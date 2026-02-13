import React from 'react';
import { createRoot } from 'react-dom/client';
import ValentineCard from './components/ValentineCard.jsx';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <ValentineCard />
  </React.StrictMode>,
);

