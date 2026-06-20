"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/lib/store"
import { ChevronRight, ChevronLeft, Check, ListMusic, Music, Settings, Sparkles } from "lucide-react"

const STEPS = [
  {
    title: "Welcome to EZ-Keys",
    description: "The ultimate tool for church musicians and keyboardists to master their voicings, translate progressions, and learn songs quickly in any key.",
    icon: <Sparkles className="w-12 h-12 text-primary" />,
    content: (
      <div className="flex flex-col items-center gap-4 text-sm leading-relaxed text-muted-foreground mt-4 text-center">
        <p>
          EZ-Keys is built around a single, powerful concept: <strong className="text-foreground">The Global Keyboard</strong>. 
        </p>
        <p>
          No matter what tool or view you are using, the interactive keyboard at the bottom of the screen will always show you exactly what notes to play, complete with left and right-hand coloring.
        </p>
      </div>
    )
  },
  {
    title: "Understanding Transposition",
    description: "Never fear a weird key again. Our transposition engine handles the math for you.",
    icon: <Settings className="w-12 h-12 text-primary" />,
    content: (
      <div className="flex flex-col items-center gap-4 text-sm leading-relaxed text-muted-foreground mt-4 text-center">
        <p>
          At the top of your screen, you'll see the <strong className="text-foreground">I Play In</strong> and <strong className="text-foreground">Audience Hears</strong> dropdowns.
        </p>
        <div className="bg-secondary/50 p-4 rounded-lg border border-border w-full text-left">
          <p className="mb-2">If you prefer playing in <strong>C</strong>, but the singer is singing in <strong>Eb</strong>:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Set "I Play In" to <strong>C</strong></li>
            <li>Set "Audience Hears" to <strong>Eb</strong></li>
          </ul>
        </div>
        <p>
          Your keyboard will automatically show you the chords in the key of C, while mathematically confirming it sounds like Eb!
        </p>
      </div>
    )
  },
  {
    title: "Feature Explorers",
    description: "Dive deep into music theory visually.",
    icon: <Music className="w-12 h-12 text-primary" />,
    content: (
      <div className="flex flex-col gap-4 text-sm leading-relaxed text-muted-foreground mt-4 text-center">
        <div className="space-y-4">
          <div className="flex flex-col items-center">
            <strong className="text-foreground flex items-center gap-2">🎹 Chord & Voicing Explorers</strong>
            <p className="mt-1">Click through any chord quality (maj7, m11, dim) and discover lush, professional voicings for it instantly.</p>
          </div>
          <div className="flex flex-col items-center">
            <strong className="text-foreground flex items-center gap-2">🎼 Progression Translator</strong>
            <p className="mt-1">Type in Nashville Numbers like <code className="bg-secondary px-1 py-0.5 rounded text-xs">1 5 6m 4</code> and see the chords laid out.</p>
          </div>
        </div>
      </div>
    )
  },
  {
    title: "Setlist Mode",
    description: "Your digital chord sheet perfectly synced with your voicings.",
    icon: <ListMusic className="w-12 h-12 text-primary" />,
    content: (
      <div className="flex flex-col items-center gap-4 text-sm leading-relaxed text-muted-foreground mt-4 text-center">
        <p>
          This is where it all comes together. Create custom setlists and add songs from our built-in <strong className="text-foreground">Global Song Library</strong>.
        </p>
        <div className="bg-secondary/50 p-4 rounded-lg border border-border w-full text-left">
          <p className="mb-2 text-foreground font-medium">Interactive Chord Sheets:</p>
          <p>
            Inside a song, you'll see the lyrics mapped with chords. <strong className="text-foreground">Click any chord in the lyrics</strong>, and the Global Keyboard will instantly light up to show you exactly how to voice that chord.
          </p>
        </div>
        <p className="font-medium text-foreground mt-2">
          It's time to play. Enjoy EZ-Keys!
        </p>
      </div>
    )
  }
]

export function TutorialDialog() {
  const { hasSeenTutorial, isTutorialOpen, setTutorialOpen, setHasSeenTutorial } = useAppStore()
  const [step, setStep] = useState(0)

  // Auto-open logic
  useEffect(() => {
    if (!hasSeenTutorial) {
      // Small delay to let the app render first
      const timer = setTimeout(() => {
        setTutorialOpen(true)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [hasSeenTutorial, setTutorialOpen])

  // Reset step when dialog opens
  useEffect(() => {
    if (isTutorialOpen) {
      setStep(0)
    }
  }, [isTutorialOpen])

  function handleClose() {
    setTutorialOpen(false)
    if (!hasSeenTutorial) {
      setHasSeenTutorial(true)
    }
  }

  function nextStep() {
    if (step < STEPS.length - 1) {
      setStep(step + 1)
    } else {
      handleClose()
    }
  }

  function prevStep() {
    if (step > 0) {
      setStep(step - 1)
    }
  }

  const currentStep = STEPS[step]

  return (
    <Dialog open={isTutorialOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-lg max-h-[90dvh] p-0 overflow-hidden sm:rounded-2xl gap-0 flex flex-col">
        <div className="flex-1 overflow-y-auto flex flex-col px-4 sm:px-6 pt-8 pb-6">
          <div className="flex justify-center mb-6 shrink-0">
            <div className="p-4 bg-primary/10 rounded-2xl">
              {currentStep.icon}
            </div>
          </div>
          
          <DialogHeader className="shrink-0">
            <DialogTitle className="text-2xl font-heading text-center mb-2">
              {currentStep.title}
            </DialogTitle>
            <DialogDescription className="text-center text-base">
              {currentStep.description}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 flex flex-col justify-center min-h-[160px] sm:min-h-[200px] mt-4">
            {currentStep.content}
          </div>
        </div>

        {/* Progress indicators */}
        <div className="shrink-0 flex justify-center gap-1.5 pb-6 bg-background">
          {STEPS.map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-6 bg-primary' : 'w-1.5 bg-border'}`}
            />
          ))}
        </div>

        <DialogFooter className="m-0 shrink-0 flex flex-row items-center justify-between px-4 sm:px-6 py-4 bg-secondary/30 border-t border-border/50 space-x-0 sm:space-x-0">
          <Button 
            variant="ghost" 
            onClick={prevStep}
            disabled={step === 0}
            className={`w-[90px] sm:w-[100px] justify-start px-2 sm:px-4 ${step === 0 ? 'invisible' : ''}`}
          >
            <ChevronLeft className="w-4 h-4 mr-1 sm:mr-2 shrink-0" />
            Back
          </Button>

          <Button 
            variant={step === STEPS.length - 1 ? "default" : "secondary"}
            onClick={nextStep}
            className="w-[110px] sm:w-[120px]"
          >
            {step === STEPS.length - 1 ? (
              <>
                <Check className="w-4 h-4 mr-1 sm:mr-2 shrink-0" />
                Start
              </>
            ) : (
              <>
                Next
                <ChevronRight className="w-4 h-4 ml-1 sm:ml-2 shrink-0" />
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
