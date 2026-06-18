"use client"

import { useAppStore } from "@/lib/store"
import { Keyboard } from "./keyboard"

// Right-hand (or mobile beneath-results) panel that always shows the keyboard
// reflecting whatever the active feature panel has pushed into the store.
export function KeyboardPanel({ variant = "side" }: { variant?: "side" | "inline" }) {
  const kbNotes = useAppStore((s) => s.kbNotes)
  const kbPcs = useAppStore((s) => s.kbPcs)
  const kbLabel = useAppStore((s) => s.kbLabel)

  return (
    <div
      className={
        variant === "side"
          ? "hidden w-[clamp(360px,30vw,480px)] shrink-0 flex-col gap-4 border-l border-border bg-card/30 p-5 xl:flex"
          : "flex flex-col gap-4"
      }
    >
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Keyboard
        </h2>
        {kbLabel ? (
          <span className="rounded-md bg-secondary px-2.5 py-1 font-mono text-sm font-semibold text-secondary-foreground">
            {kbLabel}
          </span>
        ) : null}
      </div>
      <Keyboard notes={kbNotes} highlightPcs={kbPcs} />
      <p className="text-xs leading-relaxed text-muted-foreground">
        Highlighted keys show the notes to press. Left-hand notes are blue, right-hand notes are green, and notes shared
        by both hands are purple.
      </p>
    </div>
  )
}
