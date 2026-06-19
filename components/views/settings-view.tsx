"use client"

import { useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useAppStore, type KeyboardSize } from "@/lib/store"
import { WorkspaceHeader } from "@/components/workspace-header"
import { cn } from "@/lib/utils"

const ROOTS = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"]

export function SettingsView() {
  const {
    keyboardSize,
    setKeyboardSize,
    theme,
    setTheme,
    accidental,
    setAccidental,
    referenceKey,
    setReferenceKey,
    notationSystem,
    setNotationSystem,
    setKeyboard,
  } = useAppStore()

  useEffect(() => {
    setKeyboard({})
  }, [setKeyboard])

  return (
    <div className="max-w-2xl">
      <WorkspaceHeader title="Settings" description="Configure your keyboard, theme, note spelling, and reference key." />

      <div className="grid gap-5">
        <Card className="p-5">
          <Label className="text-sm font-semibold">Keyboard Size</Label>
          <p className="mb-3 text-xs text-muted-foreground">Number of keys shown in the visualizer.</p>
          <SegmentGroup
            options={[
              { value: 61, label: "61-key" },
              { value: 76, label: "76-key" },
              { value: 88, label: "88-key" },
            ]}
            value={keyboardSize}
            onChange={(v) => setKeyboardSize(v as KeyboardSize)}
          />
        </Card>

        <Card className="p-5">
          <Label className="text-sm font-semibold">Theme</Label>
          <p className="mb-3 text-xs text-muted-foreground">Dark mode is recommended for stage use.</p>
          <SegmentGroup
            options={[
              { value: "dark", label: "Dark" },
              { value: "light", label: "Light" },
            ]}
            value={theme}
            onChange={(v) => setTheme(v as "dark" | "light")}
          />
        </Card>

        <Card className="p-5">
          <Label className="text-sm font-semibold">Note Naming</Label>
          <p className="mb-3 text-xs text-muted-foreground">Prefer sharps or flats for chromatic notes.</p>
          <SegmentGroup
            options={[
              { value: "flat", label: "Flats (Bb)" },
              { value: "sharp", label: "Sharps (A#)" },
            ]}
            value={accidental}
            onChange={(v) => setAccidental(v as "flat" | "sharp")}
          />
        </Card>

        <Card className="p-5">
          <Label className="text-sm font-semibold">Notation System</Label>
          <p className="mb-3 text-xs text-muted-foreground">Prefer letters (C, E, G) or numbers (1, 3, 5).</p>
          <SegmentGroup
            options={[
              { value: "letters", label: "Letters" },
              { value: "numbers", label: "Numbers" },
            ]}
            value={notationSystem}
            onChange={(v) => setNotationSystem(v as "letters" | "numbers")}
          />
        </Card>

        <Card className="p-5">
          <Label className="text-sm font-semibold">Reference Key</Label>
          <p className="mb-3 text-xs text-muted-foreground">
            The physical shapes you play. Most transpose players use C.
          </p>
          <div className="flex flex-wrap gap-1.5">
            {ROOTS.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setReferenceKey(r)}
                className={cn(
                  "h-9 min-w-9 rounded-md border px-2 font-mono text-sm transition-colors",
                  referenceKey === r
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-secondary/40 text-muted-foreground hover:text-foreground",
                )}
              >
                {r}
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

function SegmentGroup<T extends string | number>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <div className="inline-flex rounded-md border border-border bg-secondary/30 p-1">
      {options.map((opt) => (
        <button
          key={String(opt.value)}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cn(
            "rounded px-4 py-1.5 text-sm font-medium transition-colors",
            value === opt.value
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
