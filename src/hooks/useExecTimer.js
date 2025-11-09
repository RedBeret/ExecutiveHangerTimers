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
    const OPEN_DURATION = 3900496 // 65 minutes - GREEN phase
    const CLOSE_DURATION = 7200917 // 120 minutes - RED phase
    const CYCLE_DURATION = OPEN_DURATION + CLOSE_DURATION
    const INITIAL_OPEN_TIME = 1760636604402

    const now = Date.now()
    const timeSinceInitial = now - INITIAL_OPEN_TIME
    const currentPositionInCycle = timeSinceInitial % CYCLE_DURATION

    let targetPositionInCycle

    if (targetPhase === 'GREEN') {
      // Green phase starts at position 0 (cycle starts with GREEN/ONLINE)
      targetPositionInCycle = 0
    } else if (targetPhase === 'RED') {
      // Red phase starts after green phase (65 minutes)
      targetPositionInCycle = OPEN_DURATION
    }

    // Calculate the offset needed to shift current position to target position
    let offsetMs = targetPositionInCycle - currentPositionInCycle

    // Normalize offset to be within one cycle
    if (offsetMs < -CYCLE_DURATION / 2) {
      offsetMs += CYCLE_DURATION
    } else if (offsetMs > CYCLE_DURATION / 2) {
      offsetMs -= CYCLE_DURATION
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
