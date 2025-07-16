import React from 'react';

// Toast notification with optional undo action
export default function Toast({ message, onClose, onUndo }) {
  if (!message) return null;
  return (
    <div className="toast">
      <span>{message}</span>
      {onUndo && (
        <button onClick={onUndo} className="toast-undo">Undo</button>
      )}
      <button onClick={onClose} className="toast-close">X</button>
    </div>
  );
}
