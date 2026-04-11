"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import type { CategoryId } from "@/lib/category-catalog"
import { categories, homeCategoryColumns } from "@/lib/category-catalog"

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")

export interface HomeToolRow {
  slug: string
  category: CategoryId
  name: string
}

function firstLetter(name: string): string {
  const c = name.trim().charAt(0).toUpperCase()
  if (/[A-Z]/.test(c)) return c
  return "#"
}

interface HomeDirectoryProps {
  tools: HomeToolRow[]
}

export function HomeDirectory({ tools }: HomeDirectoryProps) {
  const [letter, setLetter] = useState<string | null>(null)

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
        className="rounded-xl border border-border/70 bg-muted/35 px-4 py-6 md:px-8 md:py-7 shadow-sm"
        aria-labelledby="az-nav-title"
      >
        <h2
          id="az-nav-title"
          className="text-center text-base md:text-lg font-bold text-foreground mb-5 tracking-tight"
        >
          Find a tool
        </h2>
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
            const hasAny = tools.some((t) => firstLetter(t.name) === L)
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
          {tools.some((t) => firstLetter(t.name) === "#") && (
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
              ? "Showing tools that do not start with A–Z."
              : `Showing tools starting with “${letter}”.`}{" "}
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
          className="text-center text-xl md:text-2xl font-bold tracking-tight mb-10 md:mb-12 text-balance"
        >
          Browse our popular categories
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-10 lg:gap-14">
          {homeCategoryColumns.map((colIds, colIdx) => (
            <div key={colIdx} className="space-y-10 min-w-0">
              {colIds.map((catId) => {
                const category = categoryById.get(catId)
                if (!category) return null
                const Icon = category.icon
                const list = toolsByCategory.get(category.id) ?? []
                if (list.length === 0) return null

                return (
                  <div key={category.id}>
                    <Link
                      href={`/${category.id}`}
                      className="group inline-flex items-center gap-2 border-b-2 border-foreground/75 pb-1.5 mb-3 w-full sm:w-auto"
                    >
                      <Icon className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                      <span className="font-bold text-[15px] md:text-base text-foreground tracking-tight group-hover:text-primary transition-colors">
                        {category.name}
                      </span>
                    </Link>
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
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
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
