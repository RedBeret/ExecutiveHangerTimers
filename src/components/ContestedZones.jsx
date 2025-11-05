import React from 'react'
import { Target, Zap, Landmark } from 'lucide-react'
import { TimerCard } from './TimerCard'
import { VaultTimerCard } from './VaultTimerCard'

const zones = [
  {
    id: 'checkmate',
    name: 'Checkmate Station',
    icon: Target,
    timers: [
      { id: 'checkmate-blue-1', label: 'Blue Keycard Printer 1' },
      { id: 'checkmate-blue-2', label: 'Blue Keycard Printer 2' },
      { id: 'checkmate-blue-3', label: 'Blue Keycard Printer 3' },
      { id: 'checkmate-blue-4', label: 'Blue Keycard Printer 4' },
    ],
  },
  {
    id: 'orbituary',
    name: 'Orbituary Station',
    icon: Zap,
    timers: [
      { id: 'orbituary-blue-1', label: 'Blue Keycard Printer 1' },
      { id: 'orbituary-blue-2', label: 'Blue Keycard Printer 2' },
    ],
  },
  {
    id: 'ruin',
    name: 'Ruin Station',
    icon: Landmark,
    timers: [
      { id: 'ruin-crypt', label: 'Green Keycard (Crypt)' },
      { id: 'ruin-wasteland', label: 'Yellow Keycard (Wasteland)' },
      { id: 'ruin-lastresort', label: 'Keycard (Last Resort)' },
    ],
  },
]

export function ContestedZones() {
  return (
    <div className="card">
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-2">Contested Zone Timers</h2>
        <p className="text-gray-400">Track keycard printers & objectives</p>
      </div>

      <div className="space-y-8">
        {zones.map((zone) => {
          const Icon = zone.icon
          return (
            <div key={zone.id} className="space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-dark-700">
                <Icon className="w-6 h-6 text-accent-blue" />
                <h3 className="text-xl font-bold">{zone.name}</h3>
              </div>

              {/* Special vault timer for Ruin Station */}
              {zone.id === 'ruin' && (
                <VaultTimerCard />
              )}

              {/* Regular keycard timers */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {zone.timers.map((timer) => (
                  <TimerCard
                    key={timer.id}
                    id={timer.id}
                    label={timer.label}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-6 p-4 bg-dark-800/30 rounded-lg text-sm text-gray-400">
        <strong className="text-gray-300">Default cooldowns:</strong> Keycard printers have a 30-minute cooldown after use.
        Start the timer when you or your team activates a printer.
      </div>
    </div>
  )
}
