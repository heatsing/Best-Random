"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Keyboard } from "lucide-react"

interface Shortcut {
  key: string
  description: string
}

interface KeyboardShortcutsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  shortcuts: Shortcut[]
}

export function KeyboardShortcutsModal({
  open,
  onOpenChange,
  shortcuts,
}: KeyboardShortcutsModalProps) {
  const isMac = typeof window !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0
  const modKey = isMac ? '⌘' : 'Ctrl'

  const formatKey = (key: string) => {
    if (key === 'Ctrl' || key === 'Cmd') {
      return modKey
    }
    if (key === 'Ctrl/Cmd') {
      return modKey
    }
    return key
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription>
            Use these shortcuts to quickly interact with the generator
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-3">
          {shortcuts.map((shortcut, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-2 border-b last:border-0"
            >
              <span className="text-sm text-muted-foreground">
                {shortcut.description}
              </span>
              <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700">
                {shortcut.key.split('+').map(formatKey).join(' + ')}
              </kbd>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
