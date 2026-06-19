"use client"

import { useEffect, useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAppStore, type SetlistSong } from "@/lib/store"
import { parseRoot, pcName } from "@/lib/theory/notes"
import { WorkspaceHeader } from "@/components/workspace-header"
import { parseNns } from "@/lib/theory/nns"
import { generateVoicings, convertToShape, shiftPlacedNotes } from "@/lib/theory/voicings"
import { Keyboard } from "@/components/keyboard"

const ROOTS = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"]

export function SetlistMode() {
  const setlist = useAppStore((s) => s.setlist)
  const addSong = useAppStore((s) => s.addSong)
  const removeSong = useAppStore((s) => s.removeSong)
  const referenceKey = useAppStore((s) => s.referenceKey)
  const accidental = useAppStore((s) => s.accidental)
  const setKeyboard = useAppStore((s) => s.setKeyboard)

  const [title, setTitle] = useState("")
  const [key, setKey] = useState("C")
  const [bpm, setBpm] = useState(120)
  const [prog, setProg] = useState("1 5 6m 4")
  const [timeSig, setTimeSig] = useState("4/4")

  const [activeSongId, setActiveSongId] = useState<string | null>(null)

  useEffect(() => {
    setKeyboard({})
  }, [setKeyboard])

  const refPc = parseRoot(referenceKey)?.pc ?? 0

  function compute(songKey: string) {
    const pc = parseRoot(songKey)?.pc ?? 0
    const transpose = ((pc - refPc) % 12 + 12) % 12
    const shape = pcName(refPc, accidental)
    return { transpose, shape }
  }

  function handleAdd() {
    const t = title.trim() || `Song ${setlist.length + 1}`
    addSong({ title: t, key, bpm, progression: prog, timeSignature: timeSig })
    setTitle("")
  }

  const activeSong = setlist.find(s => s.id === activeSongId)

  if (activeSong) {
    return <SequencerPlayer song={activeSong} onClose={() => setActiveSongId(null)} />
  }

  return (
    <div>
      <WorkspaceHeader
        title="Setlist Mode"
        description="Build a rehearsal or performance setlist. Every song shows the shape to play and the transpose setting for your reference key."
      />

      <Card className="mb-5 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex flex-1 flex-col gap-1.5 min-w-[120px]">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Song Title</span>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAdd()} placeholder="e.g. Amazing Grace" className="h-10" />
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Key</span>
            <Select value={key} onValueChange={(v) => v && setKey(v)}>
              <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
              <SelectContent>
                {ROOTS.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5 w-20">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">BPM</span>
            <Input type="number" value={bpm} onChange={(e) => setBpm(Number(e.target.value))} className="h-10" />
          </div>
          <div className="flex flex-col gap-1.5 flex-1 min-w-[150px]">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Progression (NNS)</span>
            <Input value={prog} onChange={(e) => setProg(e.target.value)} placeholder="1 5 6m 4" className="h-10 font-mono" />
          </div>
          <Button onClick={handleAdd} className="h-10">
            <Plus className="mr-1 h-4 w-4" /> Add Song
          </Button>
        </div>
      </Card>

      <Card className="overflow-hidden p-0">
        <div className="grid grid-cols-[1fr_auto_auto_auto_auto] items-center gap-x-4 border-b border-border bg-secondary/40 px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          <span>Song</span>
          <span className="w-14 text-center">Key</span>
          <span className="w-20 text-center">Play</span>
          <span className="w-20 text-center">Transpose</span>
          <span className="w-8" />
        </div>
        {setlist.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-muted-foreground">No songs yet. Add one above.</div>
        ) : (
          setlist.map((song) => {
            const { transpose, shape } = compute(song.key)
            return (
              <div
                key={song.id}
                className="grid grid-cols-[1fr_auto_auto_auto_auto] items-center gap-x-4 border-b border-border px-4 py-3 last:border-b-0"
              >
                <span className="truncate text-sm font-medium text-foreground">{song.title}</span>
                <span className="w-14 text-center font-mono text-sm">{song.key}</span>
                <span className="w-20 text-center font-mono text-sm font-semibold text-primary">{shape}</span>
                <span className="w-20 text-center font-mono text-sm text-muted-foreground">+{transpose}</span>
                <button
                  type="button"
                  onClick={() => setActiveSongId(song.id)}
                  className="flex w-8 justify-center text-primary transition-colors hover:text-primary/80"
                  aria-label={`Play ${song.title}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="6 3 20 12 6 21 6 3"/></svg>
                </button>
                <button
                  type="button"
                  onClick={() => removeSong(song.id)}
                  className="flex w-8 justify-center text-muted-foreground transition-colors hover:text-destructive"
                  aria-label={`Remove ${song.title}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )
          })
        )}
      </Card>
    </div>
  )
}

