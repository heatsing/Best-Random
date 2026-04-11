import { getCategoryById, getToolsByCategory } from "@/lib/registry"
import { generateMetadata as generateSEOMetadata } from "@/lib/seo"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getCategorySeriesContent } from "@/lib/category-series-content"
import { CategorySeriesSections } from "@/components/category-series/CategorySeriesSections"

export const dynamic = "force-static"
export const dynamicParams = false
export const revalidate = 86400

interface PageProps {
  params: {
    category: string
  }
}

export async function generateStaticParams() {
  const { categories } = await import("@/lib/registry")
  return categories.map((cat) => ({
    category: cat.id,
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const category = getCategoryById(params.category as any)

  if (!category) {
    return {
      title: "Category Not Found",
      description: "The requested category could not be found.",
    }
  }

  const categoryTitle =
    category.id === "numbers" ? "Random Number Generators" : `${category.name} Generators`

  return generateSEOMetadata({
    title: categoryTitle,
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
  const series = getCategorySeriesContent(category.id)

  return (
    <div className="container py-12 max-w-4xl mx-auto px-4 sm:px-6">
      <header className="mb-10 md:mb-12">
        <p className="text-sm font-medium uppercase tracking-widest text-primary mb-3">Series</p>
        <div className="flex items-center gap-3 mb-4">
          <Icon className="h-9 w-9 md:h-10 md:w-10 shrink-0" aria-hidden />
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{category.name}</h1>
        </div>
        <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">{category.description}</p>
      </header>

      <section aria-labelledby="tools-grid-heading" className="mb-2">
        <h2 id="tools-grid-heading" className="sr-only">
          Tools in the {category.name} series
        </h2>
        <p className="text-sm font-semibold text-foreground mb-4" aria-hidden>
          Tools
        </p>
        <div className="grid md:grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-5">
          {tools.map((tool) => {
            const ToolIcon = tool.icon || category.icon
            return (
              <Link
                key={tool.slug}
                href={`/${tool.category}/${tool.slug}`}
                className="group border-2 border-border rounded-xl p-5 hover:border-primary/50 transition-colors bg-card/40 hover:bg-card"
              >
                <div className="flex items-start gap-4">
                  <ToolIcon className="h-6 w-6 mt-0.5 flex-shrink-0 text-primary" aria-hidden />
                  <div className="flex-1 min-w-0">
                    <span className="font-semibold text-base leading-snug group-hover:text-primary transition-colors">
                      {tool.name}
                    </span>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed line-clamp-3">
                      {tool.shortDescription}
                    </p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {tools.length === 0 && (
          <div className="text-center py-12 text-muted-foreground border border-dashed rounded-xl">
            No tools in this category yet.
          </div>
        )}
      </section>

      <CategorySeriesSections categoryName={category.name} content={series} tools={tools} />
    </div>
  )
}
