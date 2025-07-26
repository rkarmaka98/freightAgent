import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Shows current wind and weather conditions
// Display weather info and ETA differences
export default function WeatherBox({ shipId }) {
  // store policies returned from backend
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWeather() {
      try {
        const res = await axios.get('/status');
        // filter for one ship if an ID was provided
        const list = shipId
          ? res.data.filter((p) => p.ship_id === shipId)
          : res.data;
        setPolicies(list);
      } catch (err) {
        console.error('Weather fetch failed', err);
        setPolicies([]);
      } finally {
        setLoading(false);
      }
    }
    fetchWeather();
  }, [shipId]);

  // helper to compute ETA difference in hours
  const etaDiff = (p) => {
    const expected = new Date(p.policy.expected_eta);
    const actual = new Date(p.policy.actual_eta);
    return ((actual - expected) / 3600000).toFixed(1);
  };

  return (
    <section className="weather-box" aria-label="Weather information">
      {loading ? (
        <p className="caption">Loading...</p>
      ) : policies.length > 0 ? (
        <ul className="list-disc pl-5 space-y-1">
          {policies.map((p) => (
            <li
              key={p.ship_id}
              className={`caption ${
                p.policy.weather?.wind_speed >= 50 ? 'text-red-600 font-bold' : ''
              }`}
            >
              {p.ship_id}: {p.policy.weather?.wind_speed} kts (
              {p.policy.weather?.conditions}) - ETA Diff: {etaDiff(p)}h
            </li>
          ))}
        </ul>
      ) : (
        <p className="caption">No weather data</p>
      )}
    </section>
  );
}
