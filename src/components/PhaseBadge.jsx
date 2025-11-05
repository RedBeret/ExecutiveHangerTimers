import React from 'react'
import { PHASES } from '../utils/timerCalculations'

const phaseConfig = {
  [PHASES.RED]: {
    label: 'HANGAR CLOSED',
    description: 'Do NOT insert compboards',
    color: 'bg-accent-red',
    textColor: 'text-red-100',
    borderColor: 'border-accent-red',
    icon: '🔴',
  },
  [PHASES.GREEN]: {
    label: 'HANGAR OPEN',
    description: 'Insert compboards NOW!',
    color: 'bg-accent-green',
    textColor: 'text-green-100',
    borderColor: 'border-accent-green',
    icon: '🟢',
  },
  [PHASES.BLACK]: {
    label: 'RESETTING',
    description: 'Cycle resetting...',
    color: 'bg-dark-600',
    textColor: 'text-gray-100',
    borderColor: 'border-dark-500',
    icon: '⚫',
  },
}

export function PhaseBadge({ phase, nextPhase }) {
  if (!phase) return null

  const config = phaseConfig[phase]
  const nextConfig = phaseConfig[nextPhase]

  return (
    <div className="space-y-3">
      <div
        className={`
          inline-flex items-center gap-3 px-6 py-3 rounded-lg border-2
          ${config.color} ${config.borderColor} ${config.textColor}
          shadow-lg transition-all duration-300
        `}
      >
        <span className="text-2xl">{config.icon}</span>
        <div>
          <div className="text-lg font-bold tracking-wider">{config.label}</div>
          <div className="text-sm opacity-90">{config.description}</div>
        </div>
      </div>

      {nextPhase && nextConfig && (
        <div className="text-sm text-gray-400">
          Next: <span className="text-gray-300 font-medium">{nextConfig.label}</span>
        </div>
      )}
    </div>
  )
}
