"""FastAPI server orchestrating the agentic workflow."""
from fastapi import FastAPI
import asyncio
from apscheduler.schedulers.background import BackgroundScheduler
from typing import Dict, List

from agents.data_agent import DataAgent
from agents.evaluator_agent import EvaluatorAgent
from agents.trigger_agent import TriggerAgent
from agents.logger_agent import LoggerAgent

DATA_PATH = "../data/mock_freight_data.json"

app = FastAPI(title="Freight Insurance Agentic API")

# Module-level scheduler so it can be reused across events
scheduler = BackgroundScheduler()

# Initialize agents
_data_agent = DataAgent(DATA_PATH)
_evaluator = EvaluatorAgent()
_trigger = TriggerAgent()
_logger = LoggerAgent()

policies: Dict[str, Dict] = {}


def monitor() -> None:
    """Periodic job to evaluate all known shipments."""
    records = _data_agent.fetch_latest()
    for rec in records:
        ship_id = rec["ship_id"]
        # Only evaluate if a policy exists for the ship
        if ship_id not in policies:
            continue
        should_trigger = _evaluator.evaluate(rec)
        _logger.log(rec, should_trigger)
        if should_trigger and ship_id not in _trigger.payout_log:
            _trigger.trigger_payout(rec)


@app.on_event("startup")
def start_scheduler() -> None:
    """Launch background scheduler when the app starts."""
    # Use the module-level scheduler defined above
    scheduler.add_job(monitor, "interval", minutes=10)
    scheduler.start()


@app.on_event("shutdown")
def shutdown_scheduler() -> None:
    """Shut down the scheduler gracefully on shutdown."""
    scheduler.shutdown()


@app.post("/policy")
async def create_policy(policy: Dict) -> Dict:
    """Store a new policy; expects at least a `ship_id` field."""
    ship_id = policy.get("ship_id")
    if not ship_id:
        return {"error": "ship_id required"}
    policies[ship_id] = policy
    return {"status": "created", "ship_id": ship_id}


@app.get("/status")
async def get_status() -> List[Dict]:
    """Return current policies and payout logs."""
    return [
        {"ship_id": sid, "policy": pol, "payout": sid in _trigger.payout_log}
        for sid, pol in policies.items()
    ]


@app.post("/manual-check")
async def manual_check() -> Dict:
    """Manually run the monitor step without blocking the event loop."""
    # monitor() performs I/O and CPU work; offload to a thread to keep FastAPI async
    await asyncio.to_thread(monitor)
    return {"checked": True}
