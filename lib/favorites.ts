"use client"

export interface FavoriteItem {
  toolSlug: string
  id: string
  value: string
  timestamp: number
}

const FAVORITES_KEY = "bestrandom_favorites"

export function addToFavorites(toolSlug: string, id: string, value: string): void {
  if (typeof window === 'undefined') return
  
  try {
    const favorites = getFavorites(toolSlug)
    const newFavorite: FavoriteItem = {
      toolSlug,
      id,
      value,
      timestamp: Date.now(),
    }
    
    // Remove if already exists
    const filtered = favorites.filter(f => f.id !== id)
    const updated = [newFavorite, ...filtered]
    
    const allFavorites = getAllFavorites()
    const otherFavorites = allFavorites.filter(f => f.toolSlug !== toolSlug)
    localStorage.setItem(FAVORITES_KEY, JSON.stringify([...updated, ...otherFavorites]))
  } catch (err) {
    console.error("Failed to save favorite:", err)
  }
}

export function removeFromFavorites(toolSlug: string, id: string): void {
  if (typeof window === 'undefined') return
  
  try {
    const allFavorites = getAllFavorites()
    const updated = allFavorites.filter(
      f => !(f.toolSlug === toolSlug && f.id === id)
    )
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated))
  } catch (err) {
    console.error("Failed to remove favorite:", err)
  }
}

export function getFavorites(toolSlug: string): FavoriteItem[] {
  if (typeof window === 'undefined') return []
  
  try {
    const allFavorites = getAllFavorites()
    return allFavorites.filter(f => f.toolSlug === toolSlug)
  } catch (err) {
    console.error("Failed to read favorites:", err)
    return []
  }
}

export function getAllFavorites(): FavoriteItem[] {
  if (typeof window === 'undefined') return []
  
  try {
    const data = localStorage.getItem(FAVORITES_KEY)
    if (!data) return []
    return JSON.parse(data) as FavoriteItem[]
  } catch (err) {
    console.error("Failed to read favorites:", err)
    return []
  }
}

export function isFavorite(toolSlug: string, id: string): boolean {
  const favorites = getFavorites(toolSlug)
  return favorites.some(f => f.id === id)
}

export function clearFavorites(toolSlug?: string): void {
  if (typeof window === 'undefined') return
  
  try {
    if (toolSlug) {
      const allFavorites = getAllFavorites()
      const updated = allFavorites.filter(f => f.toolSlug !== toolSlug)
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated))
    } else {
      localStorage.removeItem(FAVORITES_KEY)
    }
  } catch (err) {
    console.error("Failed to clear favorites:", err)
  }
}
