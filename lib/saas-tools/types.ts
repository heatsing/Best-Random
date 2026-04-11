import type { LucideIcon } from "lucide-react"

/**
 * Single source of truth for /tools/* pages.
 * Add rows here to scale — same shape supports 100+ tools.
 */
export interface SaasToolDefinition {
  /** URL segment: /tools/[slug] */
  slug: string
  /** Short label for cards & SEO title fragment */
  name: string
  /** One-line pitch */
  tagline: string
  /** Meta description (~155 chars) */
  description: string
  /** SEO keywords */
  keywords: string[]
  /** Grouping for directory filters later */
  category: "generators" | "selection" | "utilities"
  /** Lucide icon for directory cards */
  icon: LucideIcon
  /** Internal links — sibling tools (exclude self in UI) */
  relatedSlugs: string[]
}
