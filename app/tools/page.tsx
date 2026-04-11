import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { SAAS_TOOLS } from "@/lib/saas-tools"
import { Breadcrumbs } from "@/components/saas/Breadcrumbs"
import { generateMetadata as buildMeta } from "@/lib/seo"

export const metadata: Metadata = buildMeta({
  title: "Random Tools Directory — Scalable Generator Platform",
  description:
    "Browse modular random generators: names, numbers, pickers, and more. Built for speed, SEO, and growth — add tools without rewriting the shell.",
  path: "/tools",
  keywords: [
    "random tools",
    "random generator directory",
    "online random utilities",
    "BestRandom tools",
  ],
})

export default function ToolsDirectoryPage() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-10 sm:px-6 md:py-16">
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Tools" }]}
      />

      <header className="mt-8 max-w-2xl border-b border-border pb-10">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">Platform</p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-balance">
          Random tools that scale
        </h1>
        <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
          Each tool uses the same page template, routing, and SEO primitives — ship new generators by
          registering one row and a small UI module.
        </p>
      </header>

      <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SAAS_TOOLS.map((tool) => {
          const Icon = tool.icon
          return (
            <li key={tool.slug}>
              <Link
                href={`/tools/${tool.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/35 hover:shadow-md"
              >
                <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <h2 className="text-lg font-semibold tracking-tight group-hover:text-primary transition-colors">
                  {tool.name}
                </h2>
                <p className="mt-2 flex-1 text-sm text-muted-foreground leading-relaxed line-clamp-3">
                  {tool.tagline}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                  Open tool
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
