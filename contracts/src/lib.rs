#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Env, Address, BytesN, Symbol};

#[contract]
pub struct FreightInsurance;

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    ExpectedEta(BytesN<32>),
    ActualEta(BytesN<32>),
    DelayThreshold(BytesN<32>),
    PayoutAmount(BytesN<32>),
    Owner(BytesN<32>),
    PayoutDone(BytesN<32>),
}

#[contractimpl]
impl FreightInsurance {
    pub fn init_policy(
        env: Env,
        ship_id: BytesN<32>,
        expected_eta: u64,
        threshold_hours: u64,
        owner: Address,
        payout_amount: i128,
    ) {
        let p = env.storage().persistent();
        p.set(&DataKey::ExpectedEta(ship_id.clone()), &expected_eta);
        p.set(&DataKey::DelayThreshold(ship_id.clone()), &threshold_hours);
        p.set(&DataKey::Owner(ship_id.clone()), &owner);
        p.set(&DataKey::PayoutAmount(ship_id.clone()), &payout_amount);
        p.set(&DataKey::PayoutDone(ship_id), &false);
    }

    pub fn check_and_payout(env: Env, ship_id: BytesN<32>) -> bool {
        let p = env.storage().persistent();
        let expected: u64 = p.get(&DataKey::ExpectedEta(ship_id.clone())).unwrap();
        let actual: u64 = p.get(&DataKey::ActualEta(ship_id.clone())).unwrap_or(0);
        let threshold: u64 = p.get(&DataKey::DelayThreshold(ship_id.clone())).unwrap();
        let done: bool = p.get(&DataKey::PayoutDone(ship_id.clone())).unwrap_or(false);

        if done || actual == 0 {
            return false;
        }
        let delay_hours = (actual.saturating_sub(expected)) / 3600;
        if delay_hours >= threshold {
            p.set(&DataKey::PayoutDone(ship_id), &true);
            return true;
        }
        false
    }

    pub fn get_policy_status(env: Env, ship_id: BytesN<32>) -> u32 {
        let p = env.storage().persistent();
        let done = p.get(&DataKey::PayoutDone(ship_id.clone())).unwrap_or(false);
        let actual_exists = p.has(&DataKey::ActualEta(ship_id));
        if done {
            2
        } else if actual_exists {
            1
        } else {
            0
        }
    }
}
