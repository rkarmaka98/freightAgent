# Parametric Freight Insurance with Agentic & Smart Contracts

This project is a prototype parametric insurance system built with:

- **Python Agentic** workflow for real-time monitoring
- **Rust + Soroban smart contracts** for on-chain policy and payouts
- **React Frontend** for real-time user interaction

The system automates insurance payouts for delayed freight shipments or risky weather conditions using public data sources and smart contracts.

---

## Tech Stack

| Layer          | Technology                     |
| -------------- | ------------------------------ |
| Smart Contract | Rust + Soroban SDK             |
| Agentic AI     | Python (FastAPI + scheduler)   |
| Frontend       | React + Vite                   |
| Blockchain     | Stellar Testnet + Soroban      |
| Data Sources   | Freight data from `data/mock_freight_data.json`, weather live via Met Éireann API |

Weather data is fetched from the Met Éireann API by the DataAgent.

---

## Core Concepts

- **Parametric Insurance**: Auto-payout when objective conditions are met (e.g., delay > 48 hours).
- **Agentic Workflow**: Autonomous agents fetch data, evaluate risks, and trigger contracts.
- **Smart Contracts**: Store policies and control payout logic.
- **UI Dashboard**: Show policy, weather, delay status, and alerts.

---

## Quickstart

1. Clone the repo
2. Follow setup instructions in:
   - [`contracts/README.md`](contracts/README.md)
   - [`agentic/README.md`](agentic/README.md)
   - [`frontend/README.md`](frontend/README.md)
3. Run all services and demo your live workflow

After starting the backend, the **DataAgent** loads freight records locally from
`data/mock_freight_data.json` while fetching current weather from the Met
Éireann API. This mix of local and live data keeps the demo self-contained yet
realistic.

---
<img width="1280" height="671" alt="image" src="https://github.com/user-attachments/assets/ad1a653e-06ec-4b94-b4ff-79fd677328b8" />


---

## END-TO-END FLOW

1. **User** enters policy in React UI → POSTs to Python backend → Python calls `init_policy` on Soroban.

2. **Python Agent** fetches weather data and loads freight records from `data/mock_freight_data.json` every 10 minutes, registering each arrival via `register_actual_arrival`.

3. **Evaluator Agent** checks for:
   
   - Delay > threshold hours
   
   - Wind speed > 50 km/h or other threshold

4. If triggered, agent calls `check_and_payout()` → Soroban executes payout.

5. React UI is updated via WebSocket.

6. User sees payout confirmation + weather risk alert.

## Component Map

```
Frontend (React)          <----WebSocket---->     Python Agentic AI
    |                                                |
    |                                                |
Soroban (Rust Contracts)  <--------RPC--------->  Python Contract Invoker
```

## **Architectural Data Flow**

### 1. **Policy Creation**

- User enters details in UI → sends to FastAPI `/policy`

- Python agent validates, then calls Soroban `init_policy(...)`

### 2. **Periodic Monitoring**

- Python scheduler runs every 10 minutes:
  
  - Calls ETA API + Weather API
  
  - EvaluatorAgent checks if delay or weather triggers payout
  
  - If true, TriggerAgent calls Soroban `check_and_payout()`

### 3. **Payout & Update**

- Smart contract transfers tokens to the user

- Logs on-chain

- Python updates frontend via WebSocket or `GET /status`

- UI shows green success banner and policy-labeled transactions in `TxLog`

## Agentic Intelligence Upgrade

| Upgrade            | Benefit                                                         |
| ------------------ | --------------------------------------------------------------- |
| Confidence scores  | Let EvaluatorAgent use ML model or probabilistic thresholds     |
| Feedback loop      | Train EvaluatorAgent on past payout efficiency                  |
| Auto-policy tuning | Adjust thresholds dynamically based on season, weather patterns |

![](https://sdmntprukwest.oaiusercontent.com/files/00000000-15d4-6243-8b54-0002a6046aed/raw?se=2025-07-15T18%3A43%3A59Z&sp=r&sv=2024-08-04&sr=b&scid=cdbc55ae-5eae-5cda-a356-864e62b49930&skoid=eb780365-537d-4279-a878-cae64e33aa9c&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-07-15T07%3A28%3A31Z&ske=2025-07-16T07%3A28%3A31Z&sks=b&skv=2024-08-04&sig=7PSXOzsoYLs8mbWVc9lc7kcl99/3CatDTour70R4/yc%3D)
