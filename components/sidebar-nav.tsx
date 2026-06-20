"use client"

import { cn } from "@/lib/utils"
import { useAppStore } from "@/lib/store"
import { NAV_ITEMS } from "./nav-items"
import { HelpCircle } from "lucide-react"

export function SidebarNav() {
  const view = useAppStore((s) => s.view)
  const setView = useAppStore((s) => s.setView)
  const referenceKey = useAppStore((s) => s.referenceKey)

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
      <div className="flex items-center gap-2.5 border-b border-sidebar-border px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <span className="font-mono text-lg font-bold leading-none">EZ</span>
        </div>
        <div className="leading-tight">
          <h1 className="font-heading text-base font-semibold text-sidebar-foreground">EZ-Keys</h1>
          <p className="text-xs text-muted-foreground">Transpose Assistant</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const active = view === item.view
          return (
            <button
              key={item.view}
              type="button"
              onClick={() => setView(item.view)}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
              )}
            >
              <Icon className={cn("h-4 w-4 shrink-0", active && "text-primary")} />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <button
          type="button"
          onClick={() => useAppStore.getState().setTutorialOpen(true)}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
        >
          <HelpCircle className="h-4 w-4 shrink-0" />
          <span>Tutorial</span>
        </button>
      </div>

      <div className="border-t border-sidebar-border px-5 py-4">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Reference Key</span>
          <span className="rounded bg-sidebar-accent px-2 py-0.5 font-mono font-semibold text-sidebar-foreground">
            {referenceKey}
          </span>
        </div>
      </div>
    </aside>
  )
}

export function MobileNav() {
  const view = useAppStore((s) => s.view)
  const setView = useAppStore((s) => s.setView)

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 flex items-stretch border-t border-border bg-card/95 backdrop-blur lg:hidden">
      <div className="flex w-full overflow-x-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const active = view === item.view
          return (
            <button
              key={item.view}
              type="button"
              onClick={() => setView(item.view)}
              className={cn(
                "flex min-w-[4.5rem] flex-1 flex-col items-center gap-1 px-2 py-2.5 text-[10px] transition-colors",
                active ? "text-primary" : "text-muted-foreground",
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="whitespace-nowrap">{item.label.split(" ")[0]}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
