import React from 'react'

export function CircularProgress({
  percentage,
  size = 120,
  strokeWidth = 8,
  color = '#10b981',
  backgroundColor = '#1a1f2e',
  showPercentage = false,
  children
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
          style={{
            filter: `drop-shadow(0 0 ${strokeWidth}px ${color})`
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {showPercentage ? (
          <span className="text-lg font-bold font-mono" style={{ color }}>
            {Math.round(percentage)}%
          </span>
        ) : (
          children
        )}
      </div>
    </div>
  )
}

export function TimerRing({ timeRemaining, totalTime, status = 'active', size = 100 }) {
  const percentage = (timeRemaining / totalTime) * 100

  // Color based on status and time remaining
  let color = '#10b981' // green (ready)
  let warningState = false

  if (status === 'active') {
    if (timeRemaining < 3 * 60 * 1000) {
      // Less than 3 minutes - yellow warning
      color = '#f59e0b'
      warningState = true
    } else {
      // Active - red
      color = '#ef4444'
    }
  }

  return (
    <CircularProgress
      percentage={percentage}
      size={size}
      strokeWidth={6}
      color={color}
      backgroundColor="#1a1f2e"
    >
      <div className="text-center">
        <div className={`text-xs font-medium ${warningState ? 'text-amber-400 animate-pulse' : 'text-gray-400'}`}>
          {status === 'active' ? (
            warningState ? 'SOON!' : 'Cooling'
          ) : 'Ready'}
        </div>
      </div>
    </CircularProgress>
  )
}
