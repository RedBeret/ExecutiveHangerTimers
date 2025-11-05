import React from 'react'
import { Github, Heart } from 'lucide-react'

export function Footer() {
  return (
    <footer className="mt-16 border-t border-dark-700">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-accent-red fill-current" />
            <span>by the Star Citizen community</span>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://github.com/yourusername/pyro-timer"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-accent-blue transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </a>
            <span className="text-gray-600">v1.0.0</span>
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
