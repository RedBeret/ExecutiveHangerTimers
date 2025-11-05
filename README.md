# 🚀 Pyro Timer - Star Citizen CZ Tracker

A comprehensive web application for tracking Star Citizen's Executive Hangar cycles and Contested Zone objectives in the Pyro system.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)

## ✨ Features

### 🎯 Executive Hangar Timer
- **High-precision timing** (±1 second accuracy) based on the 185-minute cycle
- **Visual LED indicators** matching in-game status lights
- **Phase tracking** (Red/Green/Black phases)
- **Global synchronization** across all servers

### ⏱️ Contested Zone Timers
- **Keycard printer cooldowns** for all three zones:
  - Checkmate Station (4 Blue printers)
  - Orbituary Station (2 Blue printers)
  - Ruin Station (3 keycard printers + Vault door)
- **Vault timer door** with 1min open / 20min closed cycle
- **Persistent timers** that survive page reloads

### 📋 Compboard Tracker
- **Visual checklist** for all 7 compboards
- **Progress tracking** with percentage bar
- **Location information** for each board
- **Auto-save** to local storage

### 🎨 Modern UI/UX
- **Dark space theme** optimized for extended use
- **Responsive design** works on desktop, tablet, and mobile
- **Smooth animations** and visual feedback
- **No login required** - all data stays local

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/RedBeret/ExecutiveHangerTimers.git
cd ExecutiveHangerTimers

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
# Create optimized build
npm run build

# Preview production build
npm run preview
```

## 📦 Deployment to GitHub Pages

### Method 1: Automated Deployment

1. Update `vite.config.js` with your repository name:
```js
export default defineConfig({
  base: '/your-repo-name/',
  // ...
})
```

2. Deploy:
```bash
npm run deploy
```

### Method 2: Manual Deployment

1. Build the project:
```bash
npm run build
```

2. Push the `dist` folder to the `gh-pages` branch:
```bash
git subtree push --prefix dist origin gh-pages
```

3. Enable GitHub Pages in repository settings:
   - Go to Settings → Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages` / `root`

Your site will be live at `https://cztimer.com`

## 🏗️ Project Structure

```
ExecutiveHangerTimers/
├── src/
│   ├── components/         # React components
│   │   ├── ExecutiveHangar.jsx
│   │   ├── ContestedZones.jsx
│   │   ├── CompboardChecklist.jsx
│   │   ├── LEDIndicator.jsx
│   │   ├── PhaseBadge.jsx
│   │   ├── TimerCard.jsx
│   │   ├── VaultTimerCard.jsx
│   │   ├── CountdownDisplay.jsx
│   │   ├── QuickReference.jsx
│   │   └── Footer.jsx
│   ├── hooks/              # Custom React hooks
│   │   ├── useExecTimer.js
│   │   ├── useCountdownTimer.js
│   │   ├── useVaultTimer.js
│   │   └── useCompboards.js
│   ├── utils/              # Utility functions
│   │   ├── storage.js      # LocalStorage management
│   │   └── timerCalculations.js  # Timer logic
│   ├── App.jsx             # Main app component
│   ├── main.jsx            # React entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
├── docs/                   # Documentation
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🎮 How to Use

### Executive Hangar
1. The timer runs automatically - no setup needed
2. Watch the phase indicator and LED lights
3. Insert compboards during **GREEN** phase only
4. Use "Reset Sync" if timer seems off

### Contested Zone Timers
1. Click **Start** when you or your team uses a keycard printer
2. Timer counts down the 30-minute cooldown
3. Click **Reset** to stop/clear a timer
4. Timers persist even if you refresh the page

### Vault Timer Door
1. Click **"Door Opened Now"** when you see the vault door open
2. Timer will track the 21-minute cycle (1min open, 20min closed)
3. Use this to plan your Ruin Station runs

### Compboard Checklist
1. Click a compboard when you collect it
2. Track your progress toward all 7 boards
3. Click **Reset All Boards** to start fresh

## 🛠️ Technical Details

### Built With
- **React 18.3** - UI framework
- **Vite 5** - Build tool and dev server
- **Tailwind CSS 3.4** - Utility-first CSS
- **Lucide React** - Icon library
- **LocalStorage API** - Data persistence

### Timer Accuracy
The executive hangar timer uses a precise calculation based on:
- **Cycle length:** 185 minutes + 0.699 seconds
- **Reference epoch:** Calibrated to known cycle start
- **Update frequency:** Every 1 second

Accuracy depends on your system clock. For best results, enable automatic time synchronization in your OS settings.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Guidelines
1. Follow existing code style (Prettier/ESLint)
2. Test changes thoroughly
3. Update documentation as needed
4. Keep accessibility in mind

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

This is an **unofficial fan-made tool**, not affiliated with or endorsed by Cloud Imperium Games. Star Citizen and related marks are trademarks of Cloud Imperium Games Corporation.

Timer accuracy depends on your system clock. Use at your own risk. Game mechanics may change with patches.

## 🙏 Credits

- **Timer Algorithm:** Based on research by Xyxyll ([exec.xyxyll.com](https://exec.xyxyll.com))
- **Game Data:** [Star Citizen Wiki](https://starcitizen.tools) & community testing
- **Inspiration:** ContestedZoneTimers.com, Exectimer.com
- **Game:** [Star Citizen](https://robertsspaceindustries.com) by Cloud Imperium Games

## 📞 Support

- 🐛 **Bug Reports:** [GitHub Issues](https://github.com/RedBeret/ExecutiveHangerTimers/issues)
- 💬 **Discussions:** [GitHub Discussions](https://github.com/RedBeret/ExecutiveHangerTimers/discussions)
- 🌟 **Star the repo** if you find it useful!

---

**May your hangars always be green!** 🚀✨
