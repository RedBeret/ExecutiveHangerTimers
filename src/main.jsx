import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './i18n/i18n' // Initialize i18n
import { startTimerConfigHeartbeat } from './utils/timerConfig'
import { roomClient } from './room/roomClient'

// Fetch fresh Executive Hangar cycle constants now and every 15 minutes,
// so resyncs after game patches reach users without a page refresh
startTimerConfigHeartbeat()

// Rejoin a Run Room remembered from the previous page load
roomClient.resume()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
