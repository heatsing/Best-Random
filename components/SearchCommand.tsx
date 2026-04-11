"use client"

import { useState, useEffect, useMemo, useRef, useCallback } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Search, X, Copy, Share2, RotateCcw, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter, usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { tools, type ToolConfig } from "@/lib/registry"

/** Dispatched by {@link SearchOpenButton} to open the single global palette (see `app/layout.tsx`). */
export const OPEN_COMMAND_PALETTE_EVENT = "bestrandom:open-command-palette"

function scoreToolMatch(tool: ToolConfig, q: string): number {
  const qt = q.trim().toLowerCase()
  if (!qt) return 0
  const name = tool.name.toLowerCase()
  const desc = tool.shortDescription.toLowerCase()
  const cat = tool.category.toLowerCase()
  const slug = tool.slug.toLowerCase()
  let s = 0
  if (name === qt) s += 500
  else if (name.startsWith(qt)) s += 420
  else if (name.includes(qt)) s += 300
  if (slug === qt) s += 480
  else if (slug.startsWith(qt)) s += 360
  else if (slug.includes(qt)) s += 280
  if (desc.includes(qt)) s += 140
  if (cat.includes(qt)) s += 90
  if (tool.popular) s += 45
  for (const word of qt.split(/\s+/).filter((w) => w.length > 1)) {
    if (name.includes(word)) s += 35
    if (desc.includes(word)) s += 18
    if (slug.includes(word)) s += 32
  }
  return s
}

interface SearchCommandProps {
  className?: string
}

export function SearchOpenButton({
  className,
  onOpen,
}: {
  className?: string
  onOpen?: () => void
}) {
  return (
    <Button
      type="button"
      variant="outline"
      className={cn(
        "justify-start gap-2 rounded-lg border-border/90 bg-muted/25 font-normal text-muted-foreground shadow-sm transition-colors hover:border-primary/35 hover:bg-muted/45 h-9 md:h-10",
        className
      )}
      onClick={() => {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent(OPEN_COMMAND_PALETTE_EVENT))
        }
        onOpen?.()
      }}
      aria-label="Search tools"
    >
      <Search className="h-4 w-4 shrink-0" aria-hidden />
      <span className="flex-1 text-left truncate text-sm">Search tools…</span>
      <kbd className="pointer-events-none hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
        ⌘K
      </kbd>
    </Button>
  )
}

