// Runtime-updatable Executive Hangar cycle constants.
//
// The values ship baked-in as a fallback, but the app periodically re-fetches
// /timer-config.json (same static host) so a resync after a game patch only
// requires updating that one JSON file — no rebuild, and users pick it up
// within one heartbeat without refreshing the page.

// Baked-in fallback (resync 2026-07-02 against exec.xyxyll.com)
const DEFAULT_CONFIG = {
  initialOpenTime: 1782913351076, // 2026-07-01T13:42:31.076Z - GREEN phase start
  openDuration: 3900093, // 65.002 minutes - GREEN/ONLINE phase
  closeDuration: 7200173, // 120.003 minutes - RED/OFFLINE phase
}

const HEARTBEAT_MS = 15 * 60 * 1000
const DESIGN_OPEN_MS = 65 * 60 * 1000
const DESIGN_CLOSE_MS = 120 * 60 * 1000

let config = { ...DEFAULT_CONFIG }
let clockSkewMs = 0
let roomApi = ''

export function getExecConfig() {
  return {
    ...config,
    cycleDuration: config.openDuration + config.closeDuration,
  }
}

// Positive = device clock ahead of server time, negative = behind.
// Estimated from the HTTP Date header (1s resolution + network latency),
// so only differences well above a few seconds are meaningful.
export function getClockSkewMs() {
  return clockSkewMs
}

// Run Room backend URL, delivered via timer-config.json so the backend can
// move (or be disabled) without rebuilding the site. Empty = rooms unavailable.
export function getRoomApi() {
  return roomApi
}

// Reject configs that are malformed or wildly off the designed cycle,
// so a corrupted fetch can never break the timer.
function isValidConfig(c) {
  return (
    c &&
    Number.isFinite(c.openDuration) &&
    Math.abs(c.openDuration - DESIGN_OPEN_MS) < DESIGN_OPEN_MS * 0.05 &&
    Number.isFinite(c.closeDuration) &&
    Math.abs(c.closeDuration - DESIGN_CLOSE_MS) < DESIGN_CLOSE_MS * 0.05 &&
    Number.isFinite(c.initialOpenTime) &&
    c.initialOpenTime > Date.UTC(2020, 0, 1) &&
    c.initialOpenTime < Date.now() + 366 * 24 * 60 * 60 * 1000
  )
}

async function fetchConfig() {
  try {
    const requestStart = Date.now()
    const res = await fetch(`${import.meta.env.BASE_URL}timer-config.json`, {
      cache: 'no-store',
    })
    if (!res.ok) return

    const dateHeader = res.headers.get('date')
    if (dateHeader) {
      const serverTime = new Date(dateHeader).getTime()
      if (Number.isFinite(serverTime)) {
        // Compare against the midpoint of the request to absorb latency
        clockSkewMs = Math.round((requestStart + Date.now()) / 2) - serverTime
      }
    }

    const data = await res.json()
    if (isValidConfig(data)) {
      config = {
        initialOpenTime: data.initialOpenTime,
        openDuration: data.openDuration,
        closeDuration: data.closeDuration,
      }
    }
    if (typeof data.roomApi === 'string' && /^https:\/\/[\w./-]+$/.test(data.roomApi)) {
      roomApi = data.roomApi.replace(/\/+$/, '')
    }
  } catch {
    // Offline or fetch blocked - keep the current (baked-in or last good) config
  }
}

let heartbeatStarted = false

export function startTimerConfigHeartbeat() {
  if (heartbeatStarted) return
  heartbeatStarted = true
  fetchConfig()
  setInterval(fetchConfig, HEARTBEAT_MS)
}
