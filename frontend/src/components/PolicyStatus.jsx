import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PolicyDetails from './PolicyDetails';

// Displays current policy status and ETA information
export default function PolicyStatus() {
  // hold list of policy statuses returned from the backend
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  // keep the policy selected by the user; null shows the list
  const [selected, setSelected] = useState(null);

  // fetch status information when component mounts and poll regularly
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

    // initial fetch
    fetchStatus();
    // poll every 5 seconds; replace with WebSocket if backend supports it
    const id = setInterval(fetchStatus, 5000);
    return () => clearInterval(id); // cleanup when component unmounts
  }, []);

  return (
    // width set so layout grid can control sizing
    <div className="policy-status space-y-2 w-full">
      <h2 className="mb-2">Current Policies</h2>
      {loading ? (
        <p className="caption">Loading...</p>
      ) : selected ? (
        // show details when a policy is selected
        <PolicyDetails
          policy={{ ...selected.policy, ship_id: selected.ship_id, payout: selected.payout }}
          onBack={() => setSelected(null)}
        />
      ) : (
        <ul className="list-disc pl-5">
          {statuses.map((s) => (
            <li key={s.ship_id} className="caption flex items-center space-x-2">
              <span>{s.ship_id}</span>
              {/* badge displays policy state */}
              <span
                className={`px-1 rounded text-xs ${
                  s.payout ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'
                }`}
              >
                {s.payout ? 'Payout Triggered' : 'Active'}
              </span>
            <li
              key={s.ship_id}
              className="caption cursor-pointer"
              onClick={() => setSelected(s)}
            >
              {s.ship_id}: {s.payout ? 'Payout Triggered' : 'Active'}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
