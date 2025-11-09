import React, { useState } from 'react'
import { RefreshCw, Rocket, Globe, Clock, ChevronDown, ChevronUp } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useExecTimer } from '../hooks/useExecTimer'
import { PHASES } from '../utils/timerCalculations'
import { PhaseBadge } from './PhaseBadge'
import { LEDGrid } from './LEDIndicator'

export function ExecutiveHangar() {
  const { t } = useTranslation()
  const { status, offset, resetOffset, syncToPhase } = useExecTimer()
  const [showSyncPanel, setShowSyncPanel] = useState(false)

  if (!status) {
    return (
      <div className="card">
        <div className="animate-pulse text-gray-500">{t('execHangar.loading')}</div>
      </div>
    )
  }

  // Determine background gradient based on phase
  const phaseGradient = {
    [PHASES.RED]: 'bg-gradient-radial-red',
    [PHASES.GREEN]: 'bg-gradient-radial-green',
  }[status.phase]

  const phaseGlow = {
    [PHASES.RED]: 'shadow-accent-red/20',
    [PHASES.GREEN]: 'shadow-accent-green/20',
  }[status.phase]

  return (
    <div className="relative">
      {/* Background gradient effect */}
      <div className={`absolute inset-0 ${phaseGradient} rounded-2xl opacity-30 blur-3xl pointer-events-none`} />

      <div className={`relative card p-4 sm:p-6 md:p-8 border-2 ${phaseGlow} shadow-2xl`}>
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <Rocket className="w-6 h-6 sm:w-8 sm:h-8 text-accent-blue" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-accent-blue to-accent-green bg-clip-text text-transparent">
              {t('execHangar.title')}
            </h2>
          </div>
          <div className="flex items-center justify-center gap-2 text-gray-400">
            <Globe className="w-3 h-3 sm:w-4 sm:h-4" />
            <p className="text-xs sm:text-sm font-medium">{t('execHangar.subtitle')}</p>
          </div>
        </div>

        <div className="space-y-10">
          {/* Main Timer Display - LARGE AND PROMINENT */}
          <div className="relative">
            {/* Glassmorphism container */}
            <div className="backdrop-blur-md bg-dark-800/60 rounded-2xl p-4 sm:p-6 md:p-8 lg:p-10 border border-dark-700/50">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 lg:gap-10">
                {/* Phase Badge */}
                <div className="flex-1 flex justify-center lg:justify-start">
                  <PhaseBadge phase={status.phase} nextPhase={status.nextPhase} />
                </div>

                {/* MASSIVE Countdown */}
                <div className="text-center lg:text-right">
                  <div className="text-xs sm:text-sm text-gray-400 font-medium mb-2 sm:mb-3 uppercase tracking-wider">
                    {t('execHangar.timeUntil')} {status.phase === PHASES.GREEN ? t('execHangar.closing') : t('execHangar.opening')}
                  </div>
                  <div className="font-mono font-black tracking-tight leading-none text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
                    <CountdownTimer timeRemaining={status.timeRemaining} phase={status.phase} />
                  </div>
                  <div className="mt-2 sm:mt-3 text-[10px] sm:text-xs text-gray-500 font-medium">
                    {t('execHangar.cycleProgress')}: {Math.round(status.cycleProgress)}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* LED Status Grid */}
          <LEDGrid ledStates={status.ledStates} />

          {/* Controls and Info */}
          <div className="space-y-4 pt-6 border-t-2 border-dark-700/50">
            {/* Main controls row */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={() => setShowSyncPanel(!showSyncPanel)}
                className="btn btn-primary flex items-center gap-2 px-6 py-3 min-h-[48px] hover:scale-105 active:scale-95 transition-all duration-300"
                aria-label="Toggle sync panel"
              >
                <Clock className="w-5 h-5" />
                <span>{t('execHangar.syncTimer')}</span>
                {showSyncPanel ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              <button
                onClick={resetOffset}
                className="btn btn-secondary flex items-center gap-2 px-6 py-3 min-h-[48px] hover:scale-105 active:scale-95 transition-all duration-300"
                disabled={offset === 0}
                aria-label="Reset synchronization to default"
              >
                <RefreshCw className="w-4 h-4" />
                {t('execHangar.resetSync')}
              </button>

              <div className="flex-1 text-center sm:text-left">
                <p className="text-sm text-gray-500">
                  <span className="text-accent-blue font-bold">⚡ {t('execHangar.precisionTiming')}</span> {t('execHangar.syncWhenSee')}
                </p>
              </div>
            </div>

            {/* Sync Panel - Collapsible */}
            {showSyncPanel && (
              <div className="bg-dark-800/60 backdrop-blur-sm rounded-xl p-6 border border-accent-blue/30 space-y-4">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-accent-blue flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-2 text-accent-blue">{t('execHangar.syncPanel.title')}</h3>
                    <p className="text-sm text-gray-400 mb-4">
                      {t('execHangar.syncPanel.description')}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => {
                      syncToPhase('GREEN')
                      setShowSyncPanel(false)
                    }}
                    className="bg-accent-green/20 hover:bg-accent-green/30 border-2 border-accent-green/50 text-accent-green rounded-lg p-4 transition-all duration-300 hover:scale-105 active:scale-95 min-h-[48px]"
                    aria-label="Sync to green phase opening now"
                  >
                    <div className="font-bold text-lg mb-1">🟢 {t('execHangar.syncPanel.green')}</div>
                    <div className="text-xs opacity-80">{t('execHangar.syncPanel.greenOpened')}</div>
                    <div className="text-xs opacity-60">{t('execHangar.syncPanel.greenDesc')}</div>
                  </button>

                  <button
                    onClick={() => {
                      syncToPhase('RED')
                      setShowSyncPanel(false)
                    }}
                    className="bg-accent-red/20 hover:bg-accent-red/30 border-2 border-accent-red/50 text-accent-red rounded-lg p-4 transition-all duration-300 hover:scale-105 active:scale-95 min-h-[48px]"
                    aria-label="Sync to red phase closing now"
                  >
                    <div className="font-bold text-lg mb-1">🔴 {t('execHangar.syncPanel.red')}</div>
                    <div className="text-xs opacity-80">{t('execHangar.syncPanel.redClosed')}</div>
                    <div className="text-xs opacity-60">{t('execHangar.syncPanel.redDesc')}</div>
                  </button>
                </div>

                <div className="text-xs text-gray-500 bg-dark-900/50 rounded p-3 border-l-4 border-accent-blue/50">
                  <span dangerouslySetInnerHTML={{ __html: t('execHangar.syncPanel.tip') }} />
                </div>
              </div>
            )}
          </div>

          {/* Sync Offset Warning */}
          {offset !== 0 && (
            <div className="p-4 bg-amber-500/10 border-2 border-amber-500/30 rounded-xl text-sm text-amber-200 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <div>
                <strong className="font-bold">{t('execHangar.syncActive')}</strong> {t('execHangar.offsetApplied', { offset: `${offset > 0 ? '+' : ''}${offset}` })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Enhanced countdown component with phase-based colors
function CountdownTimer({ timeRemaining, phase }) {
  const totalSeconds = Math.floor(timeRemaining / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  const phaseColor = {
    [PHASES.RED]: 'text-accent-red',
    [PHASES.GREEN]: 'text-accent-green',
  }[phase]

  const glowAnimation = {
    [PHASES.RED]: 'animate-glow-red',
    [PHASES.GREEN]: 'animate-glow-green',
  }[phase]

  return (
    <span className={`${phaseColor} ${glowAnimation} drop-shadow-2xl`}>
      {hours > 0 && (
        <>
          {String(hours).padStart(2, '0')}
          <span className="text-gray-600 mx-1">:</span>
        </>
      )}
      {String(minutes).padStart(2, '0')}
      <span className="text-gray-600 mx-1">:</span>
      {String(seconds).padStart(2, '0')}
    </span>
  )
}
