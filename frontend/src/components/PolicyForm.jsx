import React, { useState } from 'react';
import axios from 'axios';
import Tooltip from './Tooltip'; // explanatory tooltips
import Toast from './Toast'; // toast notifications

// Form for creating new insurance policies
export default function PolicyForm() {
  // keep local form state for ship ID and expected ETA
  const [shipId, setShipId] = useState('');
  const [expectedEta, setExpectedEta] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({ shipId: '', eta: '' });
  const [toast, setToast] = useState('');
  const [undoData, setUndoData] = useState(null); // store cleared data for undo

  // simple validation helpers
  const validateShipId = (val) => (!val ? 'Ship ID required' : '');
  const validateEta = (val) => {
    if (!val) return 'ETA required';
    return new Date(val) <= new Date() ? 'ETA must be future' : '';
  };

  // send data to backend when form is submitted
  const handleSubmit = async (e) => {
    e.preventDefault();
    const shipError = validateShipId(shipId);
    const etaError = validateEta(expectedEta);
    setErrors({ shipId: shipError, eta: etaError });
    if (shipError || etaError) return; // abort if validation fails

    try {
      const res = await axios.post('/policy', {
        ship_id: shipId,
        expected_eta: expectedEta,
      });
      // show toast message on success
      setToast(`Created policy for ${res.data.ship_id}`);
      setShipId('');
      setExpectedEta('');
    } catch (err) {
      // display simple error message on failure
      setMessage('Failed to create policy');
    }
  };

  // clear form with undo option
  const handleClear = () => {
    setUndoData({ shipId, expectedEta });
    setShipId('');
    setExpectedEta('');
    setToast('Form cleared');
  };

  const handleUndo = () => {
    if (undoData) {
      setShipId(undoData.shipId);
      setExpectedEta(undoData.expectedEta);
      setUndoData(null);
    }
    setToast('');
  };

  return (
    <form className="policy-form" onSubmit={handleSubmit}>
      <h2>Create Policy</h2>
      <div>
        <label>Ship ID:</label>
        <input
          value={shipId}
          onChange={(e) => {
            const val = e.target.value;
            setShipId(val);
            setErrors((err) => ({ ...err, shipId: validateShipId(val) }));
          }}
        />
        {errors.shipId && <span className="error">{errors.shipId}</span>}
      </div>
      <div>
        <label>
          Expected ETA
          <Tooltip text="Estimated time of arrival" />
        </label>
        <input
          type="datetime-local"
          value={expectedEta}
          onChange={(e) => {
            const val = e.target.value;
            setExpectedEta(val);
            setErrors((err) => ({ ...err, eta: validateEta(val) }));
          }}
        />
        {errors.eta && <span className="error">{errors.eta}</span>}
      </div>
      <button type="submit">Submit</button>
      <button type="button" onClick={handleClear}>Clear</button>
      {message && <p>{message}</p>}
      <Toast message={toast} onClose={() => setToast('')} onUndo={undoData && handleUndo} />
    </form>
  );
}
