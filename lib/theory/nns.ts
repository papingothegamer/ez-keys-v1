import type { GeneratedChord } from "./chords"

// Nashville Number System and Roman Numeral utilities

const ROMAN = ["I", "bII", "II", "bIII", "III", "IV", "#IV", "V", "bVI", "VI", "bVII", "VII"]
const NNS = ["1", "b2", "2", "b3", "3", "4", "#4", "5", "b6", "6", "b7", "7"]

function isMinorish(chord: GeneratedChord) {
  return chord.intervals.includes(3)
}

export function formatRelativeChord(chord: GeneratedChord, keyPc: number, system: "roman" | "nns"): string {
  const interval = ((chord.rootPc - keyPc) % 12 + 12) % 12
  
  if (system === "roman") {
    let r = ROMAN[interval]
    if (isMinorish(chord)) r = r.toLowerCase()
    if (chord.type.symbol.includes("dim") || chord.type.symbol === "m7b5") r += "\u00B0"
    return r
  } else {
    // Nashville Number System
    let n = NNS[interval]
    if (isMinorish(chord)) {
      if (chord.type.symbol.includes("dim") || chord.type.symbol === "m7b5") {
        n += "dim"
      } else {
        n += "m"
      }
    }
    // NNS often appends extensions like 1maj7, 57, 2m7
    // For simplicity, we just return the base (e.g., 1, 2m, 5) 
    // unless the chord is complex. But usually players infer the 7ths.
    // Let's add the 7th if it exists to be precise.
    if (chord.type.symbol.includes("maj7")) n += "maj7"
    else if (chord.type.symbol.includes("m7") && !chord.type.symbol.includes("b5")) n += "7"
    else if (chord.type.symbol === "7") n += "7"

    return n
  }
}

import { parseChord } from "./chords"
import { parseRoot, shiftLetter, spellNote } from "./notes"

// Simple NNS parser to turn a token like "1", "6m", "4maj7" into an absolute chord in the target key.
export function parseNns(nnsToken: string, keySymbol: string): GeneratedChord | null {
  const rootObj = parseRoot(keySymbol)
  if (!rootObj) return null

  // Extract the degree number and accidental (e.g., "b3", "1", "#4")
  const match = nnsToken.match(/^(b|#)?(\d)(.*)$/)
  if (!match) return null

  const accidentalStr = match[1] || ""
  const degreeStr = match[2]
  const qualityStr = match[3]

  const degreeIndex = NNS.findIndex(n => n === accidentalStr + degreeStr)
  if (degreeIndex === -1) return null

  const targetPc = (rootObj.pc + degreeIndex) % 12
  // We need the proper letter name.
  // 1=0, 2=1, 3=2 letter steps.
  const stepMap: Record<string, number> = { "1": 0, "2": 1, "3": 2, "4": 3, "5": 4, "6": 5, "7": 6 }
  const steps = stepMap[degreeStr] ?? 0
  const letter = shiftLetter(rootObj.letter, steps)
  
  const rootName = spellNote(letter, targetPc)
  
  // Clean up quality. If empty, it's major. If "m", it's minor.
  let q = qualityStr
  if (q === "m") q = "m7" // Default to 7ths for richer voicings
  if (q === "") q = "maj7" // Default to 7ths
  if (q === "dim") q = "m7b5" // Default to half-dim

  // Attempt to parse
  const chord = parseChord(rootName + q)
  if (chord) return chord
  // Fallback to basic triads if 7th fails
  return parseChord(rootName + qualityStr)
}
