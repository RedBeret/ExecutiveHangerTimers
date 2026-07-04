// Room Durable Object: holds one squad's shared timer state and fans out
// updates over WebSockets.
//
// Uses the WebSocket Hibernation API so an idle room with open connections
// costs nothing - the DO is evicted from memory and woken only when a
// message arrives.
//
// Storage layout:
//   meta          -> { createdAt, lastActivityAt }
//   timer:<id>    -> endTime (epoch ms)
//   vault         -> syncTime (epoch ms)

const ROOM_TTL_MS = 10 * 60 * 60 * 1000 // rooms die 10h after last activity
const MAX_MESSAGE_BYTES = 2048
const MAX_TIMER_ID_LEN = 64
const MAX_TIMERS_PER_ROOM = 100
const MAX_SOCKETS_PER_ROOM = 24
const MSG_RATE_LIMIT = 30 // messages per socket per 10s window

export class Room {
  constructor(state) {
    this.state = state
    // Per-socket message counters; in-memory only, resets on hibernation
    // (that's fine - it just blunts floods)
    this.msgCounts = new WeakMap()
    // Keepalive pings answered without waking the DO
    this.state.setWebSocketAutoResponse(
      new WebSocketRequestResponsePair('ping', 'pong')
    )
  }

  async fetch(request) {
    const url = new URL(request.url)

    if (url.pathname === '/create') {
      const meta = await this.state.storage.get('meta')
      if (meta) {
        // Code already in use by a live room - tell the Worker to pick another
        return new Response('taken', { status: 409 })
      }
      const now = Date.now()
      await this.state.storage.put('meta', { createdAt: now, lastActivityAt: now })
      await this.state.storage.setAlarm(now + ROOM_TTL_MS)
      return new Response('ok', { status: 200 })
    }

    if (url.pathname.endsWith('/ws')) {
      const meta = await this.state.storage.get('meta')
      if (!meta) {
        return new Response('room not found', { status: 404 })
      }
      if (this.state.getWebSockets().length >= MAX_SOCKETS_PER_ROOM) {
        return new Response('room full', { status: 409 })
      }

      const pair = new WebSocketPair()
      this.state.acceptWebSocket(pair[1])

      // New member: send them the full state, tell everyone the new headcount
      await this.sendSnapshot(pair[1])
      this.broadcastPresence()

      return new Response(null, { status: 101, webSocket: pair[0] })
    }

    return new Response('not found', { status: 404 })
  }

  async sendSnapshot(ws) {
    const timers = {}
    const timerEntries = await this.state.storage.list({ prefix: 'timer:' })
    for (const [key, endTime] of timerEntries) {
      timers[key.slice('timer:'.length)] = endTime
    }
    const vault = (await this.state.storage.get('vault')) ?? null
    this.safeSend(ws, {
      type: 'snapshot',
      timers,
      vault,
      members: this.state.getWebSockets().length,
    })
  }

  async webSocketMessage(ws, raw) {
    if (typeof raw !== 'string' || raw.length > MAX_MESSAGE_BYTES) return
    if (!this.allowMessage(ws)) return

    let msg
    try {
      msg = JSON.parse(raw)
    } catch {
      return
    }

    const now = Date.now()

    switch (msg.type) {
      case 'timer:start': {
        if (!this.validTimerId(msg.id) || !this.validEndTime(msg.endTime, now)) return
        const count = (await this.state.storage.list({ prefix: 'timer:', limit: MAX_TIMERS_PER_ROOM })).size
        if (count >= MAX_TIMERS_PER_ROOM) return
        await this.state.storage.put(`timer:${msg.id}`, msg.endTime)
        this.broadcast({ type: 'timer:start', id: msg.id, endTime: msg.endTime }, ws)
        await this.touch(now)
        break
      }
      case 'timer:reset': {
        if (!this.validTimerId(msg.id)) return
        await this.state.storage.delete(`timer:${msg.id}`)
        this.broadcast({ type: 'timer:reset', id: msg.id }, ws)
        await this.touch(now)
        break
      }
      case 'vault:sync': {
        // Vault sync is a past observation time, not a future end time
        if (typeof msg.syncTime !== 'number' || Math.abs(now - msg.syncTime) > 24 * 60 * 60 * 1000) return
        await this.state.storage.put('vault', msg.syncTime)
        this.broadcast({ type: 'vault:sync', syncTime: msg.syncTime }, ws)
        await this.touch(now)
        break
      }
      case 'vault:clear': {
        await this.state.storage.delete('vault')
        this.broadcast({ type: 'vault:clear' }, ws)
        await this.touch(now)
        break
      }
      default:
        break
    }
  }

  webSocketClose(ws) {
    // The closing socket can still be in getWebSockets() here - exclude it
    this.broadcastPresence(ws)
  }

  webSocketError(ws) {
    this.broadcastPresence(ws)
  }

  async alarm() {
    const meta = await this.state.storage.get('meta')
    if (!meta) return
    const idleFor = Date.now() - meta.lastActivityAt
    if (idleFor >= ROOM_TTL_MS) {
      // Room expired: disconnect everyone and wipe all state, freeing the code
      for (const ws of this.state.getWebSockets()) {
        try {
          ws.close(1000, 'room expired')
        } catch {
          // socket already gone
        }
      }
      await this.state.storage.deleteAll()
    } else {
      await this.state.storage.setAlarm(meta.lastActivityAt + ROOM_TTL_MS)
    }
  }

  async touch(now) {
    const meta = await this.state.storage.get('meta')
    if (meta) {
      meta.lastActivityAt = now
      await this.state.storage.put('meta', meta)
    }
  }

  validTimerId(id) {
    return typeof id === 'string' && id.length > 0 && id.length <= MAX_TIMER_ID_LEN
  }

  validEndTime(endTime, now) {
    // End times must be in the near future (longest CZ cooldown is 30min;
    // allow generous headroom without letting garbage in)
    return typeof endTime === 'number' && endTime > now - 60_000 && endTime < now + 24 * 60 * 60 * 1000
  }

  allowMessage(ws) {
    let entry = this.msgCounts.get(ws)
    const now = Date.now()
    if (!entry || now - entry.windowStart > 10_000) {
      entry = { windowStart: now, count: 0 }
    }
    entry.count++
    this.msgCounts.set(ws, entry)
    return entry.count <= MSG_RATE_LIMIT
  }

  safeSend(ws, msg) {
    try {
      ws.send(JSON.stringify(msg))
    } catch {
      // socket closing; presence updates on its close event
    }
  }

  broadcast(msg, exclude = null) {
    const data = JSON.stringify(msg)
    for (const ws of this.state.getWebSockets()) {
      if (ws === exclude) continue
      try {
        ws.send(data)
      } catch {
        // socket closing; presence updates on its close event
      }
    }
  }

  broadcastPresence(closing = null) {
    const members = this.state.getWebSockets().filter((ws) => ws !== closing).length
    this.broadcast({ type: 'presence', members }, closing)
  }
}
