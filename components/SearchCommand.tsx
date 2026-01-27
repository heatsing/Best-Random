"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Search, X, Copy, Share2, RotateCcw, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter, usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { TOOL_REGISTRY } from "@/lib/tool-registry"

interface SearchCommandProps {
  className?: string
}

export function CommandPalette({ className }: SearchCommandProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const router = useRouter()
  const pathname = usePathname()

  const filtered = TOOL_REGISTRY.filter(
    tool =>
      tool.name.toLowerCase().includes(query.toLowerCase()) ||
      tool.intro.toLowerCase().includes(query.toLowerCase()) ||
      tool.category.toLowerCase().includes(query.toLowerCase())
  )

  const handleSelect = (slug: string) => {
    router.push(`/${slug}`)
    setOpen(false)
    setQuery("")
  }

  const isToolPage = TOOL_REGISTRY.some(tool => pathname === `/${tool.slug}`)
  const currentTool = TOOL_REGISTRY.find(tool => pathname === `/${tool.slug}`)

  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setOpen(true)
      }
      if (e.key === "Escape") {
        setOpen(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener("keydown", handleKeyDown)
      }
    }
  }, [])

  if (!open) {
    return null
  }

  return (
    <div className={cn("fixed inset-0 z-50", className)}>
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm" 
        onClick={() => setOpen(false)} 
      />
      <div className="relative bg-background border rounded-lg shadow-lg p-4 max-w-2xl mx-auto mt-20">
        <div className="flex items-center gap-2 mb-4">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools..."
            className="flex-1"
            autoFocus
          />
          <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {isToolPage && currentTool && (
            <div className="mb-4 pb-4 border-b">
              <div className="text-xs font-semibold text-muted-foreground mb-2 px-2">
                Quick Actions
              </div>
              <div className="space-y-1">
                <button
                  onClick={() => {
                    // Trigger generate/repeat
                    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'g' }))
                    setOpen(false)
                  }}
                  className="w-full text-left px-4 py-2 rounded-md hover:bg-accent transition-colors flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Generate/Repeat</span>
                  <kbd className="ml-auto px-2 py-0.5 text-xs bg-muted rounded">G</kbd>
                </button>
                <button
                  onClick={() => {
                    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'r' }))
                    setOpen(false)
                  }}
                  className="w-full text-left px-4 py-2 rounded-md hover:bg-accent transition-colors flex items-center gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Reroll</span>
                  <kbd className="ml-auto px-2 py-0.5 text-xs bg-muted rounded">R</kbd>
                </button>
                <button
                  onClick={() => {
                    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'c' }))
                    setOpen(false)
                  }}
                  className="w-full text-left px-4 py-2 rounded-md hover:bg-accent transition-colors flex items-center gap-2"
                >
                  <Copy className="h-4 w-4" />
                  <span>Copy All</span>
                  <kbd className="ml-auto px-2 py-0.5 text-xs bg-muted rounded">C</kbd>
                </button>
                <button
                  onClick={() => {
                    window.dispatchEvent(new KeyboardEvent('keydown', { key: 's' }))
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
          <div>
            <div className="text-xs font-semibold text-muted-foreground mb-2 px-2">
              {query ? "Search Results" : "All Tools"}
            </div>
            {filtered.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No tools found
              </div>
            ) : (
              <div className="space-y-1">
                {filtered.map((tool) => {
                  const Icon = tool.icon
                  return (
                    <button
                      key={tool.slug}
                      onClick={() => handleSelect(tool.slug)}
                      className="w-full text-left px-4 py-3 rounded-md hover:bg-accent transition-colors flex items-center gap-3"
                    >
                      <Icon className="h-5 w-5 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="font-medium">{tool.name}</div>
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          {tool.intro}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {tool.category}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Export both names for compatibility
export { CommandPalette as SearchCommand }
