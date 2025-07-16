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
        # Log individual transactions with status and hash
        self.tx_log: list[dict] = []

    def _call_contract(self, ship_id: str) -> str:
        """Thin JSON-RPC wrapper around the check_and_payout call.

        Returns a fake transaction hash for demo purposes.
        """
        payload = {
            "jsonrpc": "2.0",
            "id": 1,
            "method": "check_and_payout",
            "params": {"contract_id": self.contract_id, "ship_id": ship_id},
        }
        resp = requests.post(self.rpc_url, json=payload, timeout=10)
        resp.raise_for_status()
        data = resp.json()
        if data.get("result") == "success":
            # Simulate the hash returned by a real blockchain
            return f"0x{ship_id}abc"
        return ""

    def register_actual_arrival(self, record: Dict) -> None:
        """Simulate calling the `register_actual_arrival` contract method."""
        ship_id = record["ship_id"]
        actual = record["actual_eta"]
        # In a real system, this would send a transaction to the Soroban contract
        print(f"Recorded arrival for {ship_id} at {actual}")

    def trigger_payout(self, record: Dict) -> bool:
        """Send the transaction and store status information."""
        ship_id = record["ship_id"]
        # create initial pending entry
        log_entry = {"ship_id": ship_id, "hash": "", "status": "pending"}
        self.tx_log.append(log_entry)
        try:
            tx_hash = self._call_contract(ship_id)
            if tx_hash:
                # mark transaction as confirmed and keep hash
                log_entry["hash"] = tx_hash
                log_entry["status"] = "confirmed"
                self.payout_log.append(ship_id)
                return True
            # mark failure if no hash returned
            log_entry["status"] = "failed"
            print(f"check_and_payout failed for {ship_id}")
        except Exception as exc:  # pragma: no cover - network failures
            log_entry["status"] = "failed"
            print(f"RPC error for {ship_id}: {exc}")
        return False

    def trigger_batch_payout(self, records: list[Dict]) -> list[str]:
        """Process multiple payouts in sequence."""
        processed: list[str] = []
        for rec in records:
            sid = rec["ship_id"]
            if sid in self.payout_log:
                continue
            if self.trigger_payout(rec):
                processed.append(sid)
        return processed
