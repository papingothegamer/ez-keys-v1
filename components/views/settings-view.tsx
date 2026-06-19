"use client"

import { useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useAppStore, type KeyboardSize } from "@/lib/store"
import { WorkspaceHeader } from "@/components/workspace-header"
import { cn } from "@/lib/utils"

import { getRoots } from "@/lib/theory/notes"

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

  const roots = getRoots(accidental)

  return (
    <div className="max-w-3xl">
      <WorkspaceHeader title="Settings" description="Configure your keyboard, theme, note spelling, and reference key." />

      <div className="space-y-10 pb-10">
        <section>
          <h3 className="mb-4 text-base font-medium text-foreground uppercase tracking-wider text-muted-foreground/80">Appearance & Interface</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="p-5 flex flex-col justify-between bg-card/60 backdrop-blur-sm border-border/50">
              <div className="mb-5">
                <Label className="text-sm font-semibold text-foreground">Theme</Label>
                <p className="mt-1.5 text-xs text-muted-foreground/80 leading-relaxed">Dark mode is recommended for stage environments to reduce glare.</p>
              </div>
              <div>
                <SegmentGroup
                  options={[
                    { value: "dark", label: "Dark" },
                    { value: "light", label: "Light" },
                  ]}
                  value={theme}
                  onChange={(v) => setTheme(v as "dark" | "light")}
                />
              </div>
            </Card>

            <Card className="p-5 flex flex-col justify-between bg-card/60 backdrop-blur-sm border-border/50">
              <div className="mb-5">
                <Label className="text-sm font-semibold text-foreground">Keyboard Size</Label>
                <p className="mt-1.5 text-xs text-muted-foreground/80 leading-relaxed">Adjust the number of keys shown in the visualizer to match your controller.</p>
              </div>
              <div>
                <SegmentGroup
                  options={[
                    { value: 61, label: "61" },
                    { value: 76, label: "76" },
                    { value: 88, label: "88" },
                  ]}
                  value={keyboardSize}
                  onChange={(v) => setKeyboardSize(v as KeyboardSize)}
                />
              </div>
            </Card>
          </div>
        </section>

        <section>
          <h3 className="mb-4 text-base font-medium text-foreground uppercase tracking-wider text-muted-foreground/80">Music Theory Engine</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="p-5 flex flex-col justify-between bg-card/60 backdrop-blur-sm border-border/50">
              <div className="mb-5">
                <Label className="text-sm font-semibold text-foreground">Note Naming (Accidentals)</Label>
                <p className="mt-1.5 text-xs text-muted-foreground/80 leading-relaxed">Select how chromatic notes are spelled throughout the app.</p>
              </div>
              <div className="overflow-x-auto pb-1">
                <SegmentGroup
                  options={[
                    { value: "flat", label: "Flats (Bb)" },
                    { value: "sharp", label: "Sharps (A#)" },
                    { value: "concert", label: "Concert (Eb, F#)" },
                  ]}
                  value={accidental}
                  onChange={(v) => setAccidental(v as "flat" | "sharp" | "concert")}
                />
              </div>
            </Card>

            <Card className="p-5 flex flex-col justify-between bg-card/60 backdrop-blur-sm border-border/50">
              <div className="mb-5">
                <Label className="text-sm font-semibold text-foreground">Notation System</Label>
                <p className="mt-1.5 text-xs text-muted-foreground/80 leading-relaxed">Display notes as traditional letters (C, E) or Nashville Numbers (1, 3).</p>
              </div>
              <div>
                <SegmentGroup
                  options={[
                    { value: "letters", label: "Letters" },
                    { value: "numbers", label: "Numbers" },
                  ]}
                  value={notationSystem}
                  onChange={(v) => setNotationSystem(v as "letters" | "numbers")}
                />
              </div>
            </Card>

            <Card className="p-5 sm:col-span-2 flex flex-col justify-between bg-card/60 backdrop-blur-sm border-border/50">
              <div className="mb-5">
                <Label className="text-sm font-semibold text-foreground">Reference Key (Your Fingering)</Label>
                <p className="mt-1.5 text-xs text-muted-foreground/80 leading-relaxed">
                  The physical key layout you press on your keyboard. Most transpose players lock this to C.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {roots.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setReferenceKey(r)}
                    className={cn(
                      "h-10 w-12 shrink-0 rounded-md border font-mono text-sm font-medium transition-all",
                      referenceKey === r
                        ? "border-primary bg-primary text-primary-foreground shadow-md scale-105"
                        : "border-border bg-secondary/40 text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                    )}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </Card>
          </div>
        </section>
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
