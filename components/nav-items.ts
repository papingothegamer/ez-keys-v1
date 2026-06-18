import {
  Piano,
  Layers,
  ArrowRightLeft,
  AudioWaveform,
  Repeat,
  ListMusic,
  Settings,
  type LucideIcon,
} from "lucide-react"
import type { View } from "@/lib/store"

export interface NavItem {
  view: View
  label: string
  icon: LucideIcon
  description: string
}

export const NAV_ITEMS: NavItem[] = [
  { view: "chord", label: "Chord Explorer", icon: Piano, description: "Search any chord" },
  { view: "voicing", label: "Voicing Explorer", icon: Layers, description: "Practical piano voicings" },
  { view: "progression", label: "Progression Translator", icon: ArrowRightLeft, description: "Translate progressions" },
  { view: "scale", label: "Scale Explorer", icon: AudioWaveform, description: "Scales & modes" },
  { view: "modulation", label: "Modulation Assistant", icon: Repeat, description: "Handle key changes" },
  { view: "setlist", label: "Setlist Mode", icon: ListMusic, description: "Prep for performances" },
  { view: "settings", label: "Settings", icon: Settings, description: "Preferences" },
]
