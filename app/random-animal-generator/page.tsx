import { getToolBySlug } from "@/lib/tool-registry"
import { generateMetadata } from "@/lib/seo"
import type { Metadata } from "next"
import { RandomAnimalGeneratorClient } from "./client"

const tool = getToolBySlug("random-animal-generator")!

export const metadata: Metadata = generateMetadata({
  title: tool.metaTitle,
  description: tool.metaDescription,
  path: `/${tool.slug}`,
})

export default function RandomAnimalGeneratorPage() {
  return <RandomAnimalGeneratorClient />
}
