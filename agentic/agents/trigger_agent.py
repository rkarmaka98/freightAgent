"""Trigger payouts by invoking the Soroban contract."""

import os
from datetime import datetime
from typing import Dict, List, Optional
import requests

class TriggerAgent:
    """Invoke the `check_and_payout` method on-chain."""

    def __init__(self, rpc_url: Optional[str] = None, contract_id: Optional[str] = None) -> None:
        """Initialize connection details and local state."""
        # RPC endpoint for the Soroban network
        self.rpc_url = rpc_url or os.getenv("SOROBAN_RPC_URL", "http://localhost:8000")
        # Contract ID deployed on the network
        self.contract_id = contract_id or os.getenv("CONTRACT_ID", "")
        # Keep track of successful payouts to avoid double calls
        self.payout_log: list[str] = []
        # Track each submitted transaction for the UI
        self.transactions: List[Dict] = []
        # Optional explorer base URL so users can view the tx on-chain
        self.explorer_url = os.getenv("EXPLORER_URL", "")

    def _record_tx(self, ship_id: str) -> str:
        """Create a local transaction entry and return its ID."""
        tx_id = f"tx-{ship_id}-{int(datetime.utcnow().timestamp())}"
        self.transactions.append({"ship_id": ship_id, "tx_id": tx_id, "status": "pending"})
        return tx_id

    def _update_tx_status(self, tx_id: str, status: str) -> None:
        """Update a transaction's status in place for UI consumption."""
        for tx in self.transactions:
            if tx["tx_id"] == tx_id:
                tx["status"] = status
                break

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
        # record the transaction before sending so UI can show pending state
        tx_id = self._record_tx(ship_id)
        try:
            if self._call_contract(ship_id):
                # log payout and mark tx confirmed
                self.payout_log.append(ship_id)
                self._update_tx_status(tx_id, "confirmed")
                return True
            print(f"check_and_payout failed for {ship_id}")
            self._update_tx_status(tx_id, "failed")
        except Exception as exc:  # pragma: no cover - network failures
            print(f"RPC error for {ship_id}: {exc}")
            self._update_tx_status(tx_id, "failed")
        return False

    def trigger_payout_batch(self, records: List[Dict]) -> None:
        """Process multiple payouts in one batch."""
        for rec in records:
            self.trigger_payout(rec)
        if records:
            # helpful console notice for operators
            print(f"Batch payout for {len(records)} policies completed")
