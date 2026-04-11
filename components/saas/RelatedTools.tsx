import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { getSaasTool, SAAS_TOOLS } from "@/lib/saas-tools"
import type { SaasToolDefinition } from "@/lib/saas-tools"

interface RelatedToolsProps {
  current: SaasToolDefinition
}

export function RelatedTools({ current }: RelatedToolsProps) {
  const related: SaasToolDefinition[] = current.relatedSlugs
    .map((s) => getSaasTool(s))
    .filter((t): t is SaasToolDefinition => Boolean(t))

  if (related.length === 0) return null

  return (
    <section className="mt-14 pt-10 border-t border-border/80" aria-labelledby="related-tools-heading">
      <h2 id="related-tools-heading" className="text-lg font-semibold tracking-tight mb-4">
        More tools
      </h2>
      <ul className="grid gap-3 sm:grid-cols-2">
        {related.map((tool) => {
          const Icon = tool.icon
          return (
            <li key={tool.slug}>
              <Link
                href={`/tools/${tool.slug}`}
                className="group flex items-start gap-3 rounded-xl border border-border bg-card/50 p-4 transition-all hover:border-primary/40 hover:bg-primary/5 hover:shadow-sm"
              >
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1 font-medium leading-snug group-hover:text-primary transition-colors">
                    {tool.name}
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                  </span>
                  <span className="mt-0.5 block text-sm text-muted-foreground line-clamp-2">
                    {tool.tagline}
                  </span>
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
      <p className="mt-6 text-center">
        <Link
          href="/tools"
          className="text-sm font-medium text-primary hover:underline underline-offset-4"
        >
          Browse all {SAAS_TOOLS.length} tools in the directory
        </Link>
      </p>
    </section>
  )
}
