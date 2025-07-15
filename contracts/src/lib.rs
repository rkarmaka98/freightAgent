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
    /// Initialize a new policy with expected arrival time and payout details
    pub fn init_policy(
        env: Env,
        ship_id: BytesN<32>,
        expected_eta: u64,
        threshold_hours: u64,
        owner: Address,
        payout_amount: i128,
    ) {
        // Store policy details in contract storage
        env.storage().set(&DataKey::ExpectedEta(ship_id.clone()), &expected_eta);
        env.storage().set(&DataKey::DelayThreshold(ship_id.clone()), &threshold_hours);
        env.storage().set(&DataKey::Owner(ship_id.clone()), &owner);
        env.storage().set(&DataKey::PayoutAmount(ship_id.clone()), &payout_amount);
        env.storage().set(&DataKey::PayoutDone(ship_id.clone()), &false);
    }

    /// Register the actual arrival time and optional wind speed reading
    pub fn register_actual_arrival(
        env: Env,
        ship_id: BytesN<32>,
        actual_eta: u64,
        _wind_speed: Option<u32>,
    ) {
        // Save actual arrival time for the ship
        env.storage().set(&DataKey::ActualEta(ship_id), &actual_eta);
    }

    /// Check if the delay exceeds the threshold and payout if necessary
    pub fn check_and_payout(env: Env, ship_id: BytesN<32>) -> bool {
        // Fetch stored info
        let expected: u64 = env.storage().get_unchecked(&DataKey::ExpectedEta(ship_id.clone())).unwrap();
        let actual: u64 = env.storage().get_unchecked(&DataKey::ActualEta(ship_id.clone())).unwrap_or(0);
        let threshold: u64 = env.storage().get_unchecked(&DataKey::DelayThreshold(ship_id.clone())).unwrap();
        let done: bool = env.storage().get_unchecked(&DataKey::PayoutDone(ship_id.clone())).unwrap_or(false);

        // Only payout once
        if done || actual == 0 {
            return false;
        }

        // Compute delay
        let delay_hours = if actual > expected { (actual - expected) / 3600 } else { 0 };
        if delay_hours >= threshold {
            // Transfer tokens - placeholder logic
            env.storage().set(&DataKey::PayoutDone(ship_id.clone()), &true);
            return true;
        }
        false
    }

    /// Return current policy status: 0 = Active, 1 = Triggered, 2 = Settled
    pub fn get_policy_status(env: Env, ship_id: BytesN<32>) -> u32 {
        let payout_done: bool = env.storage().get_unchecked(&DataKey::PayoutDone(ship_id.clone())).unwrap_or(false);
        let actual_exists: bool = env.storage().has(&DataKey::ActualEta(ship_id.clone()));
        if payout_done {
            2
        } else if actual_exists {
            1
        } else {
            0
        }
    }
}
