import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'; // Make sure this points to your main App component
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

// We have removed the <React.StrictMode> wrapper to prevent double-rendering in development,
// which was causing the immediate API rate-limiting issue.
root.render(
  <App />
);
