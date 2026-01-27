"use client"

export interface HistoryEntry {
  toolSlug: string
  seed: string
  params: Record<string, any>
  outputPreview: string
  timestamp: number
}

const HISTORY_KEY = "bestrandom_history"
const MAX_HISTORY_ENTRIES = 20

export function saveToHistory(entry: HistoryEntry): void {
  if (typeof window === 'undefined') return
  
  try {
    const history = getHistory()
    const newHistory = [entry, ...history.filter(e => 
      e.toolSlug !== entry.toolSlug || 
      e.seed !== entry.seed || 
      JSON.stringify(e.params) !== JSON.stringify(entry.params)
    )].slice(0, MAX_HISTORY_ENTRIES)
    
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory))
  } catch (err) {
    console.error("Failed to save history:", err)
  }
}

export function getHistory(toolSlug?: string): HistoryEntry[] {
  if (typeof window === 'undefined') return []
  
  try {
    const data = localStorage.getItem(HISTORY_KEY)
    if (!data) return []
    
    const history = JSON.parse(data) as HistoryEntry[]
    return toolSlug 
      ? history.filter(e => e.toolSlug === toolSlug)
      : history
  } catch (err) {
    console.error("Failed to read history:", err)
    return []
  }
}

export function clearHistory(toolSlug?: string): void {
  if (typeof window === 'undefined') return
  
  try {
    if (toolSlug) {
      const history = getHistory().filter(e => e.toolSlug !== toolSlug)
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
    } else {
      localStorage.removeItem(HISTORY_KEY)
    }
  } catch (err) {
    console.error("Failed to clear history:", err)
  }
}
