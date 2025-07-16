import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

// simple utility fetches policy status so we can calculate metrics

// Dashboard showing key metrics in a card grid
export default function App() {
  // store policy status list to derive metrics
  const [statuses, setStatuses] = useState([]);

  useEffect(() => {
    async function fetchStatus() {
      try {
        const res = await axios.get('/status');
        // save status array for metric calculations
        setStatuses(res.data);
      } catch (err) {
        // log errors to console for now
        console.error('Status fetch failed', err);
      }
    }
    fetchStatus();
  }, []);

  // derive simple counts from status data
  const activePolicies = statuses.filter((s) => !s.payout).length;
  const pendingEtas = statuses.filter((s) => {
    const eta = new Date(s.policy?.expected_eta || 0);
    return eta > new Date();
  }).length;
  const weatherAlerts = statuses.filter(
    (s) => s.policy?.weather?.wind_speed >= 50
  ).length;

  return (
    <div className="App">

      <h1>Freight Insurance Dashboard</h1>
      <div className="dashboard-grid">
        {/* card displaying active policy count */}
        <div className="card">
          <h2>Active Policies</h2>
          <p>{activePolicies}</p>
        </div>
        {/* card showing how many ETAs are still pending */}
        <div className="card">
          <h2>Pending ETAs</h2>
          <p>{pendingEtas}</p>
        </div>
        {/* card listing number of policies with risky weather */}
        <div className="card">
          <h2>Weather Alerts</h2>
          <p>{weatherAlerts}</p>
        </div>
      </div>
    </div>
  );
}
