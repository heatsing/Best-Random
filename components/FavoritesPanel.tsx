"use client"

import { useState, useEffect } from "react"
import { Heart, X, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getFavorites, clearFavorites, type FavoriteItem } from "@/lib/favorites"
import { cn } from "@/lib/utils"

interface FavoritesPanelProps {
  toolSlug: string
  className?: string
  onSelect?: (item: FavoriteItem) => void
}

export function FavoritesPanel({ toolSlug, className, onSelect }: FavoritesPanelProps) {
  const [items, setItems] = useState<FavoriteItem[]>([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setItems(getFavorites(toolSlug))
  }, [toolSlug])

  const handleSelect = (item: FavoriteItem) => {
    onSelect?.(item)
    setOpen(false)
  }

  const handleClear = () => {
    clearFavorites(toolSlug)
    setItems([])
  }

  if (items.length === 0) {
    return null
  }

  return (
    <div className={cn("relative", className)}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(!open)}
        className="gap-2"
      >
        <Heart className="h-4 w-4" />
        Favorites ({items.length})
      </Button>
      
      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute top-full mt-2 right-0 z-50 w-80 bg-background border rounded-lg shadow-lg p-4 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm">Favorites</h3>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClear}
                  className="h-6 w-6"
                  aria-label="Clear favorites"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setOpen(false)}
                  className="h-6 w-6"
                  aria-label="Close"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className="w-full text-left p-2 rounded-md hover:bg-accent transition-colors border"
                >
                  <div className="text-sm">{item.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {new Date(item.timestamp).toLocaleString()}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
