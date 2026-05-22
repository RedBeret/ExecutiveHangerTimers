import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Gift } from 'lucide-react'
import { SupportModal } from './SupportModal'

export function Footer() {
  const { t } = useTranslation()
  const [supportOpen, setSupportOpen] = useState(false)

  return (
    <footer className="mt-16 border-t border-dark-700">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <div className="flex flex-col items-center md:items-start gap-2">
            <span>{t('footer.communityTool')}</span>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/guide" className="text-gray-500 hover:text-accent-blue transition-colors">
              {t('footer.startHere')}
            </Link>
            <button
              type="button"
              onClick={() => setSupportOpen(true)}
              className="flex items-center gap-1.5 text-gray-500 hover:text-accent-green transition-colors"
            >
              <Gift size={13} />
              <span>{t('footer.support')}</span>
            </button>
            <span className="text-gray-600">v1.0.2</span>
          </div>
        </div>

        <div className="mt-4 text-center text-xs text-gray-600">
          <p>
            {t('footer.disclaimer')}
          </p>
          <p className="mt-1">
            {t('footer.accuracy')}
          </p>
        </div>
      </div>

      <SupportModal open={supportOpen} onClose={() => setSupportOpen(false)} />
    </footer>
  )
}
