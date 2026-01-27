import { 
  Hash, User, FileText, Shuffle, Palette, Key, PawPrint, Type,
  Users, Mail, Globe, Dice1, Coins, AtSign, Smile, Briefcase,
  MessageSquare, GitBranch, Trophy, Sparkles, Globe2, MapPin,
  Activity, Zap, Lock, Code, Hash as HashIcon
} from "lucide-react"
import { createPRNG, stableStringify, hashStringToUint32 } from "./prng"

// ============================================================================
// TYPES
// ============================================================================

export type CategoryId = 
  | "numbers" 
  | "text" 
  | "selection" 
  | "design" 
  | "security" 
  | "fun" 
  | "utilities" 
  | "games"

export type GeneratorType = 
  | "list" 
  | "single" 
  | "picker" 
  | "team" 
  | "color" 
  | "password" 
  | "game"
  | "pair"
  | "draft"
  | "secret-santa"
  | "gradient"
  | "palette"

export type OptionFieldType = 
  | "number" 
  | "checkbox" 
  | "select" 
  | "textarea" 
  | "text" 
  | "range"
  | "multiselect"

export interface OptionField {
  key: string
  label: string
  type: OptionFieldType
  default?: any
  min?: number
  max?: number
  step?: number
  options?: Array<{ value: string | number; label: string }>
  placeholder?: string
  helpText?: string
  required?: boolean
}

export interface OptionSchema {
  fields: OptionField[]
}

export interface GeneratorContext {
  seed: string
  rng: () => number // Returns 0..1
  options: Record<string, any>
}

export interface GeneratedResult {
  items: any[]
  meta: {
    seedUsed: string
    count: number
    generatedAt: number
  }
  previewText: string
}

export interface Category {
  id: CategoryId
  name: string
  description: string
  icon: typeof Hash
  color?: string
}

export interface ToolConfig {
  slug: string
  category: CategoryId
  name: string
  shortDescription: string
  longDescription: string
  generatorType: GeneratorType
  defaultOptions: Record<string, any>
  optionSchema: OptionSchema
  run: (ctx: GeneratorContext) => GeneratedResult
  seo: {
    title: string
    description: string
    h1: string
    faq: Array<{ question: string; answer: string }>
  }
  icon?: typeof Hash
  popular?: boolean
}

// ============================================================================
// CATEGORIES
// ============================================================================

export const categories: Category[] = [
  {
    id: "numbers",
    name: "Numbers",
    description: "Random numbers, dice, coins, and numeric generators",
    icon: Hash,
    color: "blue"
  },
  {
    id: "text",
    name: "Text",
    description: "Names, words, usernames, and text generators",
    icon: Type,
    color: "green"
  },
  {
    id: "selection",
    name: "Selection",
    description: "Pickers, teams, pairs, and selection tools",
    icon: Shuffle,
    color: "purple"
  },
  {
    id: "design",
    name: "Design",
    description: "Colors, palettes, and gradient generators",
    icon: Palette,
    color: "pink"
  },
  {
    id: "security",
    name: "Security",
    description: "Passwords, tokens, UUIDs, and security tools",
    icon: Key,
    color: "red"
  },
  {
    id: "utilities",
    name: "Utilities",
    description: "Hashes, tokens, and utility generators",
    icon: Code,
    color: "orange"
  },
  {
    id: "fun",
    name: "Fun",
    description: "Animals, countries, games, and fun generators",
    icon: PawPrint,
    color: "yellow"
  },
  {
    id: "games",
    name: "Games",
    description: "Dice, coins, and game-related generators",
    icon: Dice1,
    color: "indigo"
  }
]

// ============================================================================
// HELPER: Create deterministic seed from base seed + options
// ============================================================================

export function createCombinedSeed(baseSeed: string, options: Record<string, any>): string {
  const optionsStr = stableStringify(options)
  return `${baseSeed}|${optionsStr}`
}

// ============================================================================
// TOOLS REGISTRY - Imported from tools directory
// ============================================================================

import { allTools } from "./tools"

export const tools: ToolConfig[] = allTools

// Export helper functions
export function getCategoryById(id: CategoryId): Category | undefined {
  return categories.find(c => c.id === id)
}

export function getToolBySlug(slug: string): ToolConfig | undefined {
  return tools.find(t => t.slug === slug)
}

export function getToolsByCategory(categoryId?: CategoryId): ToolConfig[] {
  if (!categoryId) return tools
  return tools.filter(t => t.category === categoryId)
}

export function getPopularTools(): ToolConfig[] {
  return tools.filter(t => t.popular)
}
