import React from 'react'
import { useTranslation } from 'react-i18next'
import { Check, X } from 'lucide-react'

// isOn: true = green (open), false = red (closed), null = empty/off
export function LEDIndicator({ isOn, number, size = 'md', responsive = false }) {
  const { t } = useTranslation()
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: responsive ? 'w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20' : 'w-20 h-20',
    xl: 'w-24 h-24',
  }

  const stateKey = isOn === true ? 'led.active' : isOn === false ? 'led.closed' : 'led.off'

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        {/* Outer glow ring */}
        {isOn === true && (
          <div className={`
            absolute inset-0 ${sizeClasses[size]} rounded-full
            bg-accent-green blur-xl opacity-60 animate-glow-green
          `} />
        )}
        {isOn === false && (
          <div className={`
            absolute inset-0 ${sizeClasses[size]} rounded-full
            bg-accent-red blur-xl opacity-60 animate-glow-red
          `} />
        )}

        {/* LED body */}
        <div className="relative">
          <div
            role="img"
            aria-label={`${t('led.label', { number })}: ${t(stateKey)}`}
            className={`
              ${sizeClasses[size]} rounded-full border-3 transition-all duration-500
              relative flex items-center justify-center
              ${isOn === true
                ? 'bg-gradient-to-br from-accent-green via-green-400 to-accent-green border-green-300 shadow-2xl shadow-accent-green/80 animate-glow-green'
                : isOn === false
                  ? 'bg-gradient-to-br from-accent-red via-red-400 to-accent-red border-red-300 shadow-2xl shadow-accent-red/80 animate-glow-red'
                  : 'bg-gradient-to-br from-dark-800 to-dark-900 border-dark-600 shadow-inner'
              }
            `}
          >
            {/* Inner highlight */}
            {isOn !== null && (
              <div className="absolute w-1/3 h-1/3 rounded-full bg-white/40 blur-sm" />
            )}
            {/* Etched state glyph — redundant shape cue so lit states read without color */}
            {isOn === true && (
              <Check className="relative w-1/2 h-1/2 text-green-950/60" strokeWidth={3} aria-hidden="true" />
            )}
            {isOn === false && (
              <X className="relative w-1/2 h-1/2 text-red-950/60" strokeWidth={3} aria-hidden="true" />
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-1">
        <span className={`text-xs sm:text-sm font-mono font-bold ${isOn === true ? 'text-accent-green' : isOn === false ? 'text-accent-red' : 'text-gray-600'}`}>
          {t('led.label', { number })}
        </span>
        <span className={`text-[10px] sm:text-xs font-medium ${isOn === true ? 'text-green-400' : isOn === false ? 'text-red-400' : 'text-gray-700'}`}>
          {t(stateKey)}
        </span>
      </div>
    </div>
  )
}

export function LEDGrid({ ledStates }) {
  const { t } = useTranslation()

  return (
    <div className="relative">
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-radial-green rounded-xl opacity-50 blur-2xl" />

      <div className="relative p-4 sm:p-6 md:p-8 bg-dark-900/80 backdrop-blur-md rounded-xl border-2 border-dark-700/50">
        <div className="text-center mb-4 sm:mb-6">
          <h3 className="text-base sm:text-lg font-bold text-gray-300 mb-1">{t('led.statusLights')}</h3>
          <p className="text-xs sm:text-sm text-gray-500">{t('led.realTimeIndicators')}</p>
        </div>

        <div className="flex justify-center items-start gap-2 sm:gap-4 md:gap-6">
          {ledStates.map((isOn, index) => (
            <LEDIndicator key={index} isOn={isOn} number={index + 1} size="lg" responsive={true} />
          ))}
        </div>

        <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-dark-700/50 text-center">
          <p className="text-[10px] sm:text-xs text-gray-500" dangerouslySetInnerHTML={{ __html: t('led.description') }} />
        </div>
      </div>
    </div>
  )
}
