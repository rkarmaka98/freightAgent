import json
from pathlib import Path
from typing import List, Dict

import requests

class DataAgent:
    """Load freight data and fetch weather from Met Éireann."""

    def __init__(self, data_path: str, weather_url: str = "https://api.met.ie/weather"):
        # Path to the mock freight dataset
        self.data_path = Path(data_path)
        # Base URL for Met Éireann weather API
        self.weather_url = weather_url
        self.records: List[Dict] = []

    def load(self) -> None:
        """Read the JSON file into memory."""
        if self.data_path.exists():
            with self.data_path.open() as f:
                self.records = json.load(f)
        else:
            self.records = []

    def fetch_weather(self, location: str) -> Dict:
        """Query Met Éireann for the latest weather at the given location."""
        try:
            resp = requests.get(f"{self.weather_url}/{location}", timeout=5)
            if resp.status_code == 200:
                data = resp.json()
                # Map API response to the fields we use
                return {
                    "wind_speed": data.get("wind_speed", 0),
                    "conditions": data.get("weather", "Unknown"),
                }
        except Exception as exc:  # pragma: no cover - network failures
            print(f"Weather fetch failed for {location}: {exc}")
        # Fallback if API fails
        return {"wind_speed": 0, "conditions": "Unknown"}

    def fetch_latest(self) -> List[Dict]:
        """Return freight records with updated weather data."""
        if not self.records:
            self.load()
        for rec in self.records:
            # Fetch weather for the origin port using Met Éireann
            location = rec.get("origin", "")
            rec["weather"] = self.fetch_weather(location)
        return self.records
