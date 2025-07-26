import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
// layout and section components
import DashboardLayout from './components/DashboardLayout';
import PolicyForm from './components/PolicyForm';
import PolicyStatus from './components/PolicyStatus';
import WeatherBox from './components/WeatherBox';
import AlertBanner from './components/AlertBanner';
import TxLog from './components/TxLog';

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
    // use layout with sidebar for a consistent dashboard view
    <DashboardLayout>
      {/* page heading */}
      <h1>Freight Insurance Dashboard</h1>

      {/* alert banner shows payout notifications */}
      <AlertBanner />

      {/* quick metrics on top of the page */}
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

      {/* form and status stack on small screens via Tailwind classes */}
      <div className="grid gap-4 md:grid-cols-2 mt-4 w-full">
        <PolicyForm />
        <PolicyStatus />
      </div>

      {/* additional information sections */}
      <WeatherBox />
      {/* log section below other content on mobile */}
      <TxLog />
    </DashboardLayout>
  );
}
