"use client"

import { useState, useEffect } from "react"
import { History, X, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getHistory, clearHistory, type HistoryEntry } from "@/lib/history"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface HistoryPanelProps {
  toolSlug: string
  className?: string
  onSelect?: (entry: HistoryEntry) => void
}

export function HistoryPanel({ toolSlug, className, onSelect }: HistoryPanelProps) {
  const [entries, setEntries] = useState<HistoryEntry[]>([])
  const [open, setOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setEntries(getHistory(toolSlug))
  }, [toolSlug])

  const handleSelect = (entry: HistoryEntry) => {
    if (onSelect) {
      onSelect(entry)
    } else {
      // Navigate with seed and params
      const params = new URLSearchParams()
      params.set('seed', entry.seed)
      Object.entries(entry.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.set(key, String(value))
        }
      })
      router.push(`/${toolSlug}?${params.toString()}`)
    }
    setOpen(false)
  }

  const handleClear = () => {
    clearHistory(toolSlug)
    setEntries([])
  }

  if (entries.length === 0) {
    return null
  }

  return (
    <div className={cn("relative", className)}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(!open)}
        className="gap-2"
      >
        <History className="h-4 w-4" />
        History ({entries.length})
      </Button>
      
      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute top-full mt-2 right-0 z-50 w-80 bg-background border rounded-lg shadow-lg p-4 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm">Recent History</h3>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClear}
                  className="h-6 w-6"
                  aria-label="Clear history"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setOpen(false)}
                  className="h-6 w-6"
                  aria-label="Close"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              {entries.map((entry, index) => (
                <button
                  key={index}
                  onClick={() => handleSelect(entry)}
                  className="w-full text-left p-2 rounded-md hover:bg-accent transition-colors border"
                >
                  <div className="text-xs font-mono text-muted-foreground mb-1">
                    {entry.seed.slice(0, 8)}...
                  </div>
                  <div className="text-sm truncate">{entry.outputPreview}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {new Date(entry.timestamp).toLocaleString()}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
