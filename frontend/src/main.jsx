import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// include base styles and breakpoints
import './styles.css';

// Mount the root React component
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
