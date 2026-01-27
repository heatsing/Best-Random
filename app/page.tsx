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
    <div className="container py-12 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          BestRandom
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Fast random generation that FEELS random, with deterministic repeatability via seed, shareable URLs, and polished micro-interactions.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <Link
                key={category.id}
                href={`/${category.id}`}
                className="block p-6 border rounded-lg hover:border-primary transition-colors text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-label={`View ${category.name} tools`}
              >
                <Icon className="h-8 w-8 mx-auto mb-3 text-primary" aria-hidden="true" />
                <h3 className="font-semibold mb-1">{category.name}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">{category.description}</p>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Popular Tools */}
      {popularTools.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Popular Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularTools.map((tool) => {
              const Icon = tool.icon || categories.find(c => c.id === tool.category)?.icon
              return (
                <Link
                  key={tool.slug}
                  href={`/${tool.category}/${tool.slug}`}
                  className="block p-6 border rounded-lg hover:border-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  aria-label={`Use ${tool.name} - ${tool.shortDescription}`}
                >
                  {Icon && <Icon className="h-8 w-8 mb-3 text-primary" aria-hidden="true" />}
                  <h2 className="text-xl font-semibold mb-2">{tool.name}</h2>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{tool.shortDescription}</p>
                  <span className="text-xs text-muted-foreground">{tool.category}</span>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* All Tools */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">All Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => {
            const Icon = tool.icon || categories.find(c => c.id === tool.category)?.icon
            return (
              <Link
                key={tool.slug}
                href={`/${tool.category}/${tool.slug}`}
                className="block p-6 border rounded-lg hover:border-primary transition-colors"
              >
                {Icon && <Icon className="h-8 w-8 mb-3 text-primary" />}
                <h2 className="text-xl font-semibold mb-2">{tool.name}</h2>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{tool.shortDescription}</p>
                <span className="text-xs text-muted-foreground">{tool.category}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
