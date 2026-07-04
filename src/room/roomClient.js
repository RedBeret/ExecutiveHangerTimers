// Run Room client: syncs user-triggered timers (keycard printers, vault door)
// across a squad over WebSocket. No accounts, no PII - just a 4-digit code.
//
// The room is authoritative while connected: remote updates are written into
// the same localStorage keys the hooks already read, then a window event
// nudges mounted hooks to re-read. Solo mode is untouched - with no room
// joined every publish is a no-op.

import { storage } from '../utils/storage'
import { getRoomApi } from '../utils/timerConfig'

export const ROOM_EVENT = 'cz-room-remote-update'
const ROOM_CODE_KEY = 'pyro_room_code'

const RECONNECT_BASE_MS = 1000
const RECONNECT_MAX_MS = 15000
const KEEPALIVE_MS = 30000

const state = {
  code: null,
  status: 'idle', // idle | connecting | connected | error
  members: 0,
}

let ws = null
let listeners = new Set()
let reconnectAttempt = 0
let reconnectTimer = null
let keepaliveTimer = null
let intentionalLeave = false

function apiBase() {
  return import.meta.env.VITE_ROOM_API || getRoomApi()
}

function emit() {
  const snapshot = { ...state, available: Boolean(apiBase()) }
  listeners.forEach((fn) => fn(snapshot))
}

function notifyTimersChanged() {
  window.dispatchEvent(new CustomEvent(ROOM_EVENT))
}

function setStatus(status) {
  state.status = status
  emit()
}

function cleanupSocket() {
  if (keepaliveTimer) clearInterval(keepaliveTimer)
  keepaliveTimer = null
  if (reconnectTimer) clearTimeout(reconnectTimer)
  reconnectTimer = null
  if (ws) {
    ws.onopen = ws.onmessage = ws.onclose = ws.onerror = null
    try {
      ws.close()
    } catch {
      // already closed
    }
    ws = null
  }
}

function send(msg) {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(msg))
  }
}

function handleMessage(msg) {
  switch (msg.type) {
    case 'snapshot': {
      // Merge: the room wins for ids it knows; then contribute any local
      // running timers the room doesn't have yet
      const local = storage.loadTimers()
      const now = Date.now()
      for (const [id, endTime] of Object.entries(msg.timers)) {
        local[id] = endTime
      }
      storage.saveTimers(local)
      for (const [id, endTime] of Object.entries(local)) {
        if (!(id in msg.timers) && endTime > now) {
          send({ type: 'timer:start', id, endTime })
        }
      }
      if (typeof msg.vault === 'number') {
        storage.saveVaultSync(msg.vault)
      }
      state.members = msg.members
      notifyTimersChanged()
      emit()
      break
    }
    case 'timer:start': {
      const timers = storage.loadTimers()
      timers[msg.id] = msg.endTime
      storage.saveTimers(timers)
      notifyTimersChanged()
      break
    }
    case 'timer:reset': {
      storage.clearTimer(msg.id)
      notifyTimersChanged()
      break
    }
    case 'vault:sync': {
      storage.saveVaultSync(msg.syncTime)
      notifyTimersChanged()
      break
    }
    case 'vault:clear': {
      storage.clearVaultSync()
      notifyTimersChanged()
      break
    }
    case 'presence': {
      state.members = msg.members
      emit()
      break
    }
    default:
      break
  }
}

function connect(code) {
  const base = apiBase()
  if (!base) return

  cleanupSocket()
  setStatus('connecting')

  const wsUrl = `${base.replace(/^http/, 'ws')}/rooms/${code}/ws`
  ws = new WebSocket(wsUrl)

  ws.onopen = () => {
    reconnectAttempt = 0
    state.code = code
    localStorage.setItem(ROOM_CODE_KEY, code)
    setStatus('connected')
    keepaliveTimer = setInterval(() => {
      if (ws && ws.readyState === WebSocket.OPEN) ws.send('ping')
    }, KEEPALIVE_MS)
  }

  ws.onmessage = (event) => {
    if (event.data === 'pong') return
    try {
      handleMessage(JSON.parse(event.data))
    } catch {
      // malformed frame - ignore
    }
  }

  ws.onclose = () => {
    if (keepaliveTimer) clearInterval(keepaliveTimer)
    keepaliveTimer = null
    if (intentionalLeave) return
    if (!state.code) {
      // never established (bad code) - surface as error
      setStatus('error')
      return
    }
    // Drop -> reconnect with backoff; the snapshot on reconnect re-syncs us
    setStatus('connecting')
    const delay = Math.min(RECONNECT_BASE_MS * 2 ** reconnectAttempt, RECONNECT_MAX_MS)
    reconnectAttempt++
    reconnectTimer = setTimeout(() => connect(state.code), delay)
  }

  ws.onerror = () => {
    // onclose follows and handles state
  }
}

export const roomClient = {
  subscribe(fn) {
    listeners.add(fn)
    fn({ ...state, available: Boolean(apiBase()) })
    return () => listeners.delete(fn)
  },

  async createRoom() {
    const base = apiBase()
    if (!base) throw new Error('room_api_unavailable')
    setStatus('connecting')
    try {
      const res = await fetch(`${base}/rooms`, { method: 'POST' })
      if (!res.ok) throw new Error('create_failed')
      const { code } = await res.json()
      intentionalLeave = false
      connect(code)
      return code
    } catch (err) {
      setStatus('error')
      throw err
    }
  },

  joinRoom(code) {
    if (!/^\d{4}$/.test(code)) {
      setStatus('error')
      return
    }
    intentionalLeave = false
    connect(code)
  },

  leaveRoom() {
    intentionalLeave = true
    cleanupSocket()
    state.code = null
    state.members = 0
    localStorage.removeItem(ROOM_CODE_KEY)
    setStatus('idle')
  },

  // Rejoin a room remembered from a previous page load
  resume() {
    const code = localStorage.getItem(ROOM_CODE_KEY)
    if (code && /^\d{4}$/.test(code) && !ws) {
      intentionalLeave = false
      // Resume must survive the config fetch race: the API base may not be
      // known yet on first paint, so retry briefly until the heartbeat lands
      if (apiBase()) {
        connect(code)
      } else {
        let tries = 0
        const poll = setInterval(() => {
          tries++
          if (apiBase()) {
            clearInterval(poll)
            connect(code)
          } else if (tries > 20) {
            clearInterval(poll)
          }
        }, 500)
      }
    }
  },

  publishTimerStart(id, endTime) {
    send({ type: 'timer:start', id, endTime })
  },

  publishTimerReset(id) {
    send({ type: 'timer:reset', id })
  },

  publishVaultSync(syncTime) {
    send({ type: 'vault:sync', syncTime })
  },

  publishVaultClear() {
    send({ type: 'vault:clear' })
  },
}
