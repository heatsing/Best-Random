"use client"

import { ReactNode } from "react"
import { HelpCircle, RotateCcw, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SeedBadge } from "./SeedBadge"
import { ShareButton } from "./ShareButton"
import { KeyboardShortcutsModal } from "./KeyboardShortcutsModal"
import { HistoryPanel } from "./HistoryPanel"
import { useState, useEffect } from "react"
import { useSearchParams, usePathname } from "next/navigation"
import type { ToolConfig } from "@/lib/tool-registry"

interface GeneratorLayoutProps {
  tool: ToolConfig
  seed: string
  onRepeat: () => void
  onReroll: () => void
  onCopy?: () => void
  onShare?: () => string
  children: ReactNode
  shortcuts?: Array<{ key: string; description: string }>
  className?: string
}

export function GeneratorLayout({
  tool,
  seed,
  onRepeat,
  onReroll,
  onCopy,
  onShare,
  children,
  shortcuts = [],
  className,
}: GeneratorLayoutProps) {
  const [shortcutsOpen, setShortcutsOpen] = useState(false)
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const defaultShortcuts = [
    { key: "G", description: "Generate/Repeat" },
    { key: "R", description: "Reroll (new seed)" },
    ...(onCopy ? [{ key: "C", description: "Copy all results" }] : []),
    ...(onShare ? [{ key: "S", description: "Copy share link" }] : []),
    { key: "?", description: "Show shortcuts" },
  ]

  const allShortcuts = shortcuts.length > 0 ? shortcuts : defaultShortcuts

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement)?.isContentEditable
      ) {
        return
      }

      if (e.key === "g" || e.key === "G") {
        e.preventDefault()
        onRepeat()
      } else if (e.key === "r" || e.key === "R") {
        e.preventDefault()
        onReroll()
      } else if ((e.key === "c" || e.key === "C") && onCopy) {
        e.preventDefault()
        onCopy()
      } else if ((e.key === "s" || e.key === "S") && onShare) {
        e.preventDefault()
        const url = onShare()
        navigator.clipboard.writeText(url)
      } else if (e.key === "?") {
        e.preventDefault()
        setShortcutsOpen(true)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onRepeat, onReroll, onCopy, onShare])

  const shareUrl = onShare
    ? onShare()
    : `${pathname}?${searchParams.toString()}`

  return (
    <div className={`container py-8 ${className || ""}`}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{tool.h1}</h1>
          <p className="text-muted-foreground mb-6">{tool.intro}</p>
        </div>

        {/* Randomness Bar */}
        <div className="mb-6 p-4 border rounded-lg bg-muted/30 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            <SeedBadge seed={seed} />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <RefreshCw className="h-4 w-4" />
                Repeatable
              </span>
              <span className="inline-flex items-center gap-1">
                <RotateCcw className="h-4 w-4" />
                Fair draw
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <ShareButton url={shareUrl} size="sm" />
            <Button
              variant="outline"
              size="sm"
              onClick={onReroll}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Reroll
            </Button>
            <HistoryPanel toolSlug={tool.slug} />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShortcutsOpen(true)}
              className="h-9 w-9"
              aria-label="Show keyboard shortcuts"
            >
              <HelpCircle className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="mb-8">{children}</div>

        {/* Shortcuts Hint */}
        <div className="text-center text-sm text-muted-foreground">
          Press <kbd className="px-2 py-1 bg-muted rounded text-xs">?</kbd> for keyboard shortcuts
        </div>
      </div>

      <KeyboardShortcutsModal
        open={shortcutsOpen}
        onOpenChange={setShortcutsOpen}
        shortcuts={allShortcuts}
      />
    </div>
  )
}
