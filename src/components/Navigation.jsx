import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Rocket, Swords } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { LanguageSwitcher } from './LanguageSwitcher'

export function Navigation() {
  const location = useLocation()
  const { t } = useTranslation()

  const navItems = [
    { path: '/', label: t('nav.dashboard'), icon: Home },
    { path: '/executive-hangars', label: t('nav.executiveHangars'), icon: Rocket },
    { path: '/contested-zones', label: t('nav.contestedZones'), icon: Swords },
  ]

  return (
    <nav className="bg-dark-900/80 backdrop-blur-md border-b-2 border-dark-700 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-3 py-4 lg:flex-row">
          {/* Logo/Brand */}
          <Link to="/" className="flex min-w-0 items-center gap-3 group">
            <div className="w-10 h-10 flex-shrink-0 rounded-lg bg-gradient-to-br from-accent-blue to-accent-green flex items-center justify-center">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl font-bold bg-gradient-to-r from-accent-blue to-accent-green bg-clip-text text-transparent">
                Pyro Timer
              </h1>
              <p className="hidden text-xs text-gray-500 sm:block">{t('nav.hangarTracker')}</p>
            </div>
          </Link>

          {/* Navigation Tabs and Language Switcher */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {navItems.map(({ path, label, icon: Icon }) => {
              const isActive = location.pathname === path
              return (
                <Link
                  key={path}
                  to={path}
                  className={`
                    flex items-center gap-2 px-3 py-3 sm:px-6 rounded-lg font-medium
                    transition-all duration-300 min-h-[48px]
                    hover:scale-105 active:scale-95
                    ${isActive
                      ? 'bg-accent-blue text-white shadow-lg shadow-blue-500/30'
                      : 'bg-dark-800 text-gray-400 hover:bg-dark-700 hover:text-white'
                    }
                  `}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className="w-5 h-5" aria-hidden="true" />
                  <span className="hidden sm:inline">{label}</span>
                </Link>
              )
            })}

            {/* Language Switcher */}
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </nav>
  )
}
