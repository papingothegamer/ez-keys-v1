"use client"

import { useEffect, useMemo, useState } from "react"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAppStore } from "@/lib/store"
import { SCALE_TYPES, parseScale } from "@/lib/theory/scales"
import { WorkspaceHeader } from "@/components/workspace-header"
import { NoteChips, LabeledRow } from "@/components/note-chips"
import { cn } from "@/lib/utils"

const ROOTS = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"]

export function ScaleExplorer() {
  const [root, setRoot] = useState("C")
  const [typeIdx, setTypeIdx] = useState(0)
  const setKeyboard = useAppStore((s) => s.setKeyboard)

  const scale = useMemo(() => parseScale(root, SCALE_TYPES[typeIdx]), [root, typeIdx])

  useEffect(() => {
    if (scale) {
      setKeyboard({
        pcs: scale.pcs.map((pc) => ({ pc, hand: "right" as const })),
        label: `${scale.rootName} ${scale.type.name}`,
      })
    } else {
      setKeyboard({})
    }
  }, [scale, setKeyboard])

  return (
    <div>
      <WorkspaceHeader
        title="Scale Explorer"
        description="Browse scales and modes with their notes, scale degrees, and full keyboard visualization."
      />

      <div className="flex flex-wrap gap-3">
        <div className="flex flex-wrap gap-1.5">
          {ROOTS.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRoot(r)}
              className={cn(
                "h-9 min-w-9 rounded-md border px-2 font-mono text-sm transition-colors",
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
        <div className="mt-6 grid gap-5">
          <Card className="p-5">
            <div className="mb-4 flex items-baseline gap-3">
              <span className="font-heading text-2xl font-semibold">{scale.rootName}</span>
              <span className="text-muted-foreground">{scale.type.name}</span>
            </div>
            <div className="grid gap-4">
              <LabeledRow label="Notes">
                <NoteChips notes={scale.notes} tone="primary" />
              </LabeledRow>
              <LabeledRow label="Degrees">
                <NoteChips notes={scale.degreeLabels} />
              </LabeledRow>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
