import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getSaasTool, getAllSaasSlugs } from "@/lib/saas-tools"
import { SaasToolRunner } from "@/components/saas/SaasToolRunner"
import { generateMetadata as buildMeta } from "@/lib/seo"
import { saasBreadcrumbJsonLd, saasWebPageJsonLd } from "@/lib/saas-tools/structured-data"

export const dynamicParams = false

export function generateStaticParams() {
  return getAllSaasSlugs().map((slug) => ({ slug }))
}

type PageProps = { params: { slug: string } }

export function generateMetadata({ params }: PageProps): Metadata {
  const tool = getSaasTool(params.slug)
  if (!tool) {
    return { title: "Not found" }
  }
  return buildMeta({
    title: tool.name,
    description: tool.description,
    path: `/tools/${tool.slug}`,
    keywords: tool.keywords,
  })
}

export default function SaasToolPage({ params }: PageProps) {
  const tool = getSaasTool(params.slug)
  if (!tool) notFound()

  const breadcrumbLd = saasBreadcrumbJsonLd(tool.slug, tool.name)
  const pageLd = saasWebPageJsonLd({
    slug: tool.slug,
    name: tool.name,
    description: tool.description,
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbLd, pageLd]) }}
      />
      <SaasToolRunner slug={tool.slug} />
    </>
  )
}
