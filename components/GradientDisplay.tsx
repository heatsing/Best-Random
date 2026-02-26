"use client"

import { Copy, Code } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

interface GradientDisplayProps {
  gradient: {
    id: string
    value: string
    formatted: string
    type: string
    colors: string[]
    stops: Array<{ color: string; position: number }>
    angle?: number
    css: string
    cssProperty: string
  }
  onCopy?: (text: string) => void
}

export function GradientDisplay({ gradient, onCopy }: GradientDisplayProps) {
  const { toast } = useToast()

  const handleCopyCSS = () => {
    navigator.clipboard.writeText(gradient.css)
    toast({
      title: "Copied",
      description: "CSS code copied to clipboard",
    })
    onCopy?.(gradient.css)
  }

  const handleCopyProperty = () => {
    navigator.clipboard.writeText(gradient.cssProperty)
    toast({
      title: "Copied",
      description: "CSS property copied to clipboard",
    })
    onCopy?.(gradient.cssProperty)
  }

  return (
    <div className="space-y-4">
      {/* Gradient Preview */}
      <div
        className="w-full h-48 rounded-lg border-2 border-border shadow-lg"
        style={{ background: gradient.cssProperty }}
        aria-label={`${gradient.type} gradient preview`}
      />

      {/* Gradient Info */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold capitalize">{gradient.type} Gradient</h3>
            {gradient.angle !== undefined && (
              <p className="text-sm text-muted-foreground">Angle: {gradient.angle}°</p>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyProperty}
              className="gap-2"
            >
              <Copy className="h-4 w-4" />
              Copy CSS
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyCSS}
              className="gap-2"
            >
              <Code className="h-4 w-4" />
              Copy Full
            </Button>
          </div>
        </div>

        {/* Color Stops */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Color Stops:</h4>
          <div className="flex flex-wrap gap-2">
            {gradient.stops.map((stop, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-3 py-1.5 rounded-md border bg-card"
              >
                <div
                  className="w-6 h-6 rounded border"
                  style={{ backgroundColor: stop.color }}
                  aria-label={`Color ${stop.color}`}
                />
                <span className="text-sm font-mono">{stop.color}</span>
                <span className="text-xs text-muted-foreground">{stop.position}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* CSS Code */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">CSS Property:</h4>
          <div className="p-3 rounded-md bg-muted border font-mono text-sm break-all">
            {gradient.cssProperty}
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Full CSS:</h4>
          <div className="p-3 rounded-md bg-muted border font-mono text-sm break-all">
            {gradient.css}
          </div>
        </div>
      </div>
    </div>
  )
}
