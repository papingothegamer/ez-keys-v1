"use client"

import { useEffect, useState } from "react"
import { useAppStore } from "@/lib/store"
import { ThemeSync } from "./theme-sync"
import { SidebarNav, MobileNav } from "./sidebar-nav"
import { KeyboardPanel } from "./keyboard-panel"
import { NAV_ITEMS } from "./nav-items"
import { ChordExplorer } from "./views/chord-explorer"
import { VoicingExplorer } from "./views/voicing-explorer"
import { ProgressionTranslator } from "./views/progression-translator"
import { ScaleExplorer } from "./views/scale-explorer"
import { ModulationAssistant } from "./views/modulation-assistant"
import { SetlistMode } from "./views/setlist-mode"
import { SettingsView } from "./views/settings-view"

// Views that don't need the always-on keyboard panel.
const NO_KEYBOARD = new Set(["modulation", "setlist", "settings"])

export function AppWorkspace() {
  const view = useAppStore((s) => s.view)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const showKeyboard = !NO_KEYBOARD.has(view)
  const active = NAV_ITEMS.find((n) => n.view === view)

  return (
    <div className="flex h-dvh overflow-hidden bg-background">
      <ThemeSync />
      <SidebarNav />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar */}
        <header className="flex items-center justify-between border-b border-border px-4 py-3 lg:hidden">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-primary text-primary-foreground">
              <span className="font-mono text-sm font-bold leading-none">EZ</span>
            </div>
            <span className="font-heading text-sm font-semibold">{active?.label ?? "EZ-Keys"}</span>
          </div>
        </header>

        <div className="flex min-h-0 flex-1">
          <main className="min-w-0 flex-1 overflow-y-auto px-5 py-6 pb-24 lg:px-8 lg:pb-8">
            {mounted ? <ActiveView view={view} /> : null}

            {/* Mobile/tablet: keyboard moves beneath results */}
            {mounted && showKeyboard && (
              <div className="mt-6 xl:hidden">
                <KeyboardPanel variant="inline" />
              </div>
            )}
          </main>

          {/* Desktop right panel */}
          {showKeyboard && <KeyboardPanel variant="side" />}
        </div>
      </div>

      <MobileNav />
    </div>
  )
}

function ActiveView({ view }: { view: string }) {
  switch (view) {
    case "chord":
      return <ChordExplorer />
    case "voicing":
      return <VoicingExplorer />
    case "progression":
      return <ProgressionTranslator />
    case "scale":
      return <ScaleExplorer />
    case "modulation":
      return <ModulationAssistant />
    case "setlist":
      return <SetlistMode />
    case "settings":
      return <SettingsView />
    default:
      return <ChordExplorer />
  }
}
