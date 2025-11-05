// Timer calculation utilities for Executive Hangar and other timers

// Executive Hangar Constants (based on Xyxyll's research)
const EXEC_CYCLE_MS = 185 * 60 * 1000 + 699 // 185 minutes + 0.699 seconds
const RED_PHASE_MS = 120 * 60 * 1000 // 120 minutes
const GREEN_PHASE_MS = 60 * 60 * 1000 // 60 minutes
const BLACK_PHASE_MS = 5 * 60 * 1000 // 5 minutes

// Reference epoch: A known time when the cycle started
// Calibrated based on community timer data (exec.xyxyll.com)
// Updated: Nov 5, 2025 for SC Patch 4.3.2
// Reference: November 5, 2025 01:22:36 UTC
const REFERENCE_EPOCH = 1762305756624

export const PHASES = {
  RED: 'RED',
  GREEN: 'GREEN',
  BLACK: 'BLACK',
}

export function calculateExecStatus(offsetSeconds = 0) {
  const now = Date.now() + (offsetSeconds * 1000)
  const timeSinceRef = now - REFERENCE_EPOCH
  const positionInCycle = timeSinceRef % EXEC_CYCLE_MS

  let phase, timeRemaining, nextPhase, ledStates

  if (positionInCycle < RED_PHASE_MS) {
    // RED PHASE (Closed)
    phase = PHASES.RED
    timeRemaining = RED_PHASE_MS - positionInCycle
    nextPhase = PHASES.GREEN

    // LEDs light up progressively during red phase (5 lights over 120 min = 24 min each)
    const ledInterval = RED_PHASE_MS / 5
    const ledsLit = Math.floor(positionInCycle / ledInterval)
    ledStates = Array(5).fill(false).map((_, i) => i < ledsLit)

  } else if (positionInCycle < RED_PHASE_MS + GREEN_PHASE_MS) {
    // GREEN PHASE (Open - can insert compboards)
    phase = PHASES.GREEN
    timeRemaining = (RED_PHASE_MS + GREEN_PHASE_MS) - positionInCycle
    nextPhase = PHASES.BLACK

    // All LEDs are green during green phase, but turn off progressively
    // 5 lights over 60 min = 12 min each
    const posInGreen = positionInCycle - RED_PHASE_MS
    const ledInterval = GREEN_PHASE_MS / 5
    const ledsOff = Math.floor(posInGreen / ledInterval)
    ledStates = Array(5).fill(true).map((_, i) => i >= ledsOff)

  } else {
    // BLACK PHASE (Reset/Transition)
    phase = PHASES.BLACK
    timeRemaining = EXEC_CYCLE_MS - positionInCycle
    nextPhase = PHASES.RED
    ledStates = Array(5).fill(false)
  }

  return {
    phase,
    timeRemaining,
    nextPhase,
    ledStates,
    cycleProgress: (positionInCycle / EXEC_CYCLE_MS) * 100,
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
