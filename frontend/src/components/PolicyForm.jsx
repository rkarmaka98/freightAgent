import React, { useState } from 'react';
import axios from 'axios';

// Form for creating new insurance policies
export default function PolicyForm() {
  // keep local form state for ship ID and expected ETA
  const [shipId, setShipId] = useState('');
  const [expectedEta, setExpectedEta] = useState('');
  const [delayThreshold, setDelayThreshold] = useState('');
  const [owner, setOwner] = useState('');
  const [payoutAmount, setPayoutAmount] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // send data to backend when form is submitted
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // basic validation for required and numeric fields
    if (!shipId || !expectedEta || !delayThreshold || !owner || !payoutAmount) {
      setError('All fields are required');
      return;
    }
    if (isNaN(delayThreshold) || isNaN(payoutAmount)) {
      setError('Threshold and payout must be numeric');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('/policy', {
        ship_id: shipId,
        expected_eta: expectedEta,
        delay_threshold: Number(delayThreshold),
        owner,
        payout_amount: Number(payoutAmount),
      });
      // show success message from API response
      setMessage(`Created policy for ${res.data.ship_id}`);
    } catch (err) {
      // display simple error message on failure
      setError('Failed to create policy');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="policy-form space-y-2" onSubmit={handleSubmit}>
      <h2 className="mb-2">Create Policy</h2>
      <div className="flex flex-col">
        <label className="caption">Ship ID:</label>
        <input
          className="border p-1"
          value={shipId}
          onChange={(e) => setShipId(e.target.value)}
        />
      </div>
      <div className="flex flex-col">
        <label className="caption">Expected ETA:</label>
        <input
          className="border p-1"
          type="datetime-local"
          value={expectedEta}
          onChange={(e) => setExpectedEta(e.target.value)}
        />
      </div>
      <div className="flex flex-col">
        <label className="caption">Delay Threshold (hrs):</label>
        <input
          className="border p-1"
          value={delayThreshold}
          onChange={(e) => setDelayThreshold(e.target.value)}
        />
      </div>
      <div className="flex flex-col">
        <label className="caption">Owner Address:</label>
        <input
          className="border p-1"
          value={owner}
          onChange={(e) => setOwner(e.target.value)}
        />
      </div>
      <div className="flex flex-col">
        <label className="caption">Payout Amount:</label>
        <input
          className="border p-1"
          value={payoutAmount}
          onChange={(e) => setPayoutAmount(e.target.value)}
        />
      </div>
      <button
        className="bg-primary text-white px-2 py-1"
        disabled={loading}
        type="submit"
      >
        {loading ? 'Submitting...' : 'Submit'}
      </button>
      {error && <p className="caption text-red-600">{error}</p>}
      {message && <p className="caption">{message}</p>}
    </form>
  );
}
