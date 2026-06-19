"use client"

import { useEffect, useState, useMemo } from "react"
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
import { KeyboardPanel } from "@/components/keyboard-panel"
import { useSequencer } from "@/lib/hooks/use-sequencer"
import { SetlistLibraryDialog } from "@/components/setlist-library-dialog"
import { SkipBack, SkipForward } from "lucide-react"
import { parseChordPro } from "@/lib/theory/chordpro"

import { getRoots } from "@/lib/theory/notes"

export function SetlistMode() {
  const setlist = useAppStore((s) => s.setlist)
  const addSong = useAppStore((s) => s.addSong)
  const removeSong = useAppStore((s) => s.removeSong)
  const updateSong = useAppStore((s) => s.updateSong)
  const { referenceKey, accidental } = useAppStore()
  const roots = getRoots(accidental)
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
    return <SequencerPlayer key={activeSong.id} song={activeSong} onClose={() => setActiveSongId(null)} onNavigate={(id) => setActiveSongId(id)} />
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
                {roots.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5 w-20">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">BPM</span>
            <Input type="number" value={bpm} onChange={(e) => setBpm(Number(e.target.value))} className="h-10" />
          </div>
          <div className="flex flex-col gap-1.5 flex-1 min-w-[250px]">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Progression / Lyrics (ChordPro)</span>
            <textarea 
              value={prog} 
              onChange={(e) => setProg(e.target.value)} 
              placeholder="Amazing grace, how [5]sweet the sound" 
              className="flex min-h-[40px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 font-mono resize-y" 
            />
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleAdd} className="h-10">
              <Plus className="mr-1 h-4 w-4" /> Add Song
            </Button>
            <SetlistLibraryDialog onAddSong={(song) => addSong({ title: song.title, key: "C", bpm: song.defaultBpm, progression: song.progression, timeSignature: song.timeSignature })} />
          </div>
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
                <div className="w-16">
                  <Select value={song.key} onValueChange={(v) => updateSong(song.id, { key: v })}>
                    <SelectTrigger className="h-8 px-2 font-mono text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {roots.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
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

function SequencerPlayer({ song, onClose, onNavigate }: { song: SetlistSong; onClose: () => void; onNavigate: (id: string) => void }) {
  const setlist = useAppStore(s => s.setlist)
  const activeIndex = setlist.findIndex(s => s.id === song.id)
  const prevSong = setlist[activeIndex - 1]
  const nextSong = setlist[activeIndex + 1]

  const parsedChordPro = useMemo(() => parseChordPro(song.progression), [song.progression])
  
  const { isPlaying, currentStep, steps, togglePlayback, stopPlayback, setCurrentStep } = useSequencer(parsedChordPro.steps, song.bpm, song.timeSignature)
  
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
    const voicings = generateVoicings(conversion.shape)
    return { shape: conversion.shape, placed: voicings[0]?.placed ?? [] }
  }, [activeChord, transpose, accidental])

  return (
    <div className="flex flex-col h-full gap-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => { stopPlayback(); onClose() }}>Back to Setlist</Button>
          <div>
            <h2 className="font-heading text-xl font-bold">{song.title}</h2>
            <p className="text-xs text-muted-foreground">Key of {song.key} • {song.bpm} BPM</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-secondary/50 p-1.5 rounded-lg border border-border">
          <Button 
            variant="ghost" 
            size="icon" 
            disabled={!prevSong} 
            onClick={() => prevSong && onNavigate(prevSong.id)}
            title={prevSong?.title}
          >
            <SkipBack className="h-4 w-4" />
          </Button>
          <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground px-2">Setlist</span>
          <Button 
            variant="ghost" 
            size="icon" 
            disabled={!nextSong} 
            onClick={() => nextSong && onNavigate(nextSong.id)}
            title={nextSong?.title}
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card className="p-5 flex flex-col items-center justify-center bg-card/60 backdrop-blur-md">
        <div className="mb-8 w-full max-w-2xl mx-auto flex flex-col gap-4 text-center">
          {parsedChordPro.lines.map((line, lineIdx) => (
            <div key={lineIdx} className="flex flex-wrap justify-center leading-loose">
              {line.map((seg, segIdx) => (
                <div key={segIdx} className="flex flex-col items-center mx-1 group cursor-pointer" onClick={() => seg.stepIndex !== -1 && setCurrentStep(seg.stepIndex)}>
                  <span className={`font-mono text-sm font-bold transition-colors mb-[-4px] ${seg.stepIndex === currentStep ? 'text-primary scale-110' : 'text-muted-foreground/60 group-hover:text-muted-foreground'}`}>
                    {seg.chord ?? "\u00A0"}
                  </span>
                  <span className={`text-lg transition-colors ${seg.stepIndex === currentStep ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                    {seg.lyric || "\u00A0"}
                  </span>
                </div>
              ))}
            </div>
          ))}
          {parsedChordPro.steps.length === 0 && (
            <p className="text-muted-foreground text-sm">Add [chords] inside the lyrics to play.</p>
          )}
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

      <div className="flex-1 min-h-0">
        <KeyboardPanel variant="standalone" notes={placed} label={shape ? `${shape.symbol} — Root Position` : undefined} />
      </div>
    </div>
  )
}
