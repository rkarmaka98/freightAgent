import json
from pathlib import Path
from typing import List, Dict

class DataAgent:
    """Load freight and weather data from a JSON file."""

    def __init__(self, data_path: str):
        # Path to the mock freight dataset
        self.data_path = Path(data_path)
        self.records: List[Dict] = []

    def load(self) -> None:
        """Read the JSON file into memory."""
        if self.data_path.exists():
            with self.data_path.open() as f:
                self.records = json.load(f)
        else:
            self.records = []

    def fetch_latest(self) -> List[Dict]:
        """Return the latest freight records.
        In a real system this would call remote APIs."""
        if not self.records:
            self.load()
        return self.records
