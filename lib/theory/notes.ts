// Core note + pitch-class utilities for EZ-Keys.
// Everything in the app is derived from these primitives.

export type Accidental = "sharp" | "flat"

// Letter names in order, used for correct enharmonic spelling.
export const LETTERS = ["C", "D", "E", "F", "G", "A", "B"] as const
export type Letter = (typeof LETTERS)[number]

// Natural pitch class for each letter.
export const LETTER_PC: Record<Letter, number> = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11,
}

// Default chromatic spellings.
export const SHARP_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
export const FLAT_NAMES = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"]

export function pcName(pc: number, accidental: Accidental = "flat"): string {
  const norm = ((pc % 12) + 12) % 12
  return accidental === "sharp" ? SHARP_NAMES[norm] : FLAT_NAMES[norm]
}

// Parse an accidental string (#, b, ##, bb, x) into a semitone offset.
function accidentalOffset(acc: string): number {
  let offset = 0
  for (const ch of acc) {
    if (ch === "#") offset += 1
    else if (ch === "b") offset -= 1
    else if (ch === "x") offset += 2
  }
  return offset
}

// Render a semitone alteration as an accidental string.
export function renderAccidental(offset: number): string {
  if (offset === 0) return ""
  if (offset > 0) return "#".repeat(offset)
  return "b".repeat(-offset)
}

export interface ParsedRoot {
  letter: Letter
  accidental: string
  pc: number
}

// Parse a root token like "Eb", "F#", "C", "G##".
export function parseRoot(token: string): ParsedRoot | null {
  const match = token.match(/^([A-Ga-g])([#bx]*)/)
  if (!match) return null
  const letter = match[1].toUpperCase() as Letter
  const accidental = match[2]
  const pc = (LETTER_PC[letter] + accidentalOffset(accidental) + 1200) % 12
  return { letter, accidental, pc }
}

// Spell a note given a target letter and a target pitch class.
// Produces the correct accidental (e.g. letter G + pc 6 -> "Gb").
export function spellNote(letter: Letter, pc: number): string {
  const natural = LETTER_PC[letter]
  let diff = (((pc - natural) % 12) + 12) % 12
  if (diff > 6) diff -= 12
  return letter + renderAccidental(diff)
}

// Move a letter up by a number of letter-steps.
export function shiftLetter(letter: Letter, steps: number): Letter {
  const idx = LETTERS.indexOf(letter)
  return LETTERS[(((idx + steps) % 7) + 7) % 7]
}
