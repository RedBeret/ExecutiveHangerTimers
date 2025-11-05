import React from 'react'
import { Check, RotateCcw, MapPin } from 'lucide-react'
import { useCompboards } from '../hooks/useCompboards'

export function CompboardChecklist() {
  const { boards, collectedCount, progress, toggleBoard, resetAll } = useCompboards()

  return (
    <div className="card">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold">Compboard Collection</h3>
          <div className="text-right">
            <div className="text-3xl font-bold text-accent-blue">{collectedCount}/7</div>
            <div className="text-sm text-gray-400">Collected</div>
          </div>
        </div>

        <div className="w-full bg-dark-800 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-accent-blue to-accent-green h-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-sm text-gray-400 mt-3">
          Collect all 7 unique compboards to unlock the Executive Hangar
        </p>
      </div>

      <div className="space-y-2 mb-6">
        {boards.map((board) => (
          <button
            key={board.id}
            onClick={() => toggleBoard(board.id)}
            className={`
              w-full p-4 rounded-lg border-2 transition-all duration-200
              flex items-center gap-4 text-left
              ${board.collected
                ? 'bg-accent-green/10 border-accent-green hover:bg-accent-green/20'
                : 'bg-dark-800/50 border-dark-700 hover:border-dark-600 hover:bg-dark-800'
              }
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
                Board {board.id}
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-400">
                <MapPin className="w-3 h-3" />
                {board.location}
              </div>
            </div>

            {board.collected && (
              <div className="text-accent-green text-sm font-medium">
                ✓ Collected
              </div>
            )}
          </button>
        ))}
      </div>

      <button
        onClick={resetAll}
        className="btn btn-secondary w-full flex items-center justify-center gap-2"
      >
        <RotateCcw className="w-4 h-4" />
        Reset All Boards
      </button>
    </div>
  )
}
