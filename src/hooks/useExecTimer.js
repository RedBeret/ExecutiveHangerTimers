import { useState, useEffect } from 'react'
import { calculateExecStatus } from '../utils/timerCalculations'
import { storage } from '../utils/storage'

export function useExecTimer() {
  const [status, setStatus] = useState(null)
  const [offset, setOffset] = useState(() => storage.loadExecOffset())

  useEffect(() => {
    const updateStatus = () => {
      const newStatus = calculateExecStatus(offset)
      setStatus(newStatus)
    }

    // Initial update
    updateStatus()

    // Update every second
    const interval = setInterval(updateStatus, 1000)

    return () => clearInterval(interval)
  }, [offset])

  const updateOffset = (newOffset) => {
    setOffset(newOffset)
    storage.saveExecOffset(newOffset)
  }

  const resetOffset = () => {
    setOffset(0)
    storage.saveExecOffset(0)
  }

  // Sync to a specific phase starting NOW
  const syncToPhase = (targetPhase) => {
    const EXEC_CYCLE_MS = 185 * 60 * 1000 + 699
    const RED_PHASE_MS = 120 * 60 * 1000
    const GREEN_PHASE_MS = 60 * 60 * 1000

    const now = Date.now()
    const REFERENCE_EPOCH = new Date('2025-01-01T00:00:00.000Z').getTime()
    const timeSinceRef = now - REFERENCE_EPOCH
    const currentPositionInCycle = timeSinceRef % EXEC_CYCLE_MS

    let targetPositionInCycle

    if (targetPhase === 'RED') {
      // Red phase starts at position 0
      targetPositionInCycle = 0
    } else if (targetPhase === 'GREEN') {
      // Green phase starts after red phase (120 minutes)
      targetPositionInCycle = RED_PHASE_MS
    } else if (targetPhase === 'BLACK') {
      // Black phase starts after red + green (180 minutes)
      targetPositionInCycle = RED_PHASE_MS + GREEN_PHASE_MS
    }

    // Calculate the offset needed to shift current position to target position
    let offsetMs = targetPositionInCycle - currentPositionInCycle

    // Normalize offset to be within one cycle
    if (offsetMs < -EXEC_CYCLE_MS / 2) {
      offsetMs += EXEC_CYCLE_MS
    } else if (offsetMs > EXEC_CYCLE_MS / 2) {
      offsetMs -= EXEC_CYCLE_MS
    }

    const offsetSeconds = Math.round(offsetMs / 1000)
    updateOffset(offsetSeconds)
  }

  return {
    status,
    offset,
    updateOffset,
    resetOffset,
    syncToPhase,
  }
}
