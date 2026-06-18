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

export interface SetlistSong {
  id: string
  title: string
  key: string
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

  // Setlist
  setlist: SetlistSong[]
  addSong: (title: string, key: string) => void
  removeSong: (id: string) => void

  // Shared keyboard visualization state (set by the active feature panel)
  kbNotes: KbNote[]
  kbPcs: KbPc[]
  kbLabel: string
  setKeyboard: (data: { notes?: KbNote[]; pcs?: KbPc[]; label?: string }) => void
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

      setlist: [
        { id: "1", title: "Song 1", key: "Eb" },
        { id: "2", title: "Song 2", key: "F#" },
        { id: "3", title: "Song 3", key: "A" },
        { id: "4", title: "Song 4", key: "D" },
      ],
      addSong: (title, key) =>
        set((s) => ({
          setlist: [...s.setlist, { id: crypto.randomUUID(), title, key }],
        })),
      removeSong: (id) => set((s) => ({ setlist: s.setlist.filter((song) => song.id !== id) })),

      kbNotes: [],
      kbPcs: [],
      kbLabel: "",
      setKeyboard: ({ notes, pcs, label }) =>
        set({ kbNotes: notes ?? [], kbPcs: pcs ?? [], kbLabel: label ?? "" }),
    }),
    {
      name: "ez-keys-store",
      // Only persist user settings + setlist, never transient keyboard state.
      partialize: (s) => ({
        keyboardSize: s.keyboardSize,
        theme: s.theme,
        accidental: s.accidental,
        referenceKey: s.referenceKey,
        setlist: s.setlist,
        view: s.view,
      }),
    },
  ),
)
