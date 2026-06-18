// Scale recipes — generated dynamically like chords.

import { type Letter, parseRoot, shiftLetter, spellNote } from "./notes"

interface ScaleDeg {
  number: number
  alter: number
}

const DEGREE_SEMITONE: Record<number, number> = { 1: 0, 2: 2, 3: 4, 4: 5, 5: 7, 6: 9, 7: 11 }
const DEGREE_LETTER_STEP: Record<number, number> = { 1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 5, 7: 6 }

function sd(spec: string): ScaleDeg {
  const m = spec.match(/^(#{1,2}|b{1,2})?(\d+)$/)!
  let alter = 0
  for (const ch of m[1] ?? "") alter += ch === "#" ? 1 : -1
  return { number: Number.parseInt(m[2], 10), alter }
}

function ds(...specs: string[]): ScaleDeg[] {
  return specs.map(sd)
}

export interface ScaleType {
  name: string
  category: string
  degrees: ScaleDeg[]
}

export const SCALE_TYPES: ScaleType[] = [
  { name: "Major (Ionian)", category: "Major", degrees: ds("1", "2", "3", "4", "5", "6", "7") },
  { name: "Natural Minor (Aeolian)", category: "Minor", degrees: ds("1", "2", "b3", "4", "5", "b6", "b7") },
  { name: "Harmonic Minor", category: "Minor", degrees: ds("1", "2", "b3", "4", "5", "b6", "7") },
  { name: "Melodic Minor", category: "Minor", degrees: ds("1", "2", "b3", "4", "5", "6", "7") },
  { name: "Dorian", category: "Mode", degrees: ds("1", "2", "b3", "4", "5", "6", "b7") },
  { name: "Phrygian", category: "Mode", degrees: ds("1", "b2", "b3", "4", "5", "b6", "b7") },
  { name: "Lydian", category: "Mode", degrees: ds("1", "2", "3", "#4", "5", "6", "7") },
  { name: "Mixolydian", category: "Mode", degrees: ds("1", "2", "3", "4", "5", "6", "b7") },
  { name: "Locrian", category: "Mode", degrees: ds("1", "b2", "b3", "4", "b5", "b6", "b7") },
  { name: "Major Pentatonic", category: "Pentatonic", degrees: ds("1", "2", "3", "5", "6") },
  { name: "Minor Pentatonic", category: "Pentatonic", degrees: ds("1", "b3", "4", "5", "b7") },
  { name: "Blues", category: "Blues", degrees: ds("1", "b3", "4", "b5", "5", "b7") },
]

export interface GeneratedScale {
  rootName: string
  rootPc: number
  type: ScaleType
  notes: string[]
  pcs: number[]
  degreeLabels: string[]
}

function label(d: ScaleDeg): string {
  const acc = d.alter > 0 ? "#".repeat(d.alter) : d.alter < 0 ? "b".repeat(-d.alter) : ""
  return acc + d.number
}

export function generateScale(rootLetter: Letter, rootPc: number, type: ScaleType): GeneratedScale {
  const notes: string[] = []
  const pcs: number[] = []
  const degreeLabels: string[] = []
  // Pentatonic / blues scales don't map cleanly to 7 letters; spell by step where possible.
  const heptatonic = type.degrees.length === 7
  for (let i = 0; i < type.degrees.length; i++) {
    const d = type.degrees[i]
    const semis = DEGREE_SEMITONE[d.number] + d.alter
    const targetPc = (rootPc + semis + 1200) % 12
    const letter = heptatonic ? shiftLetter(rootLetter, DEGREE_LETTER_STEP[d.number]) : shiftLetter(rootLetter, i)
    notes.push(spellNote(letter, targetPc))
    pcs.push(targetPc)
    degreeLabels.push(label(d))
  }
  return { rootName: spellNote(rootLetter, rootPc), rootPc, type, notes, pcs, degreeLabels }
}

export function parseScale(rootInput: string, type: ScaleType): GeneratedScale | null {
  const r = parseRoot(rootInput)
  if (!r) return null
  return generateScale(r.letter, r.pc, type)
}
