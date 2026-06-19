import { parseRoot } from "./notes"
import { generateScale, SCALE_TYPES } from "./scales"
import { parseChord, type GeneratedChord } from "./chords"

// Generates the 7 diatonic chords for a given Major key, with optional quality overrides.
export function generateKeyLibrary(keySymbol: string, overrides: Record<number, string> = {}): GeneratedChord[] {
  const root = parseRoot(keySymbol)
  if (!root) return []

  const majorScaleType = SCALE_TYPES.find((s) => s.name.includes("Major"))!
  const scale = generateScale(root.letter, root.pc, majorScaleType)

  const qualities = ["maj7", "m7", "m7", "maj7", "7", "m7", "m7b5"]
  
  const chords: GeneratedChord[] = []
  for (let i = 0; i < 7; i++) {
    const defaultQuality = qualities[i]
    const activeQuality = overrides[i] ?? defaultQuality
    
    // We attempt to parse with the given quality. If it fails, fallback to default.
    let chord = parseChord(scale.notes[i] + activeQuality)
    if (!chord) chord = parseChord(scale.notes[i] + defaultQuality)
    
    if (chord) chords.push(chord)
  }

  return chords
}
