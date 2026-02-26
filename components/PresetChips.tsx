"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface Preset {
  label: string
  value: any
}

interface PresetChipsProps {
  presets: Preset[]
  onSelect: (preset: Preset) => void
  selected?: Preset
  className?: string
}

export function PresetChips({ presets, onSelect, selected, className }: PresetChipsProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {presets.map((preset, index) => (
        <Button
          key={index}
          variant={selected === preset ? "default" : "outline"}
          size="sm"
          onClick={() => onSelect(preset)}
          className="text-xs"
        >
          {preset.label}
        </Button>
      ))}
    </div>
  )
}
