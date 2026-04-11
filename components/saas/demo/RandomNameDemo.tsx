"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { demoRandomNames } from "@/lib/saas-tools"
import { Shuffle } from "lucide-react"

export function RandomNameDemo() {
  const [count, setCount] = useState(5)
  const [names, setNames] = useState<string[]>([])

  const run = useCallback(() => {
    setNames(demoRandomNames(count))
  }, [count])

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <Label htmlFor="name-count" className="text-base">
          How many names?
        </Label>
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex flex-col gap-2 min-w-[140px]">
            <input
              id="name-count"
              type="range"
              min={1}
              max={15}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full accent-primary h-2 rounded-full bg-muted"
            />
            <span className="text-sm text-muted-foreground tabular-nums">{count} names</span>
          </div>
          <Button type="button" onClick={run} className="gap-2 shrink-0">
            <Shuffle className="h-4 w-4" />
            Generate
          </Button>
        </div>
      </div>

      {names.length > 0 && (
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-3">Results</p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {names.map((n, i) => (
              <li
                key={`${n}-${i}`}
                className="rounded-lg border border-border/80 bg-muted/30 px-3 py-2.5 text-sm font-medium"
              >
                {n}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
