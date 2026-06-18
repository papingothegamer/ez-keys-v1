"use client"

import { useEffect, useMemo, useState } from "react"
import { ArrowRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAppStore } from "@/lib/store"
import { parseRoot, pcName } from "@/lib/theory/notes"
import { WorkspaceHeader } from "@/components/workspace-header"

const ROOTS = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"]

export function ModulationAssistant() {
  const accidental = useAppStore((s) => s.accidental)
  const referenceKey = useAppStore((s) => s.referenceKey)
  const setKeyboard = useAppStore((s) => s.setKeyboard)
  const [current, setCurrent] = useState("Eb")
  const [target, setTarget] = useState("F")

  useEffect(() => {
    setKeyboard({})
  }, [setKeyboard])

  const data = useMemo(() => {
    const refPc = parseRoot(referenceKey)?.pc ?? 0
    const curPc = parseRoot(current)?.pc ?? 0
    const tgtPc = parseRoot(target)?.pc ?? 0
    const currentTranspose = ((curPc - refPc) % 12 + 12) % 12
    const newTranspose = ((tgtPc - refPc) % 12 + 12) % 12
    const adjustment = newTranspose - currentTranspose
    // Alternative: keep transpose fixed, change the physical shape instead.
    const currentShape = pcName(refPc, accidental)
    const newShapePc = ((refPc + (tgtPc - curPc)) % 12 + 12) % 12
    const newShape = pcName(newShapePc, accidental)
    return { currentTranspose, newTranspose, adjustment, currentShape, newShape }
  }, [current, target, referenceKey, accidental])

  return (
    <div>
      <WorkspaceHeader
        title="Modulation Assistant"
        description="Handle key changes mid-song. See how your transpose setting should change — or keep transpose fixed and change the shape instead."
      />

      <div className="flex flex-wrap items-end gap-4">
        <KeyPicker label="Current Key" value={current} onChange={setCurrent} />
        <ArrowRight className="mb-2.5 h-5 w-5 text-muted-foreground" />
        <KeyPicker label="Target Key" value={target} onChange={setTarget} />
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <Card className="p-5">
          <h3 className="mb-4 font-heading text-base font-semibold">Adjust the Transpose</h3>
          <div className="space-y-3">
            <StatRow label="Current Transpose" value={`+${data.currentTranspose}`} />
            <StatRow label="New Transpose" value={`+${data.newTranspose}`} highlight />
            <div className="my-1 border-t border-border" />
            <StatRow
              label="Adjustment"
              value={`${data.adjustment >= 0 ? "+" : ""}${data.adjustment}`}
            />
          </div>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            Keep playing the same shapes — just change your keyboard&apos;s transpose setting from{" "}
            <span className="font-mono text-foreground">+{data.currentTranspose}</span> to{" "}
            <span className="font-mono text-foreground">+{data.newTranspose}</span>.
          </p>
        </Card>

        <Card className="p-5">
          <h3 className="mb-4 font-heading text-base font-semibold">Keep Transpose Fixed</h3>
          <div className="flex items-center justify-around gap-3 py-2">
            <div className="text-center">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Current Shape</p>
              <p className="mt-1 font-heading text-3xl font-semibold text-foreground">{data.currentShape}</p>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground" />
            <div className="text-center">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">New Shape</p>
              <p className="mt-1 font-heading text-3xl font-semibold text-primary">{data.newShape}</p>
            </div>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            Prefer not to touch the transpose dial? Leave it where it is and shift your hands to{" "}
            <span className="font-mono text-foreground">{data.newShape}</span> shapes instead.
          </p>
        </Card>
      </div>
    </div>
  )
}

function KeyPicker({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
      <Select value={value} onValueChange={onChange}>
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
  )
}

function StatRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={`font-mono text-lg font-semibold ${highlight ? "text-primary" : "text-foreground"}`}>
        {value}
      </span>
    </div>
  )
}
