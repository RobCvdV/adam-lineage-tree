import React from 'react'
import ReactDOM from 'react-dom/client'
import AdamLineageTree from './components/AdamLineageTree'
import { ThemeProvider } from './context/ThemeContext'
import './styles/mobile.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <AdamLineageTree/>
    </ThemeProvider>
  </React.StrictMode>,
)
