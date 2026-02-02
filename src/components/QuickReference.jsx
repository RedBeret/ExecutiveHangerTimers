import React from 'react'
import { BookOpen, Key, Clock, Lightbulb } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function QuickReference() {
  const { t } = useTranslation()

  const references = [
    {
      icon: BookOpen,
      title: t('quickReference.hangarCycle.title'),
      items: [
        t('quickReference.hangarCycle.totalCycle'),
        t('quickReference.hangarCycle.greenPhase'),
        t('quickReference.hangarCycle.redPhase'),
        t('quickReference.hangarCycle.synchronized'),
      ],
    },
    {
      icon: Key,
      title: t('quickReference.keycards.title'),
      items: [
        t('quickReference.keycards.red'),
        t('quickReference.keycards.blue'),
        t('quickReference.keycards.greenYellow'),
        t('quickReference.keycards.cooldown'),
      ],
    },
    {
      icon: Clock,
      title: t('quickReference.vaultDoor.title'),
      items: [
        t('quickReference.vaultDoor.location'),
        t('quickReference.vaultDoor.opensFor'),
        t('quickReference.vaultDoor.closedFor'),
        t('quickReference.vaultDoor.repeats'),
        t('quickReference.vaultDoor.sync'),
      ],
    },
    {
      icon: Lightbulb,
      title: t('quickReference.tips.title'),
      items: [
        t('quickReference.tips.systemClock'),
        t('quickReference.tips.markBoards'),
        t('quickReference.tips.startTimers'),
        t('quickReference.tips.planRoutes'),
        t('quickReference.tips.allBoards'),
      ],
    },
  ]

  return (
    <div className="card">
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-2">{t('quickReference.title')}</h2>
        <p className="text-gray-400">{t('quickReference.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {references.map((ref, index) => {
          const Icon = ref.icon
          return (
            <div
              key={index}
              className="p-5 bg-dark-800/50 rounded-lg border border-dark-700 hover:border-accent-blue/50 transition-all duration-200"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-accent-blue/20 rounded-lg">
                  <Icon className="w-5 h-5 text-accent-blue" />
                </div>
                <h3 className="font-bold text-lg">{ref.title}</h3>
              </div>
              <ul className="space-y-2">
                {ref.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="text-accent-blue mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </div>
  )
}
