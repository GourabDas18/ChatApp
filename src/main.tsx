import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { StoreFunction } from './Context/conext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
 
    <StoreFunction>
    <App />
    </StoreFunction>
 
)
