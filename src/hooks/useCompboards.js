import { useState, useEffect, useCallback } from 'react'
import { storage } from '../utils/storage'

const COMPBOARD_DATA = [
  { id: 1, location: 'Checkmate - Hangar Area' },
  { id: 2, location: 'Checkmate - Server Room' },
  { id: 3, location: 'Orbituary - Main Terminal' },
  { id: 4, location: 'Orbituary - Storage Bay' },
  { id: 5, location: 'Ruin Station - Crypt' },
  { id: 6, location: 'Ruin Station - Vault (Timer Door)' },
  { id: 7, location: 'Ruin Station - Wasteland' },
]

export function useCompboards() {
  const [boards, setBoards] = useState(() => {
    const saved = storage.loadCompboards()
    return COMPBOARD_DATA.map(board => ({
      ...board,
      collected: saved[board.id] || false,
    }))
  })

  const collectedCount = boards.filter(b => b.collected).length
  const progress = (collectedCount / boards.length) * 100

  const toggleBoard = useCallback((boardId) => {
    setBoards(prev => {
      const updated = prev.map(board =>
        board.id === boardId ? { ...board, collected: !board.collected } : board
      )

      // Save to storage
      const saved = {}
      updated.forEach(board => {
        if (board.collected) {
          saved[board.id] = true
        }
      })
      storage.saveCompboards(saved)

      return updated
    })
  }, [])

  const resetAll = useCallback(() => {
    setBoards(prev => prev.map(board => ({ ...board, collected: false })))
    storage.clearAllCompboards()
  }, [])

  return {
    boards,
    collectedCount,
    progress,
    toggleBoard,
    resetAll,
  }
}
