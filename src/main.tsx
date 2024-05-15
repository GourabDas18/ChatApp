import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { StoreFunction } from './Context/conext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <StoreFunction>
    <App />
    </StoreFunction>
  </React.StrictMode>,
)
