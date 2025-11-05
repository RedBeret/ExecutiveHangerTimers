import React from 'react'
import { formatTime } from '../utils/timerCalculations'

export function CountdownDisplay({ timeRemaining, size = 'large', className = '' }) {
  const sizeClasses = {
    small: 'text-2xl',
    medium: 'text-4xl',
    large: 'text-6xl',
  }

  return (
    <div className={`font-mono font-bold text-glow ${sizeClasses[size]} ${className}`}>
      {formatTime(timeRemaining)}
    </div>
  )
}
