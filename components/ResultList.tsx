"use client"

import { useState } from "react"
import { Copy, Lock, Unlock, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

export interface ResultItem {
  id: string
  value: string | React.ReactNode
  locked?: boolean
}

interface ResultListProps {
  items: ResultItem[]
  onLockToggle?: (id: string) => void
  onCopy?: (value: string) => void
  onCopyAll?: () => void
  onDownloadCSV?: () => void
  showLock?: boolean
  showDownload?: boolean
  className?: string
  itemClassName?: string
}

export function ResultList({
  items,
  onLockToggle,
  onCopy,
  onCopyAll,
  onDownloadCSV,
  showLock = false,
  showDownload = false,
  className,
  itemClassName,
}: ResultListProps) {
  const { toast } = useToast()

  const handleCopy = async (value: string) => {
    try {
      const text = typeof value === 'string' ? value : String(value)
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copied",
        description: "Item copied to clipboard",
      })
      onCopy?.(text)
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard",
        variant: "destructive",
      })
    }
  }

  const handleCopyAll = async () => {
    try {
      const allText = items
        .map(item => typeof item.value === 'string' ? item.value : String(item.value))
        .join('\n')
      await navigator.clipboard.writeText(allText)
      toast({
        title: "All items copied",
        description: "All results copied to clipboard",
      })
      onCopyAll?.()
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard",
        variant: "destructive",
      })
    }
  }

  const handleDownloadCSV = () => {
    if (!onDownloadCSV) {
      const csv = items
        .map(item => {
          const value = typeof item.value === 'string' ? item.value : String(item.value)
          return `"${value.replace(/"/g, '""')}"`
        })
        .join('\n')
      
      const blob = new Blob([csv], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'results.csv'
      a.click()
      URL.revokeObjectURL(url)
      
      toast({
        title: "Downloaded",
        description: "Results downloaded as CSV",
      })
    } else {
      onDownloadCSV()
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      {(onCopyAll || onDownloadCSV) && (
        <div className="flex gap-2 justify-end">
          {onCopyAll && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyAll}
              className="gap-2"
              aria-label="Copy all results"
            >
              <Copy className="h-4 w-4" aria-hidden="true" />
              Copy All
            </Button>
          )}
          {showDownload && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadCSV}
              className="gap-2"
              aria-label="Download results as CSV"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Download CSV
            </Button>
          )}
        </div>
      )}
      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className={cn(
              "flex items-center justify-between p-3 border rounded-lg bg-card",
              item.locked && "bg-muted/50",
              itemClassName
            )}
          >
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium break-words">
                {item.value}
              </div>
            </div>
            <div className="flex items-center gap-2 ml-4">
              {onCopy && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleCopy(typeof item.value === 'string' ? item.value : String(item.value))}
                  className="h-8 w-8"
                  aria-label="Copy item"
                >
                  <Copy className="h-4 w-4" aria-hidden="true" />
                </Button>
              )}
              {showLock && onLockToggle && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onLockToggle(item.id)}
                  className="h-8 w-8"
                  aria-label={item.locked ? "Unlock item" : "Lock item"}
                >
                  {item.locked ? (
                    <Lock className="h-4 w-4 text-primary" aria-hidden="true" />
                  ) : (
                    <Unlock className="h-4 w-4" aria-hidden="true" />
                  )}
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
