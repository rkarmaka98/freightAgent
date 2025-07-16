import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Notifies user of payouts or potential risks
export default function AlertBanner() {
  // message displayed when a payout has occurred
  const [alert, setAlert] = useState('');

  // check backend for any triggered payouts
  useEffect(() => {
    async function checkPayouts() {
      try {
        const res = await axios.get('/status');
        const triggered = res.data.filter((p) => p.payout);
        if (triggered.length > 0) {
          setAlert(`Payout triggered for ${triggered.map((p) => p.ship_id).join(', ')}`);
        }
      } catch (err) {
        console.error('Alert fetch failed', err);
      }
    }
    checkPayouts();
  }, []);

  return (
    <div className="alert-banner" role="alert">
      {alert && <p>{alert}</p>}
    </div>
  );
}
