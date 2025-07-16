# React UI: Freight Insurance Dashboard

This React SPA provides an intuitive interface for managing and tracking insurance policies.

---

## Features

- Policy creation form
- Real-time status display
- Weather and ETA monitor
- Payout notifications + transaction logs
- Simple, mobile-friendly UI

---

## Pages & Components

| Component          | Purpose                             |
| ------------------ | ----------------------------------- |
| `PolicyForm.jsx`   | Create new policy                   |
| `PolicyStatus.jsx` | Show current policy and ETA         |
| `WeatherBox.jsx`   | Show current wind/conditions        |
| `AlertBanner.jsx`  | Notify user of payouts or risks     |
| `TxLog.jsx`        | Show transaction history (optional) |

---

## Backend Interaction

- Uses Axios to call Python FastAPI endpoints
- Polls `/status` or subscribes to WebSocket (optional) for real-time updates

---

## How to Run

```bash
cd frontend/
npm install
npm run dev
```
The frontend is built with Vite and React. After installing dependencies,
the development server will be available at `http://localhost:5173` by default.

## Suggested UI Structure

```
HomePage
├── PolicyForm 
├── CurrentStatus 
│ ├── ETA & Arrival 
│ ├── Weather Box 
│ └── Risk Banner 
└── Footer
```

---

## 📦 Dependencies

- Vite + React

- Axios

- Tailwind CSS or Bootstrap

---

## 📌 Notes

- Keep all display values user-friendly (e.g., convert UNIX timestamp)

- Add mock data visual if needed (weather, port, route)
