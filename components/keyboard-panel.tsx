"use client"

import { useAppStore } from "@/lib/store"
import { Keyboard, type KbNote } from "./keyboard"
import type { Hand } from "@/lib/theory/voicings"

interface KeyboardPanelProps {
  variant?: "side" | "inline" | "standalone"
  notes?: KbNote[]
  highlightPcs?: { pc: number; hand: Hand }[]
  label?: string | null
  startMidi?: number
  endMidi?: number
  headerContent?: React.ReactNode
}

// Right-hand (or mobile beneath-results) panel that always shows the keyboard
// reflecting whatever the active feature panel has pushed into the store,
// OR the explicitly provided props.
export function KeyboardPanel({ variant = "side", notes, highlightPcs, label, startMidi, endMidi, headerContent }: KeyboardPanelProps) {
  const storeNotes = useAppStore((s) => s.kbNotes)
  const storePcs = useAppStore((s) => s.kbPcs)
  const storeLabel = useAppStore((s) => s.kbLabel)

  const kbNotes = notes ?? storeNotes
  const kbPcs = highlightPcs ?? storePcs
  const kbLabel = label !== undefined ? label : storeLabel

  return (
    <div
      className={
        variant === "side"
          ? "hidden w-[clamp(360px,30vw,480px)] shrink-0 flex-col gap-4 border-l border-border bg-card/30 p-5 xl:flex"
          : variant === "standalone" 
          ? "flex flex-col gap-4 border border-border bg-card p-4 rounded-lg shadow-sm"
          : "flex flex-col gap-4"
      }
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <h2 className="font-heading text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Keyboard
          </h2>
          {headerContent}
        </div>
        {kbLabel ? (
          <span className="rounded-md bg-secondary px-2.5 py-1 font-mono text-sm font-semibold text-secondary-foreground">
            {kbLabel}
          </span>
        ) : null}
      </div>
      <Keyboard notes={kbNotes} highlightPcs={kbPcs} startMidi={startMidi} endMidi={endMidi} />
      <p className="text-xs leading-relaxed text-muted-foreground">
        Highlighted keys show the notes to press. Left-hand notes are blue, right-hand notes are green, and notes shared
        by both hands are purple.
      </p>
    </div>
  )
}
