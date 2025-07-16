import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Shows transaction history from the smart contract
export default function TxLog() {
  // full transaction list from backend
  const [logs, setLogs] = useState([]);
  // toggle to optionally show explorer links
  const [showLinks, setShowLinks] = useState(false);

  useEffect(() => {
    async function fetchLogs() {
      try {
        const res = await axios.get('/txlog');
        setLogs(res.data);
      } catch (err) {
        console.error('Log fetch failed', err);
      }
    }
    fetchLogs();
  }, []);

  return (
    <div className="tx-log">
      <h2>Transaction Log</h2>
      <label>
        <input
          type="checkbox"
          checked={showLinks}
          onChange={() => setShowLinks(!showLinks)}
        />
        Show explorer links
      </label>
      <ul>
        {logs.map((l, i) => (
          <li key={i}>
            {/* Friendly policy label */}
            Policy #{l.ship_id}{' '}
            {/* Status badge */}
            <span className={`status ${l.status}`}>{l.status}</span>{' '}
            {/* Optional explorer link */}
            {showLinks && l.hash && (
              <a
                href={`https://blockexplorer.com/tx/${l.hash}`}
                target="_blank"
                rel="noreferrer"
              >
                View
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
