import React from 'react';
import PolicyForm from './components/PolicyForm';
import PolicyStatus from './components/PolicyStatus';
import WeatherBox from './components/WeatherBox';
import AlertBanner from './components/AlertBanner';
import TxLog from './components/TxLog';
// button component to toggle dark mode
import ThemeToggle from './components/ThemeToggle';

// Simple layout referencing all components
export default function App() {
  return (
    <div className="App">
      <header>
        <h1>Freight Insurance Dashboard</h1>
        {/* toggle for dark/light modes */}
        <ThemeToggle />
      </header>
      <main>
        <AlertBanner />
        <PolicyForm />
        <PolicyStatus />
        <WeatherBox />
        <TxLog />
      </main>
    </div>
  );
}
