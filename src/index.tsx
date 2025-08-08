import React from 'react';
import { createRoot } from 'react-dom/client';
import AdamLineageTree from './components/AdamLineageTree';
import './styles/mobile.css';

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <AdamLineageTree />
  </React.StrictMode>
);
