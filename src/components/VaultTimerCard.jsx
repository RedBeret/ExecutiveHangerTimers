import React from 'react'
import { DoorOpen, RotateCcw, AlertCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { CountdownDisplay } from './CountdownDisplay'
import { useVaultTimer } from '../hooks/useVaultTimer'

export function VaultTimerCard() {
  const { t } = useTranslation()
  const { status, sync, reset, isSynced } = useVaultTimer()

  const isOpen = status.status === 'OPEN'
  const isClosed = status.status === 'CLOSED'

  return (
    <div className={`
      card p-6 border-2 transition-all duration-300
      ${isOpen ? 'border-accent-green bg-accent-green/5' : ''}
      ${isClosed ? 'border-accent-red bg-accent-red/5' : ''}
      ${!isSynced ? 'border-amber-500/50 bg-amber-500/5' : ''}
    `}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h4 className="text-lg font-bold text-gray-100 flex items-center gap-2">
            <DoorOpen className="w-5 h-5" />
            {t('vault.title')}
          </h4>
          <p className="text-sm text-gray-400 mt-1">
            {t('vault.description')}
          </p>
        </div>
        <div
          className={`
            px-3 py-1 rounded-lg text-sm font-bold
            ${isOpen ? 'bg-accent-green text-white' : ''}
            ${isClosed ? 'bg-accent-red text-white' : ''}
            ${!isSynced ? 'bg-amber-500 text-white' : ''}
          `}
        >
          {status.status}
        </div>
      </div>

      {!isSynced && (
        <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-200">
            <strong>{t('vault.notSynced')}</strong> {t('vault.syncInstruction')}
          </div>
        </div>
      )}

      {isSynced && (
        <div className="mb-4">
          <div className="text-sm text-gray-400 mb-2">
            {isOpen ? t('vault.closingIn') : t('vault.openingIn')}
          </div>
          <CountdownDisplay
            timeRemaining={status.timeRemaining}
            size="large"
            className={isOpen ? 'text-accent-green' : 'text-accent-red'}
          />
          <div className="mt-2 text-sm text-gray-400">
            {isOpen ? t('vault.closesAt') : t('vault.opensAt')} <span className="text-accent-blue font-semibold">
              {new Date(Date.now() + status.timeRemaining).toLocaleTimeString([], {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
              })}
            </span>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={sync}
          className="flex-1 btn btn-success flex items-center justify-center gap-2"
        >
          <DoorOpen className="w-4 h-4" />
          {t('vault.doorOpenedNow')}
        </button>
        {isSynced && (
          <button
            onClick={reset}
            className="btn btn-secondary px-4"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}
