import Link from "next/link"
import Image from "next/image"
import { tools, getPopularTools } from "@/lib/registry"

export function Footer() {
  const popularTools = getPopularTools()
  const mainTools = popularTools.slice(0, 4)
  const moreTools = tools.filter(t => !t.popular).slice(0, 8)

  return (
    <footer className="border-t-2 border-border bg-background">
      <div className="container max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-b-2 border-border pb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Image src="/logo-v2.svg" alt="BestRandom" width={28} height={28} />
              <h3 className="font-bold text-lg tracking-tight">BestRandom</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Fast random generation that FEELS random, with deterministic repeatability via seed, shareable URLs, and polished micro-interactions.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 tracking-tight border-b border-border pb-2">Generators</h4>
            <ul className="space-y-2 text-sm">
              {mainTools.map((tool) => (
                <li key={tool.slug}>
                  <Link href={`/${tool.category}/${tool.slug}`} className="text-muted-foreground hover:text-primary transition-colors">
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 tracking-tight border-b border-border pb-2">More</h4>
            <ul className="space-y-2 text-sm">
              {moreTools.map((tool) => (
                <li key={tool.slug}>
                  <Link href={`/${tool.category}/${tool.slug}`} className="text-muted-foreground hover:text-primary transition-colors">
                    {tool.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/generators" className="text-muted-foreground hover:text-primary transition-colors">
                  All Generators
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 tracking-tight border-b border-border pb-2">Info</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
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
