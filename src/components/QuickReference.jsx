import React from 'react'
import { BookOpen, Key, Clock, Lightbulb } from 'lucide-react'

const references = [
  {
    icon: BookOpen,
    title: 'Executive Hangar Cycle',
    items: [
      'Total Cycle: 185 minutes (3h 5min)',
      'Red Phase: ~120 min (Closed - Do NOT insert boards)',
      'Green Phase: ~60 min (OPEN - Insert boards now!)',
      'Black Phase: ~5 min (Resetting)',
      'Synchronized globally across all servers',
    ],
  },
  {
    icon: Key,
    title: 'Keycard Types',
    items: [
      'Red: From Supervisor stations',
      'Blue: 30-min cooldown printers',
      'Green/Yellow: Ruin Station specific',
      'All printers have 30-minute cooldown after use',
    ],
  },
  {
    icon: Clock,
    title: 'Vault Timer Door',
    items: [
      'Location: Ruin Station vault',
      'Opens for 1 minute',
      'Closed for 20 minutes',
      'Repeats automatically',
      'Click "Door Opened Now" to sync',
    ],
  },
  {
    icon: Lightbulb,
    title: 'Tips & Strategy',
    items: [
      'Keep system clock auto-synced',
      'Mark compboards as you collect them',
      'Start timers immediately when using printers',
      'Plan routes around timer availability',
      'All 7 boards required for hangar access',
    ],
  },
]

export function QuickReference() {
  return (
    <div className="card">
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-2">Quick Reference Guide</h2>
        <p className="text-gray-400">Essential info for contested zone operations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {references.map((ref, index) => {
          const Icon = ref.icon
          return (
            <div
              key={index}
              className="p-5 bg-dark-800/50 rounded-lg border border-dark-700 hover:border-accent-blue/50 transition-all duration-200"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-accent-blue/20 rounded-lg">
                  <Icon className="w-5 h-5 text-accent-blue" />
                </div>
                <h3 className="font-bold text-lg">{ref.title}</h3>
              </div>
              <ul className="space-y-2">
                {ref.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="text-accent-blue mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </div>
  )
}
