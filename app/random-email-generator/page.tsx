import { getToolBySlug } from "@/lib/tool-registry"
import { generateMetadata } from "@/lib/seo"
import type { Metadata } from "next"
import { RandomEmailGeneratorClient } from "./client"

const tool = getToolBySlug("random-email-generator")!

export const metadata: Metadata = generateMetadata({
  title: tool.metaTitle,
  description: tool.metaDescription,
  path: `/${tool.slug}`,
})

export default function RandomEmailGeneratorPage() {
  return <RandomEmailGeneratorClient />
}
