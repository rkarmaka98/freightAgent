import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // global Tailwind styles

// Mount the root React component
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
