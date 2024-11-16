// index.js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css'; // Optional: if you want to apply global styling

// Render the main App component into the root DOM element
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);