import { getToolBySlug } from "@/lib/tool-registry"
import { generateMetadata } from "@/lib/seo"
import type { Metadata } from "next"
import { RandomPickerClient } from "./client"

const tool = getToolBySlug("random-picker")!

export const metadata: Metadata = generateMetadata({
  title: tool.metaTitle,
  description: tool.metaDescription,
  path: `/${tool.slug}`,
})

export default function RandomPickerPage() {
  return <RandomPickerClient />
}
