import { useState, useEffect, useCallback } from 'react'
import { calculateVaultStatus } from '../utils/timerCalculations'
import { storage } from '../utils/storage'

export function useVaultTimer() {
  const [syncTime, setSyncTime] = useState(() => storage.loadVaultSync())
  const [status, setStatus] = useState({ status: 'UNKNOWN', timeRemaining: 0, nextChange: 'NOT_SYNCED' })

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
  }, [])

  const reset = useCallback(() => {
    setSyncTime(null)
    storage.clearVaultSync()
  }, [])

  return {
    status,
    sync,
    reset,
    isSynced: syncTime !== null,
  }
}
