import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Crosshair, Shield, MapPin, CheckSquare, Swords, Timer,
  ChevronDown, ChevronUp, ArrowRight, AlertTriangle, Target, Package,
  Key
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
  const { t } = useTranslation()

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
              {t('guide.hero.title')}
            </span>
          </h1>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            {t('guide.hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={scrollToBasics}
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent-blue/20 border border-accent-blue/40 text-accent-blue rounded-lg hover:bg-accent-blue/30 transition-colors"
            >
              {t('guide.hero.showBasics')}
              <ChevronDown className="w-4 h-4" />
            </button>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent-green/20 border border-accent-green/40 text-accent-green rounded-lg hover:bg-accent-green/30 transition-colors"
            >
              {t('guide.hero.goToTimers')}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* 1. Why Do This? */}
        <section id="why-section" className="space-y-4 scroll-mt-24">
          <div className="flex items-center gap-3">
            <Target className="w-6 h-6 text-accent-blue" />
            <h2 className="text-2xl font-bold text-white">{t('guide.why.title')}</h2>
          </div>
          <div className="bg-dark-800/50 rounded-xl border border-dark-700 p-6 space-y-3">
            <p className="text-gray-300">
              {t('guide.why.paragraph1')}
            </p>
            <p className="text-gray-300">
              {t('guide.why.paragraph2')}
            </p>
          </div>
        </section>

        {/* 2. What Are Contested Zones? */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <Crosshair className="w-6 h-6 text-accent-red" />
            <h2 className="text-2xl font-bold text-white">{t('guide.whatAreCZ.title')}</h2>
          </div>
          <div className="bg-dark-800/50 rounded-xl border border-dark-700 p-6 space-y-3">
            <p className="text-gray-300">
              {t('guide.whatAreCZ.description')}
            </p>
            <div className="flex items-start gap-3 bg-accent-red/10 border border-accent-red/20 rounded-lg p-4">
              <AlertTriangle className="w-5 h-5 text-accent-red mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-300">
                <strong className="text-accent-red">{t('guide.whatAreCZ.warning')}</strong>
              </p>
            </div>
            <p className="text-gray-400 text-sm">
              {t('guide.whatAreCZ.pveNote')}
            </p>
          </div>
        </section>

        {/* 3. Zone Comparison Cards */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <MapPin className="w-6 h-6 text-accent-green" />
            <h2 className="text-2xl font-bold text-white">{t('guide.zones.title')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ZoneCard
              title={t('guide.zones.checkmate.name')}
              color="text-accent-blue"
              borderColor="border-accent-blue/30"
              icon={Shield}
              items={[
                t('guide.zones.checkmate.item1'),
                t('guide.zones.checkmate.item2'),
                t('guide.zones.checkmate.item3'),
                t('guide.zones.checkmate.item4'),
              ]}
            />
            <ZoneCard
              title={t('guide.zones.orbituary.name')}
              color="text-purple-400"
              borderColor="border-purple-500/30"
              icon={Crosshair}
              items={[
                t('guide.zones.orbituary.item1'),
                t('guide.zones.orbituary.item2'),
                t('guide.zones.orbituary.item3'),
                t('guide.zones.orbituary.item4'),
              ]}
            />
            <ZoneCard
              title={t('guide.zones.ruin.name')}
              subtitle={t('guide.zones.ruin.subtitle')}
              color="text-accent-red"
              borderColor="border-accent-red/30"
              icon={Swords}
              items={[
                t('guide.zones.ruin.item1'),
                t('guide.zones.ruin.item2'),
                t('guide.zones.ruin.item3'),
                t('guide.zones.ruin.item4'),
              ]}
            />
            <ZoneCard
              title={t('guide.zones.supervisor.name')}
              subtitle={t('guide.zones.supervisor.subtitle')}
              color="text-gray-400"
              borderColor="border-gray-600/30"
              icon={Key}
              items={[
                t('guide.zones.supervisor.item1'),
                t('guide.zones.supervisor.item2'),
                t('guide.zones.supervisor.item3'),
                t('guide.zones.supervisor.item4'),
              ]}
            />
          </div>
        </section>

        {/* 4. Quickstart Checklist */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <Package className="w-6 h-6 text-accent-green" />
            <h2 className="text-2xl font-bold text-white">{t('guide.quickstart.title')}</h2>
          </div>
          <div className="bg-dark-800/50 rounded-xl border border-dark-700 p-6">
            <p className="text-gray-400 text-sm mb-4">{t('guide.quickstart.soloNote')}</p>
            <ul className="space-y-3">
              <ChecklistItem>{t('guide.quickstart.step1')}</ChecklistItem>
              <ChecklistItem>{t('guide.quickstart.step2')}</ChecklistItem>
              <ChecklistItem>{t('guide.quickstart.step3')}</ChecklistItem>
              <ChecklistItem>{t('guide.quickstart.step4')}</ChecklistItem>
              <ChecklistItem>{t('guide.quickstart.step5')}</ChecklistItem>
            </ul>
          </div>
        </section>

        {/* 5. PvP & Safety */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <Swords className="w-6 h-6 text-accent-red" />
            <h2 className="text-2xl font-bold text-white">{t('guide.pvp.title')}</h2>
          </div>
          <div className="bg-dark-800/50 rounded-xl border border-dark-700 p-6 space-y-3">
            <p className="text-gray-300">
              {t('guide.pvp.description')}
            </p>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-accent-red mt-0.5">•</span>
                <span>{t('guide.pvp.tip1')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-red mt-0.5">•</span>
                <span>{t('guide.pvp.tip2')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-red mt-0.5">•</span>
                <span>{t('guide.pvp.tip3')}</span>
              </li>
            </ul>
          </div>
        </section>

        {/* 6. What This Site Does */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <Timer className="w-6 h-6 text-accent-blue" />
            <h2 className="text-2xl font-bold text-white">{t('guide.site.title')}</h2>
          </div>
          <div className="bg-dark-800/50 rounded-xl border border-dark-700 p-6 space-y-3">
            <p className="text-gray-300">
              {t('guide.site.description')}
            </p>
            <p className="text-gray-300">
              {t('guide.site.localStorage')}
            </p>
            <div className="pt-2">
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent-blue/20 border border-accent-blue/40 text-accent-blue rounded-lg hover:bg-accent-blue/30 transition-colors"
              >
                {t('guide.site.goToDashboard')}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Back to top */}
        <div className="text-center pt-4">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-300 transition-colors"
          >
            <ChevronUp className="w-4 h-4" />
            {t('guide.backToTop')}
          </button>
        </div>

      </div>
    </div>
  )
}