export function CommandPalette({ className }: SearchCommandProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [activeIndex, setActiveIndex] = useState(-1)
  const router = useRouter()
  const pathname = usePathname()

  const sortedRef = useRef<ToolConfig[]>([])
  const activeIndexRef = useRef(-1)
  activeIndexRef.current = activeIndex

  const qLower = query.trim().toLowerCase()

  const filtered = useMemo(
    () =>
      tools.filter(
        (tool) =>
          !qLower ||
          tool.name.toLowerCase().includes(qLower) ||
          tool.shortDescription.toLowerCase().includes(qLower) ||
          tool.category.toLowerCase().includes(qLower) ||
          tool.slug.toLowerCase().includes(qLower)
      ),
    [qLower]
  )

  const sortedTools = useMemo(() => {
    if (!qLower) {
      return [...filtered].sort((a, b) => {
        const pa = a.popular ? 1 : 0
        const pb = b.popular ? 1 : 0
        if (pb !== pa) return pb - pa
        return a.name.localeCompare(b.name)
      })
    }
    return [...filtered]
      .map((t) => ({ t, s: scoreToolMatch(t, qLower) }))
      .sort((a, b) => {
        if (b.s !== a.s) return b.s - a.s
        const pa = a.t.popular ? 1 : 0
        const pb = b.t.popular ? 1 : 0
        if (pb !== pa) return pb - pa
        return a.t.name.localeCompare(b.t.name)
      })
      .map((x) => x.t)
  }, [filtered, qLower])

  sortedRef.current = sortedTools

  const handleSelect = useCallback(
    (slug: string, category: string) => {
      router.push(`/${category}/${slug}`)
      setOpen(false)
      setQuery("")
      setActiveIndex(-1)
    },
    [router]
  )

  const isToolPage = tools.some((tool) => pathname === `/${tool.category}/${tool.slug}`)
  const currentTool = tools.find((tool) => pathname === `/${tool.category}/${tool.slug}`)

  useEffect(() => {
    setActiveIndex(-1)
  }, [qLower])

  useEffect(() => {
    const onOpenEvent = () => setOpen(true)
    window.addEventListener(OPEN_COMMAND_PALETTE_EVENT, onOpenEvent)
    return () => window.removeEventListener(OPEN_COMMAND_PALETTE_EVENT, onOpenEvent)
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setOpen((o) => !o)
      }
      if (e.key === "Escape") {
        setOpen(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  useEffect(() => {
    if (!open) {
      setActiveIndex(-1)
      return
    }

    const onPaletteKey = (e: KeyboardEvent) => {
      const list = sortedRef.current
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setActiveIndex((i) => {
          if (list.length === 0) return -1
          if (i < 0) return 0
          return Math.min(list.length - 1, i + 1)
        })
        return
      }
      if (e.key === "ArrowUp") {
        e.preventDefault()
        setActiveIndex((i) => {
          if (i <= 0) return -1
          return i - 1
        })
      }
    }

    window.addEventListener("keydown", onPaletteKey, true)
    return () => window.removeEventListener("keydown", onPaletteKey, true)
  }, [open])

  useEffect(() => {
    if (!open || activeIndex < 0) return
    const slug = sortedTools[activeIndex]?.slug
    if (!slug) return
    const el = document.getElementById(`cmdk-result-${slug}`)
    el?.scrollIntoView({ block: "nearest" })
  }, [activeIndex, open, sortedTools])

  if (!open) {
    return null
  }

  return (
    <div
      className={cn("fixed inset-0 z-50", className)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="command-palette-title"
    >
      <div
        className="absolute inset-0 bg-background/75 backdrop-blur-md"
        onClick={() => setOpen(false)}
        aria-hidden
      />
      <div className="relative mx-auto mt-[8vh] max-w-2xl rounded-xl border-2 border-border bg-card p-5 shadow-2xl shadow-black/10 ring-1 ring-primary/10">
        <h2 id="command-palette-title" className="sr-only">
          Search tools
        </h2>
        <div className="mb-4 flex items-center gap-2 border-b border-border pb-4">
          <Search className="h-4 w-4 shrink-0 text-primary" aria-hidden />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key !== "Enter") return
              e.preventDefault()
              const list = sortedRef.current
              if (list.length === 0) return
              const i = activeIndexRef.current >= 0 ? activeIndexRef.current : 0
              const pick = list[i]
              if (pick) handleSelect(pick.slug, pick.category)
            }}
            placeholder="Search tools..."
            className="flex-1 border-border/90 bg-background"
            autoFocus
            aria-controls="command-palette-results"
          />
          <Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Close">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="max-h-[min(24rem,70vh)] overflow-y-auto">
          <div className="mb-4 border-b border-border/80 pb-4">
            <div className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Site
            </div>
            <div className="flex flex-wrap gap-2 px-2">
              <Button variant="outline" size="sm" className="h-8" asChild>
                <Link href="/" onClick={() => setOpen(false)}>
                  Home
                </Link>
              </Button>
              <Button variant="outline" size="sm" className="h-8" asChild>
                <Link href="/generators" onClick={() => setOpen(false)}>
                  All generators
                </Link>
              </Button>
              <Button variant="outline" size="sm" className="h-8" asChild>
                <Link href="/tools" onClick={() => setOpen(false)}>
                  Tools hub
                </Link>
              </Button>
            </div>
          </div>
          {isToolPage && currentTool && (
            <div className="mb-4 border-b border-border/80 pb-4">
              <div className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Quick actions
              </div>
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    window.dispatchEvent(new KeyboardEvent("keydown", { key: "g" }))
                    setOpen(false)
                  }}
                  className="w-full text-left px-4 py-2 rounded-md hover:bg-accent transition-colors flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Generate/Repeat</span>
                  <kbd className="ml-auto px-2 py-0.5 text-xs bg-muted rounded">G</kbd>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    window.dispatchEvent(new KeyboardEvent("keydown", { key: "r" }))
                    setOpen(false)
                  }}
                  className="w-full text-left px-4 py-2 rounded-md hover:bg-accent transition-colors flex items-center gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Reroll</span>
                  <kbd className="ml-auto px-2 py-0.5 text-xs bg-muted rounded">R</kbd>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    window.dispatchEvent(new KeyboardEvent("keydown", { key: "c" }))
                    setOpen(false)
                  }}
                  className="w-full text-left px-4 py-2 rounded-md hover:bg-accent transition-colors flex items-center gap-2"
                >
                  <Copy className="h-4 w-4" />
                  <span>Copy All</span>
                  <kbd className="ml-auto px-2 py-0.5 text-xs bg-muted rounded">C</kbd>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    window.dispatchEvent(new KeyboardEvent("keydown", { key: "s" }))
                    setOpen(false)
                  }}
                  className="w-full text-left px-4 py-2 rounded-md hover:bg-accent transition-colors flex items-center gap-2"
                >
                  <Share2 className="h-4 w-4" />
                  <span>Share</span>
                  <kbd className="ml-auto px-2 py-0.5 text-xs bg-muted rounded">S</kbd>
                </button>
              </div>
            </div>
          )}
          <div id="command-palette-results">
            <div className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {query ? "Search results" : "All tools"}
            </div>
            {sortedTools.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No tools found</div>
            ) : (
              <div className="space-y-1" role="listbox" aria-label="Tools">
                {sortedTools.map((tool, idx) => {
                  const Icon = tool.icon || (() => null)
                  const isActive = idx === activeIndex
                  return (
                    <button
                      key={tool.slug}
                      type="button"
                      id={`cmdk-result-${tool.slug}`}
                      role="option"
                      aria-selected={isActive}
                      onClick={() => handleSelect(tool.slug, tool.category)}
                      onMouseEnter={() => setActiveIndex(idx)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors",
                        isActive
                          ? "border border-primary/30 bg-primary/10"
                          : "border border-transparent hover:bg-muted/60"
                      )}
                    >
                      {Icon && (
                        <Icon
                          className={cn(
                            "h-5 w-5 shrink-0",
                            isActive ? "text-primary" : "text-muted-foreground"
                          )}
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium">{tool.name}</div>
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          {tool.shortDescription}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">{tool.category}</div>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>
        <p className="mt-4 border-t border-border pt-4 px-2 text-[11px] text-muted-foreground">
          <kbd className="rounded border bg-muted px-1 font-mono">↑</kbd>{" "}
          <kbd className="rounded border bg-muted px-1 font-mono">↓</kbd> to move ·{" "}
          <kbd className="rounded border bg-muted px-1 font-mono">Enter</kbd> to open
        </p>
      </div>
    </div>
  )
}

export { CommandPalette as SearchCommand }
