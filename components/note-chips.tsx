import { cn } from "@/lib/utils"

export function NoteChips({
  notes,
  className,
  tone = "default",
}: {
  notes: string[]
  className?: string
  tone?: "default" | "primary" | "left" | "right" | "rainbow"
}) {
  const getToneClass = (i: number) => {
    if (tone === "rainbow") {
      const colors = [
        "bg-red-500/15 text-red-500 border-red-500/30",
        "bg-orange-500/15 text-orange-500 border-orange-500/30",
        "bg-amber-500/15 text-amber-500 border-amber-500/30",
        "bg-green-500/15 text-green-500 border-green-500/30",
        "bg-blue-500/15 text-blue-500 border-blue-500/30",
        "bg-indigo-500/15 text-indigo-500 border-indigo-500/30",
        "bg-purple-500/15 text-purple-500 border-purple-500/30",
        "bg-pink-500/15 text-pink-500 border-pink-500/30",
      ]
      return colors[i % colors.length]
    }
    return {
      default: "bg-secondary text-secondary-foreground border-border",
      primary: "bg-primary/15 text-primary border-primary/30",
      left: "bg-hand-left/20 text-hand-left border-hand-left/40",
      right: "bg-hand-right/20 text-hand-right border-hand-right/40",
    }[tone]
  }

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {notes.map((n, i) => (
        <span
          key={`${n}-${i}`}
          className={cn(
            "inline-flex h-9 w-11 shrink-0 items-center justify-center rounded-md border font-mono text-sm font-medium",
            getToneClass(i),
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
