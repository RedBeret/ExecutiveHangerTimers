import React from 'react'
import { Check, RotateCcw, MapPin, Clock, Play } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useCompboards } from '../hooks/useCompboards'
import { useCountdownTimer } from '../hooks/useCountdownTimer'
import { CountdownDisplay } from './CountdownDisplay'

function CompboardItem({ board, onToggle, t }) {
  const COMPBOARD_RESPAWN = 30 * 60 * 1000 // 30 minutes
  const { status, start } = useCountdownTimer(`compboard-${board.id}`, COMPBOARD_RESPAWN)

  return (
    <div className="bg-dark-800/50 border-2 border-dark-700 rounded-lg p-4">
      {/* Board Info and Checkbox */}
      <button
        onClick={() => onToggle(board.id)}
        className={`
          w-full rounded-lg transition-all duration-200
          flex items-center gap-4 text-left mb-3
          ${board.collected ? 'opacity-75' : ''}
        `}
      >
        <div
          className={`
            w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
            ${board.collected
              ? 'bg-accent-green text-white'
              : 'bg-dark-700 text-gray-500 border-2 border-dark-600'
            }
          `}
        >
          {board.collected ? <Check className="w-5 h-5" /> : board.id}
        </div>

        <div className="flex-1">
          <div className={`font-bold ${board.collected ? 'text-accent-green' : 'text-gray-200'}`}>
            {t('compboards.board', { id: board.id })}
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-400">
            <MapPin className="w-3 h-3" />
            {board.location}
          </div>
        </div>

        {board.collected && (
          <div className="text-accent-green text-sm font-medium">
            {t('compboards.collected')}
          </div>
        )}
      </button>

      {/* Respawn Timer */}
      <div className="border-t border-dark-700 pt-3">
        {status.isActive ? (
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-400 mb-1">{t('compboards.printerRespawn')}</div>
              <CountdownDisplay
                timeRemaining={status.timeRemaining}
                size="small"
                className="text-accent-red"
              />
              <div className="mt-1 text-xs text-gray-500">
                {t('compboards.readyAt')} <span className="text-accent-blue font-semibold">
                  {new Date(Date.now() + status.timeRemaining).toLocaleTimeString([], {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                  })}
                </span>
              </div>
            </div>
            <div className="text-xs text-accent-red font-medium px-3 py-1 bg-accent-red/10 rounded-lg">
              {t('compboards.coolingDown')}
            </div>
          </div>
        ) : (
          <button
            onClick={() => start()}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg
              bg-accent-blue hover:bg-blue-600 text-white text-sm font-medium
              transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <Play className="w-4 h-4" />
            {t('compboards.startTimer')}
          </button>
        )}
      </div>
    </div>
  )
}

export function CompboardChecklist({ filterZone = 'all' }) {
  const { t } = useTranslation()
  const { boards, collectedCount, progress, toggleBoard, resetAll, resetKey } = useCompboards()

  // Filter boards by zone
  const filteredBoards = filterZone === 'all'
    ? boards
    : boards.filter(board => board.zone === filterZone)

  const filteredCollectedCount = filteredBoards.filter(b => b.collected).length
  const filteredProgress = (filteredCollectedCount / filteredBoards.length) * 100

  return (
    <div className="card">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold">
            {t('compboards.title')}
            {filterZone !== 'all' && <span className="text-sm text-gray-400 ml-2">({t('compboards.boardsInZone', { count: filteredBoards.length })})</span>}
          </h3>
          <div className="text-right">
            <div className="text-3xl font-bold text-accent-blue">
              {filterZone === 'all' ? `${collectedCount}/7` : `${filteredCollectedCount}/${filteredBoards.length}`}
            </div>
            <div className="text-sm text-gray-400">{t('compboards.collectedLabel')}</div>
          </div>
        </div>

        <div className="w-full bg-dark-800 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-accent-blue to-accent-green h-full transition-all duration-500 ease-out"
            style={{ width: `${filterZone === 'all' ? progress : filteredProgress}%` }}
          />
        </div>

        <p className="text-sm text-gray-400 mt-3">
          {filterZone === 'all'
            ? t('compboards.collectAll')
            : t('compboards.startTimersHint')}
        </p>
      </div>

      <div className="space-y-3 mb-6">
        {filteredBoards.map((board) => (
          <CompboardItem
            key={`${board.id}-${resetKey}`}
            board={board}
            onToggle={toggleBoard}
            t={t}
          />
        ))}
      </div>

      <button
        onClick={resetAll}
        className="btn btn-secondary w-full flex items-center justify-center gap-2"
      >
        <RotateCcw className="w-4 h-4" />
        {t('compboards.resetAllBoards')}
      </button>
    </div>
  )
}
