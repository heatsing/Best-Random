import { getToolBySlug } from "@/lib/tool-registry"
import { generateMetadata } from "@/lib/seo"
import type { Metadata } from "next"
import { LastNameGeneratorClient } from "./client"
import { Suspense } from "react"

const tool = getToolBySlug("last-name-generator")!

export const metadata: Metadata = generateMetadata({
  title: tool.metaTitle,
  description: tool.metaDescription,
  path: `/${tool.slug}`,
})

export default function LastNameGeneratorPage() {
  return (
    <Suspense fallback={<div className="container py-12">Loading...</div>}>
      <LastNameGeneratorClient />
    </Suspense>
  )
}
