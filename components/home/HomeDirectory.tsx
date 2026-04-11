"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { LayoutGrid } from "lucide-react"
import type { CategoryId } from "@/lib/category-catalog"
import { categories, homeCategoryColumns } from "@/lib/category-catalog"

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")

export interface HomeToolRow {
  slug: string
  category: CategoryId
  name: string
}

/** /tools/* lightweight demos — paths differ from /{category}/{slug} */
export interface HomeSaasToolRow {
  slug: string
  name: string
}

function firstLetter(name: string): string {
  const c = name.trim().charAt(0).toUpperCase()
  if (/[A-Z]/.test(c)) return c
  return "#"
}

interface HomeDirectoryProps {
  tools: HomeToolRow[]
  saasTools: HomeSaasToolRow[]
}

export function HomeDirectory({ tools, saasTools }: HomeDirectoryProps) {
  const [letter, setLetter] = useState<string | null>(null)

  /** A–Z only indexes main-catalog generator names (/{category}/{slug}), not /tools demos. */
  const mainToolNames = useMemo(() => tools.map((t) => t.name), [tools])

  const filtered = useMemo(() => {
    if (!letter) return tools
    if (letter === "#") return tools.filter((t) => firstLetter(t.name) === "#")
    return tools.filter((t) => firstLetter(t.name) === letter)
  }, [tools, letter])

  const toolsByCategory = useMemo(() => {
    const map = new Map<string, HomeToolRow[]>()
    for (const t of filtered) {
      const list = map.get(t.category) ?? []
      list.push(t)
      map.set(t.category, list)
    }
    for (const list of map.values()) {
      list.sort((a, b) => a.name.localeCompare(b.name))
    }
    return map
  }, [filtered])

  const categoryById = useMemo(() => {
    const m = new Map<CategoryId, (typeof categories)[0]>()
    for (const c of categories) m.set(c.id, c)
    return m
  }, [])

  return (
    <div className="space-y-12 md:space-y-16">
      {/* A–Z index — light panel, directory style */}
      <section
        className="structure-card rounded-xl px-4 py-6 md:px-8 md:py-8"
        aria-labelledby="az-nav-title"
      >
        <h2
          id="az-nav-title"
          className="mb-2 text-center text-base font-bold tracking-tight text-foreground md:text-lg"
        >
          Find a tool
        </h2>
        <p className="mx-auto mb-6 max-w-md text-center text-xs leading-relaxed text-muted-foreground">
          Letters match each generator in the categories below—not the separate Tools hub list.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-0.5 sm:gap-x-1">
          <button
            type="button"
            onClick={() => setLetter(null)}
            className={`px-2.5 py-1 text-sm rounded-md transition-colors ${
              letter === null
                ? "bg-primary/15 text-primary font-semibold"
                : "text-muted-foreground hover:text-foreground hover:bg-background/80"
            }`}
          >
            All
          </button>
          <span className="text-border px-1 select-none hidden sm:inline" aria-hidden>
            ·
          </span>
          {LETTERS.map((L) => {
            const hasAny = mainToolNames.some((name) => firstLetter(name) === L)
            const active = letter === L
            return (
              <button
                key={L}
                type="button"
                disabled={!hasAny}
                onClick={() => setLetter(L)}
                className={`min-w-[1.65rem] px-1 py-1 text-sm rounded-md transition-colors ${
                  !hasAny
                    ? "text-muted-foreground/30 cursor-not-allowed"
                    : active
                      ? "bg-primary/15 text-primary font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-background/80"
                }`}
                aria-pressed={active}
                aria-label={`Filter by ${L}`}
              >
                {L}
              </button>
            )
          })}
          {mainToolNames.some((name) => firstLetter(name) === "#") && (
            <button
              type="button"
              onClick={() => setLetter("#")}
              className={`px-2 py-1 text-sm rounded-md transition-colors ${
                letter === "#"
                  ? "bg-primary/15 text-primary font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/80"
              }`}
            >
              #
            </button>
          )}
        </div>
        {letter && (
          <p className="text-center text-sm text-muted-foreground mt-4">
            {letter === "#"
              ? "Showing main generators that do not start with A–Z."
              : `Showing main generators starting with “${letter}”.`}{" "}
            <button
              type="button"
              className="underline underline-offset-4 hover:text-foreground"
              onClick={() => setLetter(null)}
            >
              Clear
            </button>
          </p>
        )}
      </section>

      {/* Browse by category — 3 columns */}
      <section aria-labelledby="categories-heading">
        <h2
          id="categories-heading"
          className="mb-3 text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground"
        >
          Series
        </h2>
        <p className="mb-10 text-center text-2xl font-bold tracking-tight text-balance text-foreground md:mb-12 md:text-3xl">
          Browse all generators
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-10 lg:gap-14">
          {homeCategoryColumns.map((colIds, colIdx) => (
            <div key={colIdx} className="space-y-10 min-w-0">
              {colIds.map((catId) => {
                const category = categoryById.get(catId)
                if (!category) return null
                const Icon = category.icon
                const list = toolsByCategory.get(category.id) ?? []

                return (
                  <div
                    key={category.id}
                    className="rounded-xl border border-border bg-card/50 p-4 shadow-sm transition-colors hover:border-primary/25 hover:bg-card"
                  >
                    <Link
                      href={`/${category.id}`}
                      className="group mb-3 inline-flex w-full items-center gap-2 border-b border-border pb-2 sm:w-auto"
                    >
                      <Icon className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                      <span className="text-[15px] font-bold tracking-tight text-foreground transition-colors group-hover:text-primary md:text-base">
                        {category.name}
                      </span>
                    </Link>
                    {list.length > 0 ? (
                      <ul className="space-y-0">
                        {list.map((tool) => (
                          <li key={`${tool.category}-${tool.slug}`}>
                            <Link
                              href={`/${tool.category}/${tool.slug}`}
                              className="group flex items-start gap-2.5 py-2 text-[13px] md:text-sm leading-snug text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <Icon
                                className="h-4 w-4 mt-0.5 shrink-0 opacity-80 group-hover:opacity-100 text-primary"
                                aria-hidden
                              />
                              <span className="group-hover:underline underline-offset-4 decoration-border">
                                {tool.name}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : letter ? (
                      <p className="text-xs text-muted-foreground py-2 pl-0.5">No tools match this letter.</p>
                    ) : null}
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        {/* /tools 系列 — 与主站分类并列 */}
        <div className="mt-14 border-t border-border pt-12 md:mt-16">
          <div className="max-w-xl rounded-xl border border-dashed border-border bg-muted/20 p-6">
            <Link href="/tools" className="group mb-3 inline-flex items-center gap-2 border-b border-border pb-2">
              <LayoutGrid className="h-4 w-4 shrink-0 text-primary" aria-hidden />
              <span className="font-bold text-[15px] md:text-base text-foreground tracking-tight group-hover:text-primary transition-colors">
                Tools
              </span>
            </Link>
            <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
              Modular demos on <span className="font-mono">/tools/…</span>. Not filtered by the letter bar above.
            </p>
            {saasTools.length > 0 ? (
              <ul className="space-y-0">
                {saasTools.map((tool) => (
                  <li key={`saas-${tool.slug}`}>
                    <Link
                      href={`/tools/${tool.slug}`}
                      className="group flex items-start gap-2.5 py-2 text-[13px] md:text-sm leading-snug text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <LayoutGrid
                        className="h-4 w-4 mt-0.5 shrink-0 opacity-80 group-hover:opacity-100 text-primary"
                        aria-hidden
                      />
                      <span className="group-hover:underline underline-offset-4 decoration-border">{tool.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>

        {filtered.length === 0 && letter && (
          <p className="text-center text-muted-foreground py-10 text-sm">
            No tools match this filter.{" "}
            <button type="button" className="underline underline-offset-4" onClick={() => setLetter(null)}>
              Show all
            </button>
          </p>
        )}
      </section>
    </div>
  )
}
