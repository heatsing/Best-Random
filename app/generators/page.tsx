import Link from "next/link"
import { generateMetadata } from "@/lib/seo"
import type { Metadata } from "next"
import { categories, getToolsByCategory } from "@/lib/registry"

export const metadata: Metadata = generateMetadata({
  title: "All Generators – BestRandom",
  description: "Browse all available random generator tools including numbers, names, words, colors, passwords, animals, and more.",
  path: "/generators",
})

export default function GeneratorsPage() {
  const toolsByCategory = categories.map(cat => ({
    category: cat,
    tools: getToolsByCategory(cat.id)
  })).filter(group => group.tools.length > 0)

  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">All Generators</h1>
        <p className="text-muted-foreground">
          Browse all available random generator tools
        </p>
      </div>

      {toolsByCategory.map(({ category, tools }) => {
        const CategoryIcon = category.icon
        return (
          <div key={category.id} className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <CategoryIcon className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold">{category.name}</h2>
              <span className="text-sm text-muted-foreground">({tools.length})</span>
            </div>
            <p className="text-muted-foreground mb-4">{category.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools.map((tool) => {
                const Icon = tool.icon || CategoryIcon
                return (
                  <Link
                    key={tool.slug}
                    href={`/${tool.category}/${tool.slug}`}
                    className="block p-6 border rounded-lg hover:border-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
