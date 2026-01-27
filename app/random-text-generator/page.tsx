import { getToolBySlug } from "@/lib/tool-registry"
import { generateMetadata } from "@/lib/seo"
import type { Metadata } from "next"
import { RandomTextGeneratorClient } from "./client"

const tool = getToolBySlug("random-text-generator")!

export const metadata: Metadata = generateMetadata({
  title: tool.metaTitle,
  description: tool.metaDescription,
  path: `/${tool.slug}`,
})

export default function RandomTextGeneratorPage() {
  return <RandomTextGeneratorClient />
}
