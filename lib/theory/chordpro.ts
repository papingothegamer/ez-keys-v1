export interface ChordProSegment {
  chord: string | null;
  lyric: string;
  stepIndex: number;
}

export interface ParsedChordPro {
  lines: ChordProSegment[][];
  steps: string[]; // The sequential array of chords for the sequencer
}

export function parseChordPro(input: string): ParsedChordPro {
  const lines = input.split('\n');
  const parsedLines: ChordProSegment[][] = [];
  const steps: string[] = [];
  let stepIndex = 0;

  for (const line of lines) {
    const segments: ChordProSegment[] = [];
    // Split by [chord]. parts[0] is text before the first chord.
    // parts[1] is the first chord, parts[2] is the text after it, etc.
    const parts = line.split(/\[(.*?)\]/);
    
    if (parts[0]) {
      segments.push({ chord: null, lyric: parts[0], stepIndex: -1 });
    }
    
    for (let i = 1; i < parts.length; i += 2) {
      const chord = parts[i];
      const lyric = parts[i + 1] || "";
      
      segments.push({ chord, lyric, stepIndex });
      steps.push(chord);
      stepIndex++;
    }
    parsedLines.push(segments);
  }

  return { lines: parsedLines, steps };
}
