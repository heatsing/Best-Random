import { getToolBySlug } from "@/lib/tool-registry"
import { generateMetadata } from "@/lib/seo"
import type { Metadata } from "next"
import { RandomWebsiteGeneratorClient } from "./client"
import { Suspense } from "react"

const tool = getToolBySlug("random-website-generator")!

export const metadata: Metadata = generateMetadata({
  title: tool.metaTitle,
  description: tool.metaDescription,
  path: `/${tool.slug}`,
})

export default function RandomWebsiteGeneratorPage() {
  return (
    <Suspense fallback={<div className="container py-12">Loading...</div>}>
      <RandomWebsiteGeneratorClient />
    </Suspense>
  )
}
