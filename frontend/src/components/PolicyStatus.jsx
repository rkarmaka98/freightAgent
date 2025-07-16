import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Displays current policy status and ETA information
export default function PolicyStatus() {
  // hold list of policy statuses returned from the backend
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="policy-status space-y-2">
      <h2 className="mb-2">Current Policies</h2>
      {loading ? (
        <p className="caption">Loading...</p>
      ) : (
        <ul className="list-disc pl-5">
          {statuses.map((s) => (
            <li key={s.ship_id} className="caption">
              {s.ship_id}: {s.payout ? 'Payout Triggered' : 'Active'}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
