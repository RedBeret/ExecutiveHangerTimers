# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Pyro Timer** is a React-based web application for tracking Star Citizen's Executive Hangar cycles and Contested Zone objectives in the Pyro system. The app uses localStorage for persistence and runs entirely client-side with no backend.

## Architecture

### Tech Stack
- **Frontend Framework:** React 18.3 with hooks
- **Build Tool:** Vite 5
- **Styling:** Tailwind CSS 3.4 with custom space theme
- **Icons:** Lucide React
- **State Management:** React hooks + localStorage
- **Deployment:** GitHub Pages (static hosting)

### Core Concepts

1. **Executive Hangar Timer:**
   - 185-minute cycle with precise calculation (185:00.699)
   - Three phases: RED (120min closed), GREEN (60min open), BLACK (5min reset)
   - LED indicators that change state during phases
   - Global sync across all game servers

2. **Contested Zone Timers:**
   - Organized by location-based tabs (Checkmate, Orbituary, Ruin)
   - Dashboard remains all-encompassing with tabs for specific station filtering
   - Keycard printers: Red (30min), Blue (15min), Yellow/Green (30min)
   - Vault timer door (21min cycle: 1min open, 20min closed)
   - User-triggered timers that persist in localStorage

3. **Compboard Checklist:**
   - 7 unique compboards across 3 zones
   - Progress tracking with visual indicators
   - LocalStorage persistence
   - Location mapping:
     - Checkmate Station: Boards #1, #2, #3
     - Orbituary Station: Boards #4, #7
     - Ruin Station: Boards #5, #6

4. **Location-Based Organization:**
   - **Checkmate Station**: Blue keycard timers (30min), Boards 1-3
   - **Orbituary Station**: Blue keycard timers (30min), Boards 4 & 7
   - **Ruin Station (Ghost Arena)**: Vault timer, Yellow/Green keycards (30min), Boards 5 & 6
   - **Supervisor Outposts** (Pyro 3 L4/L5): Red keycard printers (30min)

### Project Structure

```
src/
├── components/          # React components (UI building blocks)
│   ├── ExecutiveHangar.jsx    # Main hangar timer section
│   ├── ContestedZones.jsx     # CZ timers section (with location tabs)
│   ├── CompboardChecklist.jsx # Compboard tracker
│   ├── LEDIndicator.jsx       # LED visual components
│   ├── PhaseBadge.jsx         # Phase status display
│   ├── TimerCard.jsx          # Individual CZ timer
│   ├── VaultTimerCard.jsx     # Vault door special timer
│   ├── CountdownDisplay.jsx   # Formatted time display
│   ├── QuickReference.jsx     # Help/reference section
│   └── Footer.jsx             # App footer
│   └── LocationTabs.jsx       # Station filter tabs (future/planned)
├── hooks/               # Custom React hooks (logic layer)
│   ├── useExecTimer.js        # Executive hangar timer logic
│   ├── useCountdownTimer.js   # CZ countdown timer logic
│   ├── useVaultTimer.js       # Vault timer logic
│   └── useCompboards.js       # Compboard state management
├── utils/               # Utility functions
│   ├── storage.js             # localStorage wrapper
│   └── timerCalculations.js  # Timer math & phase logic
├── App.jsx              # Main app component
├── main.jsx             # React entry point
└── index.css            # Global styles + Tailwind
```

## Key Implementation Details

### Timer Calculations (`src/utils/timerCalculations.js`)

**Executive Hangar Logic:**
- Uses a reference epoch (2025-01-01 00:00:00 UTC) as baseline
- Calculates current position in cycle: `(now - reference) % EXEC_CYCLE_MS`
- Determines phase based on position:
  - 0-120min → RED phase
  - 120-180min → GREEN phase
  - 180-185min → BLACK phase
- LED states update based on phase progression

**Important:** The reference epoch may need recalibration if CIG changes mechanics. Community reports (e.g., from exec.xyxyll.com) should be used to verify accuracy.

### LocalStorage Schema (`src/utils/storage.js`)

```js
localStorage keys:
- 'pyro_timers': { timerId: endTimeMs, ... }
- 'pyro_compboards': { boardId: true/false, ... }
- 'pyro_exec_offset': offsetSeconds (number)
- 'pyro_vault_sync': syncTimeMs (number)
```

All timer data is stored as millisecond timestamps. Timers auto-clear when they reach zero.

### Component Patterns

**Hooks-based architecture:**
- Each feature has a custom hook that manages state and localStorage
- Components are primarily presentational
- Timer updates run via `setInterval` at 1-second intervals

**Example pattern:**
```jsx
// Hook manages logic
const { status, start, reset } = useCountdownTimer('timer-id')

// Component renders UI
return <TimerCard status={status} onStart={start} onReset={reset} />
```

## Development Commands

