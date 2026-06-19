import { ChevronLeft, ChevronRight } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { generateKeyLibrary } from "@/lib/theory/library"
import { formatRelativeChord } from "@/lib/theory/nns"
import { parseRoot } from "@/lib/theory/notes"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { useMemo } from "react"

const ROOTS = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"]
const QUALITIES = [
  { val: "", label: "Triad (Major)" },
  { val: "m", label: "Triad (Minor)" },
  { val: "maj7", label: "Major 7th" },
  { val: "m7", label: "Minor 7th" },
  { val: "7", label: "Dominant 7th" },
  { val: "m7b5", label: "Half-Diminished 7th" },
  { val: "dim7", label: "Fully Diminished 7th" },
  { val: "aug", label: "Augmented Triad" },
  { val: "sus4", label: "Sus4" },
  { val: "sus2", label: "Sus2" },
]

export function GlobalLibraryBrowser() {
  const { 
    activeKey, 
    setActiveKey, 
    activeChordIndex, 
    setActiveChordIndex, 
    notationSystem,
    activeChordOverrides,
    setActiveChordOverride 
  } = useAppStore()

  const library = useMemo(() => generateKeyLibrary(activeKey, activeChordOverrides[activeKey]), [activeKey, activeChordOverrides])
  const activeChord = library[activeChordIndex]
  const keyPc = parseRoot(activeKey)?.pc ?? 0

  if (!activeChord) return null

  const handlePrev = () => setActiveChordIndex((activeChordIndex - 1 + library.length) % library.length)
  const handleNext = () => setActiveChordIndex((activeChordIndex + 1) % library.length)

  const relativeName = formatRelativeChord(activeChord, keyPc, notationSystem === "numbers" ? "nns" : "roman")

  return (
    <Card className="mb-6 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-card/60 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Global Key</span>
        <Select value={activeKey} onValueChange={setActiveKey}>
          <SelectTrigger className="w-24 h-9 font-mono bg-background">
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

      <div className="flex flex-1 items-center justify-center max-w-sm">
        <button 
          onClick={handlePrev}
          className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-secondary/50"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
          <div className="flex items-end gap-2">
            <h2 className="font-heading text-3xl font-bold text-foreground">
              {notationSystem === "numbers" ? relativeName : activeChord.symbol}
            </h2>
            <Select 
              value={activeChord.type.symbol} 
              onValueChange={(val) => setActiveChordOverride(activeKey, activeChordIndex, val)}
            >
              <SelectTrigger className="h-6 w-auto border-0 bg-transparent text-xs text-primary shadow-none p-0 ml-1 hover:underline">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {QUALITIES.map(q => <SelectItem key={q.val} value={q.val}>{q.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <p className="text-xs font-medium text-muted-foreground tracking-wide mt-1">
            {notationSystem === "numbers" ? activeChord.symbol : relativeName}
          </p>
        </div>

        <button 
          onClick={handleNext}
          className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-secondary/50"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      <div className="hidden sm:block w-[120px]" /> {/* Spacer for centering */}
    </Card>
  )
}
