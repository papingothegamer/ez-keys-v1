"use client"

import { useEffect, useMemo, useState } from "react"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAppStore } from "@/lib/store"
import { SCALE_TYPES, parseScale } from "@/lib/theory/scales"
import { WorkspaceHeader } from "@/components/workspace-header"
import { NoteChips, LabeledRow } from "@/components/note-chips"
import { cn } from "@/lib/utils"
import { KeyboardPanel } from "@/components/keyboard-panel"

import { getRoots } from "@/lib/theory/notes"

export function ScaleExplorer() {
  const [root, setRoot] = useState("C")
  const [typeIdx, setTypeIdx] = useState(0)
  const setKeyboard = useAppStore((s) => s.setKeyboard)
  const notationSystem = useAppStore((s) => s.notationSystem)
  const accidental = useAppStore((s) => s.accidental)
  const roots = getRoots(accidental)

  const scale = useMemo(() => parseScale(root, SCALE_TYPES[typeIdx]), [root, typeIdx])

  useEffect(() => {
    if (scale) {
      const baseMidi = 60 + scale.rootPc
      const notes = scale.pcs.map((pc, i) => {
        const octaveShift = pc < scale.rootPc ? 12 : 0
        return { midi: 60 + pc + octaveShift, hand: `rainbow-${i % 8}` as any }
      })
      notes.push({ midi: baseMidi + 12, hand: `rainbow-${scale.pcs.length % 8}` as any })

      setKeyboard({
        notes,
        label: `${scale.rootName} ${scale.type.name}`,
        rootPc: scale.rootPc,
      })
    } else {
      setKeyboard({})
    }
  }, [scale, setKeyboard])

  return (
    <div className="flex flex-col h-full min-h-0">
      <WorkspaceHeader
        title="Scale Explorer"
        description="Browse scales and modes with their notes, scale degrees, and full keyboard visualization."
      />

      <div className="flex flex-wrap gap-3">
        <div className="flex flex-wrap gap-1.5">
          {roots.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRoot(r)}
              className={cn(
                "h-9 w-11 shrink-0 rounded-md border font-mono text-sm transition-colors",
                root === r
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-secondary/40 text-muted-foreground hover:text-foreground",
              )}
            >
              {r}
            </button>
          ))}
        </div>
        <Select value={String(typeIdx)} onValueChange={(v) => setTypeIdx(Number(v))}>
          <SelectTrigger className="w-56">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SCALE_TYPES.map((t, i) => (
              <SelectItem key={t.name} value={String(i)}>
                {t.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {scale && (
        <div className="mt-6 flex-1 min-h-0 flex flex-col gap-5">
          <Card className="p-5 flex-none">
            <div className="mb-4 flex items-baseline gap-3">
              <span className="font-heading text-2xl font-semibold">{scale.rootName}</span>
              <span className="text-muted-foreground">{scale.type.name}</span>
            </div>
            <div className="grid gap-4">
              <LabeledRow label="Scale Notes">
                <NoteChips notes={notationSystem === "numbers" ? scale.degreeLabels : scale.notes} tone="rainbow" />
              </LabeledRow>
              <LabeledRow label="Intervals">
                <NoteChips notes={scale.degreeLabels} />
              </LabeledRow>
            </div>
          </Card>
          <div className="mt-auto pt-4 flex-none">
            <KeyboardPanel variant="inline" />
          </div>
        </div>
      )}
    </div>
  )
}
