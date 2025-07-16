"""Trigger payouts by invoking the Soroban contract."""

import os
from typing import Dict
from typing import Optional
import requests

class TriggerAgent:
    """Invoke the `check_and_payout` method on-chain."""

    def __init__(self, rpc_url: Optional[str] = None, contract_id: Optional[str] = None) -> None:
        # RPC endpoint for the Soroban network
        self.rpc_url = rpc_url or os.getenv("SOROBAN_RPC_URL", "http://localhost:8000")
        # Contract ID deployed on the network
        self.contract_id = contract_id or os.getenv("CONTRACT_ID", "")
        # Keep track of successful payouts to avoid double calls
        self.payout_log: list[str] = []

    def _call_contract(self, ship_id: str) -> bool:
        """Thin JSON-RPC wrapper around the check_and_payout call."""
        payload = {
            "jsonrpc": "2.0",
            "id": 1,
            "method": "check_and_payout",
            "params": {"contract_id": self.contract_id, "ship_id": ship_id},
        }
        resp = requests.post(self.rpc_url, json=payload, timeout=10)
        resp.raise_for_status()
        data = resp.json()
        return data.get("result") == "success"

    def register_actual_arrival(self, record: Dict) -> None:
        """Simulate calling the `register_actual_arrival` contract method."""
        ship_id = record["ship_id"]
        actual = record["actual_eta"]
        # In a real system, this would send a transaction to the Soroban contract
        print(f"Recorded arrival for {ship_id} at {actual}")

    def trigger_payout(self, record: Dict) -> bool:
        """Send the transaction and return True if it succeeded."""
        ship_id = record["ship_id"]
        try:
            if self._call_contract(ship_id):
                self.payout_log.append(ship_id)
                return True
            print(f"check_and_payout failed for {ship_id}")
        except Exception as exc:  # pragma: no cover - network failures
            print(f"RPC error for {ship_id}: {exc}")
        return False
