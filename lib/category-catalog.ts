import { Hash, Type, Shuffle, Palette, Key, Code, PawPrint, Dice1 } from "lucide-react"

export type CategoryId =
  | "numbers"
  | "text"
  | "selection"
  | "design"
  | "security"
  | "fun"
  | "utilities"
  | "games"

export interface Category {
  id: CategoryId
  name: string
  description: string
  icon: typeof Hash
  color?: string
}

/** Single source of truth for category metadata (also re-exported from registry). */
export const categories: Category[] = [
  {
    id: "numbers",
    name: "Numbers",
    description: "Random numbers, dice, coins, and numeric generators",
    icon: Hash,
    color: "blue",
  },
  {
    id: "text",
    name: "Text",
    description: "Names, words, usernames, and text generators",
    icon: Type,
    color: "green",
  },
  {
    id: "selection",
    name: "Selection",
    description: "Pickers, teams, pairs, and selection tools",
    icon: Shuffle,
    color: "purple",
  },
  {
    id: "design",
    name: "Design",
    description: "Colors, palettes, and gradient generators",
    icon: Palette,
    color: "pink",
  },
  {
    id: "security",
    name: "Security",
    description: "Passwords, tokens, UUIDs, and security tools",
    icon: Key,
    color: "red",
  },
  {
    id: "utilities",
    name: "Utilities",
    description: "Hashes, tokens, and utility generators",
    icon: Code,
    color: "orange",
  },
  {
    id: "fun",
    name: "Fun",
    description: "Animals, countries, games, and fun generators",
    icon: PawPrint,
    color: "yellow",
  },
  {
    id: "games",
    name: "Games",
    description: "Dice, coins, and game-related generators",
    icon: Dice1,
    color: "indigo",
  },
]

/** Home directory 3-column layout (reference UI). */
export const homeCategoryColumns: CategoryId[][] = [
  ["numbers", "text", "selection"],
  ["design", "security", "utilities"],
  ["fun", "games"],
]
