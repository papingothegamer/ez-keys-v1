"use client"

import { useEffect } from "react"
import { useAppStore } from "@/lib/store"

// Keeps the <html> class in sync with the persisted theme preference.
export function ThemeSync() {
  const theme = useAppStore((s) => s.theme)
  useEffect(() => {
    const root = document.documentElement
    if (theme === "dark") {
      root.classList.add("dark")
      root.classList.remove("light")
    } else {
      root.classList.add("light")
      root.classList.remove("dark")
    }
  }, [theme])
  return null
}
