import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Shows current wind and weather conditions
export default function WeatherBox() {
  // simple weather info from first policy if available
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    async function fetchWeather() {
      try {
        const res = await axios.get('/status');
        const first = res.data[0];
        if (first && first.policy && first.policy.weather) {
          setWeather(first.policy.weather);
        }
      } catch (err) {
        console.error('Weather fetch failed', err);
      }
    }
    fetchWeather();
  }, []);

  return (
    <div className="weather-box">
      {weather ? (
        <p className="caption">
          Wind: {weather.wind_speed} kts, Conditions: {weather.conditions}
        </p>
      ) : (
        <p className="caption">No weather data</p>
      )}
    </div>
  );
}
