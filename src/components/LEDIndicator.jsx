import React from 'react'

export function LEDIndicator({ isOn, number, size = 'md', responsive = false }) {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: responsive ? 'w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20' : 'w-20 h-20',
    xl: 'w-24 h-24',
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        {/* Outer glow ring */}
        {isOn && (
          <div className={`
            absolute inset-0 ${sizeClasses[size]} rounded-full
            bg-accent-green blur-xl opacity-60 animate-glow-green
          `} />
        )}

        {/* LED body */}
        <div className="relative">
          <div
            className={`
              ${sizeClasses[size]} rounded-full border-3 transition-all duration-500
              flex items-center justify-center
              ${isOn
                ? 'bg-gradient-to-br from-accent-green via-green-400 to-accent-green border-green-300 shadow-2xl shadow-accent-green/80 animate-glow-green'
                : 'bg-gradient-to-br from-dark-800 to-dark-900 border-dark-600 shadow-inner'
              }
            `}
          >
            {/* Inner highlight */}
            {isOn && (
              <div className="w-1/3 h-1/3 rounded-full bg-white/40 blur-sm" />
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-1">
        <span className={`text-xs sm:text-sm font-mono font-bold ${isOn ? 'text-accent-green' : 'text-gray-600'}`}>
          LED {number}
        </span>
        <span className={`text-[10px] sm:text-xs font-medium ${isOn ? 'text-green-400' : 'text-gray-700'}`}>
          {isOn ? 'ACTIVE' : 'OFF'}
        </span>
      </div>
    </div>
  )
}

export function LEDGrid({ ledStates }) {
  return (
    <div className="relative">
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-radial-green rounded-xl opacity-50 blur-2xl" />

      <div className="relative p-4 sm:p-6 md:p-8 bg-dark-900/80 backdrop-blur-md rounded-xl border-2 border-dark-700/50">
        <div className="text-center mb-4 sm:mb-6">
          <h3 className="text-base sm:text-lg font-bold text-gray-300 mb-1">Hangar Status Lights</h3>
          <p className="text-xs sm:text-sm text-gray-500">Real-time LED indicators</p>
        </div>

        <div className="flex justify-center items-start gap-2 sm:gap-4 md:gap-6">
          {ledStates.map((isOn, index) => (
            <LEDIndicator key={index} isOn={isOn} number={index + 1} size="lg" responsive={true} />
          ))}
        </div>

        <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-dark-700/50 text-center">
          <p className="text-[10px] sm:text-xs text-gray-500">
            Lights turn <span className="text-accent-green font-semibold">GREEN</span> during power-up phase •
            Turn off during power-down • All off = hangar closed
          </p>
        </div>
      </div>
    </div>
  )
}
