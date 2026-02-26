import { getToolBySlug } from "@/lib/tool-registry"
import { generateMetadata } from "@/lib/seo"
import type { Metadata } from "next"
import { RandomNumberGeneratorClient } from "./client"
import { Suspense } from "react"

const tool = getToolBySlug("random-number-generator")!

export const metadata: Metadata = generateMetadata({
  title: tool.metaTitle,
  description: tool.metaDescription,
  path: `/${tool.slug}`,
})

export default function RandomNumberGeneratorPage() {
  return (
    <Suspense fallback={<div className="container py-12">Loading...</div>}>
      <RandomNumberGeneratorClient />
    </Suspense>
  )
}
