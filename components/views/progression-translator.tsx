"use client"

import { useEffect, useMemo, useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAppStore } from "@/lib/store"
import { parseChord, type GeneratedChord } from "@/lib/theory/chords"
import { parseRoot } from "@/lib/theory/notes"
import { convertToShape, generateVoicings } from "@/lib/theory/voicings"
import { WorkspaceHeader } from "@/components/workspace-header"

const ROMAN = ["I", "bII", "II", "bIII", "III", "IV", "#IV", "V", "bVI", "VI", "bVII", "VII"]
const ROOTS = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"]

function isMinorish(chord: GeneratedChord) {
  return chord.intervals.includes(3)
}

function romanFor(chord: GeneratedChord, keyPc: number) {
  const interval = ((chord.rootPc - keyPc) % 12 + 12) % 12
  let r = ROMAN[interval]
  if (isMinorish(chord)) r = r.toLowerCase()
  if (chord.type.symbol.includes("dim") || chord.type.symbol === "m7b5") r += "\u00B0"
  return r
}

export function ProgressionTranslator() {
  const [input, setInput] = useState("Eb | Cm | Ab | Bb")
  const accidental = useAppStore((s) => s.accidental)
  const referenceKey = useAppStore((s) => s.referenceKey)
  const setKeyboard = useAppStore((s) => s.setKeyboard)

  const chords = useMemo(() => {
    return input
      .split(/[|,]/)
      .map((c) => c.trim())
      .filter(Boolean)
      .map((c) => ({ raw: c, chord: parseChord(c) }))
  }, [input])

  const [keyRoot, setKeyRoot] = useState("Eb")
  const keyPc = useMemo(() => parseRoot(keyRoot)?.pc ?? 0, [keyRoot])
  const refPc = useMemo(() => parseRoot(referenceKey)?.pc ?? 0, [referenceKey])

  const firstValid = chords.find((c) => c.chord)?.chord
  useEffect(() => {
    if (firstValid) {
      const v = generateVoicings(firstValid)[0]
      setKeyboard({ notes: v.placed, label: firstValid.symbol })
    }
  }, [firstValid, setKeyboard])

  return (
    <div>
      <WorkspaceHeader
        title="Progression Translator"
        description="Enter a chord progression and instantly see the shapes to play in your reference key, with Roman numerals."
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Eb | Cm | Ab | Bb"
          className="h-11 font-mono text-base"
        />
        <div className="flex items-center gap-2">
          <span className="whitespace-nowrap text-xs uppercase tracking-wide text-muted-foreground">Key</span>
          <Select value={keyRoot} onValueChange={(v) => v && setKeyRoot(v)}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ROOTS.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="mt-6 overflow-x-auto p-0">
        <div className="grid" style={{ gridTemplateColumns: `120px repeat(${Math.max(chords.length, 1)}, minmax(80px, 1fr))` }}>
          <RowHeader label="Sounding" />
          {chords.map((c, i) => (
            <Cell key={`s-${i}`} className="font-heading text-lg font-semibold text-foreground">
              {c.chord ? c.chord.symbol : <span className="text-destructive">{c.raw}?</span>}
            </Cell>
          ))}

          <RowHeader label="Roman" muted />
          {chords.map((c, i) => (
            <Cell key={`r-${i}`} className="font-mono text-sm text-muted-foreground">
              {c.chord ? romanFor(c.chord, keyPc) : "—"}
            </Cell>
          ))}

          <RowHeader label="Transpose" muted />
          {chords.map((c, i) => {
            const conv = c.chord ? convertToShape(c.chord, refPc, accidental) : null
            return (
              <Cell key={`t-${i}`} className="font-mono text-sm text-muted-foreground">
                {conv ? `+${conv.semitones}` : "—"}
              </Cell>
            )
          })}

          <RowHeader label="Play Shape" highlight />
          {chords.map((c, i) => {
            const conv = c.chord ? convertToShape(c.chord, refPc, accidental) : null
            return (
              <Cell key={`p-${i}`} className="bg-primary/5 font-heading text-lg font-semibold text-primary">
                {conv ? conv.shape.symbol : "—"}
              </Cell>
            )
          })}
        </div>
      </Card>

      <p className="mt-3 text-xs text-muted-foreground">
        Play shapes assume your reference key is{" "}
        <span className="font-mono font-medium text-foreground">{referenceKey}</span>. Change it in Settings.
      </p>
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
