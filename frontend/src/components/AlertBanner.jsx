import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Notifies user of payouts or potential risks
export default function AlertBanner() {
  // message displayed when a payout has occurred
  const [alert, setAlert] = useState('');

  // check backend for any triggered payouts on a regular interval
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

    // run once immediately then every 5 seconds; consider WebSocket push later
    checkPayouts();
    const id = setInterval(checkPayouts, 5000);
    return () => clearInterval(id); // cleanup on unmount
  }, []);

  return (
    <div className="alert-banner">
      {alert && <p className="caption text-accent font-semibold">{alert}</p>}
    </div>
  );
}
