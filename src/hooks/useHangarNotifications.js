import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { PHASES } from '../utils/timerCalculations'
import { storage } from '../utils/storage'

// Fire the 5-minute warning this long before the hangar opens
const OPEN_WARNING_MS = 5 * 60 * 1000

function notificationsSupported() {
  return typeof window !== 'undefined' && 'Notification' in window
}

function showNotification(title, body) {
  if (!notificationsSupported() || Notification.permission !== 'granted') return
  try {
    new Notification(title, { body, tag: 'exec-hangar' })
  } catch (error) {
    console.error('Error showing notification:', error)
  }
}

// Opt-in browser notifications for Executive Hangar phase changes.
// Fires while the tab is open: on GREEN (open), on RED (closed),
// and a one-shot warning 5 minutes before the hangar opens.
export function useHangarNotifications(status) {
  const { t } = useTranslation()
  const [enabled, setEnabled] = useState(() => storage.loadNotifyHangar())
  const [permission, setPermission] = useState(() =>
    notificationsSupported() ? Notification.permission : 'unsupported'
  )

  const prevPhaseRef = useRef(null)
  const warnedThisCycleRef = useRef(false)

  const supported = permission !== 'unsupported'
  const blocked = enabled && permission === 'denied'
  const active = enabled && permission === 'granted'

  const toggle = () => {
    if (!supported) return

    if (enabled) {
      setEnabled(false)
      storage.saveNotifyHangar(false)
      return
    }

    setEnabled(true)
    storage.saveNotifyHangar(true)

    if (Notification.permission === 'default') {
      Notification.requestPermission().then((result) => {
        setPermission(result)
      })
    } else {
      setPermission(Notification.permission)
    }
  }

  useEffect(() => {
    if (!status || !active) {
      // Don't fire stale transitions when re-enabled later
      prevPhaseRef.current = status ? status.phase : null
      return
    }

    const prevPhase = prevPhaseRef.current
    prevPhaseRef.current = status.phase

    // Phase transitions (skip the very first tick after enabling)
    if (prevPhase && prevPhase !== status.phase) {
      if (status.phase === PHASES.GREEN) {
        showNotification(t('notifications.hangarOpenTitle'), t('notifications.hangarOpenBody'))
      } else if (status.phase === PHASES.RED) {
        showNotification(t('notifications.hangarClosedTitle'), t('notifications.hangarClosedBody'))
      }
      // New phase, new cycle for the pre-open warning
      warnedThisCycleRef.current = false
    }

    // One-shot warning 5 minutes before the hangar opens
    if (
      status.phase === PHASES.RED &&
      status.timeRemaining <= OPEN_WARNING_MS &&
      !warnedThisCycleRef.current
    ) {
      warnedThisCycleRef.current = true
      showNotification(t('notifications.hangarSoonTitle'), t('notifications.hangarSoonBody'))
    }
  }, [status, active, t])

  return {
    enabled,
    supported,
    blocked,
    active,
    permission,
    toggle,
  }
}
