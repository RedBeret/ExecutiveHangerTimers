import { useState, useEffect, useCallback } from 'react'
import { calculateVaultStatus } from '../utils/timerCalculations'
import { storage } from '../utils/storage'
import { roomClient, ROOM_EVENT } from '../room/roomClient'

export function useVaultTimer() {
  const [syncTime, setSyncTime] = useState(() => storage.loadVaultSync())
  const [status, setStatus] = useState({ status: 'UNKNOWN', timeRemaining: 0, nextChange: 'NOT_SYNCED' })

  // Pick up vault syncs shared through a Run Room
  useEffect(() => {
    const loadFromStorage = () => setSyncTime(storage.loadVaultSync())
    window.addEventListener(ROOM_EVENT, loadFromStorage)
    return () => window.removeEventListener(ROOM_EVENT, loadFromStorage)
  }, [])

  useEffect(() => {
    const updateStatus = () => {
      const newStatus = calculateVaultStatus(syncTime)
      setStatus(newStatus)
    }

    updateStatus()
    const interval = setInterval(updateStatus, 1000)

    return () => clearInterval(interval)
  }, [syncTime])

  const sync = useCallback(() => {
    const now = Date.now()
    setSyncTime(now)
    storage.saveVaultSync(now)
    roomClient.publishVaultSync(now)
  }, [])

  const reset = useCallback(() => {
    setSyncTime(null)
    storage.clearVaultSync()
    roomClient.publishVaultClear()
  }, [])

  return {
    status,
    sync,
    reset,
    isSynced: syncTime !== null,
  }
}
