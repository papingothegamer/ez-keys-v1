"use client"

import { useEffect, useMemo, useState } from "react"
import { ArrowRight, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAppStore } from "@/lib/store"
import { parseChord, getInversions, CHORD_TYPES } from "@/lib/theory/chords"
import { parseRoot } from "@/lib/theory/notes"
import { generateVoicings, convertToShape } from "@/lib/theory/voicings"
import { WorkspaceHeader } from "@/components/workspace-header"
import { NoteChips, LabeledRow } from "@/components/note-chips"

const SUGGESTIONS = ["Cmaj9", "Ebmaj9", "Bb13", "F#m11", "Ab7#9", "Dm7b5", "G13b9", "Csus2"]

export function ChordExplorer() {
  const [input, setInput] = useState("Ebmaj9")
  const accidental = useAppStore((s) => s.accidental)
  const referenceKey = useAppStore((s) => s.referenceKey)
  const setKeyboard = useAppStore((s) => s.setKeyboard)

  const chord = useMemo(() => parseChord(input), [input])
  const inversions = useMemo(() => (chord ? getInversions(chord) : []), [chord])
  const voicing = useMemo(() => (chord ? generateVoicings(chord)[0] : null), [chord])

  const refPc = useMemo(() => parseRoot(referenceKey)?.pc ?? 0, [referenceKey])
  const conversion = useMemo(
    () => (chord ? convertToShape(chord, refPc, accidental) : null),
    [chord, refPc, accidental],
  )

  // Push the sounding chord (root-position voicing) to the shared keyboard.
  useEffect(() => {
    if (chord && voicing) {
      setKeyboard({ notes: voicing.placed, label: chord.symbol })
    } else {
      setKeyboard({})
    }
  }, [chord, voicing, setKeyboard])

  return (
    <div>
      <WorkspaceHeader
        title="Chord Explorer"
        description="Search any chord to see its notes, formula, inversions, and the shape you should physically play."
      />

      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a chord, e.g. Ebmaj9, F#m11, C7#9"
          className="h-11 pl-9 font-mono text-base"
          autoFocus
        />
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setInput(s)}
            className="rounded-full border border-border bg-secondary/50 px-3 py-1 font-mono text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
          >
            {s}
          </button>
        ))}
      </div>

      {!chord ? (
        <Card className="mt-6 p-6 text-sm text-muted-foreground">
          {input.trim()
            ? `"${input}" is not a recognized chord yet. Try a root note followed by a quality, like Cm7 or Abmaj9.`
            : "Enter a chord to get started."}
        </Card>
      ) : (
        <div className="mt-6 grid gap-5">
          {/* Sounding chord */}
          <Card className="p-5">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className="font-heading text-3xl font-semibold text-foreground">{chord.symbol}</span>
              <Badge variant="secondary" className="font-normal">
                {chord.type.name}
              </Badge>
              <Badge variant="outline" className="font-normal text-muted-foreground">
                {chord.type.category}
              </Badge>
            </div>
            <div className="grid gap-4">
              <LabeledRow label="Notes">
                <NoteChips notes={chord.notes} tone="primary" />
              </LabeledRow>
              <LabeledRow label="Formula">
                <NoteChips notes={chord.formula} />
              </LabeledRow>
            </div>
          </Card>

          {/* Conversion: sounding -> play shape */}
          {conversion && (
            <Card className="overflow-hidden p-0">
              <div className="grid grid-cols-1 divide-y divide-border md:grid-cols-[1fr_auto_1fr] md:divide-x md:divide-y-0">
                <div className="p-5">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Sounding Chord</p>
                  <p className="mt-1 font-heading text-2xl font-semibold text-foreground">{conversion.sounding.symbol}</p>
                  <p className="mt-1 text-xs text-muted-foreground">What the audience hears</p>
                </div>
                <div className="flex items-center justify-center bg-primary/10 px-6 py-4">
                  <div className="text-center">
                    <ArrowRight className="mx-auto h-5 w-5 text-primary" />
                    <p className="mt-1 font-mono text-lg font-bold text-primary">
                      {conversion.semitones >= 0 ? "+" : ""}
                      {conversion.semitones}
                    </p>
                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Transpose</p>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Play Shape</p>
                  <p className="mt-1 font-heading text-2xl font-semibold text-primary">{conversion.shape.symbol}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    What you physically play (reference key {referenceKey})
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Inversions */}
          <Card className="p-5">
            <h3 className="mb-4 font-heading text-base font-semibold">Inversions</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {inversions.map((inv) => (
                <InversionRow key={inv.label} label={inv.label} notes={inv.notes} />
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

function InversionRow({ label, notes }: { label: string; notes: string[] }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-border bg-secondary/30 px-3 py-2.5">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="font-mono text-sm font-medium text-foreground">{notes.join(" ")}</span>
    </div>
  )
}

export { CHORD_TYPES }
