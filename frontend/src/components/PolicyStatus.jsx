import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Displays current policy status and ETA information
export default function PolicyStatus() {
  // hold list of policy statuses returned from the backend
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  // message shown after batch payout completes
  const [batchMsg, setBatchMsg] = useState('');

  // fetch status information when component mounts
  useEffect(() => {
    async function fetchStatus() {
      try {
        const res = await axios.get('/status');
        // store policy status array from server
        setStatuses(res.data);
      } catch (err) {
        // log error; UI simply shows no data
        console.error('Status fetch failed', err);
      } finally {
        setLoading(false);
      }
    }
    fetchStatus();
  }, []);

  // call backend to batch process payouts
  const handleBatch = async () => {
    try {
      const res = await axios.post('/batch-payout');
      setBatchMsg(`Processed: ${res.data.processed.join(', ')}`);
    } catch (err) {
      setBatchMsg('Batch payout failed');
    }
  };

  return (
    <div className="policy-status">
      <h2>Current Policies</h2>
      <button onClick={handleBatch}>Run Batch Payout</button>
      {batchMsg && <p>{batchMsg}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {statuses.map((s) => (
            <li key={s.ship_id}>
              {/* Show policy label */}
              Policy #{s.ship_id}:{' '}
              {/* Status badge with style */}
              <span className={`status ${s.payout ? 'triggered' : 'active'}`}>
                {s.payout ? 'Triggered' : 'Active'}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
