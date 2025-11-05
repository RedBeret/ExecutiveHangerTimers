import { useEffect, useRef } from 'react'

/**
 * Accessibility hook for announcing timer updates to screen readers
 * Follows WCAG guidelines: announce at critical intervals only
 * (5 minutes, 2 minutes, 1 minute, 30 seconds)
 */
export function useAnnouncer(timeRemaining, isActive, label = 'Timer') {
  const lastAnnouncedRef = useRef(null)

  useEffect(() => {
    if (!isActive || timeRemaining <= 0) {
      lastAnnouncedRef.current = null
      return
    }

    const seconds = Math.floor(timeRemaining / 1000)
    const minutes = Math.floor(seconds / 60)

    // Critical intervals to announce (in seconds)
    const intervals = {
      300: '5 minutes',
      120: '2 minutes',
      60: '1 minute',
      30: '30 seconds',
      10: '10 seconds',
    }

    // Check if we should announce this interval
    for (const [threshold, announcement] of Object.entries(intervals)) {
      const thresholdNum = parseInt(threshold)
      if (seconds === thresholdNum && lastAnnouncedRef.current !== thresholdNum) {
        announceToScreenReader(`${label} - ${announcement} remaining`)
        lastAnnouncedRef.current = thresholdNum
        break
      }
    }

    // Announce when timer completes
    if (seconds === 0 && lastAnnouncedRef.current !== 0) {
      announceToScreenReader(`${label} complete - Ready`)
      lastAnnouncedRef.current = 0
    }
  }, [timeRemaining, isActive, label])
}

/**
 * Announce message to screen readers using aria-live region
 */
function announceToScreenReader(message) {
  // Create or get existing announcer element
  let announcer = document.getElementById('sr-announcer')

  if (!announcer) {
    announcer = document.createElement('div')
    announcer.id = 'sr-announcer'
    announcer.setAttribute('aria-live', 'polite')
    announcer.setAttribute('aria-atomic', 'true')
    announcer.className = 'sr-only'
    announcer.style.cssText = `
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    `
    document.body.appendChild(announcer)
  }

  // Clear and set new message
  announcer.textContent = ''
  setTimeout(() => {
    announcer.textContent = message
  }, 100)
}

/**
 * Hook for managing focus announcements
 */
export function useFocusAnnouncer() {
  const announce = (message) => {
    announceToScreenReader(message)
  }

  return { announce }
}
