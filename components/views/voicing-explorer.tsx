"use client"

import { useEffect, useMemo, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useAppStore } from "@/lib/store"
import { generateVoicings, shiftPlacedNotes, convertToShape } from "@/lib/theory/voicings"
import { generateKeyLibrary } from "@/lib/theory/library"
import { GlobalLibraryBrowser } from "@/components/global-library-browser"
import { NoteChips } from "@/components/note-chips"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { parseRoot } from "@/lib/theory/notes"
import { KeyboardPanel } from "@/components/keyboard-panel"

export function VoicingExplorer() {
  const [selected, setSelected] = useState(0)
  const { setKeyboard, notationSystem, activeKey, activeChordIndex, referenceKey, accidental } = useAppStore()

  const library = useMemo(() => generateKeyLibrary(activeKey), [activeKey])
  const chord = library[activeChordIndex] || null

  const refPc = useMemo(() => parseRoot(referenceKey)?.pc ?? 0, [referenceKey])
  const actPc = useMemo(() => parseRoot(activeKey)?.pc ?? 0, [activeKey])
  const transpose = useMemo(() => ((actPc - refPc) % 12 + 12) % 12, [refPc, actPc])

  const conversion = useMemo(
    () => (chord ? convertToShape(chord, transpose, accidental) : null),
    [chord, transpose, accidental]
  )

  const voicings = useMemo(() => (conversion ? generateVoicings(conversion.shape) : []), [conversion])
  const current = voicings[selected] ?? voicings[0]

  useEffect(() => {
    setSelected(0)
  }, [chord?.symbol])

  useEffect(() => {
    if (chord && current && conversion) {
      setKeyboard({ 
        notes: current.placed, 
        label: `${conversion.shape.symbol} — ${current.name}`, 
        rootPc: conversion.shape.rootPc 
      })
    } else {
      setKeyboard({})
    }
  }, [chord, current, conversion, transpose, setKeyboard])

  return (
    <div className="flex flex-col h-full min-h-0">
      <GlobalLibraryBrowser />

      <div className="flex-1 overflow-y-auto min-h-0 pb-6 flex flex-col">
        {!chord ? (
          <Card className="mt-6 p-6 text-sm text-muted-foreground">Select a chord from the library to explore voicings.</Card>
        ) : (
          <>
            <div className="mt-4 flex-1 flex flex-col items-center max-w-lg mx-auto w-full gap-4">
              <div className="flex items-center justify-between w-full">
              <button 
                onClick={() => setSelected((prev) => (prev - 1 + voicings.length) % voicings.length)}
                className="p-3 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-secondary/50"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>

              <div className="flex-1 px-4 w-full">
                {current && conversion && (
                  <Card className="p-5 flex flex-col justify-center gap-4 transition-colors border-primary/60 bg-primary/5 shadow-md h-[240px] w-full">
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-3">
                          <span className="font-heading text-2xl font-bold">{current.name}</span>
                          <Badge variant="outline" className="font-medium py-0.5 px-2 text-primary border-primary/40 bg-primary/10">
                            {current.category}
                          </Badge>
                        </div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          {selected + 1} of {voicings.length}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground text-pretty">{current.description}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-widest text-hand-left">Left Hand</span>
                        <NoteChips notes={notationSystem === "numbers" ? current.lhDegrees : current.lh} tone="left" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-widest text-hand-right">Right Hand</span>
                        <NoteChips notes={notationSystem === "numbers" ? current.rhDegrees : current.rh} tone="right" />
                      </div>
                    </div>
                  </Card>
                )}
              </div>

              <button 
                onClick={() => setSelected((prev) => (prev + 1) % voicings.length)}
                className="p-3 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-secondary/50"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </div>
            
            {/* Dots indicator */}
            <div className="flex gap-2 mt-2">
              {voicings.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSelected(i)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all",
                    i === selected ? "bg-primary w-4" : "bg-border hover:bg-muted-foreground/50"
                  )}
                  aria-label={`Go to voicing ${i + 1}`}
                />
              ))}
            </div>
            </div>
            
            <div className="mt-auto pt-6 flex-none w-full">
              <KeyboardPanel variant="inline" />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
