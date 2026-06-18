"use client"

import { useEffect, useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAppStore } from "@/lib/store"
import { parseRoot, pcName } from "@/lib/theory/notes"
import { WorkspaceHeader } from "@/components/workspace-header"

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
    addSong(t, key)
    setTitle("")
  }

  return (
    <div>
      <WorkspaceHeader
        title="Setlist Mode"
        description="Build a rehearsal or performance setlist. Every song shows the shape to play and the transpose setting for your reference key."
      />

      <Card className="mb-5 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex flex-1 flex-col gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Song Title</span>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              placeholder="e.g. Amazing Grace"
              className="h-10"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Key</span>
            <Select value={key} onValueChange={(v) => v && setKey(v)}>
              <SelectTrigger className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ROOTS.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
