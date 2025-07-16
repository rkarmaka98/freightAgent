import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Shows transaction history from the smart contract
export default function TxLog() {
  // log of transactions derived from payout status
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    async function fetchLogs() {
      try {
        const res = await axios.get('/status');
        const entries = res.data
          .filter((p) => p.payout)
          .map((p) => `Payout sent for ${p.ship_id}`);
        setLogs(entries);
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
          <li key={i} className="caption">{l}</li>
        ))}
      </ul>
    </div>
  );
}
