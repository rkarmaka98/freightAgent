from datetime import datetime
from pathlib import Path
from typing import Dict

class LoggerAgent:
    """Simple file logger for evaluation events."""

    def __init__(self, log_path: str = "agent.log"):
        self.path = Path(log_path)

    def log(self, record: Dict, triggered: bool) -> None:
        """Append an entry describing the decision."""
        time_str = datetime.utcnow().isoformat()
        msg = f"{time_str} - {record['ship_id']} triggered={triggered}\n"
        with self.path.open("a") as f:
            f.write(msg)
