import React from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';

// register chart.js components once
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend
);

// display policy counts and claim trends
export default function ChartView({ data }) {
  const activeCount = data.filter((d) => !d.payout).length;
  const payoutCount = data.filter((d) => d.payout).length;

  // bar chart of policy counts
  const barData = {
    labels: ['Active', 'Payout'],
    datasets: [
      {
        label: 'Policies',
        data: [activeCount, payoutCount],
        backgroundColor: ['#36a2eb', '#ff6384'],
      },
    ],
  };

  // line chart of delay hours per ship
  const lineData = {
    labels: data.map((d) => d.ship_id),
    datasets: [
      {
        label: 'Delay Hours',
        data: data.map((d) => {
          const expected = new Date(d.policy.expected_eta);
          const actual = new Date(d.policy.actual_eta);
          return Math.max((actual - expected) / 3600000, 0);
        }),
        borderColor: '#4bc0c0',
        fill: false,
      },
    ],
  };

  return (
    <div className="chart-view">
      {/* show bar and line charts */}
      <Bar data={barData} />
      <Line data={lineData} />
    </div>
  );
}
