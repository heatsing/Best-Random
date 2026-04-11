import Link from "next/link"
import Image from "next/image"
import { tools, getPopularTools } from "@/lib/registry"

export function Footer() {
  const popularTools = getPopularTools()
  const mainTools = popularTools.slice(0, 4)
  const moreTools = tools.filter((t) => !t.popular).slice(0, 8)

  return (
    <footer className="border-t border-border bg-muted/25">
      <div className="container max-w-[1400px] mx-auto px-4 sm:px-6 py-14 md:py-16">
        <div className="grid grid-cols-1 gap-12 border-b border-border/80 pb-12 md:grid-cols-4 md:gap-10">
          <div className="md:col-span-1">
            <div className="mb-4 flex items-center gap-2.5">
              <Image src="/logo-v2.svg" alt="BestRandom" width={28} height={28} />
              <h3 className="text-lg font-bold tracking-tight">BestRandom</h3>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Fast random generation that feels random—seeds, share links, and crisp UI. Built for
              classrooms, streams, and shipping mock data.
            </p>
          </div>
          <div>
            <h4 className="mb-4 border-b border-border pb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Generators
            </h4>
            <ul className="space-y-2.5 text-sm">
              {mainTools.map((tool) => (
                <li key={tool.slug}>
                  <Link
                    href={`/${tool.category}/${tool.slug}`}
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-4 border-b border-border pb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              More
            </h4>
            <ul className="space-y-2.5 text-sm">
              {moreTools.map((tool) => (
                <li key={tool.slug}>
                  <Link
                    href={`/${tool.category}/${tool.slug}`}
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    {tool.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/generators" className="text-muted-foreground transition-colors hover:text-primary">
                  All generators
                </Link>
              </li>
              <li>
                <Link href="/tools" className="text-muted-foreground transition-colors hover:text-primary">
                  Tools directory
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 border-b border-border pb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Info
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground transition-colors hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground transition-colors hover:text-primary">
                  About
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground transition-colors hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground transition-colors hover:text-primary">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} BestRandom. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