function SequencerPlayer({ song, onClose }: { song: SetlistSong; onClose: () => void }) {
  const { isPlaying, currentStep, steps, togglePlayback, stopPlayback, setCurrentStep } = useSequencer(song.progression, song.bpm, song.timeSignature)
  
  const referenceKey = useAppStore(s => s.referenceKey)
  const accidental = useAppStore(s => s.accidental)
  const refPc = parseRoot(referenceKey)?.pc ?? 0
  const actPc = parseRoot(song.key)?.pc ?? 0
  const transpose = ((actPc - refPc) % 12 + 12) % 12

  // The NNS step we are currently playing
  const currentToken = steps[currentStep]
  
  const activeChord = useMemo(() => {
    if (!currentToken) return null
    return parseNns(currentToken, song.key)
  }, [currentToken, song.key])

  const { shape, placed } = useMemo(() => {
    if (!activeChord) return { shape: null, placed: [] }
    const conversion = convertToShape(activeChord, transpose, accidental)
    const voicings = generateVoicings(activeChord)
    // Use the first voicing for playback, shift to physical
    const physicalNotes = shiftPlacedNotes(voicings[0]?.placed ?? [], -transpose)
    return { shape: conversion.shape, placed: physicalNotes }
  }, [activeChord, transpose, accidental])

  return (
    <div className="flex flex-col h-full gap-5">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => { stopPlayback(); onClose() }}>Back to Setlist</Button>
        <div>
          <h2 className="font-heading text-xl font-bold">{song.title}</h2>
          <p className="text-xs text-muted-foreground">Key of {song.key} • {song.bpm} BPM</p>
        </div>
      </div>

      <Card className="p-5 flex flex-col items-center justify-center bg-card/60 backdrop-blur-md">
        <div className="mb-8 flex items-center justify-center gap-3 flex-wrap">
          {steps.map((step, i) => (
            <button 
              key={i} 
              onClick={() => setCurrentStep(i)}
              className={`px-4 py-2 rounded-md font-mono text-lg font-semibold transition-colors ${i === currentStep ? "bg-primary text-primary-foreground shadow-md scale-110" : "bg-secondary text-muted-foreground hover:bg-secondary/80"}`}
            >
              {step}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-8 mb-6">
          <div className="text-center">
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Sounding</p>
            <p className="font-heading text-3xl font-bold">{activeChord?.symbol ?? "—"}</p>
          </div>
          <div className="text-center">
            <p className="text-xs uppercase tracking-wider text-primary mb-1">Play Shape</p>
            <p className="font-heading text-3xl font-bold text-primary">{shape?.symbol ?? "—"}</p>
          </div>
        </div>

        <Button onClick={togglePlayback} size="lg" className="w-40 font-bold tracking-widest uppercase">
          {isPlaying ? "Pause" : "Play"}
        </Button>
      </Card>

      <div className="flex-1 min-h-0 bg-background rounded-lg border border-border shadow-sm overflow-hidden flex flex-col justify-end">
        {/* Render a 2 octave keyboard strictly C3 (48) to B4 (71) */}
        <Keyboard notes={placed} startMidi={48} endMidi={71} className="border-0 rounded-none bg-transparent" />
      </div>
    </div>
  )
}
