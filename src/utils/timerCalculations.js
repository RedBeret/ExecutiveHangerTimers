// Timer calculation utilities for Executive Hangar and other timers

// Executive Hangar Constants (exact values from exec.xyxyll.com)
// Updated: Feb 01, 2026 for SC Patch 4.4.0-LIVE
const OPEN_DURATION = 3900415 // 65.007 minutes - GREEN/ONLINE phase
const CLOSE_DURATION = 7200767 // 120.013 minutes - RED/OFFLINE phase
const CYCLE_DURATION = OPEN_DURATION + CLOSE_DURATION // 11101182 ms = 185.020 minutes

// Reference epoch: Initial open time when GREEN/ONLINE phase started
// 2026-02-01T17:09:54.775-05:00 (EST) = 2026-02-01T22:09:54.775Z (UTC)
const INITIAL_OPEN_TIME = 1769983794775

export const PHASES = {
  RED: 'RED',
  GREEN: 'GREEN',
}

export function calculateExecStatus(offsetSeconds = 0) {
  const now = Date.now() + (offsetSeconds * 1000)
  const elapsedTimeSinceInitialOpen = now - INITIAL_OPEN_TIME
  const timeInCurrentCycle = elapsedTimeSinceInitialOpen % CYCLE_DURATION

  let phase, timeRemaining, nextPhase, ledStates

  // LED thresholds based on exec.xyxyll.com
  const thresholds = [
    { min: 0, max: 12*60*1000, colors: ['green', 'green', 'green', 'green', 'green'] }, // Online 5G
    { min: 12*60*1000, max: 24*60*1000, colors: ['green', 'green', 'green', 'green', 'empty'] }, // Online 4G1E
    { min: 24*60*1000, max: 36*60*1000, colors: ['green', 'green', 'green', 'empty', 'empty'] }, // Online 3G2E
    { min: 36*60*1000, max: 48*60*1000, colors: ['green', 'green', 'empty', 'empty', 'empty'] }, // Online 2G3E
    { min: 48*60*1000, max: 60*60*1000, colors: ['green', 'empty', 'empty', 'empty', 'empty'] }, // Online 1G4E
    { min: 60*60*1000, max: 65*60*1000, colors: ['empty', 'empty', 'empty', 'empty', 'empty'] }, // Online 5E
    { min: 65*60*1000, max: 89*60*1000, colors: ['red', 'red', 'red', 'red', 'red'] }, // Offline 5R
    { min: 89*60*1000, max: 113*60*1000, colors: ['green', 'red', 'red', 'red', 'red'] }, // Offline 1G4R
    { min: 113*60*1000, max: 137*60*1000, colors: ['green', 'green', 'red', 'red', 'red'] }, // Offline 2G3R
    { min: 137*60*1000, max: 161*60*1000, colors: ['green', 'green', 'green', 'red', 'red'] }, // Offline 3G2R
    { min: 161*60*1000, max: 185*60*1000, colors: ['green', 'green', 'green', 'green', 'red'] } // Offline 4G1R
  ]

  if (timeInCurrentCycle < OPEN_DURATION) {
    // GREEN PHASE (Online - hangars are open, can insert compboards)
    phase = PHASES.GREEN
    timeRemaining = OPEN_DURATION - timeInCurrentCycle
    nextPhase = PHASES.RED
  } else {
    // RED PHASE (Offline - hangars are closed)
    phase = PHASES.RED
    const remainingCloseDuration = timeInCurrentCycle - OPEN_DURATION
    timeRemaining = CLOSE_DURATION - remainingCloseDuration
    nextPhase = PHASES.GREEN
  }

  // Calculate LED states based on position in cycle
  const currentThreshold = thresholds.find(t => timeInCurrentCycle >= t.min && timeInCurrentCycle < t.max)
  if (currentThreshold) {
    ledStates = currentThreshold.colors.map(color => {
      if (color === 'green') return true
      if (color === 'red') return false
      return null // empty/transparent
    })
  } else {
    // Fallback if outside all thresholds
    ledStates = [null, null, null, null, null]
  }

  // Calculate the actual clock time when phase changes
  const nextChangeTime = now + timeRemaining

  return {
    phase,
    timeRemaining,
    nextPhase,
    ledStates,
    cycleProgress: (timeInCurrentCycle / CYCLE_DURATION) * 100,
    nextChangeTime, // Timestamp when the next phase change occurs
  }
}

export function formatTime(milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

// Format a timestamp as a clock time in user's local timezone
export function formatClockTime(timestamp) {
  const date = new Date(timestamp)

  // Format time in user's local timezone (12-hour format with AM/PM)
  return date.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

// Calculate vault door status (21-minute cycle: 1 min open, 20 min closed)
export function calculateVaultStatus(syncTime) {
  if (!syncTime) {
    return {
      status: 'UNKNOWN',
      timeRemaining: 0,
      nextChange: 'NOT_SYNCED',
    }
  }

  const VAULT_CYCLE_MS = 21 * 60 * 1000 // 21 minutes total
  const VAULT_OPEN_MS = 1 * 60 * 1000 // 1 minute open
  const VAULT_CLOSED_MS = 20 * 60 * 1000 // 20 minutes closed

  const now = Date.now()
  const timeSinceSync = now - syncTime
  const positionInCycle = timeSinceSync % VAULT_CYCLE_MS

  if (positionInCycle < VAULT_OPEN_MS) {
    // Door is currently OPEN
    return {
      status: 'OPEN',
      timeRemaining: VAULT_OPEN_MS - positionInCycle,
      nextChange: 'CLOSED',
    }
  } else {
    // Door is currently CLOSED
    return {
      status: 'CLOSED',
      timeRemaining: VAULT_CYCLE_MS - positionInCycle,
      nextChange: 'OPEN',
    }
  }
}

// Calculate countdown timer status
export function calculateCountdownStatus(endTime) {
  if (!endTime) {
    return {
      status: 'READY',
      timeRemaining: 0,
      isActive: false,
    }
  }

  const now = Date.now()
  const timeRemaining = endTime - now

  if (timeRemaining <= 0) {
    return {
      status: 'READY',
      timeRemaining: 0,
      isActive: false,
    }
  }

  return {
    status: 'ACTIVE',
    timeRemaining,
    isActive: true,
  }
}
