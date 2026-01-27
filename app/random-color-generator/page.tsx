import { getToolBySlug } from "@/lib/tool-registry"
import { generateMetadata } from "@/lib/seo"
import type { Metadata } from "next"
import { RandomColorGeneratorClient } from "./client"

const tool = getToolBySlug("random-color-generator")!

export const metadata: Metadata = generateMetadata({
  title: tool.metaTitle,
  description: tool.metaDescription,
  path: `/${tool.slug}`,
})

export default function RandomColorGeneratorPage() {
  return <RandomColorGeneratorClient />
}
