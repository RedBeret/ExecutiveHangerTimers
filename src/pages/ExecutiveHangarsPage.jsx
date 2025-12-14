import React from 'react'
import { ExecutiveHangar } from '../components/ExecutiveHangar'
import { CompboardChecklist } from '../components/CompboardChecklist'
import { Rocket, CheckCircle2, TrendingUp } from 'lucide-react'

export function ExecutiveHangarsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Page Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Rocket className="w-12 h-12 text-accent-blue" />
            <h1 className="text-5xl font-bold">
              <span className="bg-gradient-to-r from-accent-blue to-accent-green bg-clip-text text-transparent">
                Executive Hangars
              </span>
            </h1>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Track the PYAM-EXHANG hangar cycle and collect all 7 compboards to access legendary ships
          </p>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card p-6 bg-accent-blue/10 border-accent-blue/30">
            <div className="flex items-center gap-3 mb-2">
              <Rocket className="w-6 h-6 text-accent-blue" />
              <h3 className="font-bold text-lg">Hangar Cycle</h3>
            </div>
            <p className="text-sm text-gray-400">
              185-minute cycle: Green (65min open) → Red (120min closed)
            </p>
          </div>

          <div className="card p-6 bg-accent-green/10 border-accent-green/30">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle2 className="w-6 h-6 text-accent-green" />
              <h3 className="font-bold text-lg">7 Compboards</h3>
            </div>
            <p className="text-sm text-gray-400">
              Collect all boards from contested zones to unlock hangar access
            </p>
          </div>

          <div className="card p-6 bg-amber-500/10 border-amber-500/30">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-6 h-6 text-amber-400" />
              <h3 className="font-bold text-lg">Ship Rewards</h3>
            </div>
            <p className="text-sm text-gray-400">
              Choose from 5 exclusive ships: F8C, Polaris, 890J, Carrack, or A2
            </p>
          </div>
        </div>

        {/* Executive Hangar Timer */}
        <section id="exec-hangar">
          <ExecutiveHangar />
        </section>

        {/* Compboard Checklist */}
        <section id="compboards">
          <CompboardChecklist />
        </section>

        {/* Strategy Tips */}
        <section className="card bg-dark-800/60">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <span className="text-accent-blue">💡</span>
            Hangar Run Strategy
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-300">
            <div>
              <h3 className="font-bold text-lg mb-2 text-accent-green">Preparation Phase (Red)</h3>
              <ul className="space-y-2 ml-5 list-disc text-sm">
                <li>Collect all 7 compboards from contested zones</li>
                <li>Watch the LED indicators (5 lights = ready soon)</li>
                <li>Position your ship near PYAM-EXHANG</li>
                <li>Have your crew ready 10-15 minutes before Green</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2 text-accent-green">Execution Phase (Green)</h3>
              <ul className="space-y-2 ml-5 list-disc text-sm">
                <li>You have 65 minutes to complete the run</li>
                <li>Insert all 7 compboards in the correct sequence</li>
                <li>Complete hangar objectives</li>
                <li>Choose your ship reward carefully!</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2 text-amber-400">Timing Tips</h3>
              <ul className="space-y-2 ml-5 list-disc text-sm">
                <li>Use the "Sync Timer" button when you see phase changes in-game</li>
                <li>Set alarms for 10 minutes before Green phase</li>
                <li>Plan contested zone runs during Red phase</li>
                <li>Avoid being inside during phase transitions</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2 text-accent-red">Danger Zones</h3>
              <ul className="space-y-2 ml-5 list-disc text-sm">
                <li>⚠️ All ships inside are destroyed when doors close (Red phase)</li>
                <li>⚠️ Exit before the Green phase countdown reaches zero!</li>
                <li>⚠️ Have escape routes planned</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
