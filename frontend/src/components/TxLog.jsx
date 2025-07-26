import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Shows transaction history from the smart contract
export default function TxLog() {
  // tx log returned from backend
  const [logs, setLogs] = useState([]);

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
    <div className="tx-log space-y-2">
      <h2 className="mb-2">Transaction Log</h2>
      <ul className="list-disc pl-5">
        {logs.map((l, i) => (
          <li key={i} className="caption flex items-center space-x-2">
            <span>{l.label}</span>
            <span
              className={`px-1 rounded text-xs ${
                l.status === 'pending'
                  ? 'bg-yellow-200'
                  : l.status === 'confirmed'
                  ? 'bg-green-200'
                  : 'bg-red-200'
              }`}
            >
              {l.status === 'confirmed' ? 'Payout Confirmed' : l.status}
            </span>
            {l.explorer && (
              <a
                href={l.explorer}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-xs"
              >
                View on Explorer
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
