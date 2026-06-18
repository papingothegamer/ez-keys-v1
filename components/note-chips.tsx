import { cn } from "@/lib/utils"

export function NoteChips({
  notes,
  className,
  tone = "default",
}: {
  notes: string[]
  className?: string
  tone?: "default" | "primary" | "left" | "right"
}) {
  const toneClass = {
    default: "bg-secondary text-secondary-foreground border-border",
    primary: "bg-primary/15 text-primary border-primary/30",
    left: "bg-hand-left/20 text-hand-left border-hand-left/40",
    right: "bg-hand-right/20 text-hand-right border-hand-right/40",
  }[tone]

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {notes.map((n, i) => (
        <span
          key={`${n}-${i}`}
          className={cn(
            "inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-2.5 font-mono text-sm font-medium",
            toneClass,
          )}
        >
          {n}
        </span>
      ))}
    </div>
  )
}

export function LabeledRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
      <span className="w-28 shrink-0 text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}
