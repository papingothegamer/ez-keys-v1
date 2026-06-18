"use client"

import { useEffect, useMemo, useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useAppStore } from "@/lib/store"
import { parseChord } from "@/lib/theory/chords"
import { generateVoicings } from "@/lib/theory/voicings"
import { WorkspaceHeader } from "@/components/workspace-header"
import { NoteChips } from "@/components/note-chips"

export function VoicingExplorer() {
  const [input, setInput] = useState("Fmaj9")
  const [selected, setSelected] = useState(0)
  const setKeyboard = useAppStore((s) => s.setKeyboard)

  const chord = useMemo(() => parseChord(input), [input])
  const voicings = useMemo(() => (chord ? generateVoicings(chord) : []), [chord])
  const current = voicings[selected] ?? voicings[0]

  useEffect(() => {
    setSelected(0)
  }, [input])

  useEffect(() => {
    if (chord && current) {
      setKeyboard({ notes: current.placed, label: `${chord.symbol} — ${current.name}` })
    } else {
      setKeyboard({})
    }
  }, [chord, current, setKeyboard])

  return (
    <div>
      <WorkspaceHeader
        title="Voicing Explorer"
        description="Generate practical two-hand piano voicings for any chord — from shell and rootless to gospel and pop."
      />

      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a chord, e.g. Fmaj9"
          className="h-11 pl-9 font-mono text-base"
        />
      </div>

      {!chord ? (
        <Card className="mt-6 p-6 text-sm text-muted-foreground">Enter a valid chord to explore voicings.</Card>
      ) : (
        <div className="mt-6 grid gap-3">
          {voicings.map((v, i) => {
            const active = i === selected
            return (
              <button key={v.id} type="button" onClick={() => setSelected(i)} className="text-left">
                <Card
                  className={cn(
                    "p-4 transition-colors",
                    active ? "border-primary/60 bg-primary/5" : "hover:border-border/80 hover:bg-secondary/30",
                  )}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-heading text-base font-semibold">{v.name}</span>
                      <Badge variant="outline" className="font-normal text-muted-foreground">
                        {v.category}
                      </Badge>
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground text-pretty">{v.description}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium uppercase tracking-wide text-hand-left">LH</span>
                      <NoteChips notes={v.lh} tone="left" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium uppercase tracking-wide text-hand-right">RH</span>
                      <NoteChips notes={v.rh} tone="right" />
                    </div>
                  </div>
                </Card>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
