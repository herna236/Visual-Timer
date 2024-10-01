import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css'; //universal styles

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  // strictMode is helpful for dev. it mounts twice and catches things early
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
