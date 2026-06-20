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

export interface Setlist {
  id: string
  name: string
  songs: SetlistSong[]
}

export type Hand = "left" | "right" | "shared" | (string & {})
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

  // Setlists
  setlists: Setlist[]
  activeSetlistId: string | null
  createSetlist: (name: string) => void
  deleteSetlist: (id: string) => void
  setActiveSetlist: (id: string | null) => void

  addSong: (song: Omit<SetlistSong, "id">) => void
  removeSong: (id: string) => void
  updateSong: (id: string, updates: Partial<SetlistSong>) => void
  reorderSongs: (startIndex: number, endIndex: number) => void

  // Shared keyboard visualization state (set by the active feature panel)
  kbNotes: KbNote[]
  kbPcs: KbPc[]
  kbLabel: string
  kbRootPc: number | null
  setKeyboard: (data: { notes?: KbNote[]; pcs?: KbPc[]; label?: string; rootPc?: number | null }) => void

  // Tutorial
  hasSeenTutorial: boolean
  setHasSeenTutorial: (v: boolean) => void
  isTutorialOpen: boolean
  setTutorialOpen: (v: boolean) => void
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

      setlists: [
  {
    "id": "worship",
    "name": "Worship",
    "songs": [
      {
        "id": "worship-0",
        "title": "You Are Alpha and Omega",
        "key": "C",
        "bpm": 120,
        "timeSignature": "4/4",
        "progression": "You are [1]Al-pha [2]and [3]O-[4]me-[1]ga\nWe [4]worship [2]You our [1]Lord\n[6]You are [4]wor-[6]thy [5]to be [1]praised\nWe give You [6]all [5]the [4]glo-[1]ry\n[3]We [4]worship [5]You our [6]Lord\nYou are [5]wor-[3]thy [4]to [5]be [1]praised"
      },
      {
        "id": "worship-1",
        "title": "Praise",
        "key": "C",
        "bpm": 120,
        "timeSignature": "4/4",
        "progression": "I'll [1]praise in the valley\n[4]Praise on the [1]moun-tain\nI'll [5]praise when I'm sure\n[4]Praise when I'm [1]doub-ting\nI'll [1]praise when out-numbered\n[4]Praise when [1]surrounded\n[5]'Cause praise is the water\n[4]My enemies [1]drown in\nAs [5]long as I'm breathing\n[4]I've got a [5]rea-son to\n[6]Praise [4]the [1]Lord, oh my [5]soul"
      },
      {
        "id": "worship-2",
        "title": "Kadosh",
        "key": "C",
        "bpm": 120,
        "timeSignature": "4/4",
        "progression": "[4]Ka-dosh, Ka-dosh, Ka-[5]dosh, Ka-do[1]sh, Ka-dosh\nIs the [2]Lamb of God who [5]sits u-pon the [6]throne\n[4]He a-lone is [5]wor-thy of our [1]praise"
      }
    ]
  },
  {
    "id": "ccm",
    "name": "CCM",
    "songs": [
      {
        "id": "ccm-0",
        "title": "You Are Able (Creator of the Universe)",
        "key": "C",
        "bpm": 120,
        "timeSignature": "4/4",
        "progression": "[1]Creator of the [5] universe\n[6]What can't  You [4]do\n[1]What can't You [5]change\n[3]Je-[4]sus,\nYou are [1]a-[5]ble\n[2]Great and [3]mighty [4]God\nYou are [1]a-[5]ble, [3]Je-[4]sus"
      },
      {
        "id": "ccm-1",
        "title": "I Will Call Upon The Lord (Magnify)",
        "key": "C",
        "bpm": 120,
        "timeSignature": "4/4",
        "progression": "[1]I will call upon the Lord\n[6]Who is [4]worthy to be [1]praised\n[1]So shall [4]I be [5]saved from my [4]ene-mies\n[1]The Lord li-veth, and [4]bles-sed be the [1]rock\nAnd let the [4]God of my sal-[6]va-tion be ex-[5]al-[1]ted"
      },
      {
        "id": "ccm-2",
        "title": "Covenant Keeping God",
        "key": "C",
        "bpm": 120,
        "timeSignature": "4/4",
        "progression": "You'll ne-ver [4]leave me\nYou said that You won't for-[4]sake me\n[5]You are be-[6]side me and [1]that is all that mat-[5]ters\n[4]You are the [4]co-ve-nant [5]kee-ping [6]God\n[1]You are the [4]co-ve-nant [6]kee-ping [5]God"
      },
      {
        "id": "ccm-3",
        "title": "Yahweh, Rapha (Updated)",
        "key": "C",
        "bpm": 120,
        "timeSignature": "4/4",
        "progression": "Yah-[4]weh, [6]Ra-[5]pha, Elo-[3]him, Shad-[6]dai, [3]Ji-[4]reh, [6]Ado-[5]nai, come and [3]mani-[5]fest your-[6]self"
      },
      {
        "id": "ccm-4",
        "title": "Hallelujah Eh",
        "key": "C",
        "bpm": 120,
        "timeSignature": "4/4",
        "progression": "[1]Hallelujah eh\nHallelu-jah [4]ooo\n[5]Hallelujah eh\nIt's the sound of [1]vic-to-ry\n[1]Hallelujah eh\nHallelu-jah [4]ooo\nLet the [5]sound of re-[4]joi-[5]cing fill this [1]place"
      }
    ]
  },
  {
    "id": "african",
    "name": "African Medley",
    "songs": [
      {
        "id": "african-0",
        "title": "Tambira Jehovah",
        "key": "C",
        "bpm": 120,
        "timeSignature": "4/4",
        "progression": "[1]Tam-bi-ra Je-[4]ho-vah\n[5]Tam-bi-ra Je-[1]ho-vah\n[1]Iyele-iyelele, [4]Iyelele-iyelele\n[5]Tam-bi-ra Je-[1]ho-vah"
      },
      {
        "id": "african-1",
        "title": "I've Got Joy (Joy Overflow)",
        "key": "C",
        "bpm": 120,
        "timeSignature": "4/4",
        "progression": "[1]I've got joy, joy, joy, joy, [5]joy, joy, joy\nJoy o-ver-[4]flows in [5]my [6]life\n[1]I've got joy, joy, joy, joy, [5]joy, joy, joy\nJoy o-ver-[4]flows in [5]my [1]life"
      },
      {
        "id": "african-2",
        "title": "Comment Ne Pas Te Louer",
        "key": "C",
        "bpm": 120,
        "timeSignature": "4/4",
        "progression": "[1]Com-ment ne pas te lou-[4]e— e- [5]er\nCom-ment ne pas te lou-[1]ee— e- [6]er\nCom-ment ne pas te lou-[2]ee— e- [5]er\nSei-gneur Jé-[1]sus\n[1]Quand je re-garde au-tour de [4]moi\n[4]Je vois ta [5]gloire\nSei-gneur Jé-[1]sus, je te bé-[6]nis\nCom-ment ne pas te lou-[2]ee— e- [5]er\nSei-gneur Jé-[1]sus"
      },
      {
        "id": "african-3",
        "title": "Eh Yahweh Kumama",
        "key": "C",
        "bpm": 120,
        "timeSignature": "4/4",
        "progression": "[1]Eh Yah-weh, Eh [5]Yah-weh, [6]Ku-ma-ma\nEh Yah-[4]weh, Eh [5]Yah-weh, [1]Ku-ma-ma"
      },
      {
        "id": "african-4",
        "title": "Jehovah You Are The Most High",
        "key": "C",
        "bpm": 120,
        "timeSignature": "4/4",
        "progression": "Je-ho-vah [4]You are the most [6]high\nJe-ho-vah [5]You are the most high [1]God\nJe-ho-vah [4]e— [6]eh\nJe-ho-vah [5]a— [1]ah"
      },
      {
        "id": "african-5",
        "title": "Who Has The Final Say",
        "key": "C",
        "bpm": 120,
        "timeSignature": "4/4",
        "progression": "[1]Who has the fi-[4]nal [3]say?\n[6]Je-ho-[4]vah has the [5]fi-nal [1]say\n[1]Who has the fi-[4]nal [3]say?\n[6]Je-ho-[4]vah has the [5]fi-nal [1]say\nJe-ho-vah [1]turned my life around\nJe-ho-vah [1]turned my life [5]around\nHe [6]makes a [5]way where there [4]is no [2]way\n[4]Je-ho-vah has the [5]fi-nal [1]say"
      }
    ]
  }
],
      activeSetlistId: 'worship',

      createSetlist: (name) => 
        set((s) => {
          const newSetlist = { id: crypto.randomUUID(), name, songs: [] }
          return { setlists: [...s.setlists, newSetlist], activeSetlistId: newSetlist.id }
        }),
      deleteSetlist: (id) =>
        set((s) => ({
          setlists: s.setlists.filter((list) => list.id !== id),
          activeSetlistId: s.activeSetlistId === id ? null : s.activeSetlistId,
        })),
      setActiveSetlist: (id) => set({ activeSetlistId: id }),

      addSong: (song) =>
        set((s) => {
          if (!s.activeSetlistId) return s;
          return {
            setlists: s.setlists.map((list) =>
              list.id === s.activeSetlistId
                ? { ...list, songs: [...list.songs, { id: crypto.randomUUID(), ...song }] }
                : list
            ),
          }
        }),
      removeSong: (id) =>
        set((s) => {
          if (!s.activeSetlistId) return s;
          return {
            setlists: s.setlists.map((list) =>
              list.id === s.activeSetlistId
                ? { ...list, songs: list.songs.filter((song) => song.id !== id) }
                : list
            ),
          }
        }),
      updateSong: (id, updates) =>
        set((s) => {
          if (!s.activeSetlistId) return s;
          return {
            setlists: s.setlists.map((list) =>
              list.id === s.activeSetlistId
                ? { ...list, songs: list.songs.map((song) => (song.id === id ? { ...song, ...updates } : song)) }
                : list
            ),
          }
        }),
      reorderSongs: (startIndex, endIndex) =>
        set((s) => {
          if (!s.activeSetlistId) return s;
          return {
            setlists: s.setlists.map((list) => {
              if (list.id !== s.activeSetlistId) return list;
              const newSongs = Array.from(list.songs);
              const [removed] = newSongs.splice(startIndex, 1);
              newSongs.splice(endIndex, 0, removed);
              return { ...list, songs: newSongs };
            })
          }
        }),

      kbNotes: [],
      kbPcs: [],
      kbLabel: "",
      kbRootPc: null,
      setKeyboard: ({ notes, pcs, label, rootPc }) =>
        set({ kbNotes: notes ?? [], kbPcs: pcs ?? [], kbLabel: label ?? "", kbRootPc: rootPc ?? null }),

      hasSeenTutorial: false,
      setHasSeenTutorial: (hasSeenTutorial) => set({ hasSeenTutorial }),
      isTutorialOpen: false,
      setTutorialOpen: (isTutorialOpen) => set({ isTutorialOpen }),
    }),
    {
      name: "ez-keys-store",
      version: 1, // Bump version to clear old state and fix hydration mismatch
      partialize: (s) => ({
        keyboardSize: s.keyboardSize,
        theme: s.theme,
        accidental: s.accidental,
        referenceKey: s.referenceKey,
        notationSystem: s.notationSystem,
        setlists: s.setlists,
        activeSetlistId: s.activeSetlistId,
        view: s.view,
        activeKey: s.activeKey,
        activeChordIndex: s.activeChordIndex,
        activeChordOverrides: s.activeChordOverrides,
        hasSeenTutorial: s.hasSeenTutorial,
      }),
    },
  ),
)
