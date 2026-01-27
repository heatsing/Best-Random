import Link from "next/link"
import { Button } from "@/components/ui/button"
import { generateMetadata } from "@/lib/seo"
import type { Metadata } from "next"
import { categories, getPopularTools, tools } from "@/lib/registry"

export const metadata: Metadata = generateMetadata({
  title: "BestRandom – Fast, Seeded & Shareable Random Generators",
  description: "Generate truly random numbers, names, words, colors, passwords, and more. All tools support seeds for repeatability and shareable links.",
  path: "/",
})

export default function HomePage() {
  // Note: This is a server component, search will be handled client-side if needed
  const popularTools = getPopularTools()

  return (
    <div className="min-h-screen">
      {/* Hero Section with Structural Lines */}
      <section className="border-b-2 border-border">
        <div className="container max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
              BestRandom
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Fast random generation that FEELS random, with deterministic repeatability via seed, shareable URLs, and polished micro-interactions.
            </p>
          </div>
        </div>
      </section>

      {/* Categories Bento Grid */}
      <section className="border-b-2 border-border">
        <div className="container max-w-7xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-semibold mb-8 tracking-tight">Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <Link
                  key={category.id}
                  href={`/${category.id}`}
                  className="structure-card group text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  aria-label={`View ${category.name} tools`}
                >
                  <Icon className="h-8 w-8 mx-auto mb-4 text-primary group-hover:scale-110 transition-transform" aria-hidden="true" />
                  <h3 className="font-semibold mb-2 text-base">{category.name}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{category.description}</p>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Popular Tools Bento Grid */}
      {popularTools.length > 0 && (
        <section className="border-b-2 border-border">
          <div className="container max-w-7xl mx-auto px-6 py-16">
            <h2 className="text-2xl font-semibold mb-8 tracking-tight">Popular Tools</h2>
            <div className="bento-grid">
              {popularTools.map((tool) => {
                const Icon = tool.icon || categories.find(c => c.id === tool.category)?.icon
                return (
                  <Link
                    key={tool.slug}
                    href={`/${tool.category}/${tool.slug}`}
                    className="structure-card group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    aria-label={`Use ${tool.name} - ${tool.shortDescription}`}
                  >
                    {Icon && <Icon className="h-8 w-8 mb-4 text-primary group-hover:scale-110 transition-transform" aria-hidden="true" />}
                    <h2 className="text-lg font-semibold mb-2 tracking-tight">{tool.name}</h2>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">{tool.shortDescription}</p>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">{tool.category}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* All Tools Grid */}
      <section>
        <div className="container max-w-7xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-semibold mb-8 tracking-tight">All Tools</h2>
          <div className="bento-grid">
            {tools.map((tool) => {
              const Icon = tool.icon || categories.find(c => c.id === tool.category)?.icon
              return (
                <Link
                  key={tool.slug}
                  href={`/${tool.category}/${tool.slug}`}
                  className="structure-card group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {Icon && <Icon className="h-8 w-8 mb-4 text-primary group-hover:scale-110 transition-transform" aria-hidden="true" />}
                  <h2 className="text-lg font-semibold mb-2 tracking-tight">{tool.name}</h2>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">{tool.shortDescription}</p>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">{tool.category}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
