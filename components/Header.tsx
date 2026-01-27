"use client"

import Link from "next/link"
import { SearchCommand } from "./SearchCommand"
import { Button } from "@/components/ui/button"
import { Menu, ChevronDown } from "lucide-react"
import { useState } from "react"
import { categories } from "@/lib/registry"
import { usePathname } from "next/navigation"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold">BestRandom</span>
        </Link>

        <nav className="hidden lg:flex items-center space-x-1" aria-label="Main navigation">
          {categories.map((category) => {
            const isActive = pathname?.startsWith(`/${category.id}`)
            const Icon = category.icon
            return (
              <Link
                key={category.id}
                href={`/${category.id}`}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                <span>{category.name}</span>
              </Link>
            )
          })}
          <Link
            href="/about"
            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
              pathname === "/about"
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            }`}
          >
            About
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden md:block w-64">
            <SearchCommand />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div id="mobile-menu" className="lg:hidden border-t">
          <div className="container py-4 space-y-4">
            <SearchCommand />
            <nav className="flex flex-col space-y-1" aria-label="Mobile navigation">
              {categories.map((category) => {
                const isActive = pathname?.startsWith(`/${category.id}`)
                const Icon = category.icon
                return (
                  <Link
                    key={category.id}
                    href={`/${category.id}`}
                    className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    <span>{category.name}</span>
                  </Link>
                )
              })}
              <Link
                href="/about"
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                  pathname === "/about"
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
