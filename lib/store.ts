"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Accidental } from "./theory/notes"

export type KeyboardSize = 61 | 76 | 88
export type ThemeMode = "dark" | "light"

export type View =
  | "chord"
  | "voicing"
  | "progression"
  | "scale"
  | "modulation"
  | "setlist"
  | "settings"

export type NotationSystem = "letters" | "numbers"

export interface SetlistSong {
  id: string
  title: string
  key: string
  bpm: number
  timeSignature: string
  progression: string
}

export type Hand = "left" | "right" | "shared"
export interface KbNote {
  midi: number
  hand: Hand
}
export interface KbPc {
  pc: number
  hand: Hand
}

interface AppState {
  view: View
  setView: (v: View) => void

  // Settings
  keyboardSize: KeyboardSize
  setKeyboardSize: (s: KeyboardSize) => void
  theme: ThemeMode
  setTheme: (t: ThemeMode) => void
  accidental: Accidental
  setAccidental: (a: Accidental) => void
  referenceKey: string
  setReferenceKey: (k: string) => void
  notationSystem: NotationSystem
  setNotationSystem: (n: NotationSystem) => void

  // Global Library State
  activeKey: string
  setActiveKey: (k: string) => void
  activeChordIndex: number
  setActiveChordIndex: (i: number) => void
  activeChordOverrides: Record<string, Record<number, string>>
  setActiveChordOverride: (key: string, index: number, quality: string) => void

  // Setlist
  setlist: SetlistSong[]
  addSong: (song: Omit<SetlistSong, "id">) => void
  removeSong: (id: string) => void

  // Shared keyboard visualization state (set by the active feature panel)
  kbNotes: KbNote[]
  kbPcs: KbPc[]
  kbLabel: string
  kbRootPc: number | null
  setKeyboard: (data: { notes?: KbNote[]; pcs?: KbPc[]; label?: string; rootPc?: number | null }) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      view: "chord",
      setView: (v) => set({ view: v }),

      keyboardSize: 88,
      setKeyboardSize: (keyboardSize) => set({ keyboardSize }),
      theme: "dark",
      setTheme: (theme) => set({ theme }),
      accidental: "flat",
      setAccidental: (accidental) => set({ accidental }),
      referenceKey: "C",
      setReferenceKey: (referenceKey) => set({ referenceKey }),
      notationSystem: "letters",
      setNotationSystem: (notationSystem) => set({ notationSystem }),

      activeKey: "Eb",
      setActiveKey: (activeKey) => set({ activeKey, activeChordIndex: 0 }),
      activeChordIndex: 0,
      setActiveChordIndex: (activeChordIndex) => set({ activeChordIndex }),
      activeChordOverrides: {},
      setActiveChordOverride: (key, index, quality) =>
        set((s) => ({
          activeChordOverrides: {
            ...s.activeChordOverrides,
            [key]: {
              ...(s.activeChordOverrides[key] || {}),
              [index]: quality,
            },
          },
        })),

      setlist: [
        { id: "1", title: "Song 1", key: "Eb", bpm: 120, timeSignature: "4/4", progression: "1 5 6m 4" },
        { id: "2", title: "Song 2", key: "F#", bpm: 90, timeSignature: "4/4", progression: "6m 4 1 5" },
      ],
      addSong: (song) =>
        set((s) => ({
          setlist: [...s.setlist, { id: crypto.randomUUID(), ...song }],
        })),
      removeSong: (id) => set((s) => ({ setlist: s.setlist.filter((song) => song.id !== id) })),

      kbNotes: [],
      kbPcs: [],
      kbLabel: "",
      kbRootPc: null,
      setKeyboard: ({ notes, pcs, label, rootPc }) =>
        set({ kbNotes: notes ?? [], kbPcs: pcs ?? [], kbLabel: label ?? "", kbRootPc: rootPc ?? null }),
    }),
    {
      name: "ez-keys-store",
      // Only persist user settings + setlist, never transient keyboard state.
      partialize: (s) => ({
        keyboardSize: s.keyboardSize,
        theme: s.theme,
        accidental: s.accidental,
        referenceKey: s.referenceKey,
        notationSystem: s.notationSystem,
        setlist: s.setlist,
        view: s.view,
        activeKey: s.activeKey,
        activeChordIndex: s.activeChordIndex,
        activeChordOverrides: s.activeChordOverrides,
      }),
    },
  ),
)
