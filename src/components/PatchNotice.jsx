import React from 'react'
import { AlertTriangle } from 'lucide-react'

export function PatchNotice() {
  return (
    <aside className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-100">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-300" aria-hidden="true" />
        <div className="space-y-1">
          <h2 className="font-bold text-amber-200">Alpha 4.8.2 Contested Zone Notice</h2>
          <p>
            Star Citizen Alpha 4.8.2 lists keycard printer timers as a known issue. Use CZ Timer as a manual Pyro
            Contested Zone tracker when activating printers, vault doors, Executive Hangar runs, and Align & Mine
            Carinite cave openings.
          </p>
        </div>
      </div>
    </aside>
  )
}
