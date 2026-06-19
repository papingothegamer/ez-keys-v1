"use client"

import { useState, useMemo, useEffect } from "react"
import { Play } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useAppStore } from "@/lib/store"
import { type GeneratedChord } from "@/lib/theory/chords"
import { parseRoot } from "@/lib/theory/notes"
import { parseNns, formatRelativeChord } from "@/lib/theory/nns"
import { convertToShape, generateVoicings, shiftPlacedNotes } from "@/lib/theory/voicings"
import { WorkspaceHeader } from "@/components/workspace-header"
import { Keyboard } from "@/components/keyboard"

export function ProgressionTranslator() {
  const [input, setInput] = useState("1 5 6m 4")
  const accidental = useAppStore((s) => s.accidental)
  const referenceKey = useAppStore((s) => s.referenceKey)
  const notationSystem = useAppStore((s) => s.notationSystem)
  const { activeKey } = useAppStore()

  const tokens = useMemo(() => {
    return input.split(/\s+/).filter(Boolean)
  }, [input])

  const chords = useMemo(() => {
    return tokens.map(token => ({
      raw: token,
      chord: parseNns(token, activeKey)
    }))
  }, [tokens, activeKey])

  const refPc = useMemo(() => parseRoot(referenceKey)?.pc ?? 0, [referenceKey])
  const actPc = useMemo(() => parseRoot(activeKey)?.pc ?? 0, [activeKey])
  const transpose = useMemo(() => ((actPc - refPc) % 12 + 12) % 12, [refPc, actPc])
  const [activeIndex, setActiveIndex] = useState<number>(0)

  const activeObj = chords[activeIndex]
  const activeChordObj = activeObj?.chord

  const { shape, placed } = useMemo(() => {
    if (!activeChordObj) return { shape: null, placed: [] }
    const conversion = convertToShape(activeChordObj, transpose, accidental)
    const voicings = generateVoicings(activeChordObj)
    const physicalNotes = shiftPlacedNotes(voicings[0]?.placed ?? [], -transpose)
    return { shape: conversion.shape, placed: physicalNotes }
  }, [activeChordObj, transpose, accidental])

  return (
    <div className="flex flex-col h-full min-h-0">
      <WorkspaceHeader
        title="Progression Sandbox"
        description="Type a chord progression using NNS (e.g. 1 5 6m 4) and click any chord to see how to play it."
      />

      <div className="flex-1 overflow-y-auto min-h-0 pb-6 flex flex-col gap-6">
        <Card className="p-5 bg-card/60 backdrop-blur-md">
          <div className="mb-4 flex flex-col gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Progression (NNS or Chords)</span>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="1 5 6m 4"
              className="h-12 font-mono text-lg"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {chords.map((c, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`px-4 py-3 rounded-md border font-mono text-lg font-semibold transition-all ${
                  i === activeIndex 
                    ? "bg-primary text-primary-foreground border-primary shadow-md scale-105" 
                    : "bg-secondary text-muted-foreground border-border hover:bg-secondary/80 hover:text-foreground"
                }`}
              >
                {c.raw}
                <div className={`text-[10px] mt-1 font-sans tracking-widest uppercase ${i === activeIndex ? "text-primary-foreground/70" : "text-muted-foreground/50"}`}>
                  {c.chord ? c.chord.symbol : "—"}
                </div>
              </button>
            ))}
          </div>
        </Card>

        {activeChordObj ? (
          <div className="flex-1 min-h-0 flex flex-col gap-5">
            <div className="flex items-center gap-8 justify-center">
              <div className="text-center">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Sounding</p>
                <p className="font-heading text-3xl font-bold">{activeChordObj.symbol}</p>
              </div>
              <div className="text-center">
                <p className="text-xs uppercase tracking-wider text-primary mb-1">Play Shape</p>
                <p className="font-heading text-3xl font-bold text-primary">{shape?.symbol ?? "—"}</p>
              </div>
            </div>

            <div className="flex-1 min-h-[200px] bg-background rounded-lg border border-border shadow-sm overflow-hidden flex flex-col justify-end">
              <Keyboard notes={placed} startMidi={48} endMidi={71} className="border-0 rounded-none bg-transparent" />
            </div>
          </div>
        ) : (
          <Card className="flex-1 flex items-center justify-center p-6 text-sm text-muted-foreground">
            {tokens.length === 0 ? "Type a progression to begin." : "Invalid chord selected."}
          </Card>
        )}
      </div>
    </div>
  )
}

function RowHeader({ label, muted, highlight }: { label: string; muted?: boolean; highlight?: boolean }) {
  return (
    <div
      className={`flex items-center border-b border-r border-border px-4 py-3 text-xs font-medium uppercase tracking-wide ${
        highlight ? "bg-primary/10 text-primary" : muted ? "text-muted-foreground" : "text-foreground"
      }`}
    >
      {label}
    </div>
  )
}

function Cell({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex items-center justify-center border-b border-border px-3 py-3 text-center ${className}`}>
      {children}
    </div>
  )
}
