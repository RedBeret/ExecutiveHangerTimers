// Sync public/timer-config.json against exec.xyxyll.com (Xyxyll's community
// research is the upstream source of truth for the Executive Hangar cycle).
//
// Fail-safe by design: if the upstream file can't be fetched or parsed, or the
// parsed values look implausible, the script exits non-zero WITHOUT touching
// the existing config - a broken upstream can never corrupt the live timer.
//
// Outputs "changed=true|false" to $GITHUB_OUTPUT when run inside Actions.

import { readFileSync, writeFileSync, appendFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const UPSTREAM_URL = 'https://exec.xyxyll.com/app.js'
const CONFIG_PATH = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'timer-config.json')

const DESIGN_OPEN_MS = 65 * 60 * 1000
const DESIGN_CLOSE_MS = 120 * 60 * 1000

function fail(message) {
  console.error(`sync-timer-config: ${message}`)
  process.exit(1)
}

function setOutput(changed) {
  if (process.env.GITHUB_OUTPUT) {
    appendFileSync(process.env.GITHUB_OUTPUT, `changed=${changed}\n`)
  }
}

const res = await fetch(UPSTREAM_URL).catch((err) => fail(`fetch failed: ${err.message}`))
if (!res.ok) fail(`fetch failed: HTTP ${res.status}`)
const src = await res.text()

function parseIntConst(name) {
  const match = src.match(new RegExp(`const\\s+${name}\\s*=\\s*(-?\\d+)`))
  return match ? Number(match[1]) : null
}

// INITIAL_OPEN_TIME upstream is `new Date('...')`; also accept a raw epoch
// number in case the format changes
function parseInitialOpenTime() {
  const dateMatch = src.match(/const\s+INITIAL_OPEN_TIME\s*=\s*new Date\(\s*'([^']+)'\s*\)/)
  if (dateMatch) return Date.parse(dateMatch[1])
  const epochMatch = src.match(/const\s+INITIAL_OPEN_TIME\s*=\s*(\d{12,14})\b/)
  if (epochMatch) return Number(epochMatch[1])
  return null
}

const driftMs = parseIntConst('CYCLE_DRIFT_MS')
const onlineMin = parseIntConst('DESIGN_ONLINE_MIN')
const offlineMin = parseIntConst('DESIGN_OFFLINE_MIN')
const initialOpenTime = parseInitialOpenTime()

if (driftMs === null || onlineMin === null || offlineMin === null) {
  fail('could not parse cycle constants - upstream format may have changed')
}
if (initialOpenTime === null || Number.isNaN(initialOpenTime)) {
  fail('could not parse INITIAL_OPEN_TIME - upstream format may have changed')
}

// Mirror upstream's derivation: drift is spread across the cycle proportionally
const designCycleMs = (onlineMin + offlineMin) * 60 * 1000
const cycleDuration = designCycleMs + driftMs
const openDuration = Math.round((cycleDuration * onlineMin * 60 * 1000) / designCycleMs)
const closeDuration = cycleDuration - openDuration

// Plausibility bounds: within 5% of the designed cycle, epoch in a sane window
if (Math.abs(openDuration - DESIGN_OPEN_MS) > DESIGN_OPEN_MS * 0.05) {
  fail(`openDuration ${openDuration} implausible`)
}
if (Math.abs(closeDuration - DESIGN_CLOSE_MS) > DESIGN_CLOSE_MS * 0.05) {
  fail(`closeDuration ${closeDuration} implausible`)
}
if (initialOpenTime < Date.UTC(2020, 0, 1) || initialOpenTime > Date.now() + 366 * 24 * 60 * 60 * 1000) {
  fail(`initialOpenTime ${initialOpenTime} implausible`)
}

const current = JSON.parse(readFileSync(CONFIG_PATH, 'utf8'))

if (
  current.initialOpenTime === initialOpenTime &&
  current.openDuration === openDuration &&
  current.closeDuration === closeDuration
) {
  console.log('timer config unchanged')
  setOutput(false)
  process.exit(0)
}

const next = {
  initialOpenTime,
  openDuration,
  closeDuration,
  source: 'exec.xyxyll.com',
  updatedAt: new Date().toISOString(),
}
writeFileSync(CONFIG_PATH, JSON.stringify(next, null, 2) + '\n')
console.log('timer config updated:', JSON.stringify(next))
setOutput(true)
