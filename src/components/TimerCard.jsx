import React from 'react'
import { Play, RotateCcw, Clock, AlertTriangle } from 'lucide-react'
import { CountdownDisplay } from './CountdownDisplay'
import { TimerRing } from './CircularProgress'
import { useCountdownTimer } from '../hooks/useCountdownTimer'
import { useAnnouncer } from '../hooks/useAnnouncer'

export function TimerCard({ id, label, duration = 30 * 60 * 1000 }) {
  const { status, start, reset } = useCountdownTimer(id, duration)

  // Accessibility: Announce timer updates to screen readers
  useAnnouncer(status.timeRemaining, status.isActive, label)

  // Warning state: less than 3 minutes remaining
  const isWarning = status.isActive && status.timeRemaining < 3 * 60 * 1000
  const isReady = !status.isActive

  // Determine border and background based on state
  let borderColor = 'border-dark-700'
  let bgGradient = ''
  let statusBadgeClass = 'bg-accent-green/20 text-accent-green'
  let statusText = 'Ready'

  if (status.isActive) {
    if (isWarning) {
      borderColor = 'border-amber-500/50'
      bgGradient = 'bg-gradient-radial-yellow'
      statusBadgeClass = 'bg-amber-500/30 text-amber-300 animate-pulse'
      statusText = 'Almost Ready!'
    } else {
      borderColor = 'border-accent-red/30'
      bgGradient = 'bg-gradient-radial-red'
      statusBadgeClass = 'bg-accent-red/20 text-accent-red'
      statusText = 'Cooling Down'
    }
  }

  return (
    <article
      className={`
        relative card p-5 transition-all duration-300
        hover:border-accent-blue/50 hover:shadow-xl
        ${borderColor}
      `}
      aria-label={`${label} timer`}
    >
      {/* Background gradient effect */}
      {status.isActive && (
        <div className={`absolute inset-0 ${bgGradient} rounded-xl opacity-20 pointer-events-none`} aria-hidden="true" />
      )}

      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h4 className="font-bold text-gray-100 text-lg mb-1">{label}</h4>
            <div className="flex items-center gap-2">
              <Clock className="w-3 h-3 text-gray-500" aria-hidden="true" />
              <span className="text-xs text-gray-500">
                {duration / 1000 / 60} min cooldown
              </span>
            </div>
          </div>
          <div
            className={`
              px-3 py-1 rounded-lg text-xs font-bold
              ${statusBadgeClass}
            `}
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            {isWarning && <AlertTriangle className="w-3 h-3 inline mr-1" aria-hidden="true" />}
            {statusText}
          </div>
        </div>

        {/* Timer Display with Progress Ring */}
        <div
          className="flex items-center justify-between gap-4 mb-4"
          role="timer"
          aria-label={`${label} countdown`}
        >
          <div className="flex-1">
            <CountdownDisplay
              timeRemaining={status.isActive ? status.timeRemaining : duration}
              size="large"
              className={
                isReady ? 'text-gray-500' :
                isWarning ? 'text-amber-400' :
                'text-accent-red'
              }
            />
            {status.isActive && (
              <div className="mt-2 text-sm text-gray-400">
                Ready at <span className="text-accent-blue font-semibold">
                  {new Date(Date.now() + status.timeRemaining).toLocaleTimeString([], {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                  })}
                </span>
              </div>
            )}
          </div>
          <div aria-hidden="true">
            <TimerRing
              timeRemaining={status.isActive ? status.timeRemaining : duration}
              totalTime={duration}
              status={status.isActive ? 'active' : 'ready'}
              size={90}
            />
          </div>
        </div>

        {/* Warning Message */}
        {isWarning && (
          <div
            className="mb-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-center gap-2"
            role="alert"
            aria-live="assertive"
          >
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" aria-hidden="true" />
            <span className="text-xs text-amber-200 font-medium">
              Printer will be ready in under 3 minutes!
            </span>
          </div>
        )}

        {/* Controls - Enhanced for mobile with min-height touch targets */}
        <div className="flex gap-3">
          <button
            onClick={() => start()}
            disabled={status.isActive}
            aria-label={`Start ${label} timer`}
            aria-disabled={status.isActive}
            className={`
              flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg
              min-h-[48px] font-bold transition-all duration-300
              hover:scale-105 active:scale-95
              ${status.isActive
                ? 'bg-dark-700 text-gray-500 cursor-not-allowed opacity-50'
                : 'bg-accent-blue hover:bg-blue-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50'
              }
            `}
          >
            <Play className="w-5 h-5" aria-hidden="true" />
            <span className="hidden sm:inline">Start Timer</span>
            <span className="sm:hidden">Start</span>
          </button>
          {status.isActive && (
            <button
              onClick={reset}
              aria-label={`Reset ${label} timer`}
              className="btn btn-secondary px-4 py-3 min-h-[48px] min-w-[48px] hover:bg-dark-600 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <RotateCcw className="w-5 h-5" aria-hidden="true" />
              <span className="sr-only">Reset</span>
            </button>
          )}
        </div>
      </div>
    </article>
  )
}
