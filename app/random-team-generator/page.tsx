import { getToolBySlug } from "@/lib/tool-registry"
import { generateMetadata } from "@/lib/seo"
import type { Metadata } from "next"
import { RandomTeamGeneratorClient } from "./client"

const tool = getToolBySlug("random-team-generator")!

export const metadata: Metadata = generateMetadata({
  title: tool.metaTitle,
  description: tool.metaDescription,
  path: `/${tool.slug}`,
})

export default function RandomTeamGeneratorPage() {
  return <RandomTeamGeneratorClient />
}
