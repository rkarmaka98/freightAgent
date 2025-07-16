import React from 'react';
import PolicyForm from './components/PolicyForm';
import PolicyStatus from './components/PolicyStatus';
import WeatherBox from './components/WeatherBox';
import AlertBanner from './components/AlertBanner';
import TxLog from './components/TxLog';

// Simple layout referencing all components
export default function App() {
  return (
    <div className="App p-4 space-y-4"> {/* basic spacing */}
      <h1 className="mb-4">Freight Insurance Dashboard</h1>
      <AlertBanner />
      <PolicyForm />
      <PolicyStatus />
      <WeatherBox />
      <TxLog />
    </div>
  );
}
