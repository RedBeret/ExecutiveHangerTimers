import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Navigation } from './components/Navigation'
import { Footer } from './components/Footer'
import { HomePage } from './pages/HomePage'
import { ExecutiveHangarsPage } from './pages/ExecutiveHangarsPage'
import { ContestedZonesPage } from './pages/ContestedZonesPage'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-dark-950 flex flex-col">
        {/* Navigation */}
        <Navigation />

        {/* Main Content */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/executive-hangars" element={<ExecutiveHangarsPage />} />
            <Route path="/contested-zones" element={<ContestedZonesPage />} />
          </Routes>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  )
}

export default App
