"use client"

import { useEffect, useState, useMemo } from "react"
import { Plus, Trash2, GripVertical, ListMusic } from "lucide-react"
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
  const setlists = useAppStore((s) => s.setlists)
  const activeSetlistId = useAppStore((s) => s.activeSetlistId)
  const setActiveSetlist = useAppStore((s) => s.setActiveSetlist)
  const createSetlist = useAppStore((s) => s.createSetlist)
  const deleteSetlist = useAppStore((s) => s.deleteSetlist)
  const reorderSongs = useAppStore((s) => s.reorderSongs)
  
  const activeSetlist = useMemo(() => setlists.find(l => l.id === activeSetlistId), [setlists, activeSetlistId])
  const setlist = activeSetlist?.songs ?? []

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

  const [newSetlistName, setNewSetlistName] = useState("")

  const [draggedIdx, setDraggedIdx] = useState<number | null>(null)

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIdx(index)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e: React.DragEvent, dropIdx: number) => {
    e.preventDefault()
    if (draggedIdx === null || draggedIdx === dropIdx) return
    reorderSongs(draggedIdx, dropIdx)
    setDraggedIdx(null)
  }

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

  if (!activeSetlistId) {
    return (
      <div>
        <WorkspaceHeader
          title="Setlists"
          description="Create and manage your setlists. A setlist holds a collection of songs with their keys, tempos, and progressions."
        />
        <Card className="mb-5 p-4 flex items-center gap-3">
          <Input 
            value={newSetlistName} 
            onChange={e => setNewSetlistName(e.target.value)} 
            placeholder="New Setlist Name..." 
            className="max-w-xs"
            onKeyDown={(e) => {
              if (e.key === "Enter" && newSetlistName.trim()) {
                createSetlist(newSetlistName.trim())
                setNewSetlistName("")
              }
            }}
          />
          <Button onClick={() => {
            if (newSetlistName.trim()) {
              createSetlist(newSetlistName.trim())
              setNewSetlistName("")
            }
          }}>
            <Plus className="mr-1 h-4 w-4" /> Create
          </Button>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {setlists.map(list => (
            <Card key={list.id} className="p-5 flex flex-col hover:border-primary/50 transition-colors cursor-pointer group" onClick={() => setActiveSetlist(list.id)}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-md text-primary">
                    <ListMusic className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-lg">{list.name}</h3>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); deleteSetlist(list.id) }}
                  className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <p className="text-sm text-muted-foreground mt-auto">
                {list.songs.length} {list.songs.length === 1 ? 'song' : 'songs'}
              </p>
            </Card>
          ))}
          {setlists.length === 0 && (
            <div className="col-span-full py-12 text-center text-muted-foreground text-sm border-2 border-dashed border-border rounded-lg">
              No setlists created yet.
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div>
      <WorkspaceHeader
        title={activeSetlist?.name || "Setlist Mode"}
        description="Build a rehearsal or performance setlist. Drag to reorder songs."
        action={
          <Button variant="outline" size="sm" onClick={() => setActiveSetlist(null)}>
            Back to Setlists
          </Button>
        }
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
        <div className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] items-center gap-x-4 border-b border-border bg-secondary/40 px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          <span className="w-4" />
          <span>Song</span>
          <span className="w-14 text-center">Key</span>
          <span className="w-20 text-center">Play</span>
          <span className="w-20 text-center">Transpose</span>
          <span className="w-8" />
        </div>
        {setlist.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-muted-foreground">No songs yet. Add one above.</div>
        ) : (
          setlist.map((song, idx) => {
            const { transpose, shape } = compute(song.key)
            return (
              <div
                key={song.id}
                draggable
                onDragStart={(e) => handleDragStart(e, idx)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, idx)}
                className={`grid grid-cols-[auto_1fr_auto_auto_auto_auto] items-center gap-x-4 border-b border-border px-4 py-3 last:border-b-0 transition-colors bg-card ${draggedIdx === idx ? 'opacity-50 border-primary border-2' : ''}`}
              >
                <div className="flex items-center justify-center cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground">
                  <GripVertical className="h-4 w-4" />
                </div>
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
  const activeSetlistId = useAppStore(s => s.activeSetlistId)
  const setlists = useAppStore(s => s.setlists)
  const setlist = useMemo(() => setlists.find(l => l.id === activeSetlistId)?.songs ?? [], [setlists, activeSetlistId])
  
  const activeIndex = setlist.findIndex(s => s.id === song.id)
  const prevSong = setlist[activeIndex - 1]
  const nextSong = setlist[activeIndex + 1]

  const parsedChordPro = useMemo(() => parseChordPro(song.progression), [song.progression])
  
  const [currentStep, setCurrentStep] = useState(0)
  
  const referenceKey = useAppStore(s => s.referenceKey)
  const accidental = useAppStore(s => s.accidental)
  const refPc = parseRoot(referenceKey)?.pc ?? 0
  const actPc = parseRoot(song.key)?.pc ?? 0
  const transpose = ((actPc - refPc) % 12 + 12) % 12

  // The NNS step we are currently viewing
  const currentToken = parsedChordPro.steps[currentStep]
  
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
    <div className="flex flex-col h-full gap-5 overflow-hidden">
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => { onClose() }}>Back to Setlist</Button>
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

      <Card className="p-6 bg-card/60 backdrop-blur-md flex-1 min-h-0 overflow-y-auto">
        <div className="columns-1 md:columns-2 lg:columns-3 gap-12 text-left w-full max-w-6xl mx-auto space-y-6">
          {parsedChordPro.lines.map((line, lineIdx) => {
            if (line.length === 0) return <div key={lineIdx} className="h-6" />
            
            return (
              <div key={lineIdx} className="break-inside-avoid flex flex-wrap items-end gap-y-2 leading-loose">
                {line.map((seg, segIdx) => (
                  <div 
                    key={segIdx} 
                    className="flex flex-col items-start mr-1.5 group cursor-pointer" 
                    onClick={() => seg.stepIndex !== -1 && setCurrentStep(seg.stepIndex)}
                  >
                    <span className={`font-mono text-[13px] font-bold transition-colors mb-[-4px] ${seg.stepIndex === currentStep ? 'text-primary' : 'text-muted-foreground/60 group-hover:text-primary/70'}`}>
                      {seg.chord ?? "\u00A0"}
                    </span>
                    <span className={`text-[15px] transition-colors ${seg.stepIndex === currentStep ? 'font-medium text-foreground bg-primary/10 rounded px-0.5 -mx-0.5' : 'text-foreground/90 group-hover:text-foreground'}`}>
                      {seg.lyric || "\u00A0"}
                    </span>
                  </div>
                ))}
              </div>
            )
          })}
          {parsedChordPro.steps.length === 0 && (
            <p className="text-muted-foreground text-sm text-center col-span-full">Add [chords] inside the lyrics to play.</p>
          )}
        </div>
      </Card>

      <div className="shrink-0">
        <KeyboardPanel 
          variant="standalone" 
          notes={placed} 
          label={shape ? `${shape.symbol} — Root Position` : undefined} 
          headerContent={
            <div className="flex items-center gap-6 ml-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Sounding</span>
                <span className="font-heading text-lg font-bold">{activeChord?.symbol ?? "—"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-wider text-primary">Play Shape</span>
                <span className="font-heading text-lg font-bold text-primary">{shape?.symbol ?? "—"}</span>
              </div>
            </div>
          }
        />
      </div>
    </div>
  )
}
