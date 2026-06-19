"use client"

import { useState } from "react"
import { Search, Plus } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SONG_LIBRARY, type LibrarySong } from "@/lib/data/songs"

interface SetlistLibraryDialogProps {
  onAddSong: (song: LibrarySong) => void
}

const GENRES = ["All", "CCM", "Pop", "R&B", "Jazz", "Gospel"]

export function SetlistLibraryDialog({ onAddSong }: SetlistLibraryDialogProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [genre, setGenre] = useState("All")

  const filteredSongs = SONG_LIBRARY.filter((song) => {
    const matchesSearch = song.title.toLowerCase().includes(search.toLowerCase())
    const matchesGenre = genre === "All" || song.genre === genre
    return matchesSearch && matchesGenre
  })

  function handleAdd(song: LibrarySong) {
    onAddSong(song)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="secondary" className="h-10" />}>
        Browse Library
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-2xl font-heading">Setlist Library</DialogTitle>
          <p className="text-sm text-muted-foreground">Add popular progressions directly to your setlist. Keys and BPM can be adjusted after adding.</p>
        </DialogHeader>

        <div className="flex flex-col gap-4 px-6 pt-2 pb-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search songs..."
              className="pl-9 h-10"
            />
          </div>
          
          <Tabs value={genre} onValueChange={setGenre} className="w-full">
            <TabsList className="w-full h-auto flex flex-wrap justify-start gap-1 p-1 bg-secondary/50">
              {GENRES.map((g) => (
                <TabsTrigger key={g} value={g} className="px-4 py-1.5 rounded-sm text-xs uppercase tracking-wide">
                  {g}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 min-h-0">
          <div className="flex flex-col gap-3">
            {filteredSongs.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No songs found matching your search.
              </div>
            ) : (
              filteredSongs.map((song) => (
                <div key={song.id} className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:bg-secondary/20 transition-colors">
                  <div className="flex flex-col gap-1.5 min-w-0 pr-4">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-lg truncate">{song.title}</span>
                      <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-primary/30 text-primary bg-primary/10">
                        {song.genre}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono">
                      <span>{song.defaultBpm} BPM</span>
                      <span>•</span>
                      <span>{song.timeSignature}</span>
                    </div>
                    <div className="mt-1 flex gap-2 overflow-hidden">
                      <span className="text-xs uppercase tracking-widest text-muted-foreground shrink-0 pt-0.5">NNS</span>
                      <span className="font-mono text-sm truncate text-foreground/80">{song.progression}</span>
                    </div>
                  </div>
                  <Button onClick={() => handleAdd(song)} size="sm" className="shrink-0 rounded-full h-9 px-4 font-bold">
                    <Plus className="mr-1.5 h-4 w-4" /> Add
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
