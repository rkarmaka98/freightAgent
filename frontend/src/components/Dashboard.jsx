import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MapView from './MapView';
import ChartView from './ChartView';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';

// container for charts, map and filtering
export default function Dashboard() {
  const [records, setRecords] = useState([]);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [ship, setShip] = useState('');
  const [status, setStatus] = useState('');

  // load policy status data once
  useEffect(() => {
    async function load() {
      try {
        const res = await axios.get('/status');
        setRecords(res.data);
      } catch (err) {
        console.error('Failed to fetch status', err);
      }
    }
    load();
  }, []);

  // apply filters client-side
  const filtered = records.filter((r) => {
    if (ship && !r.ship_id.includes(ship)) return false;
    if (status) {
      if (status === 'active' && r.payout) return false;
      if (status === 'payout' && !r.payout) return false;
    }
    if (start) {
      const st = new Date(start);
      const exp = new Date(r.policy.expected_eta);
      if (exp < st) return false;
    }
    if (end) {
      const ed = new Date(end);
      const exp = new Date(r.policy.expected_eta);
      if (exp > ed) return false;
    }
    return true;
  });

  // export filtered data as CSV file
  function exportCSV() {
    const rows = filtered.map((r) => `${r.ship_id},${r.policy.expected_eta},${r.payout}`);
    const csv = ['ship_id,expected_eta,payout', ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'policies.csv');
  }

  // export simple PDF listing records
  function exportPDF() {
    const doc = new jsPDF();
    doc.text('Policies', 10, 10);
    filtered.forEach((r, i) => {
      doc.text(`${r.ship_id} ${r.policy.expected_eta} ${r.payout ? 'PAYOUT' : 'ACTIVE'}`, 10, 20 + i * 10);
    });
    doc.save('policies.pdf');
  }

  return (
    <div className="dashboard">
      <h2>Policy Overview</h2>
      {/* filtering controls */}
      <div className="filters">
        <input type="text" placeholder="Ship ID" value={ship} onChange={(e) => setShip(e.target.value)} />
        <input type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} />
        <input type="datetime-local" value={end} onChange={(e) => setEnd(e.target.value)} />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All</option>
          <option value="active">Active</option>
          <option value="payout">Payout</option>
        </select>
        <button onClick={exportCSV}>Export CSV</button>
        <button onClick={exportPDF}>Export PDF</button>
      </div>
      {/* pass filtered data to charts and map */}
      <ChartView data={filtered} />
      <MapView data={filtered} />
    </div>
  );
}
