import React, { useState } from 'react'
import { Users, Wifi, WifiOff, LogOut, Copy, Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useRoom } from '../hooks/useRoom'

// Squad sync panel: create or join an ephemeral room by 4-digit code.
// Hidden entirely while no backend URL is configured, so the static site
// works unchanged without the Worker.
export function RoomPanel() {
  const { t } = useTranslation()
  const { code, status, members, available, createRoom, joinRoom, leaveRoom } = useRoom()
  const [joinInput, setJoinInput] = useState('')
  const [copied, setCopied] = useState(false)

  if (!available) return null

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // clipboard blocked - code is visible on screen anyway
    }
  }

  const submitJoin = (e) => {
    e.preventDefault()
    if (/^\d{4}$/.test(joinInput)) {
      joinRoom(joinInput)
      setJoinInput('')
    }
  }

  return (
    <div className="card bg-accent-blue/5 border-accent-blue/30 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="flex items-center gap-3 flex-1">
          <Users className="w-6 h-6 text-accent-blue flex-shrink-0" />
          <div>
            <h3 className="font-bold text-lg flex items-center gap-2">
              {t('room.title')}
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent-blue/20 text-accent-blue border border-accent-blue/30 font-bold uppercase tracking-wide">
                {t('execHangar.beta')}
              </span>
            </h3>
            <p className="text-sm text-gray-400">{t('room.subtitle')}</p>
          </div>
        </div>

        {status === 'connected' ? (
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <button
              onClick={copyCode}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-dark-800 border border-accent-blue/40 hover:border-accent-blue transition-all"
              aria-label={t('room.copyCode')}
            >
              <span className="font-mono font-black text-2xl tracking-[0.3em] text-accent-blue">{code}</span>
              {copied ? <Check className="w-4 h-4 text-accent-green" /> : <Copy className="w-4 h-4 text-gray-400" />}
            </button>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <Wifi className="w-4 h-4 text-accent-green" />
              {t('room.members', { count: members })}
            </div>
            <button
              onClick={leaveRoom}
              className="btn btn-secondary flex items-center gap-2 px-4 py-2"
              aria-label={t('room.leave')}
            >
              <LogOut className="w-4 h-4" />
              {t('room.leave')}
            </button>
          </div>
        ) : status === 'connecting' ? (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Wifi className="w-4 h-4 animate-pulse text-accent-blue" />
            {t('room.connecting')}
          </div>
        ) : (
          <div className="flex items-center gap-3 flex-wrap justify-center">
            {status === 'error' && (
              <div className="flex items-center gap-2 text-sm text-accent-red">
                <WifiOff className="w-4 h-4" />
                {t('room.error')}
              </div>
            )}
            <button onClick={() => createRoom().catch(() => {})} className="btn btn-primary px-4 py-2">
              {t('room.create')}
            </button>
            <form onSubmit={submitJoin} className="flex items-center gap-2">
              <input
                type="text"
                inputMode="numeric"
                maxLength={4}
                value={joinInput}
                onChange={(e) => setJoinInput(e.target.value.replace(/\D/g, ''))}
                placeholder={t('room.joinPlaceholder')}
                className="w-24 px-3 py-2 rounded-lg bg-dark-800 border border-dark-700 focus:border-accent-blue outline-none font-mono text-center tracking-widest"
                aria-label={t('room.joinPlaceholder')}
              />
              <button type="submit" className="btn btn-secondary px-4 py-2" disabled={joinInput.length !== 4}>
                {t('room.join')}
              </button>
            </form>
          </div>
        )}
      </div>
      {status === 'connected' && (
        <p className="mt-3 text-xs text-gray-500 text-center sm:text-left">{t('room.shareHint')}</p>
      )}
    </div>
  )
}
