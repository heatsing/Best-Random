import { Sparkles, Hash, ListChecks } from "lucide-react"
import type { SaasToolDefinition } from "./types"

/** Ordered catalog — append new tools here for static generation & sitemap. */
export const SAAS_TOOLS: SaasToolDefinition[] = [
  {
    slug: "random-name-generator",
    name: "Random Name Generator",
    tagline: "Generate modern random names for characters, tests, or placeholders.",
    description:
      "Free random name generator with a clean interface. Create multiple names instantly — ideal for writers, QA, and brainstorming.",
    keywords: [
      "random name generator",
      "fake names",
      "character names",
      "random names online",
    ],
    category: "generators",
    icon: Sparkles,
    relatedSlugs: ["random-number-generator", "random-picker"],
  },
  {
    slug: "random-number-generator",
    name: "Random Number Generator",
    tagline: "Draw integers in any range — fast and shareable.",
    description:
      "Pick random numbers between min and max. Generate one or many results with a minimal, focused UI.",
    keywords: [
      "random number generator",
      "random integer",
      "pick random number",
      "number randomizer",
    ],
    category: "generators",
    icon: Hash,
    relatedSlugs: ["random-name-generator", "random-picker"],
  },
  {
    slug: "random-picker",
    name: "Random Picker",
    tagline: "Paste a list — we pick one winner at random.",
    description:
      "Enter options (one per line) and randomly select an item. Perfect for giveaways, standups, and quick decisions.",
    keywords: [
      "random picker",
      "random choice",
      "pick random item from list",
      "name wheel alternative",
    ],
    category: "selection",
    icon: ListChecks,
    relatedSlugs: ["random-name-generator", "random-number-generator"],
  },
]

const bySlug = new Map(SAAS_TOOLS.map((t) => [t.slug, t]))

export function getSaasTool(slug: string): SaasToolDefinition | undefined {
  return bySlug.get(slug)
}

export function getAllSaasSlugs(): string[] {
  return SAAS_TOOLS.map((t) => t.slug)
}
