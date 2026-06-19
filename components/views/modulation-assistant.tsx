"use client"

import { useEffect, useMemo, useState } from "react"
import { ArrowRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAppStore } from "@/lib/store"
import { parseRoot, pcName } from "@/lib/theory/notes"
import { parseChord } from "@/lib/theory/chords"
import { convertToShape } from "@/lib/theory/voicings"
import { WorkspaceHeader } from "@/components/workspace-header"
import { Badge } from "@/components/ui/badge"

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
    
    // Use the chord engine to get example chords (the I chord)
    const currentIChord = parseChord(`${current}maj7`)
    const targetIChord = parseChord(`${target}maj7`)
    const currentShape = currentIChord ? convertToShape(currentIChord, refPc, accidental)?.shape.symbol : "—"
    
    // If transpose is fixed, they play a new shape to sound like the target chord
    // To find the new shape, we convert the target chord using the OLD transpose setting.
    // wait, transpose setting maps physical C to sounding Eb. So sounding = physical + transpose.
    // physical = sounding - transpose.
    // So new physical shape root = target root - currentTranspose
    const newShapePc = ((tgtPc - currentTranspose) % 12 + 12) % 12
    const newShapeRootName = pcName(newShapePc, accidental)
    const newShape = `${newShapeRootName}maj7`

    return { 
      currentTranspose, newTranspose, adjustment, 
      currentShape, newShape,
      currentIChord: currentIChord?.symbol, targetIChord: targetIChord?.symbol
    }
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
        <Card className="flex flex-col p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-heading text-base font-semibold">Adjust the Transpose</h3>
            <Badge variant="secondary">Same Shapes</Badge>
          </div>
          <div className="space-y-3">
            <StatRow label="Current Transpose" value={`+${data.currentTranspose}`} />
            <StatRow label="New Transpose" value={`+${data.newTranspose}`} highlight />
            <div className="my-1 border-t border-border" />
            <StatRow
              label="Adjustment"
              value={`${data.adjustment >= 0 ? "+" : ""}${data.adjustment}`}
            />
          </div>
          <div className="mt-auto pt-5">
            <div className="rounded-md bg-secondary/30 p-3 text-sm">
              <p className="text-muted-foreground mb-2">Example (I chord):</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-foreground font-semibold">{data.currentIChord}</p>
                  <p className="text-[10px] text-muted-foreground">Sounding</p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-primary font-semibold">{data.targetIChord}</p>
                  <p className="text-[10px] text-muted-foreground">Sounding</p>
                </div>
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground">
                You play <span className="font-mono text-foreground">{data.currentShape}</span> both times. Just change your transpose by <span className="font-mono text-foreground font-semibold">{data.adjustment >= 0 ? "+" : ""}{data.adjustment}</span>.
              </p>
            </div>
          </div>
        </Card>

        <Card className="flex flex-col p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-heading text-base font-semibold">Keep Transpose Fixed</h3>
            <Badge variant="secondary">Change Shapes</Badge>
          </div>
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
          <div className="mt-auto pt-5">
            <div className="rounded-md bg-secondary/30 p-3 text-sm">
              <p className="text-muted-foreground mb-2">Example (I chord):</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-foreground font-semibold">{data.currentIChord}</p>
                  <p className="text-[10px] text-muted-foreground">Sounding</p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-primary font-semibold">{data.targetIChord}</p>
                  <p className="text-[10px] text-muted-foreground">Sounding</p>
                </div>
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground">
                You leave transpose at <span className="font-mono text-foreground">+{data.currentTranspose}</span> and play <span className="font-mono text-foreground font-semibold">{data.newShape}</span> instead.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

function KeyPicker({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
      <Select value={value} onValueChange={(v) => v && onChange(v)}>
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
