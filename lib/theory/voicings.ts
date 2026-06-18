// Voicing generation + transposition + keyboard layout helpers.

import { type Accidental, pcName, parseRoot } from "./notes"
import { type GeneratedChord, type ChordType, chordFromPc } from "./chords"

export type Hand = "left" | "right" | "shared"

// A note placed at an absolute MIDI number with a hand assignment.
export interface PlacedNote {
  midi: number
  name: string
  hand: Hand
}

export interface Voicing {
  id: string
  name: string
  category: string
  description: string
  lh: string[] // left-hand note names
  rh: string[] // right-hand note names
  placed: PlacedNote[]
}

// Lay chord pitch classes out as ascending MIDI numbers starting near an octave.
function layout(pcs: number[], names: string[], startMidi: number): { midi: number; name: string }[] {
  const out: { midi: number; name: string }[] = []
  let prev = -1
  for (let i = 0; i < pcs.length; i++) {
    let midi = startMidi + pcs[i] - (startMidi % 12)
    if (midi <= prev) midi += 12
    while (midi <= prev) midi += 12
    out.push({ midi, name: names[i] })
    prev = midi
  }
  return out
}

const C3 = 48 // MIDI for C3 (left-hand register anchor)
const C4 = 60 // middle C (right-hand register anchor)

function placeHands(lhPcs: number[], lhNames: string[], rhPcs: number[], rhNames: string[]): PlacedNote[] {
  const lh = layout(lhPcs, lhNames, C3).map((n) => ({ ...n, hand: "left" as Hand }))
  const rh = layout(rhPcs, rhNames, C4).map((n) => ({ ...n, hand: "right" as Hand }))
  // Mark shared pitch classes purple.
  const lhPcSet = new Set(lh.map((n) => ((n.midi % 12) + 12) % 12))
  const rhPcSet = new Set(rh.map((n) => ((n.midi % 12) + 12) % 12))
  const all = [...lh, ...rh].map((n) => {
    const pc = ((n.midi % 12) + 12) % 12
    if (lhPcSet.has(pc) && rhPcSet.has(pc)) return { ...n, hand: "shared" as Hand }
    return n
  })
  return all.sort((a, b) => a.midi - b.midi)
}

// Generate a set of practical two-hand voicings for a chord.
export function generateVoicings(chord: GeneratedChord): Voicing[] {
  const { notes, pcs } = chord
  const n = notes.length
  const voicings: Voicing[] = []

  // 1. Root position — LH root, RH the rest.
  voicings.push(buildVoicing("root", "Root Position", "Basic", "Root in the left hand, upper structure in the right.", [pcs[0]], [notes[0]], pcs.slice(1), notes.slice(1)))

  // 2. Shell voicing — LH root, RH 3rd + 7th (or available upper tones).
  if (n >= 3) {
    const upperIdx = pickIndices(n, [1, n - 1])
    voicings.push(
      buildVoicing(
        "shell",
        "Shell Voicing",
        "Jazz",
        "Root with the guide tones (3rd & 7th). Open and uncluttered.",
        [pcs[0]],
        [notes[0]],
        upperIdx.map((i) => pcs[i]),
        upperIdx.map((i) => notes[i]),
      ),
    )
  }

  // 3. Rootless voicing — drop the root entirely, RH plays color tones.
  if (n >= 4) {
    voicings.push(
      buildVoicing(
        "rootless",
        "Rootless Voicing",
        "Jazz",
        "Bassist or transpose covers the root; both hands play color tones.",
        [pcs[1]],
        [notes[1]],
        pcs.slice(2),
        notes.slice(2),
      ),
    )
  }

  // 4. Open voicing — split the chord wide between the hands.
  voicings.push(
    buildVoicing(
      "open",
      "Open Voicing",
      "Classical",
      "Notes spread across a wide range for a fuller, resonant sound.",
      [pcs[0], pcs[Math.min(2, n - 1)]],
      [notes[0], notes[Math.min(2, n - 1)]],
      pcs.filter((_, i) => i !== 0 && i !== Math.min(2, n - 1)),
      notes.filter((_, i) => i !== 0 && i !== Math.min(2, n - 1)),
    ),
  )

  // 5. Gospel / Neo Soul — LH root + 5th, RH stacked upper extensions.
  if (n >= 4) {
    voicings.push(
      buildVoicing(
        "gospel",
        "Modern Gospel / Neo Soul",
        "Gospel",
        "Left hand grounds the root & 5th; right hand stacks the lush extensions.",
        [pcs[0], pcs[2 % n]],
        [notes[0], notes[2 % n]],
        pcs.slice(1),
        notes.slice(1),
      ),
    )
  }

  // 6. Pop / Ballad — LH root, RH close triad on top.
  voicings.push(
    buildVoicing(
      "pop",
      "Pop / Ballad Piano",
      "Contemporary",
      "Simple left-hand root with a close right-hand triad — clean and supportive.",
      [pcs[0]],
      [notes[0]],
      pcs.slice(0, Math.min(3, n)),
      notes.slice(0, Math.min(3, n)),
    ),
  )

  return voicings
}

function pickIndices(n: number, want: number[]): number[] {
  return Array.from(new Set(want.filter((i) => i >= 0 && i < n)))
}

function buildVoicing(
  id: string,
  name: string,
  category: string,
  description: string,
  lhPcs: number[],
  lhNames: string[],
  rhPcs: number[],
  rhNames: string[],
): Voicing {
  return {
    id,
    name,
    category,
    description,
    lh: lhNames,
    rh: rhNames,
    placed: placeHands(lhPcs, lhNames, rhPcs, rhNames),
  }
}

// ---- Transposition ----

export interface TranspositionResult {
  targetKey: string
  semitones: number // transpose setting, e.g. +3
  playShape: string // pitch class name of the shape to play
}

// Given a target key and a reference key, compute the transpose offset.
export function computeTranspose(targetPc: number, referencePc: number): number {
  // Smallest signed interval in range -6..+6 wrapped to musical "+N" convention 0..11
  return ((targetPc - referencePc) % 12 + 12) % 12
}

// Convert a sounding chord into the shape played in the reference key.
export interface ShapeConversion {
  sounding: GeneratedChord
  shape: GeneratedChord
  semitones: number
}

export function convertToShape(sounding: GeneratedChord, referencePc: number, accidental: Accidental): ShapeConversion {
  const semis = ((sounding.rootPc - referencePc) % 12 + 12) % 12
  const shapePc = ((sounding.rootPc - semis) % 12 + 12) % 12
  const shape = chordFromPc(shapePc, sounding.type, accidental)
  return { sounding, shape, semitones: semis }
}

export function transposeName(name: string, semitones: number, accidental: Accidental): string {
  const r = parseRoot(name)
  if (!r) return name
  return pcName((r.pc + semitones) % 12, accidental)
}
