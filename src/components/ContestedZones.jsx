import React, { useState } from 'react'
import { Target, Zap, Landmark, Database } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { TimerCard } from './TimerCard'
import { VaultTimerCard } from './VaultTimerCard'

export function ContestedZones({ activeTab = 'all' }) {
  const { t } = useTranslation()

  const zones = [
    {
      id: 'checkmate',
      name: 'Checkmate Station',
      icon: Target,
      timers: [
        { id: 'checkmate-blue-1', label: t('contestedZones.timers.blueKeycard', { number: 1 }), duration: 30 * 60 * 1000 },
        { id: 'checkmate-blue-2', label: t('contestedZones.timers.blueKeycard', { number: 2 }), duration: 30 * 60 * 1000 },
        { id: 'checkmate-blue-3', label: t('contestedZones.timers.blueKeycard', { number: 3 }), duration: 30 * 60 * 1000 },
        { id: 'checkmate-blue-4', label: t('contestedZones.timers.blueKeycard', { number: 4 }), duration: 30 * 60 * 1000 },
      ],
    },
    {
      id: 'orbituary',
      name: 'Orbituary Station',
      icon: Zap,
      timers: [
        { id: 'orbituary-blue-1', label: t('contestedZones.timers.blueKeycard', { number: 1 }), duration: 30 * 60 * 1000 },
        { id: 'orbituary-blue-2', label: t('contestedZones.timers.blueKeycard', { number: 2 }), duration: 30 * 60 * 1000 },
      ],
    },
    {
      id: 'ruin',
      name: 'Ruin Station (Ghost Arena)',
      icon: Landmark,
      timers: [
        { id: 'ruin-crypt', label: t('contestedZones.timers.greenKeycard', { location: 'Crypt' }), duration: 30 * 60 * 1000 },
        { id: 'ruin-wasteland', label: t('contestedZones.timers.yellowKeycard', { location: 'Wasteland' }), duration: 30 * 60 * 1000 },
        { id: 'ruin-lastresort', label: t('contestedZones.timers.keycard', { location: 'Last Resort' }), duration: 30 * 60 * 1000 },
      ],
    },
    {
      id: 'supervisor',
      name: 'Supervisor Outposts',
      icon: Database,
      timers: [
        { id: 'supervisor-l4', label: t('contestedZones.timers.redKeycard', { location: 'Pyro 3 L4' }), duration: 30 * 60 * 1000 },
        { id: 'supervisor-l5', label: t('contestedZones.timers.redKeycard', { location: 'Pyro 3 L5' }), duration: 30 * 60 * 1000 },
      ],
    },
  ]

  const tabs = [
    { id: 'all', label: t('contestedZones.tabs.all') },
    { id: 'checkmate', label: 'Checkmate' },
    { id: 'orbituary', label: 'Orbituary' },
    { id: 'ruin', label: 'Ruin' },
    { id: 'supervisor', label: 'Supervisor' },
  ]

  const filteredZones = activeTab === 'all'
    ? zones
    : zones.filter(zone => zone.id === activeTab)

  return (
    <div className="card">
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-2">{t('contestedZones.title')}</h2>
        <p className="text-gray-400">{t('contestedZones.subtitle')}</p>
      </div>

      <div className="space-y-8">
        {filteredZones.map((zone) => {
          const Icon = zone.icon
          return (
            <div key={zone.id} className="space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-dark-700">
                <Icon className="w-6 h-6 text-accent-blue" />
                <h3 className="text-xl font-bold">{zone.name}</h3>
              </div>

              {/* Special vault timer for Ruin Station */}
              {zone.id === 'ruin' && (
                <VaultTimerCard />
              )}

              {/* Regular keycard timers */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {zone.timers.map((timer) => (
                  <TimerCard
                    key={timer.id}
                    id={timer.id}
                    label={timer.label}
                    duration={timer.duration}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-6 p-4 bg-dark-800/30 rounded-lg text-sm text-gray-400">
        {t('contestedZones.cooldownInfo')}
      </div>
    </div>
  )
}
