from typing import Dict

class TriggerAgent:
    """Placeholder agent that would call the smart contract."""

    def __init__(self):
        self.payout_log = []

    def register_actual_arrival(self, record: Dict) -> None:
        """Simulate calling the `register_actual_arrival` contract method."""
        ship_id = record["ship_id"]
        actual = record["actual_eta"]
        # In a real system, this would send a transaction to the Soroban contract
        print(f"Recorded arrival for {ship_id} at {actual}")

    def trigger_payout(self, record: Dict) -> None:
        """Simulate calling the `check_and_payout` contract method."""
        ship_id = record["ship_id"]
        # In a real system, this would send a transaction to the Soroban contract
        self.payout_log.append(ship_id)
        print(f"Payout triggered for {ship_id}")
