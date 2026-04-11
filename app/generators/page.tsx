import Link from "next/link"
import { generateMetadata } from "@/lib/seo"
import type { Metadata } from "next"
import { categories, getToolsByCategory, tools } from "@/lib/registry"

export const dynamic = "force-static"
export const revalidate = 86400

export const metadata: Metadata = generateMetadata({
  title: "All Generators — Full Directory of Random Tools",
  description:
    "Browse every BestRandom tool by category: numbers, text, selection, design, security, utilities, fun, and games. Free online random generators with seeds and share links.",
  path: "/generators",
  keywords: [
    "list of random generators",
    "all random tools",
    "free random generator directory",
    "online random utilities",
    "BestRandom tools",
  ],
})

const SITE = "https://bestrandom.net"

export default function GeneratorsPage() {
  const toolsByCategory = categories.map(cat => ({
    category: cat,
    tools: getToolsByCategory(cat.id)
  })).filter(group => group.tools.length > 0)

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "BestRandom — all generators",
    numberOfItems: tools.length,
    itemListElement: tools.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      url: `${SITE}/${t.category}/${t.slug}`,
    })),
  }

  return (
    <div className="container max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <div className="mb-10 max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">Directory</p>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">All generators</h1>
        <p className="text-muted-foreground leading-relaxed">
          Every tool in one place—organized by category. Use the header or{" "}
          <Link href="/" className="text-primary underline underline-offset-4 hover:no-underline">
            home directory
          </Link>{" "}
          for A–Z filtering, or try the{" "}
          <Link href="/tools" className="text-primary underline underline-offset-4 hover:no-underline">
            modular Tools hub
          </Link>
          .
        </p>
      </div>

      {toolsByCategory.map(({ category, tools }) => {
        const CategoryIcon = category.icon
        return (
          <div key={category.id} className="mb-14 last:mb-0">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <CategoryIcon className="h-6 w-6 text-primary shrink-0" aria-hidden />
              <h2 className="text-xl md:text-2xl font-semibold tracking-tight">
                <Link
                  href={`/${category.id}`}
                  className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                >
                  {category.name}
                </Link>
              </h2>
              <span className="text-sm text-muted-foreground">({tools.length})</span>
            </div>
            <p className="text-sm text-muted-foreground mb-5 max-w-3xl leading-relaxed">{category.description}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
              {tools.map((tool) => {
                const Icon = tool.icon || CategoryIcon
                return (
                  <Link
                    key={tool.slug}
                    href={`/${tool.category}/${tool.slug}`}
                    className="block p-5 border-2 border-border rounded-xl bg-card/40 hover:border-primary/50 hover:bg-card/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    aria-label={`Use ${tool.name} - ${tool.shortDescription}`}
                  >
                    {Icon && <Icon className="h-8 w-8 mb-3 text-primary" aria-hidden="true" />}
                    <h3 className="text-xl font-semibold mb-2">{tool.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{tool.shortDescription}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{category.name}</span>
                      <span className="text-xs text-primary">View →</span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
