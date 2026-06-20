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

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { parseRoot, getRoots } from "@/lib/theory/notes"

export function AppWorkspace() {
  const { view, referenceKey, setReferenceKey, activeKey, setActiveKey } = useAppStore()
  const accidental = useAppStore((s) => s.accidental)
  const roots = getRoots(accidental)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const active = NAV_ITEMS.find((n) => n.view === view)

  const refPc = parseRoot(referenceKey)?.pc ?? 0
  const actPc = parseRoot(activeKey)?.pc ?? 0
  const transpose = ((actPc - refPc) % 12 + 12) % 12

  return (
    <div className="flex h-dvh overflow-hidden bg-background text-foreground">
      <ThemeSync />
      <SidebarNav />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar (Desktop & Mobile) */}
        <header className="flex h-14 items-center justify-between border-b border-border px-4 lg:px-8">
          <div className="flex items-center gap-2 md:hidden">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-primary text-primary-foreground">
              <span className="font-mono text-sm font-bold leading-none">EZ</span>
            </div>
            <span className="font-heading text-sm font-semibold hidden sm:inline">{active?.label ?? "EZ-Keys"}</span>
          </div>

          <div className="flex items-center gap-2 md:gap-4 text-sm ml-auto">
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-[10px] uppercase font-bold tracking-widest text-foreground">I Play In</span>
                <span className="text-[9px] uppercase tracking-wider text-muted-foreground/70">Fingering</span>
              </div>
              {mounted ? (
                <Select value={referenceKey} onValueChange={setReferenceKey}>
                  <SelectTrigger className="h-8 w-14 md:h-9 md:w-20 font-mono font-bold bg-secondary/50 border-border text-xs md:text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roots.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                  </SelectContent>
                </Select>
              ) : (
                <div className="h-9 w-20 rounded border border-border bg-secondary/50" />
              )}
              
              <span className="mx-3 text-muted-foreground/30">→</span>
              
              <div className="hidden md:flex flex-col items-end">
                <span className="text-[10px] uppercase font-bold tracking-widest text-foreground">Audience Hears</span>
                <span className="text-[9px] uppercase tracking-wider text-muted-foreground/70">Sounding Key</span>
              </div>
              {mounted ? (
                <Select value={activeKey} onValueChange={setActiveKey}>
                  <SelectTrigger className="h-8 w-14 md:h-9 md:w-20 font-mono font-bold bg-secondary/50 border-border text-primary text-xs md:text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roots.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                  </SelectContent>
                </Select>
              ) : (
                <div className="h-9 w-20 rounded border border-border bg-secondary/50" />
              )}
            </div>
          </div>

          <div className="hidden sm:block ml-2 md:ml-0">
            {mounted ? (
              <div className="flex h-8 items-center justify-center rounded border border-primary/30 bg-primary/10 px-2 md:px-3 font-mono text-[10px] md:text-xs font-medium text-primary shadow-sm">
                TRANSPOSE +{transpose}
              </div>
            ) : (
              <div className="h-8 w-20 md:w-24 rounded border border-border bg-secondary/50" />
            )}
          </div>
        </header>

        <div className="flex min-h-0 flex-1 flex-col">
          <main className="min-h-0 flex-1 overflow-y-auto px-5 py-4 lg:px-8 lg:py-6">
            {mounted ? <ActiveView view={view} /> : null}
          </main>
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
