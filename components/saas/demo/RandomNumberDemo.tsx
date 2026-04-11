"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { demoRandomIntegers } from "@/lib/saas-tools"
import { Dice3 } from "lucide-react"

export function RandomNumberDemo() {
  const [min, setMin] = useState(1)
  const [max, setMax] = useState(100)
  const [numCount, setNumCount] = useState(5)
  const [nums, setNums] = useState<number[]>([])

  const run = useCallback(() => {
    setNums(demoRandomIntegers(numCount, min, max))
  }, [min, max, numCount])

  return (
    <div className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="n-min">Min</Label>
          <Input
            id="n-min"
            type="number"
            value={min}
            onChange={(e) => setMin(Number(e.target.value))}
            className="tabular-nums"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="n-max">Max</Label>
          <Input
            id="n-max"
            type="number"
            value={max}
            onChange={(e) => setMax(Number(e.target.value))}
            className="tabular-nums"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="n-count">Count</Label>
          <Input
            id="n-count"
            type="number"
            min={1}
            max={50}
            value={numCount}
            onChange={(e) => setNumCount(Number(e.target.value))}
            className="tabular-nums"
          />
        </div>
      </div>

      <Button type="button" onClick={run} className="gap-2">
        <Dice3 className="h-4 w-4" />
        Roll numbers
      </Button>

      {nums.length > 0 && (
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-3">Results</p>
          <div className="flex flex-wrap gap-2">
            {nums.map((n, i) => (
              <span
                key={`${n}-${i}`}
                className="inline-flex min-w-[3rem] justify-center rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 font-mono text-lg font-semibold text-primary tabular-nums"
              >
                {n}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
