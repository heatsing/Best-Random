import Link from "next/link"
import { categories } from "@/lib/category-catalog"

const EXTRA_LINKS = [
  { href: "/generators", label: "All generators" },
  { href: "/tools", label: "Tools hub" },
] as const

export function FooterTags() {
  return (
    <div className="border-t border-border bg-muted/15">
      <div className="container max-w-[1400px] mx-auto px-4 sm:px-6 py-8">
        <nav aria-labelledby="footer-tags-heading">
          <h2
            id="footer-tags-heading"
            className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground sm:text-left"
          >
            Browse by tag
          </h2>
          <ul className="flex flex-wrap justify-center gap-2 sm:justify-start">
            {categories.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/${c.id}`}
                  className="inline-flex items-center rounded-full border border-border bg-background/90 px-3.5 py-1.5 text-sm text-muted-foreground shadow-sm transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                >
                  {c.name}
                </Link>
              </li>
            ))}
            {EXTRA_LINKS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex items-center rounded-full border border-dashed border-border bg-background/90 px-3.5 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary/45 hover:bg-primary/5 hover:text-primary"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  )
}
