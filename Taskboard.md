# Parametric Freight Insurance – Developer Taskboard

---

## Smart Contracts (Rust + Soroban)

- [ ] Setup Soroban SDK and Rust dev environment
- [ ] Define storage maps for policy data:
  - expected ETA
  - actual ETA
  - delay threshold
  - payout amount
  - owner address
  - payout status
- [ ] Implement `init_policy(ship_id, expected_eta, threshold, owner, payout_amount)`
- [ ] Implement `register_actual_arrival(ship_id, actual_eta, wind_speed)`
- [ ] Implement `check_and_payout(ship_id)` with payout trigger logic
- [ ] Implement `get_policy_status(ship_id)` to return: Active / Triggered / Settled
- [ ] Add `require_auth()` checks for secure methods
- [ ] Write unit tests for each function
- [ ] Deploy contract to Soroban testnet
- [ ] Provide RPC integration details for backend to interact with contract

---

## Agentic AI Workflow (Python + FastAPI)

### Infrastructure

- [ ] Set up FastAPI server
- [ ] Create `.env` file with API keys and config
- [ ] Define global policy schema and storage

### API Endpoints

- [ ] `POST /policy` → receives policy form data from frontend, calls `init_policy` on-chain
- [ ] `GET /status` → returns status of all policies for frontend polling
- [ ] `POST /manual-check` → optional trigger for testing payouts manually

### Agent Modules

- [ ] Build `DataAgent` to fetch ETA & weather data (OpenWeatherMap)
- [ ] Build `EvaluatorAgent` to:
  - Compare actual ETA vs expected
  - Compare wind speed against threshold
- [ ] Build `TriggerAgent` to:
  - Call `check_and_payout` if conditions are breached
- [ ] Build `LoggerAgent` to log all evaluation events and decisions

### Scheduler

- [ ] Integrate `APScheduler` to run `DataAgent` and `EvaluatorAgent` every 10 minutes

---

## Frontend (React)

### Setup

- [ ] Create frontend with Vite + React
- [ ] Install Axios and TailwindCSS (or Bootstrap)

### Components

- [ ] `PolicyForm.jsx` to input ship ID, ETA, threshold, etc.
- [ ] `StatusDisplay.jsx` to show current ETA, delay, and status
- [ ] `WeatherBox.jsx` to show wind speed and other weather data
- [ ] `RiskAlertBanner.jsx` to display live warnings and payouts
- [ ] `TxLog.jsx` to show blockchain transaction hashes

### API Integration

- [ ] Connect to FastAPI backend with Axios
- [ ] Call `POST /policy` on form submission
- [ ] Poll `GET /status` every X seconds
- [ ] (Optional) Integrate WebSocket for real-time alerts

### UX/Styling

- [ ] Style UI for desktop & mobile
- [ ] Add status badges (Active, Triggered, Settled)
- [ ] Show payout confirmation with transaction ID

---

## Improvements

| Area           | Suggestion                                                       | Reason                                   |
| -------------- | ---------------------------------------------------------------- | ---------------------------------------- |
| Smart Contract | Include weather threshold as input param in `init_policy`        | Allows flexible policies                 |
| Agentic AI     | Create a JSON config for each ship policy                        | Easier simulation and testing            |
| Frontend       | Add fallback mock UI to run offline                              | Helps if backend isn’t running           |
| Testing        | Create a shared `policy_id` field across UI → backend → contract | Easier debugging and logging consistency |
