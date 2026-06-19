"use client"

import { useEffect, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { useAppStore } from "@/lib/store"
import { getInversions } from "@/lib/theory/chords"
import { parseRoot } from "@/lib/theory/notes"
import { generateVoicings, convertToShape, shiftPlacedNotes } from "@/lib/theory/voicings"
import { generateKeyLibrary } from "@/lib/theory/library"
import { GlobalLibraryBrowser } from "@/components/global-library-browser"
import { NoteChips, LabeledRow } from "@/components/note-chips"

export function ChordExplorer() {
  const { accidental, referenceKey, setKeyboard, notationSystem, activeKey, activeChordIndex } = useAppStore()

  const library = useMemo(() => generateKeyLibrary(activeKey), [activeKey])
  const chord = library[activeChordIndex] || null

  const inversions = useMemo(() => (chord ? getInversions(chord) : []), [chord])
  const voicing = useMemo(() => (chord ? generateVoicings(chord)[0] : null), [chord])

  const refPc = useMemo(() => parseRoot(referenceKey)?.pc ?? 0, [referenceKey])
  const actPc = useMemo(() => parseRoot(activeKey)?.pc ?? 0, [activeKey])
  const transpose = useMemo(() => ((actPc - refPc) % 12 + 12) % 12, [refPc, actPc])

  const conversion = useMemo(
    () => (chord ? convertToShape(chord, transpose, accidental) : null),
    [chord, transpose, accidental],
  )

  useEffect(() => {
    if (chord && voicing && conversion) {
      const physicalNotes = shiftPlacedNotes(voicing.placed, -transpose)
      setKeyboard({ 
        notes: physicalNotes, 
        label: `${conversion.shape.symbol} — Root Position`, 
        rootPc: conversion.shape.rootPc 
      })
    } else {
      setKeyboard({})
    }
  }, [chord, voicing, conversion, transpose, setKeyboard])

  return (
    <div className="flex flex-col h-full min-h-0">
      <GlobalLibraryBrowser />

      <div className="flex-1 overflow-y-auto min-h-0 pb-6">
        {!chord ? (
          <Card className="mt-6 p-6 text-sm text-muted-foreground">Select a chord from the library to get started.</Card>
        ) : (
          <div className="mt-4 flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Sounding chord */}
              <Card className="relative overflow-hidden border-border bg-card p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Sounding Chord</span>
                  <span className="rounded border border-emerald-500/30 text-[9px] font-medium tracking-wide text-emerald-500 bg-emerald-500/10 px-2 py-0.5">what the audience hears</span>
                </div>
                <div className="mb-3">
                  <h2 className="font-heading text-3xl font-bold text-foreground">{chord.symbol}</h2>
                </div>
                <div className="mb-6 space-y-4">
                  <LabeledRow label="Formula">
                    <NoteChips notes={chord.formula} />
                  </LabeledRow>
                  <LabeledRow label="Notes">
                    <NoteChips notes={notationSystem === "numbers" ? chord.formula : chord.notes} tone="primary" />
                  </LabeledRow>
                </div>
              </Card>

              {/* Physical Shape */}
              <Card className="relative overflow-hidden border-primary/30 bg-card p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Physical Shape</span>
                  <span className="rounded bg-primary px-2 py-0.5 text-[9px] font-bold tracking-wide text-primary-foreground">Transpose {conversion?.semitones !== 0 ? `+${conversion?.semitones}` : 0}</span>
                </div>
                <div className="mb-3">
                  <h2 className="font-heading text-3xl font-bold text-primary">{conversion ? conversion.shape.symbol : chord.symbol}</h2>
                </div>
                <div className="mb-6">
                  <NoteChips notes={conversion ? conversion.shape.notes : chord.notes} tone="primary" />
                </div>
                <div className="mt-auto">
                  <p className="text-sm text-muted-foreground">
                    {conversion && conversion.semitones !== 0 
                      ? `With transpose set to ${conversion.semitones > 0 ? '+' : ''}${conversion.semitones}, play the ${conversion.shape.symbol} shape.`
                      : "Transpose is 0 — you play exactly what sounds."}
                  </p>
                </div>
              </Card>
            </div>

            {/* Inversions */}
            <Card className="p-4">
              <h3 className="mb-3 font-heading text-sm font-semibold text-muted-foreground uppercase tracking-wider">Inversions (Physical Shapes)</h3>
              <div className="grid gap-2 sm:grid-cols-4">
                {inversions.map((inv) => (
                  <InversionRow key={inv.label} label={inv.label} notes={inv.notes} />
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

function InversionRow({ label, notes }: { label: string; notes: string[] }) {
  return (
    <div className="flex flex-col gap-1 rounded-md border border-border bg-secondary/30 px-3 py-2">
      <span className="text-[10px] uppercase font-bold text-muted-foreground/70">{label}</span>
      <span className="font-mono text-sm font-semibold text-foreground tracking-tight">{notes.join(" ")}</span>
    </div>
  )
}

export { CHORD_TYPES }
