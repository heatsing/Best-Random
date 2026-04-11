import { 
  Hash, User, FileText, Shuffle, Palette, Key, PawPrint, Type,
  Users, Mail, Globe, Dice1, Coins, AtSign, Smile, Briefcase,
  MessageSquare, GitBranch, Trophy, Sparkles, Globe2, MapPin,
  Activity, Zap, Lock, Code, Hash as HashIcon, Fingerprint
} from "lucide-react"
import { createPRNG, stableStringify, hashStringToUint32 } from "./prng"
import type { CategoryId, Category } from "./category-catalog"
import { categories } from "./category-catalog"

export type { CategoryId, Category } from "./category-catalog"
export { categories }

// ============================================================================
// TYPES
// ============================================================================

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

export interface ToolConfig {
  slug: string
  category: CategoryId
  name: string
  shortDescription: string
  longDescription: string
  generatorType: GeneratorType
  defaultOptions: Record<string, any>
  optionSchema: OptionSchema
  run: (ctx: GeneratorContext) => GeneratedResult | Promise<GeneratedResult>
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
