import { useState, useEffect, useCallback } from 'react'
import { storage } from '../utils/storage'

const COMPBOARD_DATA = [
  { id: 1, location: 'Checkmate - Hangar Area', zone: 'checkmate' },
  { id: 2, location: 'Checkmate - Server Room', zone: 'checkmate' },
  { id: 3, location: 'Checkmate - Behind Red Door', zone: 'checkmate' },
  { id: 4, location: 'Orbituary - Storage Bay', zone: 'orbituary' },
  { id: 5, location: 'Ruin Station - Crypt', zone: 'ruin' },
  { id: 6, location: 'Ruin Station - Vault (Timer Door)', zone: 'ruin' },
  { id: 7, location: 'Orbituary - Behind Fuse/Blue Doors', zone: 'orbituary' },
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
