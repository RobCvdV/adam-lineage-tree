import React from 'react';
import { createRoot } from 'react-dom/client';
import AdamLineageTree from './components/AdamLineageTree';
import { ThemeProvider } from './context/ThemeContext';
import './styles/mobile.css';

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <ThemeProvider>
      <AdamLineageTree/>
    </ThemeProvider>
  </React.StrictMode>
);
