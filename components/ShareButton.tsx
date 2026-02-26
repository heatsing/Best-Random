"use client"

import { useState } from "react"
import { Share2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

interface ShareButtonProps {
  url: string
  className?: string
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
}

export function ShareButton({ 
  url, 
  className, 
  variant = "outline",
  size = "default"
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const handleShare = async () => {
    try {
      const fullUrl = typeof window !== 'undefined' 
        ? `${window.location.origin}${url}`
        : url
      
      if (navigator.share) {
        await navigator.share({
          title: "BestRandom",
          url: fullUrl,
        })
      } else {
        await navigator.clipboard.writeText(fullUrl)
        setCopied(true)
        toast({
          title: "Link copied",
          description: "Shareable link has been copied to clipboard",
        })
        setTimeout(() => setCopied(false), 2000)
      }
    } catch (err) {
      // User cancelled share or error occurred
      if (err instanceof Error && err.name !== 'AbortError') {
        toast({
          title: "Failed to share",
          description: "Could not share link",
          variant: "destructive",
        })
      }
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleShare}
      className={className}
      aria-label="Share link"
    >
      {copied ? (
        <>
          <Check className="mr-2 h-4 w-4" />
          Copied
        </>
      ) : (
        <>
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </>
      )}
    </Button>
  )
}
