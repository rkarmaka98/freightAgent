# Agentic AI: Freight Insurance Monitor

This Python app runs an agentic AI workflow that monitors real-time shipping data and weather conditions. If thresholds are crossed, it triggers a payout via the smart contract.

---

## Agent Design

| Agent           | Task Description                                                                    |
| --------------- | ----------------------------------------------------------------------------------- |
| Data Agent      | Load `../data/mock_freight_data.json` and pull weather (Met Éireann) every 10 mins |
| Evaluator Agent | Evaluate if delay(actual vs declared) or weather breaches thresholds                |
| Trigger Agent   | Call `check_and_payout()` on-chain when breached (delay > X hours or storm warning) |
| Logger Agent    | Persist decision logs to file with alerts                                           |
| Alert layer     | serves status + WebSocket notifications to React                                    |

---

## Data Sources

- **Weather**: Met Éireann (`wind_speed`, `storm`, `rain`)

- **ETA**: sample shipping records stored in [`../data/mock_freight_data.json`](../data/mock_freight_data.json)

```python
# data_agent.py snippet
import json

with open("../data/mock_freight_data.json") as f:
    FREIGHT_DATA = json.load(f)  # list of ship records
```

---

## REST API (FastAPI)

| Endpoint             | Description                    |
| -------------------- | ------------------------------ |
| `POST /policy`       | Create new policy via contract |
| `GET /status`        | Return all policy states       |
| `POST /manual-check` | Manually trigger evaluation    |

---

## Scheduler

Use `apscheduler` to:

- Run `fetch_data()` every 10 mins
- Log evaluations
- Trigger payout via JSON-RPC if conditions are met

---

## How to Run

```bash
cd agentic/
pip install -r requirements.txt
uvicorn main:app --reload
```

## Files

- `agents/data_agent.py`

- `agents/evaluator_agent.py`

- `agents/trigger_agent.py`

- `main.py` – FastAPI backend + orchestrator

## Test Plan

- Use simulated data to test threshold breaches

- Mock call to `check_and_payout()`

- Validate payout only occurs once

## Blockchain Interaction

Use Python subprocess or Stellar SDK to:

- Build and sign transactions

- Call Soroban contract methods
