"use client"

import { Button } from "@/components/ui/button"
import { Share2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface ShareLinkProps {
  url: string
  className?: string
}

export function ShareLink({ url, className }: ShareLinkProps) {
  const { toast } = useToast()

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Best Random",
          url: url,
        })
      } else {
        await navigator.clipboard.writeText(url)
        toast({
          title: "Link copied",
          description: "Share link copied to clipboard",
        })
      }
    } catch (error) {
      // User cancelled or error occurred
      if (error instanceof Error && error.name !== "AbortError") {
        await navigator.clipboard.writeText(url)
        toast({
          title: "Link copied",
          description: "Share link copied to clipboard",
        })
      }
    }
  }

  return (
    <Button
      onClick={handleShare}
      variant="outline"
      size="sm"
      className={className}
      aria-label="Share link"
    >
      <Share2 className="mr-2 h-4 w-4" aria-hidden="true" />
      Share
    </Button>
  )
}
