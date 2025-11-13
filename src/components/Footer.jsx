import React from 'react'
import { Coffee } from 'lucide-react'

export function Footer() {
  return (
    <footer className="mt-16 border-t border-dark-700">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <div className="flex flex-col items-center md:items-start gap-2">
            <span>Built by <span className="text-accent-blue font-semibold">@PatchOps</span> for the Star Citizen community</span>
            <div className="flex items-center gap-2 text-xs">
              <Coffee className="w-3.5 h-3.5 text-amber-400" />
              <span>Buy me a coffee in Pyro? In-game aUEC tips appreciated!</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-gray-600">v1.0.1</span>
          </div>
        </div>

        <div className="mt-4 text-center text-xs text-gray-600">
          <p>
            This is an unofficial fan-made tool, not affiliated with or endorsed by Cloud Imperium Games.
          </p>
          <p className="mt-1">
            Timer accuracy depends on your system clock. Use at your own risk.
          </p>
        </div>
      </div>
    </footer>
  )
}
