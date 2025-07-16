import React from 'react';
import PolicyForm from './components/PolicyForm';
import PolicyStatus from './components/PolicyStatus';
import WeatherBox from './components/WeatherBox';
import AlertBanner from './components/AlertBanner';
import TxLog from './components/TxLog';
import Dashboard from './components/Dashboard';

// Simple layout referencing all components
export default function App() {
  return (
    <div className="App">
      <h1>Freight Insurance Dashboard</h1>
      <AlertBanner />
      <PolicyForm />
      <PolicyStatus />
      <WeatherBox />
      <TxLog />
      {/* analytics dashboard with charts and map */}
      <Dashboard />
    </div>
  );
}
