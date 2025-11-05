import React from 'react'
import { useTranslation } from 'react-i18next'
import { ExecutiveHangar } from '../components/ExecutiveHangar'
import { ContestedZones } from '../components/ContestedZones'
import { CompboardChecklist } from '../components/CompboardChecklist'
import { QuickReference } from '../components/QuickReference'

export function HomePage() {
  const { t } = useTranslation()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Page Header */}
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-3">
            <span className="bg-gradient-to-r from-accent-blue via-accent-green to-accent-blue bg-clip-text text-transparent">
              {t('home.title')}
            </span>
          </h1>
          <p className="text-gray-400 text-lg">
            {t('home.subtitle')}
          </p>
        </div>

        {/* Executive Hangar */}
        <section id="exec-hangar">
          <ExecutiveHangar />
        </section>

        {/* Contested Zones */}
        <section id="contested-zones">
          <ContestedZones />
        </section>

        {/* Compboard Checklist */}
        <section id="compboards">
          <CompboardChecklist />
        </section>

        {/* Quick Reference */}
        <section id="quick-reference">
          <QuickReference />
        </section>

        {/* About */}
        <section id="about" className="card">
          <h2 className="text-2xl font-bold mb-4">{t('home.about.title')}</h2>

          <div className="space-y-4 text-gray-300">
            <p dangerouslySetInnerHTML={{ __html: t('home.about.description') }} />

            <div>
              <h3 className="font-bold text-lg mb-2 text-white">{t('home.about.features')}</h3>
              <ul className="space-y-1 ml-5 list-disc">
                <li>{t('home.about.featuresList.precision')}</li>
                <li>{t('home.about.featuresList.czTimers')}</li>
                <li>{t('home.about.featuresList.compboards')}</li>
                <li>{t('home.about.featuresList.localStorage')}</li>
                <li>{t('home.about.featuresList.offline')}</li>
                <li>{t('home.about.featuresList.noLogin')}</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2 text-white">{t('home.about.howItWorks')}</h3>
              <p>
                {t('home.about.howItWorksText')}
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2 text-white">{t('home.about.credits')}</h3>
              <ul className="space-y-1 ml-5 list-disc text-sm">
                <li dangerouslySetInnerHTML={{ __html: t('home.about.creditsList.algorithm') }} />
                <li dangerouslySetInnerHTML={{ __html: t('home.about.creditsList.gameData') }} />
                <li dangerouslySetInnerHTML={{ __html: t('home.about.creditsList.inspiration') }} />
                <li dangerouslySetInnerHTML={{ __html: t('home.about.creditsList.game') }} />
              </ul>
            </div>

            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg text-sm">
              <span dangerouslySetInnerHTML={{ __html: t('home.about.disclaimer') }} />
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
