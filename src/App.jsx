import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useExecTimer } from './hooks/useExecTimer'
import { PHASES, formatTime } from './utils/timerCalculations'
import { Navigation } from './components/Navigation'
import { Footer } from './components/Footer'
import { HomePage } from './pages/HomePage'
import { ExecutiveHangarsPage } from './pages/ExecutiveHangarsPage'
import { ContestedZonesPage } from './pages/ContestedZonesPage'
import { GuidePage } from './pages/GuidePage'

// Keep the hangar phase + countdown visible in the browser tab title,
// so the timer is glanceable while the game or another tab has focus
function DocumentTitleTimer() {
  const { t } = useTranslation()
  const { status } = useExecTimer()

  useEffect(() => {
    if (!status) return
    const phaseWord = status.phase === PHASES.GREEN ? t('docTitle.open') : t('docTitle.closed')
    document.title = `${phaseWord} ${formatTime(status.timeRemaining)} · CZ Timer`
  }, [status, t])

  return null
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-dark-950 flex flex-col">
        <ScrollToTop />
        <DocumentTitleTimer />
        {/* Navigation */}
        <Navigation />

        {/* Main Content */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/executive-hangars" element={<ExecutiveHangarsPage />} />
            <Route path="/contested-zones" element={<ContestedZonesPage />} />
            <Route path="/guide" element={<GuidePage />} />
          </Routes>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  )
}

export default App