### Local Development
```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Deployment
```bash
# Deploy to GitHub Pages (requires gh-pages configured)
npm run deploy
```

**Important:** Update `vite.config.js` with correct `base` path before deploying:
```js
base: '/your-repo-name/',  // Must match GitHub repo name
```

## Quick Update Workflow

### When User Says "update"

**Automated Sync & Deploy Process:**

1. **Verify Timer Sync:**
   ```bash
   # Fetch current timer config from exec.xyxyll.com
   curl -s https://exec.xyxyll.com/app.js | grep -A5 "INITIAL_OPEN_TIME"

   # Compare with current values in src/utils/timerCalculations.js
   # Verify INITIAL_OPEN_TIME and cycle durations match
   ```

2. **Update Code if Needed:**
   - Update `INITIAL_OPEN_TIME` in `src/utils/timerCalculations.js` if values differ
   - Update `OPEN_DURATION` and `CLOSE_DURATION` if cycle changed

3. **Build, Commit & Deploy:**
   ```bash
   npm run build
   git add .
   git commit -m "resync"
   git push
   npm run deploy
   ```

4. **Verify Deployment:**
   - Check that timer matches exec.xyxyll.com current status
   - Confirm GitHub Pages updated successfully

**Important:** Always use commit message "resync" for timer synchronization updates. Do NOT include "Claude" or other attribution in commit messages.

## Common Development Tasks

### Adding a New Timer

1. Add timer definition to zone config in `ContestedZones.jsx`:
```jsx
{ id: 'new-timer-id', label: 'New Timer Label' }
```

2. The timer will automatically use `useCountdownTimer` hook with 30min default

### Modifying Timer Duration

In `TimerCard.jsx`, pass custom duration:
```jsx
<TimerCard id="timer-id" label="Label" duration={45 * 60 * 1000} />
// 45 minutes in milliseconds
```

### Adjusting Executive Hangar Timing

If game mechanics change:

1. Update constants in `src/utils/timerCalculations.js`:
```js
const EXEC_CYCLE_MS = 185 * 60 * 1000 + 699  // Adjust if needed
const RED_PHASE_MS = 120 * 60 * 1000          // Adjust phase durations
```

2. Update reference epoch if necessary (requires community calibration)

### Styling Changes

Primary colors defined in `tailwind.config.js`:
```js
colors: {
  dark: { 950: '#0a0e1a', ... },     // Background colors
  accent: {
    green: '#10b981',                 // Success/active state
    red: '#ef4444',                   // Closed/inactive state
    blue: '#3b82f6',                  // Primary actions
  }
}
```

Apply via Tailwind classes: `bg-accent-green`, `text-accent-red`, etc.

## Testing Checklist

Before committing changes:

1. **Timer Accuracy:**
   - Run executive hangar timer for full cycle (185 min) if possible
   - Verify phase transitions occur at correct times
   - Check LED states match expected behavior

2. **LocalStorage Persistence:**
   - Start a timer, refresh page, verify it continues
   - Check/uncheck compboards, refresh, verify state persists
   - Clear localStorage and verify fresh state loads correctly

3. **Cross-browser Testing:**
   - Chrome, Firefox, Edge (minimum)
   - Check mobile responsive behavior
   - Verify animations and transitions work smoothly

4. **Build Testing:**
   ```bash
   npm run build
   npm run preview
   # Test production build at http://localhost:4173
   ```

## Important Notes

### Timer Precision
- All timers update every 1 second (1000ms intervals)
- Executive hangar timer accounts for 0.699s per cycle to prevent drift
- Accuracy depends on user's system clock being properly synced

### LocalStorage Limits
- ~5-10MB limit (varies by browser)
- Current usage is minimal (<1KB)
- No cleanup needed unless adding large data

### GitHub Pages Deployment
- Site must be built before deployment (`npm run build`)
- The `base` path in `vite.config.js` must match repo name exactly
- 404.html should mirror index.html for client-side routing (already configured)

### Performance Considerations
- Multiple `setInterval` timers (one per active timer + exec hangar)
- All intervals are cleaned up in `useEffect` return functions
- No performance issues expected with <50 concurrent timers

## Planned Features (In Progress)

### Location-Based Tab System

**Design Requirements:**
- Keep main dashboard all-encompassing (shows all timers)
- Add tabs for location-specific filtering: "All", "Checkmate", "Orbituary", "Ruin", "Supervisor Outposts"
- Each tab filters timers and compboards by station
- Tabs should be responsive and work on mobile
- Tab state persists in localStorage

**Implementation Plan:**
1. Create `LocationTabs.jsx` component with filter state
2. Update `ContestedZones.jsx` to accept location filter prop
3. Add station metadata to timer configs
4. Filter timers/compboards based on selected tab
5. Style tabs to match existing Pyro theme

**Timer Organization by Location:**

**Checkmate Station:**
- Blue Keycard Timer (15min)
- Red Keycard Timer (30min)
- Compboards: #1, #2, #3

**Orbituary Station:**
- Blue Keycard Timer (30min - special case)
- Compboards: #4, #7

**Ruin Station (Ghost Arena):**
- Vault Timer (21min cycle)
- Yellow Keycard Timer (30min)
- Green Keycard Timer (30min)
- Compboards: #5, #6

**Supervisor Outposts (Pyro 3 L4/L5):**
- Red Keycard Printer (30min)

**Executive Hangars:**
- Hazard Timer (15min countdown after entry)

## Future Enhancement Ideas

If expanding the project:

1. **Team Sync Mode:**
   - Add Firebase/Supabase for real-time multi-user sync
   - Session-based sharing with invite codes
   - Would require backend integration

2. **Interactive Maps:**
   - Add clickable zone maps with compboard locations
   - Link map markers to checklist items
   - Overlay timer status on map locations

3. **Notifications:**
   - Browser notifications when timers complete
   - Audio alerts for hangar phase changes
   - Requires Notification API permission

4. **PWA Features:**
   - Add service worker for offline functionality
   - Install as standalone app
   - Background sync for timer state

5. **Analytics:**
   - Track timer usage patterns
   - Identify most-used features
   - Privacy-friendly (Plausible or similar)

## Credits & References

- **Timer Algorithm:** Based on Xyxyll's research (exec.xyxyll.com)
- **Game Data:** Star Citizen Wiki (starcitizen.tools)
- **Community Tools:** ContestedZoneTimers.com, Exectimer.com
- **Game:** Star Citizen by Cloud Imperium Games (not affiliated)

## Support

For bugs or feature requests:
- Create GitHub issue with detailed description
- Include browser/OS info for bugs
- Screenshots help!

---

**Last Updated:** 2025-11-12
**Version:** 1.0.1
