import React from 'react';

// Show all fields of a single policy in a simple list
export default function PolicyDetails({ policy, onBack }) {
  if (!policy) return null; // safeguard when no policy is provided

  // format timestamp strings for readability
  const formatTs = (ts) =>
    ts ? new Date(ts).toLocaleString() : 'N/A';

  return (
    <div className="policy-details space-y-2">
      {/* optional back button to return to the list */}
      {onBack && (
        <button onClick={onBack} className="mb-2">
          Back
        </button>
      )}
      <h2 className="mb-2">Policy Details</h2>
      <ul className="list-disc pl-5">
        {/* ship identifier */}
        <li className="caption">Ship ID: {policy.ship_id}</li>
        {policy.owner && (
          <li className="caption">Owner: {policy.owner}</li>
        )}
        {policy.payout_amount !== undefined && (
          <li className="caption">Payout: {policy.payout_amount}</li>
        )}
        <li className="caption">
          Expected ETA: {formatTs(policy.expected_eta)}
        </li>
        <li className="caption">
          Actual ETA: {formatTs(policy.actual_eta)}
        </li>
        {policy.delay_threshold !== undefined && (
          <li className="caption">
            Delay Threshold (hrs): {policy.delay_threshold}
          </li>
        )}
        {policy.origin && (
          <li className="caption">Origin: {policy.origin}</li>
        )}
        {policy.destination && (
          <li className="caption">Destination: {policy.destination}</li>
        )}
        {policy.weather && (
          <>
            <li className="caption">
              Wind Speed: {policy.weather.wind_speed} kts
            </li>
            <li className="caption">
              Conditions: {policy.weather.conditions}
            </li>
          </>
        )}
      </ul>
    </div>
  );
}
