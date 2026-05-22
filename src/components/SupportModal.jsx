import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Gift, Mail, User, X, Copy, Check } from 'lucide-react'

const GIFT_EMAIL = 'patchops@protonmail.com'
const RSI_HANDLE = 'PatchOps'

function CopyField({ icon: Icon, label, value }) {
  const { t } = useTranslation()
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      // Clipboard may be blocked in some contexts; silently no-op.
    }
  }

  return (
    <div className="bg-dark-900 border border-dark-700 rounded-lg p-3">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-gray-500 mb-2">
        <Icon size={14} />
        <span>{label}</span>
      </div>
      <div className="flex items-center justify-between gap-2">
        <code className="text-accent-blue font-mono text-sm break-all">{value}</code>
        <button
          type="button"
          onClick={handleCopy}
          className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1 text-xs rounded border border-dark-600 hover:border-accent-blue hover:text-accent-blue text-gray-400 transition-colors"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          <span>{copied ? t('support.copied') : t('support.copy')}</span>
        </button>
      </div>
    </div>
  )
}

export function SupportModal({ open, onClose }) {
  const { t } = useTranslation()

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={t('support.title')}
    >
      <div
        className="relative w-full max-w-md bg-dark-950 border border-dark-700 rounded-xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={t('support.close')}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-200 transition-colors"
        >
          <X size={18} />
        </button>

        <div className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <Gift size={18} className="text-accent-green" />
            <h2 className="text-lg font-semibold text-gray-100">{t('support.title')}</h2>
          </div>

          <p className="text-sm text-gray-400 leading-relaxed mb-5">{t('support.intro')}</p>

          <section className="mb-5">
            <h3 className="text-sm font-semibold text-gray-200 mb-1">{t('support.pledgeTitle')}</h3>
            <p className="text-xs text-gray-400 leading-relaxed mb-3">{t('support.pledgeDescription')}</p>
            <CopyField icon={Mail} label={t('support.emailLabel')} value={GIFT_EMAIL} />
            <p className="text-[11px] text-gray-500 leading-relaxed mt-2">{t('support.pledgeNote')}</p>
          </section>

          <section className="mb-2">
            <h3 className="text-sm font-semibold text-gray-200 mb-1">{t('support.ingameTitle')}</h3>
            <p className="text-xs text-gray-400 leading-relaxed mb-3">{t('support.ingameDescription')}</p>
            <CopyField icon={User} label={t('support.handleLabel')} value={RSI_HANDLE} />
          </section>

          <p className="text-center text-xs text-accent-green/80 mt-5">{t('support.thanks')}</p>
        </div>
      </div>
    </div>
  )
}
