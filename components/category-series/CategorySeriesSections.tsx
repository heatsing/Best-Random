import Link from "next/link"
import type { CategoryId, ToolConfig } from "@/lib/registry"
import type { CategorySeriesContent } from "@/lib/category-series-content"
import { getToolBySlug } from "@/lib/registry"
import { generateFAQSchema } from "@/lib/seo"

interface CategorySeriesSectionsProps {
  categoryName: string
  content: CategorySeriesContent
  tools: ToolConfig[]
}

function SeriesDivider() {
  return <hr className="my-14 md:my-16 border-border" aria-hidden />
}

export function CategorySeriesSections({
  categoryName,
  content,
  tools,
}: CategorySeriesSectionsProps) {
  const popularFirst = [...tools.filter((t) => t.popular), ...tools.filter((t) => !t.popular)].slice(
    0,
    6
  )

  const crossTools = (content.relatedCrossTools || [])
    .map((x) => {
      const t = getToolBySlug(x.slug)
      if (!t || t.category !== x.category) return null
      return { ...x, href: `/${x.category}/${x.slug}` }
    })
    .filter(Boolean) as Array<{
      slug: string
      category: CategoryId
      title: string
      blurb: string
      href: string
    }>

  const faqJsonLd = generateFAQSchema(content.faq)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <SeriesDivider />

      <section
        id="what-is"
        className="scroll-mt-24"
        aria-labelledby="what-is-heading"
      >
        <h2 id="what-is-heading" className="text-2xl font-bold tracking-tight mb-4">
          {content.whatIsHeading}
        </h2>
        <div className="space-y-4 text-muted-foreground leading-relaxed max-w-3xl">
          {content.whatIsParagraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </section>

      <SeriesDivider />

      <section id="use-cases" className="scroll-mt-24" aria-labelledby="use-cases-heading">
        <h2 id="use-cases-heading" className="text-2xl font-bold tracking-tight mb-4">
          {content.useCasesHeading}
        </h2>
        <ul className="list-disc pl-5 space-y-2 text-muted-foreground leading-relaxed max-w-3xl marker:text-primary">
          {content.useCases.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </section>

      <SeriesDivider />

      <section id="popular-tools" className="scroll-mt-24" aria-labelledby="popular-tools-heading">
        <h2 id="popular-tools-heading" className="text-2xl font-bold tracking-tight mb-2">
          Popular {categoryName} tools
        </h2>
        <p className="text-sm text-muted-foreground mb-6 max-w-2xl">
          High-intent picks visitors use most—strong internal signals for this series.
        </p>
        {popularFirst.length > 0 ? (
          <ul className="grid sm:grid-cols-2 gap-3">
            {popularFirst.map((tool) => (
              <li key={tool.slug}>
                <Link
                  href={`/${tool.category}/${tool.slug}`}
                  className="block rounded-xl border border-border bg-card/60 p-4 transition-colors hover:border-primary/40 hover:bg-primary/5"
                >
                  <span className="font-semibold text-foreground">{tool.name}</span>
                  <span className="mt-1 block text-sm text-muted-foreground line-clamp-2">
                    {tool.shortDescription}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground text-sm">No tools listed in this category yet.</p>
        )}
      </section>

      <SeriesDivider />

      <section id="related-tools" className="scroll-mt-24" aria-labelledby="related-tools-heading">
        <h2 id="related-tools-heading" className="text-2xl font-bold tracking-tight mb-2">
          Related tools &amp; series
        </h2>
        <p className="text-sm text-muted-foreground mb-6 max-w-2xl">
          Explore adjacent hubs and deep links to keep crawl paths rich without keyword stuffing.
        </p>

        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Other series
        </h3>
        <ul className="grid sm:grid-cols-2 gap-3 mb-8">
          {content.relatedSeries.map((s) => (
            <li key={s.id}>
              <Link
                href={`/${s.id}`}
                className="block rounded-xl border border-border p-4 transition-colors hover:border-primary/40 hover:bg-muted/40"
              >
                <span className="font-medium">{s.title}</span>
                <span className="mt-1 block text-sm text-muted-foreground">{s.blurb}</span>
              </Link>
            </li>
          ))}
        </ul>

        {crossTools.length > 0 && (
          <>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Featured picks elsewhere on BestRandom
            </h3>
            <ul className="grid sm:grid-cols-2 gap-3">
              {crossTools.map((x) => (
                <li key={`${x.category}-${x.slug}`}>
                  <Link
                    href={x.href}
                    className="block rounded-xl border border-dashed border-border p-4 transition-colors hover:border-primary/50 hover:bg-primary/5"
                  >
                    <span className="font-medium">{x.title}</span>
                    <span className="mt-1 block text-sm text-muted-foreground">{x.blurb}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      <SeriesDivider />

      <section id="faq" className="scroll-mt-24 pb-4" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="text-2xl font-bold tracking-tight mb-6">
          FAQ
        </h2>
        <dl className="space-y-6 max-w-3xl">
          {content.faq.map((item, i) => (
            <div key={i} className="border-b border-border/80 pb-6 last:border-0 last:pb-0">
              <dt className="font-semibold text-foreground">{item.question}</dt>
              <dd className="mt-2 text-muted-foreground leading-relaxed">{item.answer}</dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  )
}
