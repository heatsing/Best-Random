import Link from "next/link"
import { tools, getPopularTools } from "@/lib/registry"

export function Footer() {
  const popularTools = getPopularTools()
  const mainTools = popularTools.slice(0, 4)
  const moreTools = tools.filter(t => !t.popular).slice(0, 8)

  return (
    <footer className="border-t bg-background">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">BestRandom</h3>
            <p className="text-sm text-muted-foreground">
              Fast random generation that FEELS random, with deterministic repeatability via seed, shareable URLs, and polished micro-interactions.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Generators</h4>
            <ul className="space-y-2 text-sm">
              {mainTools.map((tool) => (
                <li key={tool.slug}>
                  <Link href={`/${tool.category}/${tool.slug}`} className="text-muted-foreground hover:text-primary">
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">More</h4>
            <ul className="space-y-2 text-sm">
              {moreTools.map((tool) => (
                <li key={tool.slug}>
                  <Link href={`/${tool.category}/${tool.slug}`} className="text-muted-foreground hover:text-primary">
                    {tool.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/generators" className="text-muted-foreground hover:text-primary">
                  All Generators
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Info</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary">
                  About
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} BestRandom. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
