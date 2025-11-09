import React from 'react'
import { useTranslation } from 'react-i18next'
import { PHASES } from '../utils/timerCalculations'

const phaseStyles = {
  [PHASES.RED]: {
    color: 'bg-accent-red',
    textColor: 'text-red-100',
    borderColor: 'border-accent-red',
    icon: '🔴',
  },
  [PHASES.GREEN]: {
    color: 'bg-accent-green',
    textColor: 'text-green-100',
    borderColor: 'border-accent-green',
    icon: '🟢',
  },
}

const phaseKeys = {
  [PHASES.RED]: { label: 'phases.red', desc: 'phases.redDesc' },
  [PHASES.GREEN]: { label: 'phases.green', desc: 'phases.greenDesc' },
}

export function PhaseBadge({ phase, nextPhase }) {
  const { t } = useTranslation()
  if (!phase) return null

  const style = phaseStyles[phase]
  const keys = phaseKeys[phase]
  const nextKeys = phaseKeys[nextPhase]

  return (
    <div className="space-y-3">
      <div
        className={`
          inline-flex items-center gap-3 px-6 py-3 rounded-lg border-2
          ${style.color} ${style.borderColor} ${style.textColor}
          shadow-lg transition-all duration-300
        `}
      >
        <span className="text-2xl">{style.icon}</span>
        <div>
          <div className="text-lg font-bold tracking-wider">{t(keys.label)}</div>
          <div className="text-sm opacity-90">{t(keys.desc)}</div>
        </div>
      </div>

      {nextPhase && nextKeys && (
        <div className="text-sm text-gray-400">
          {t('phases.nextPhase', { phase: t(nextKeys.label) })}
        </div>
      )}
    </div>
  )
}
