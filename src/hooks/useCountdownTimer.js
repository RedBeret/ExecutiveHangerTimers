import { useState, useEffect, useCallback } from 'react'
import { calculateCountdownStatus } from '../utils/timerCalculations'
import { storage } from '../utils/storage'
import { roomClient, ROOM_EVENT } from '../room/roomClient'

export function useCountdownTimer(timerId, defaultDuration = 30 * 60 * 1000) {
  const [endTime, setEndTime] = useState(null)
  const [status, setStatus] = useState({ status: 'READY', timeRemaining: 0, isActive: false })

  // Load timer from storage on mount, and re-load whenever a Run Room
  // update writes new state into storage
  useEffect(() => {
    const loadFromStorage = () => {
      const timers = storage.loadTimers()
      setEndTime(timers[timerId] ?? null)
    }
    loadFromStorage()
    window.addEventListener(ROOM_EVENT, loadFromStorage)
    return () => window.removeEventListener(ROOM_EVENT, loadFromStorage)
  }, [timerId])

  // Update status every second
  useEffect(() => {
    const updateStatus = () => {
      const newStatus = calculateCountdownStatus(endTime)
      setStatus(newStatus)

      // Auto-clear from storage when timer expires
      if (newStatus.status === 'READY' && endTime) {
        storage.clearTimer(timerId)
        setEndTime(null)
      }
    }

    updateStatus()
    const interval = setInterval(updateStatus, 1000)

    return () => clearInterval(interval)
  }, [endTime, timerId])

  const start = useCallback((duration = defaultDuration) => {
    const newEndTime = Date.now() + duration
    setEndTime(newEndTime)

    const timers = storage.loadTimers()
    timers[timerId] = newEndTime
    storage.saveTimers(timers)
    roomClient.publishTimerStart(timerId, newEndTime)
  }, [timerId, defaultDuration])

  const reset = useCallback(() => {
    setEndTime(null)
    storage.clearTimer(timerId)
    roomClient.publishTimerReset(timerId)
  }, [timerId])

  return {
    status,
    start,
    reset,
    defaultDuration,
  }
}
