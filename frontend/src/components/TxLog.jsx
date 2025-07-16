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
    <section className="tx-log" aria-label="Transaction log">
      <h2>Transaction Log</h2>
      <ul>
        {logs.map((l, i) => (
          <li key={i}>{l}</li>
        ))}
      </ul>
    </section>
  );
}
