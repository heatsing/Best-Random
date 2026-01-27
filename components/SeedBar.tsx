"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, RefreshCw, Share2, Check } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface SeedBarProps {
  seed: string
  onSeedChange: (seed: string) => void
  onRandomSeed: () => void
  onShare?: () => string
  className?: string
}

export function SeedBar({ seed, onSeedChange, onRandomSeed, onShare, className }: SeedBarProps) {
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)

  const handleCopySeed = async () => {
    try {
      await navigator.clipboard.writeText(seed)
      setCopied(true)
      toast({
        title: "Copied",
        description: "Seed copied to clipboard",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy seed",
        variant: "destructive",
      })
    }
  }

  const handleShare = async () => {
    if (!onShare) return
    
    const url = onShare()
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Random Generator",
          text: "Check out this random generator result!",
          url,
        })
      } else {
        await navigator.clipboard.writeText(url)
        toast({
          title: "Link copied",
          description: "Share link copied to clipboard",
        })
      }
    } catch (err) {
      // User cancelled or error
      if (err instanceof Error && err.name !== "AbortError") {
        await navigator.clipboard.writeText(url)
        toast({
          title: "Link copied",
          description: "Share link copied to clipboard",
        })
      }
    }
  }

  return (
    <div className={`flex flex-col sm:flex-row gap-2 items-start sm:items-center ${className || ""}`}>
      <div className="flex-1 w-full sm:w-auto">
        <Label htmlFor="seed" className="sr-only">Seed</Label>
        <div className="flex gap-2">
          <Input
            id="seed"
            value={seed}
            onChange={(e) => onSeedChange(e.target.value)}
            placeholder="Enter seed or leave empty for random"
            className="font-mono text-sm"
            aria-label="Seed for reproducibility"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={onRandomSeed}
            aria-label="Generate random seed"
            title="Generate random seed"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleCopySeed}
          aria-label="Copy seed"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 mr-2" aria-hidden="true" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-2" aria-hidden="true" />
              Copy Seed
            </>
          )}
        </Button>
        {onShare && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleShare}
            aria-label="Share link"
          >
            <Share2 className="h-4 w-4 mr-2" aria-hidden="true" />
            Share
          </Button>
        )}
      </div>
    </div>
  )
}
