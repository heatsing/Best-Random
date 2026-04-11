"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { demoRandomPick } from "@/lib/saas-tools"
import { Trophy } from "lucide-react"

const DEFAULT_LINES = ["Option A", "Option B", "Option C", "Option D"].join("\n")

export function RandomPickerDemo() {
  const [text, setText] = useState(DEFAULT_LINES)
  const [picked, setPicked] = useState<string | null>(null)
  const [hasRun, setHasRun] = useState(false)

  const run = useCallback(() => {
    setHasRun(true)
    const lines = text.split(/\r?\n/)
    setPicked(demoRandomPick(lines))
  }, [text])

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor="picker-lines">One option per line</Label>
        <Textarea
          id="picker-lines"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
          className="resize-y min-h-[160px] font-mono text-sm leading-relaxed"
          placeholder="Paste your list…"
        />
      </div>

      <Button type="button" onClick={run} className="gap-2">
        <Trophy className="h-4 w-4" />
        Pick one
      </Button>

      {hasRun && (
        <div className="rounded-xl border-2 border-dashed border-primary/40 bg-primary/5 p-6 text-center">
          {picked === null ? (
            <p className="text-muted-foreground">Add at least one non-empty line.</p>
          ) : (
            <>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">Selected</p>
              <p className="text-2xl sm:text-3xl font-bold tracking-tight break-words">{picked}</p>
            </>
          )}
        </div>
      )}
    </div>
  )
}
