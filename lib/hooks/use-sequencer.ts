import { useState, useEffect, useRef } from "react"

export interface SequencerState {
  isPlaying: boolean
  currentStep: number // 0-indexed index in the progression array
  totalSteps: number
}

// steps array: ["1", "5", "6m", "4"]
export function useSequencer(steps: string[], bpm: number, timeSignature: string) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  const totalSteps = steps.length

  // Calculate milliseconds per bar
  // e.g., 4/4 time at 120 BPM
  // 120 beats per minute -> 2 beats per second -> 500ms per beat
  // 4 beats per bar -> 2000ms per bar
  const [beatsPerBar] = timeSignature.split("/").map(Number)
  const msPerBeat = (60 / Math.max(bpm, 1)) * 1000
  const msPerBar = msPerBeat * (beatsPerBar || 4)

  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isPlaying && totalSteps > 0) {
      // Start the timer
      timerRef.current = setInterval(() => {
        setCurrentStep((prev) => (prev + 1) % totalSteps)
      }, msPerBar)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isPlaying, msPerBar, totalSteps])

  // Stop playback if progression changes
  useEffect(() => {
    setIsPlaying(false)
    setCurrentStep(0)
  }, [steps.join(" ")])

  const togglePlayback = () => {
    if (totalSteps === 0) return
    if (!isPlaying && currentStep >= totalSteps) {
      setCurrentStep(0)
    }
    setIsPlaying(!isPlaying)
  }

  const stopPlayback = () => {
    setIsPlaying(false)
    setCurrentStep(0)
  }

  return {
    isPlaying,
    currentStep,
    totalSteps,
    steps,
    togglePlayback,
    stopPlayback,
    setCurrentStep
  }
}
