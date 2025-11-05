import React from 'react'
import { ContestedZones } from '../components/ContestedZones'
import { QuickReference } from '../components/QuickReference'
import { Swords, Target, Zap } from 'lucide-react'

export function ContestedZonesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Page Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Swords className="w-12 h-12 text-accent-red" />
            <h1 className="text-5xl font-bold">
              <span className="bg-gradient-to-r from-accent-red to-accent-green bg-clip-text text-transparent">
                Contested Zones
              </span>
            </h1>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Track keycard printer cooldowns and farm contested zones efficiently
          </p>
        </div>

        {/* Zone Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card p-6 bg-accent-red/10 border-accent-red/30">
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-6 h-6 text-accent-red" />
              <h3 className="font-bold text-lg">Checkmate</h3>
            </div>
            <p className="text-sm text-gray-400 mb-2">
              4 Blue Keycard Printers • 30-minute cooldowns
            </p>
            <p className="text-xs text-gray-500">
              Best for: Group farming runs
            </p>
          </div>

          <div className="card p-6 bg-accent-green/10 border-accent-green/30">
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-6 h-6 text-accent-green" />
              <h3 className="font-bold text-lg">Orbituary</h3>
            </div>
            <p className="text-sm text-gray-400 mb-2">
              2 Red Keycard Printers • 30-minute cooldowns
            </p>
            <p className="text-xs text-gray-500">
              Best for: Quick runs
            </p>
          </div>

          <div className="card p-6 bg-amber-500/10 border-amber-500/30">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="w-6 h-6 text-amber-400" />
              <h3 className="font-bold text-lg">Ruin Station</h3>
            </div>
            <p className="text-sm text-gray-400 mb-2">
              Vault Timer • 7-minute cooldown
            </p>
            <p className="text-xs text-gray-500">
              Best for: Fast grinding
            </p>
          </div>
        </div>

        {/* Contested Zone Timers */}
        <section id="contested-zones">
          <ContestedZones />
        </section>

        {/* Quick Reference */}
        <section id="quick-reference">
          <QuickReference />
        </section>

        {/* Farming Strategies */}
        <section className="card bg-dark-800/60">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <span className="text-accent-green">⚔️</span>
            Farming Strategies
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-300">
            <div>
              <h3 className="font-bold text-lg mb-2 text-accent-blue">Solo Farming</h3>
              <ul className="space-y-2 ml-5 list-disc text-sm">
                <li><strong>Ruin Station:</strong> Farm the 7-minute vault repeatedly</li>
                <li><strong>Route:</strong> Vault → Objectives → Exit → Repeat</li>
                <li><strong>Time per run:</strong> ~5-8 minutes including travel</li>
                <li><strong>Profit:</strong> Consistent low-risk grinding</li>
                <li>Use timers to know exactly when vault reopens</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2 text-accent-green">Group Farming</h3>
              <ul className="space-y-2 ml-5 list-disc text-sm">
                <li><strong>Checkmate:</strong> Rotate through all 4 printers</li>
                <li><strong>Strategy:</strong> Split team to cover multiple objectives</li>
                <li><strong>Time per circuit:</strong> ~20-25 minutes for all 4</li>
                <li><strong>Efficiency:</strong> High reward, requires coordination</li>
                <li>Stagger timers to maintain constant action</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2 text-amber-400">Rotation Strategy</h3>
              <ul className="space-y-2 ml-5 list-disc text-sm">
                <li>Start all 4 Checkmate printers simultaneously</li>
                <li>Complete objectives while timers run</li>
                <li>By the time you finish #4, #1 is ready again</li>
                <li>Maintain endless loop for maximum efficiency</li>
                <li><strong>Warning alerts</strong> tell you when printer is almost ready</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2 text-accent-red">Combat Tips</h3>
              <ul className="space-y-2 ml-5 list-disc text-sm">
                <li>⚠️ Contested zones have PvP and NPC enemies</li>
                <li>⚠️ Bring appropriate combat ships</li>
                <li>⚠️ Watch for other players farming same printers</li>
                <li>💡 Join an org for safer group runs</li>
                <li>💡 Scout the zone before committing</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Timer Usage Tips */}
        <section className="card bg-accent-blue/5 border-accent-blue/30">
          <h2 className="text-xl font-bold mb-3 text-accent-blue">⏱️ Using the Timers</h2>
          <div className="space-y-3 text-sm text-gray-300">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-accent-green text-dark-950 flex items-center justify-center font-bold flex-shrink-0">1</div>
              <div>
                <strong className="text-white">Start the timer</strong> when you activate a printer or vault
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-accent-green text-dark-950 flex items-center justify-center font-bold flex-shrink-0">2</div>
              <div>
                <strong className="text-white">Yellow warning</strong> appears when &lt;3 minutes remain
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-accent-green text-dark-950 flex items-center justify-center font-bold flex-shrink-0">3</div>
              <div>
                <strong className="text-white">Timer completes</strong> and shows "Ready" - go back and repeat!
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-accent-green text-dark-950 flex items-center justify-center font-bold flex-shrink-0">4</div>
              <div>
                <strong className="text-white">Reset button</strong> if you need to cancel or restart early
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
