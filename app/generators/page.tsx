import Link from "next/link"
import { generateMetadata } from "@/lib/seo"
import type { Metadata } from "next"
import { TOOL_REGISTRY, getToolsByCategory } from "@/lib/tool-registry"

export const metadata: Metadata = generateMetadata({
  title: "All Generators – BestRandom",
  description: "Browse all available random generator tools including numbers, names, words, colors, passwords, animals, and more.",
  path: "/generators",
})

export default function GeneratorsPage() {
  const toolsByCategory = getToolsByCategory()

  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">All Generators</h1>
        <p className="text-muted-foreground">
          Browse all available random generator tools
        </p>
      </div>

      {Object.entries(toolsByCategory).map(([category, tools]) => (
        <div key={category} className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">{category}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => {
              const Icon = tool.icon
              return (
                <Link
                  key={tool.slug}
                  href={`/${tool.slug}`}
                  className="block p-6 border rounded-lg hover:border-primary transition-colors"
                >
                  <Icon className="h-8 w-8 mb-3 text-primary" />
                  <h3 className="text-xl font-semibold mb-2">{tool.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{tool.intro}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{tool.category}</span>
                    <span className="text-xs text-primary">View →</span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
