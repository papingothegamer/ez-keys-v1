// Chord Recipe Engine.
// Chords are generated dynamically from interval recipes — no hardcoded chord DB.

import { type Letter, LETTER_PC, parseRoot, shiftLetter, spellNote, pcName, type Accidental } from "./notes"

// A degree like "1", "b3", "#11", "13", "bb7".
// We track the diatonic degree number + a semitone alteration so we can spell
// notes by letter (e.g. Eb..G..Bb..D..F) instead of by raw pitch class.
interface Degree {
  number: number // 1,2,3,4,5,6,7,9,11,13
  alter: number // semitone alteration
}

// Semitone offset of each diatonic degree relative to the root (major scale).
const DEGREE_SEMITONE: Record<number, number> = {
  1: 0,
  2: 2,
  3: 4,
  4: 5,
  5: 7,
  6: 9,
  7: 11,
  9: 14,
  11: 17,
  13: 21,
}

// Letter-step offset of each degree relative to the root letter.
const DEGREE_LETTER_STEP: Record<number, number> = {
  1: 0,
  2: 1,
  3: 2,
  4: 3,
  5: 4,
  6: 5,
  7: 6,
  9: 1,
  11: 3,
  13: 5,
}

function deg(spec: string): Degree {
  const m = spec.match(/^(#{1,2}|b{1,2})?(\d+)$/)!
  const accStr = m[1] ?? ""
  let alter = 0
  for (const ch of accStr) alter += ch === "#" ? 1 : -1
  return { number: Number.parseInt(m[2], 10), alter }
}

function degrees(...specs: string[]): Degree[] {
  return specs.map(deg)
}

export interface ChordType {
  // suffix as typed by the user (lowercase comparison handled in parser)
  symbol: string
  name: string
  category: string
  degrees: Degree[]
}

// Ordered longest-symbol-first matters for parsing; we sort at parse time.
export const CHORD_TYPES: ChordType[] = [
  // Triads
  { symbol: "", name: "Major", category: "Triad", degrees: degrees("1", "3", "5") },
  { symbol: "m", name: "Minor", category: "Triad", degrees: degrees("1", "b3", "5") },
  { symbol: "dim", name: "Diminished", category: "Triad", degrees: degrees("1", "b3", "b5") },
  { symbol: "aug", name: "Augmented", category: "Triad", degrees: degrees("1", "3", "#5") },
  { symbol: "sus2", name: "Suspended 2nd", category: "Triad", degrees: degrees("1", "2", "5") },
  { symbol: "sus4", name: "Suspended 4th", category: "Triad", degrees: degrees("1", "4", "5") },
  // Sixth
  { symbol: "6", name: "Major 6th", category: "Sixth", degrees: degrees("1", "3", "5", "6") },
  { symbol: "m6", name: "Minor 6th", category: "Sixth", degrees: degrees("1", "b3", "5", "6") },
  { symbol: "6/9", name: "Six-Nine", category: "Sixth", degrees: degrees("1", "3", "5", "6", "9") },
  { symbol: "m6/9", name: "Minor Six-Nine", category: "Sixth", degrees: degrees("1", "b3", "5", "6", "9") },
  // Sevenths
  { symbol: "maj7", name: "Major 7th", category: "Seventh", degrees: degrees("1", "3", "5", "7") },
  { symbol: "m7", name: "Minor 7th", category: "Seventh", degrees: degrees("1", "b3", "5", "b7") },
  { symbol: "7", name: "Dominant 7th", category: "Seventh", degrees: degrees("1", "3", "5", "b7") },
  { symbol: "m7b5", name: "Half Diminished", category: "Seventh", degrees: degrees("1", "b3", "b5", "b7") },
  { symbol: "dim7", name: "Diminished 7th", category: "Seventh", degrees: degrees("1", "b3", "b5", "bb7") },
  { symbol: "mMaj7", name: "Minor Major 7th", category: "Seventh", degrees: degrees("1", "b3", "5", "7") },
  // add chords
  { symbol: "add9", name: "Add 9", category: "Added", degrees: degrees("1", "3", "5", "9") },
  { symbol: "madd9", name: "Minor Add 9", category: "Added", degrees: degrees("1", "b3", "5", "9") },
  // Ninths
  { symbol: "maj9", name: "Major 9th", category: "Ninth", degrees: degrees("1", "3", "5", "7", "9") },
  { symbol: "m9", name: "Minor 9th", category: "Ninth", degrees: degrees("1", "b3", "5", "b7", "9") },
  { symbol: "9", name: "Dominant 9th", category: "Ninth", degrees: degrees("1", "3", "5", "b7", "9") },
  { symbol: "7b9", name: "Dominant 7 flat 9", category: "Ninth", degrees: degrees("1", "3", "5", "b7", "b9") },
  { symbol: "7#9", name: "Dominant 7 sharp 9", category: "Ninth", degrees: degrees("1", "3", "5", "b7", "#9") },
  // Elevenths
  { symbol: "11", name: "Dominant 11th", category: "Eleventh", degrees: degrees("1", "3", "5", "b7", "9", "11") },
  { symbol: "m11", name: "Minor 11th", category: "Eleventh", degrees: degrees("1", "b3", "5", "b7", "9", "11") },
  { symbol: "maj9#11", name: "Major 9 sharp 11", category: "Eleventh", degrees: degrees("1", "3", "5", "7", "9", "#11") },
  { symbol: "7#11", name: "Dominant 7 sharp 11", category: "Eleventh", degrees: degrees("1", "3", "5", "b7", "9", "#11") },
  // Thirteenths
  { symbol: "13", name: "Dominant 13th", category: "Thirteenth", degrees: degrees("1", "3", "5", "b7", "9", "13") },
  { symbol: "m13", name: "Minor 13th", category: "Thirteenth", degrees: degrees("1", "b3", "5", "b7", "9", "13") },
  { symbol: "maj13", name: "Major 13th", category: "Thirteenth", degrees: degrees("1", "3", "5", "7", "9", "13") },
  { symbol: "13b9", name: "Dominant 13 flat 9", category: "Thirteenth", degrees: degrees("1", "3", "5", "b7", "b9", "13") },
  { symbol: "7b13", name: "Dominant 7 flat 13", category: "Altered", degrees: degrees("1", "3", "5", "b7", "9", "b13") },
  { symbol: "7#9#11", name: "Dominant 7 #9 #11", category: "Altered", degrees: degrees("1", "3", "5", "b7", "#9", "#11") },
  { symbol: "alt", name: "Altered Dominant", category: "Altered", degrees: degrees("1", "3", "b5", "b7", "b9", "#9", "#11", "b13") },
]

export interface GeneratedChord {
  input: string
  rootName: string
  rootPc: number
  type: ChordType
  symbol: string // full display symbol, e.g. "Ebmaj9"
  notes: string[] // spelled note names
  pcs: number[] // pitch classes, root-relative absolute order
  intervals: number[] // semitone offsets from root
  formula: string[] // human formula like ["1","3","5","7","9"]
}

function formulaLabel(d: Degree): string {
  const acc = d.alter > 0 ? "#".repeat(d.alter) : d.alter < 0 ? "b".repeat(-d.alter) : ""
  return acc + d.number
}

// Generate a fully spelled chord from a root letter/pc and a chord type.
export function generateChord(input: string, rootLetter: Letter, rootPc: number, type: ChordType): GeneratedChord {
  const notes: string[] = []
  const pcs: number[] = []
  const intervals: number[] = []
  const formula: string[] = []

  for (const d of type.degrees) {
    const semis = DEGREE_SEMITONE[d.number] + d.alter
    const targetPc = (rootPc + semis + 1200) % 12
    const letter = shiftLetter(rootLetter, DEGREE_LETTER_STEP[d.number])
    notes.push(spellNote(letter, targetPc))
    pcs.push(targetPc)
    intervals.push(semis % 12)
    formula.push(formulaLabel(d))
  }

  const rootName = spellNote(rootLetter, rootPc)
  return {
    input,
    rootName,
    rootPc,
    type,
    symbol: rootName + type.symbol,
    notes,
    pcs,
    intervals,
    formula,
  }
}

// Parse a chord name like "Ebmaj9", "F#m11", "C7#9".
export function parseChord(input: string): GeneratedChord | null {
  const trimmed = input.trim()
  if (!trimmed) return null
  const root = parseRoot(trimmed)
  if (!root) return null
  const rest = trimmed.slice(root.letter.length + root.accidental.length)

  // Match the longest chord symbol (case-sensitive for "m" vs "M").
  const candidates = [...CHORD_TYPES].sort((a, b) => b.symbol.length - a.symbol.length)
  let matched: ChordType | undefined
  for (const c of candidates) {
    if (rest === c.symbol) {
      matched = c
      break
    }
  }
  // Fallback: case-insensitive contains for tolerant matching.
  if (!matched) {
    const lower = rest.toLowerCase()
    for (const c of candidates) {
      if (c.symbol && lower === c.symbol.toLowerCase()) {
        matched = c
        break
      }
    }
  }
  if (!matched) {
    if (rest === "") matched = CHORD_TYPES[0]
    else return null
  }

  return generateChord(trimmed, root.letter, root.pc, matched)
}

// Build a chord directly from a pitch class + type (used for transposed shapes).
export function chordFromPc(rootPc: number, type: ChordType, accidental: Accidental): GeneratedChord {
  const name = pcName(rootPc, accidental)
  const r = parseRoot(name)!
  return generateChord(name + type.symbol, r.letter, r.pc, type)
}

// Compute inversions for a chord. Each inversion rotates the lowest note up.
export interface Inversion {
  label: string
  notes: string[]
}

export function getInversions(chord: GeneratedChord): Inversion[] {
  const labels = ["Root Position", "1st Inversion", "2nd Inversion", "3rd Inversion", "4th Inversion", "5th Inversion"]
  const result: Inversion[] = []
  const n = chord.notes.length
  for (let i = 0; i < Math.min(n, 4); i++) {
    const rotated = [...chord.notes.slice(i), ...chord.notes.slice(0, i)]
    result.push({ label: labels[i], notes: rotated })
  }
  return result
}

export { LETTER_PC }
