import React from 'react'
import { ExecutiveHangar } from '../components/ExecutiveHangar'
import { ContestedZones } from '../components/ContestedZones'
import { CompboardChecklist } from '../components/CompboardChecklist'
import { QuickReference } from '../components/QuickReference'

export function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Page Header */}
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-3">
            <span className="bg-gradient-to-r from-accent-blue via-accent-green to-accent-blue bg-clip-text text-transparent">
              Pyro Timer Dashboard
            </span>
          </h1>
          <p className="text-gray-400 text-lg">
            All your Star Citizen timers at a glance
          </p>
        </div>

        {/* Executive Hangar */}
        <section id="exec-hangar">
          <ExecutiveHangar />
        </section>

        {/* Contested Zones */}
        <section id="contested-zones">
          <ContestedZones />
        </section>

        {/* Compboard Checklist */}
        <section id="compboards">
          <CompboardChecklist />
        </section>

        {/* Quick Reference */}
        <section id="quick-reference">
          <QuickReference />
        </section>

        {/* About */}
        <section id="about" className="card">
          <h2 className="text-2xl font-bold mb-4">About This Tool</h2>

          <div className="space-y-4 text-gray-300">
            <p>
              <strong className="text-accent-blue">Pyro Timer</strong> is a comprehensive fan-made
              tool for Star Citizen's contested zone operations in the Pyro system. Track executive
              hangar cycles, keycard printer cooldowns, and compboard collection all in one place.
            </p>

            <div>
              <h3 className="font-bold text-lg mb-2 text-white">Features</h3>
              <ul className="space-y-1 ml-5 list-disc">
                <li>High-precision executive hangar timer (±1 second accuracy)</li>
                <li>All contested zone objective timers (Checkmate, Orbituary, Ruin Station)</li>
                <li>Compboard collection tracker with progress visualization</li>
                <li>Local storage - your data never leaves your device</li>
                <li>Works offline after first load</li>
                <li>No login or account required</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2 text-white">How It Works</h3>
              <p>
                All timers run in your browser using React and JavaScript. The executive hangar
                timer calculates the current cycle phase based on the known 185-minute cycle.
                Contested zone timers and your checklist are saved in your browser's local storage,
                so they persist even if you close the page.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2 text-white">Credits & Sources</h3>
              <ul className="space-y-1 ml-5 list-disc text-sm">
                <li><strong>Timer Algorithm:</strong> Based on Xyxyll's research (exec.xyxyll.com)</li>
                <li><strong>Game Data:</strong> Star Citizen Wiki & community testing</li>
                <li><strong>Inspiration:</strong> ContestedZoneTimers.com, Exectimer.com</li>
                <li><strong>Game:</strong> Star Citizen by Cloud Imperium Games</li>
              </ul>
            </div>

            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg text-sm">
              <strong className="text-amber-400">Disclaimer:</strong> This is an unofficial
              fan-made tool, not affiliated with or endorsed by Cloud Imperium Games. Timer
              accuracy depends on your system clock being properly synced. Use at your own risk.
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
