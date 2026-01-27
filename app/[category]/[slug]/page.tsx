import { getToolBySlug } from "@/lib/registry"
import { generateMetadata as generateSEOMetadata } from "@/lib/seo"
import type { Metadata } from "next"
import { ToolPageClient } from "./client"
import { notFound } from "next/navigation"

interface PageProps {
  params: {
    category: string
    slug: string
  }
}

export async function generateStaticParams() {
  const { tools } = await import("@/lib/registry")
  return tools.map(tool => ({
    category: tool.category,
    slug: tool.slug
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const tool = getToolBySlug(params.slug)
  
  if (!tool) {
    return {
      title: "Tool Not Found",
      description: "The requested tool could not be found."
    }
  }
  
  return generateSEOMetadata({
    title: tool.seo.title,
    description: tool.seo.description,
    path: `/${tool.category}/${tool.slug}`,
  })
}

export default function ToolPage({ params }: PageProps) {
  const tool = getToolBySlug(params.slug)
  
  if (!tool || tool.category !== params.category) {
    notFound()
  }
  
  // Only pass serializable data to client component
  const toolData = {
    slug: tool.slug,
    category: tool.category,
    name: tool.name,
    shortDescription: tool.shortDescription,
    longDescription: tool.longDescription,
    generatorType: tool.generatorType,
    defaultOptions: tool.defaultOptions,
    optionSchema: tool.optionSchema,
    seo: tool.seo,
    icon: tool.icon,
    popular: tool.popular
  }
  
  return <ToolPageClient toolData={toolData} />
}
