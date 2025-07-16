import React from 'react';
import PolicyForm from './components/PolicyForm';
import PolicyStatus from './components/PolicyStatus';
import WeatherBox from './components/WeatherBox';
import AlertBanner from './components/AlertBanner';
import TxLog from './components/TxLog';
import DashboardLayout from './components/DashboardLayout';

// Simple layout referencing all components
export default function App() {
  return (
    // wrap existing components in new dashboard layout
    <DashboardLayout>
      <div className="App"> {/* page header + widgets */}
        <h1>Freight Insurance Dashboard</h1>
        <AlertBanner />
        <PolicyForm />
        <PolicyStatus />
        <WeatherBox />
        <TxLog />
      </div>
    </DashboardLayout>
  );
}
