import { getCategoryById, getToolsByCategory } from "@/lib/registry"
import { generateMetadata as generateSEOMetadata } from "@/lib/seo"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

interface PageProps {
  params: {
    category: string
  }
}

export async function generateStaticParams() {
  const { categories } = await import("@/lib/registry")
  return categories.map(cat => ({
    category: cat.id
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const category = getCategoryById(params.category as any)
  
  if (!category) {
    return {
      title: "Category Not Found",
      description: "The requested category could not be found."
    }
  }
  
  return generateSEOMetadata({
    title: `${category.name} Generators | BestRandom`,
    description: category.description,
    path: `/${category.id}`,
  })
}

export default function CategoryPage({ params }: PageProps) {
  const category = getCategoryById(params.category as any)
  
  if (!category) {
    notFound()
  }
  
  const tools = getToolsByCategory(category.id)
  const Icon = category.icon

  return (
    <div className="container py-12 max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Icon className="h-8 w-8" />
          <h1 className="text-3xl font-bold">{category.name}</h1>
        </div>
        <p className="text-muted-foreground text-lg">{category.description}</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map(tool => {
          const ToolIcon = tool.icon || category.icon
          return (
            <Link
              key={tool.slug}
              href={`/${tool.category}/${tool.slug}`}
              className="border rounded-lg p-6 hover:border-primary transition-colors"
            >
              <div className="flex items-start gap-4">
                <ToolIcon className="h-6 w-6 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <h2 className="font-semibold text-lg mb-2">{tool.name}</h2>
                  <p className="text-sm text-muted-foreground">{tool.shortDescription}</p>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {tools.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No tools in this category yet.
        </div>
      )}
    </div>
  )
}
