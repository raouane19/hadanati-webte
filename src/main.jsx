import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app.jsx'
import axios from 'axios' 
import './i18n.js'
axios.defaults.baseURL = 'https://reviving-throwback-cringing.ngrok-free.dev';
axios.defaults.headers.common['ngrok-skip-browser-warning'] = 'true';
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)