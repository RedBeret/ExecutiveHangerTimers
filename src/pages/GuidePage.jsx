import React from 'react'
import { Link } from 'react-router-dom'
import {
  Crosshair, Shield, MapPin, CheckSquare, Swords, Timer,
  ChevronDown, ArrowRight, AlertTriangle, Target, Package,
  Lock, Key, BookOpen
} from 'lucide-react'

function ZoneCard({ title, subtitle, color, borderColor, items, icon: Icon }) {
  return (
    <div className={`bg-dark-800/50 rounded-xl border ${borderColor} p-6`}>
      <div className="flex items-center gap-3 mb-4">
        <Icon className={`w-6 h-6 ${color}`} />
        <div>
          <h3 className={`text-lg font-bold ${color}`}>{title}</h3>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
      </div>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
            <span className="text-gray-600 mt-0.5">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function ChecklistItem({ children }) {
  return (
    <li className="flex items-start gap-3 text-gray-300">
      <CheckSquare className="w-5 h-5 text-accent-green mt-0.5 flex-shrink-0" />
      <span>{children}</span>
    </li>
  )
}

export function GuidePage() {
  const scrollToBasics = () => {
    document.getElementById('why-section')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-12">

        {/* Hero */}
        <div className="text-center py-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-accent-blue via-accent-green to-accent-blue bg-clip-text text-transparent">
              Start Here: Pyro Contested Zones
            </span>
          </h1>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            Everything you need to know before stepping into a Contested Zone in Star Citizen's Pyro system.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={scrollToBasics}
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent-blue/20 border border-accent-blue/40 text-accent-blue rounded-lg hover:bg-accent-blue/30 transition-colors"
            >
              I'm new, show me the basics
              <ChevronDown className="w-4 h-4" />
            </button>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent-green/20 border border-accent-green/40 text-accent-green rounded-lg hover:bg-accent-green/30 transition-colors"
            >
              I know the loop, take me to timers
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* 1. Why Do This? */}
        <section id="why-section" className="space-y-4">
          <div className="flex items-center gap-3">
            <Target className="w-6 h-6 text-accent-blue" />
            <h2 className="text-2xl font-bold text-white">Why Do This?</h2>
          </div>
          <div className="bg-dark-800/50 rounded-xl border border-dark-700 p-6 space-y-3">
            <p className="text-gray-300">
              <strong className="text-white">Executive Hangar access</strong> requires collecting 7 compboards spread across three Contested Zone stations. It's the endgame PvP loop in Pyro.
            </p>
            <p className="text-gray-300">
              Inside you'll find unique loot, high-value rewards, and some of the most intense PvP encounters in the game. The Executive Hangars themselves operate on a global timer — once you have the compboards, you still need to time your entry.
            </p>
          </div>
        </section>

        {/* 2. What Are Contested Zones? */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <Crosshair className="w-6 h-6 text-accent-red" />
            <h2 className="text-2xl font-bold text-white">What Are Contested Zones?</h2>
          </div>
          <div className="bg-dark-800/50 rounded-xl border border-dark-700 p-6 space-y-3">
            <p className="text-gray-300">
              Contested Zones are <strong className="text-accent-red">free-fire PvPvE areas</strong> — there is no safe mode inside. Three stations host them: Checkmate, Orbituary, and Ruin Station (Ghost Arena).
            </p>
            <div className="flex items-start gap-3 bg-accent-red/10 border border-accent-red/20 rounded-lg p-4">
              <AlertTriangle className="w-5 h-5 text-accent-red mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-300">
                <strong className="text-accent-red">If you enter a Contested Zone, assume PvP.</strong> You will encounter other players, and many of them are hostile.
              </p>
            </div>
            <p className="text-gray-400 text-sm">
              Note: PvE-focused mission hubs like Levski and QV Service Stations exist in Pyro, but travel between locations is still risky — Pyro is lawless space.
            </p>
          </div>
        </section>

        {/* 3. Zone Comparison Cards */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <MapPin className="w-6 h-6 text-accent-green" />
            <h2 className="text-2xl font-bold text-white">The Zones</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ZoneCard
              title="Checkmate Station"
              color="text-accent-blue"
              borderColor="border-accent-blue/30"
              icon={Shield}
              items={[
                'Blue keycard printers (15min)',
                'Red keycard printers (30min)',
                'Compboards #1, #2, #3',
                'Moderate layout — good starting zone',
              ]}
            />
            <ZoneCard
              title="Orbituary Station"
              color="text-purple-400"
              borderColor="border-purple-500/30"
              icon={Crosshair}
              items={[
                'Blue keycard printers (30min)',
                'Compboards #4 & #7',
                'Tight corridors — watch corners',
                'Fewer boards but still essential',
              ]}
            />
            <ZoneCard
              title="Ruin Station"
              subtitle="Ghost Arena"
              color="text-accent-red"
              borderColor="border-accent-red/30"
              icon={Swords}
              items={[
                'Vault door (21min cycle: 1min open, 20min closed)',
                'Yellow & Green keycard printers (30min)',
                'Compboards #5 & #6',
                'Most complex layout — bring a friend or be careful',
              ]}
            />
            <ZoneCard
              title="Supervisor Outposts"
              subtitle="Pyro 3 L4/L5"
              color="text-gray-400"
              borderColor="border-gray-600/30"
              icon={Key}
              items={[
                'Red keycard printers (30min)',
                'Located outside CZ stations',
                'Lower risk than full Contested Zones',
                'Good for grabbing red keycards before heading in',
              ]}
            />
          </div>
        </section>

        {/* 4. Quickstart Checklist */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <Package className="w-6 h-6 text-accent-green" />
            <h2 className="text-2xl font-bold text-white">Quickstart Checklist</h2>
          </div>
          <div className="bg-dark-800/50 rounded-xl border border-dark-700 p-6">
            <p className="text-gray-400 text-sm mb-4">Solo by default — these steps work alone or in a group.</p>
            <ul className="space-y-3">
              <ChecklistItem>
                <strong className="text-white">Gear up:</strong> Loadout, meds, ammo. Don't bring your best — bring what you can afford to lose.
              </ChecklistItem>
              <ChecklistItem>
                <strong className="text-white">Set local respawn</strong> at a nearby station before entering.
              </ChecklistItem>
              <ChecklistItem>
                <strong className="text-white">Pick a zone</strong> and get inside. Checkmate is the most approachable for beginners.
              </ChecklistItem>
              <ChecklistItem>
                <strong className="text-white">Use printers & collect boards.</strong> Start timers on this site when you activate a printer.
              </ChecklistItem>
              <ChecklistItem>
                <strong className="text-white">Extract.</strong> Treat leaving as the most dangerous part — don't linger at exits.
              </ChecklistItem>
            </ul>
          </div>
        </section>

        {/* 5. PvP & Safety */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <Swords className="w-6 h-6 text-accent-red" />
            <h2 className="text-2xl font-bold text-white">PvP & Safety</h2>
          </div>
          <div className="bg-dark-800/50 rounded-xl border border-dark-700 p-6 space-y-3">
            <p className="text-gray-300">
              Contested Zones are <strong className="text-white">free-fire PvPvE</strong>. There's no crimestat inside, and no rules of engagement.
            </p>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-accent-red mt-0.5">•</span>
                <span><strong className="text-white">Stage your approach.</strong> Don't fly straight in — scout the area and parking options.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-red mt-0.5">•</span>
                <span><strong className="text-white">Insurance mindset.</strong> If you can't afford to lose it, don't bring it.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-red mt-0.5">•</span>
                <span><strong className="text-white">Even PvE hubs carry risk</strong> on approach and departure — Pyro has no law enforcement.</span>
              </li>
            </ul>
          </div>
        </section>

        {/* 6. What This Site Does */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <Timer className="w-6 h-6 text-accent-blue" />
            <h2 className="text-2xl font-bold text-white">What This Site Does</h2>
          </div>
          <div className="bg-dark-800/50 rounded-xl border border-dark-700 p-6 space-y-3">
            <p className="text-gray-300">
              This is a <strong className="text-white">timer tool</strong>, not a walkthrough. It helps you track keycard printer cooldowns, vault door cycles, the Executive Hangar schedule, and compboard collection progress.
            </p>
            <p className="text-gray-300">
              All timers are <strong className="text-white">local to your device and browser</strong> — nothing is sent to a server. If you clear your browser data, your timers reset.
            </p>
            <div className="pt-2">
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent-blue/20 border border-accent-blue/40 text-accent-blue rounded-lg hover:bg-accent-blue/30 transition-colors"
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
