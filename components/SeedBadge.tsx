"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

interface SeedBadgeProps {
  seed: string
  className?: string
}

export function SeedBadge({ seed, className }: SeedBadgeProps) {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(seed)
      setCopied(true)
      toast({
        title: "Seed copied",
        description: "Seed has been copied to clipboard",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy seed to clipboard",
        variant: "destructive",
      })
    }
  }

  return (
    <div className={`flex items-center gap-2 ${className || ""}`}>
      <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
        Seed: {seed.slice(0, 8)}...
      </span>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleCopy}
        className="h-7 px-2"
        aria-label="Copy seed"
      >
        {copied ? (
          <Check className="h-3 w-3" />
        ) : (
          <Copy className="h-3 w-3" />
        )}
      </Button>
    </div>
  )
}
