// CZ Timer Run Room backend
//
// One Durable Object instance per room code. Rooms are ephemeral: no accounts,
// no PII, just a 4-digit code shared by voice/chat. All timers are absolute
// UTC epoch-ms end times, so countdowns are timezone-independent by design.
//
// Routes:
//   POST /rooms            -> create a room, returns { code }
//   GET  /rooms/:code/ws   -> WebSocket upgrade into the room (404 if no room)

export { Room } from './room.js'

const ALLOWED_ORIGINS = [
  'https://cztimer.com',
  'https://www.cztimer.com',
  'http://localhost:5173',
  'http://localhost:4173',
]

// Room codes: 4 digits, no leading zero (10k combos is plenty at this scale;
// creation retries on collision)
function randomCode() {
  return String(1000 + Math.floor(Math.random() * 9000))
}

function corsHeaders(request) {
  const origin = request.headers.get('Origin')
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  }
}

function json(request, status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(request) },
  })
}

// Naive per-isolate rate limit for room creation. Resets when the isolate
// recycles, which is fine: it only needs to blunt bursts, and Cloudflare's
// network-level DDoS protection sits in front of everything.
const createHits = new Map() // ip -> [timestamps]
const CREATE_LIMIT = 6 // rooms per minute per IP

function creationAllowed(ip) {
  const now = Date.now()
  const hits = (createHits.get(ip) || []).filter((t) => now - t < 60_000)
  if (hits.length >= CREATE_LIMIT) return false
  hits.push(now)
  createHits.set(ip, hits)
  if (createHits.size > 10_000) createHits.clear() // memory guard
  return true
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(request) })
    }

    if (url.pathname === '/rooms' && request.method === 'POST') {
      const ip = request.headers.get('CF-Connecting-IP') || 'unknown'
      if (!creationAllowed(ip)) {
        return json(request, 429, { error: 'rate_limited' })
      }

      // Retry a few random codes in case of collision with a live room
      for (let attempt = 0; attempt < 6; attempt++) {
        const code = randomCode()
        const stub = env.ROOM.get(env.ROOM.idFromName(code))
        const res = await stub.fetch('https://room/create')
        if (res.status === 200) {
          return json(request, 200, { code })
        }
      }
      return json(request, 503, { error: 'no_codes_available' })
    }

    const wsMatch = url.pathname.match(/^\/rooms\/(\d{4})\/ws$/)
    if (wsMatch && request.method === 'GET') {
      if (request.headers.get('Upgrade') !== 'websocket') {
        return json(request, 426, { error: 'websocket_required' })
      }
      // Forward the original request so the WebSocket upgrade survives intact;
      // the DO routes on the /ws path suffix
      const stub = env.ROOM.get(env.ROOM.idFromName(wsMatch[1]))
      return stub.fetch(request)
    }

    return json(request, 404, { error: 'not_found' })
  },
}
