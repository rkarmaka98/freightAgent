import React from 'react';

// Simple tooltip to show explanatory text on hover
export default function Tooltip({ text }) {
  return (
    <span className="tooltip">
      ?
      <span className="tooltip-text">{text}</span>
    </span>
  );
}
