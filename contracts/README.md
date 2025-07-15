# Soroban Contract: Freight Insurance

This Soroban smart contract manages insurance policy creation, monitoring, and payout based on delay or weather data.

---

## Core Functions

| Function              | Purpose                                                              |
| --------------------- | -------------------------------------------------------------------- |
| `init_policy()`       | Create and store a new insurance policy                              |
| `register_arrival()`  | Log the actual arrival and compute delay + conditions                |
| `check_and_payout()`  | Trigger payout if delay threshold met, auto-payout in testnet tokens |
| `get_policy_status()` | Query policy state: Active, Triggered                                |

---

## Stored Data Structure

```rust
Map<ship_id => expected_eta>
Map<ship_id => actual_eta>
Map<ship_id => delay_threshold_hrs>
Map<ship_id => payout_done>
Map<ship_id => owner_address>
Map<ship_id => payout_amount>
```

## Example Usage

1. <u>**Create Policy**</u>

`init_policy(   ship_id: BytesN<32>,   expected_eta: u64,   delay_threshold: u64,   owner: Address,   payout_amount: i128 )`

2. <u>**Register Arrival**</u>

`register_actual_arrival(   ship_id: BytesN<32>,   actual_eta: u64,   wind_speed: Option<u32> )`

3. <u>**Check & Payout**</u>

`check_and_payout(ship_id: BytesN<32>) -> bool`

## Test Plan

- Deploy to Soroban Testnet

- Use unit tests to:
  
  - Simulate arrival
  
  - Simulate on-chain payout logic
  
  - Ensure payouts only trigger once

## Tools

- soroban-sdk

- Soroban CLI
