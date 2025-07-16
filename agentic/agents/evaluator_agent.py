from datetime import datetime, timezone
from typing import Dict

class EvaluatorAgent:
    """Evaluate if a shipment breaches delay or weather thresholds."""

    def __init__(self, delay_threshold_hours: int = 48, wind_threshold: int = 50):
        # Number of hours allowed before payout triggers
        self.delay_threshold = delay_threshold_hours
        # Wind speed above which payout triggers regardless of delay
        self.wind_threshold = wind_threshold

    def _parse_ts(self, ts: str) -> datetime:
        """Helper to parse ISO timestamp strings."""
        return datetime.fromisoformat(ts.replace("Z", "+00:00")).astimezone(timezone.utc)

    def evaluate(self, record: Dict) -> bool:
        """Return True if the policy conditions are met."""
        expected = self._parse_ts(record["expected_eta"])
        actual = self._parse_ts(record["actual_eta"])
        wind = record.get("weather", {}).get("wind_speed", 0)

        delay_hours = max((actual - expected).total_seconds() / 3600, 0)
        if delay_hours >= self.delay_threshold:
            return True
        if wind >= self.wind_threshold:
            return True
        return False
