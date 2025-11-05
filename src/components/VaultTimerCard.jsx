import React from 'react'
import { DoorOpen, RotateCcw, AlertCircle } from 'lucide-react'
import { CountdownDisplay } from './CountdownDisplay'
import { useVaultTimer } from '../hooks/useVaultTimer'

export function VaultTimerCard() {
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
            Ruin Station Vault Door
          </h4>
          <p className="text-sm text-gray-400 mt-1">
            Opens for 1 min, closed for 20 min (repeating cycle)
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
            <strong>Not synced.</strong> Click "Door Opened Now" when you see the vault door open to start tracking.
          </div>
        </div>
      )}

      {isSynced && (
        <div className="mb-4">
          <div className="text-sm text-gray-400 mb-2">
            {isOpen ? 'Closing in:' : 'Opening in:'}
          </div>
          <CountdownDisplay
            timeRemaining={status.timeRemaining}
            size="large"
            className={isOpen ? 'text-accent-green' : 'text-accent-red'}
          />
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={sync}
          className="flex-1 btn btn-success flex items-center justify-center gap-2"
        >
          <DoorOpen className="w-4 h-4" />
          Door Opened Now
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
