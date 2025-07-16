import React, { useState } from 'react';
import axios from 'axios';

// Form for creating new insurance policies
export default function PolicyForm() {
  // keep local form state for ship ID and expected ETA
  const [shipId, setShipId] = useState('');
  const [expectedEta, setExpectedEta] = useState('');
  const [message, setMessage] = useState('');

  // send data to backend when form is submitted
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/policy', {
        ship_id: shipId,
        expected_eta: expectedEta,
      });
      // show success message from API response
      setMessage(`Created policy for ${res.data.ship_id}`);
    } catch (err) {
      // display simple error message on failure
      setMessage('Failed to create policy');
    }
  };

  return (
    <form className="policy-form" onSubmit={handleSubmit}>
      <h2>Create Policy</h2>
      <div>
        <label>Ship ID:</label>
        <input
          value={shipId}
          onChange={(e) => setShipId(e.target.value)}
        />
      </div>
      <div>
        <label>Expected ETA:</label>
        <input
          type="datetime-local"
          value={expectedEta}
          onChange={(e) => setExpectedEta(e.target.value)}
        />
      </div>
      <button type="submit">Submit</button>
      {message && <p>{message}</p>}
    </form>
  );
}
