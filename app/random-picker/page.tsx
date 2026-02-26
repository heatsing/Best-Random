import { getToolBySlug } from "@/lib/tool-registry"
import { generateMetadata } from "@/lib/seo"
import type { Metadata } from "next"
import { RandomPickerClient } from "./client"
import { Suspense } from "react"

const tool = getToolBySlug("random-picker")!

export const metadata: Metadata = generateMetadata({
  title: tool.metaTitle,
  description: tool.metaDescription,
  path: `/${tool.slug}`,
})

export default function RandomPickerPage() {
  return (
    <Suspense fallback={<div className="container py-12">Loading...</div>}>
      <RandomPickerClient />
    </Suspense>
  )
}
