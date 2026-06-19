"use client"

import { useMemo, useState } from "react"
import { cn } from "@/lib/utils"
import { useAppStore } from "@/lib/store"
import { pcName } from "@/lib/theory/notes"
import type { Hand } from "@/lib/theory/voicings"

const BLACK_PCS = new Set([1, 3, 6, 8, 10])
// White key that has a black key to its right.
const HAS_BLACK_RIGHT = new Set([0, 2, 5, 7, 9])

const RANGES: Record<number, { start: number; end: number }> = {
  61: { start: 36, end: 96 }, // C2 - C7
  76: { start: 28, end: 103 }, // E1 - G7
  88: { start: 21, end: 108 }, // A0 - C8
}

export interface KbNote {
  midi: number
  hand: Hand
}

interface KeyboardProps {
  // Exact placed notes to highlight (absolute MIDI positions).
  notes?: KbNote[]
  // Pitch classes to highlight across every octave (used for scales).
  highlightPcs?: { pc: number; hand: Hand }[]
  className?: string
  startMidi?: number
  endMidi?: number
}

const handBg: Record<Hand, string> = {
  left: "bg-hand-left",
  right: "bg-hand-right",
  shared: "bg-hand-shared",
}
const handText: Record<Hand, string> = {
  left: "text-hand-left-foreground",
  right: "text-hand-right-foreground",
  shared: "text-hand-shared-foreground",
}

export function Keyboard({ notes = [], highlightPcs = [], className, startMidi, endMidi }: KeyboardProps) {
  const keyboardSize = useAppStore((s) => s.keyboardSize)
  const accidental = useAppStore((s) => s.accidental)
  const notationSystem = useAppStore((s) => s.notationSystem)
  const kbRootPc = useAppStore((s) => s.kbRootPc)
  const [hovered, setHovered] = useState<number | null>(null)

  const defaultRange = RANGES[keyboardSize]
  const start = startMidi ?? defaultRange.start
  const end = endMidi ?? defaultRange.end

  const midiToHand = useMemo(() => {
    const map = new Map<number, Hand>()
    for (const n of notes) map.set(n.midi, n.hand)
    return map
  }, [notes])

  const pcToHand = useMemo(() => {
    const map = new Map<number, Hand>()
    for (const h of highlightPcs) map.set(h.pc, h.hand)
    return map
  }, [highlightPcs])

  const whiteKeys = useMemo(() => {
    const arr: number[] = []
    for (let m = start; m <= end; m++) {
      if (!BLACK_PCS.has(((m % 12) + 12) % 12)) arr.push(m)
    }
    return arr
  }, [start, end])

  function activeHand(midi: number): Hand | null {
    if (midiToHand.has(midi)) return midiToHand.get(midi)!
    const pc = ((midi % 12) + 12) % 12
    if (pcToHand.has(pc)) return pcToHand.get(pc)!
    return null
  }

  // NNS relative names for pitch classes relative to a root (1, b2, 2, b3, 3, 4, #4, 5, b6, 6, b7, 7)
  const NNS_NAMES = ["1", "b2", "2", "b3", "3", "4", "#4", "5", "b6", "6", "b7", "7"]
  function getLabel(pc: number) {
    if (notationSystem === "numbers" && kbRootPc !== null) {
      const interval = ((pc - kbRootPc) % 12 + 12) % 12
      return NNS_NAMES[interval]
    }
    return pcName(pc, accidental)
  }

  return (
    <div className={cn("w-full overflow-x-auto rounded-lg border border-border bg-card/60 p-3", className)}>
      <div className="relative flex h-44 min-w-full select-none sm:h-52">
        {whiteKeys.map((midi) => {
          const pc = ((midi % 12) + 12) % 12
          const hand = activeHand(midi)
          const showBlack = HAS_BLACK_RIGHT.has(pc) && midi + 1 <= end
          const blackMidi = midi + 1
          const blackHand = showBlack ? activeHand(blackMidi) : null
          const isC = pc === 0
          return (
            <div key={midi} className="relative flex flex-1 items-end justify-center" style={{ minWidth: 22 }}>
              {/* White key */}
              <button
                type="button"
                onMouseEnter={() => setHovered(midi)}
                onMouseLeave={() => setHovered(null)}
                className={cn(
                  "h-full w-full rounded-b-md border border-border/70 transition-colors",
                  hand ? cn(handBg[hand], handText[hand]) : "bg-foreground/95 text-background hover:bg-foreground/80",
                )}
              >
                <span className="pointer-events-none flex h-full flex-col items-center justify-end pb-2 text-[10px] font-medium">
                  {hand ? (
                    <span className="font-mono">{getLabel(pc)}</span>
                  ) : hovered === midi ? (
                    <span className="font-mono text-background/70">{getLabel(pc)}</span>
                  ) : isC ? (
                    <span className="font-mono text-background/40">{`C${Math.floor(midi / 12) - 1}`}</span>
                  ) : null}
                </span>
              </button>

              {/* Black key */}
              {showBlack && (
                <button
                  type="button"
                  onMouseEnter={() => setHovered(blackMidi)}
                  onMouseLeave={() => setHovered(null)}
                  className={cn(
                    "absolute top-0 z-10 h-[62%] w-[62%] -translate-x-[-50%] rounded-b-md border border-black/40 shadow-md transition-colors",
                    blackHand
                      ? cn(handBg[blackHand], handText[blackHand])
                      : "bg-neutral-900 text-neutral-300 hover:bg-neutral-800",
                  )}
                  style={{ left: "50%", marginLeft: "-1px" }}
                >
                  <span className="pointer-events-none flex h-full flex-col items-center justify-end pb-1 text-[9px] font-medium">
                    {blackHand ? (
                      <span className="font-mono">{getLabel(((blackMidi % 12) + 12) % 12)}</span>
                    ) : hovered === blackMidi ? (
                      <span className="font-mono">{getLabel(((blackMidi % 12) + 12) % 12)}</span>
                    ) : null}
                  </span>
                </button>
              )}
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 px-1 text-xs text-muted-foreground">
        <LegendDot className="bg-hand-left" label="Left Hand" />
        <LegendDot className="bg-hand-right" label="Right Hand" />
        <LegendDot className="bg-hand-shared" label="Shared" />
      </div>
    </div>
  )
}

function LegendDot({ className, label }: { className: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={cn("inline-block h-3 w-3 rounded-sm", className)} />
      {label}
    </span>
  )
}
