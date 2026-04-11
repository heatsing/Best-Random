"use client"

import Link from "next/link"
import Image from "next/image"
import { SearchOpenButton, OPEN_COMMAND_PALETTE_EVENT } from "./SearchCommand"
import { ThemeToggle } from "./ThemeToggle"
import { Button } from "@/components/ui/button"
import { Menu, Search } from "lucide-react"
import { useState } from "react"
import { categories } from "@/lib/registry"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

function navLinkClass(active: boolean) {
  return cn(
    "rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border",
    active
      ? "border-primary/35 bg-primary/10 text-primary"
      : "border-transparent text-muted-foreground hover:border-border hover:bg-muted/60 hover:text-foreground"
  )
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/65">
      <div className="container flex h-[3.75rem] max-w-[1400px] items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="group flex items-center gap-2.5 border-l-[3px] border-primary pl-3 -ml-0.5 sm:pl-3.5"
        >
          <Image
            src="/logo-v2.svg"
            alt="BestRandom"
            width={32}
            height={32}
            className="opacity-95 transition-opacity group-hover:opacity-100"
            priority
          />
          <span className="text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
            BestRandom
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
          {categories.map((category) => {
            const isActive = pathname?.startsWith(`/${category.id}`)
            return (
              <Link key={category.id} href={`/${category.id}`} className={navLinkClass(!!isActive)}>
                {category.name}
              </Link>
            )
          })}
          <Link
            href="/generators"
            data-touch-target="comfortable"
            className={navLinkClass(pathname === "/generators")}
          >
            Generators
          </Link>
          <Link
            href="/tools"
            data-touch-target="comfortable"
            className={navLinkClass(pathname === "/tools" || !!pathname?.startsWith("/tools/"))}
          >
            Tools
          </Link>
          <Link href="/about" className={navLinkClass(pathname === "/about")}>
            About
          </Link>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden md:block w-56 min-w-0 lg:w-64">
            <SearchOpenButton className="w-full border-border/80 bg-muted/30 hover:bg-muted/50" />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden rounded-lg border border-transparent hover:border-border hover:bg-muted/50"
            aria-label="Search tools"
            type="button"
            onClick={() => {
              if (typeof window !== "undefined") {
                window.dispatchEvent(new CustomEvent(OPEN_COMMAND_PALETTE_EVENT))
              }
            }}
          >
            <Search className="h-5 w-5" aria-hidden />
          </Button>
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden rounded-lg border border-transparent hover:border-border hover:bg-muted/50"
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
        <div id="mobile-menu" className="lg:hidden border-t border-border bg-background/95 backdrop-blur-md">
          <div className="container max-w-[1400px] space-y-4 px-4 py-5 sm:px-6">
            <SearchOpenButton className="w-full border-border/80 bg-muted/30" onOpen={() => setMobileMenuOpen(false)} />
            <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
              {categories.map((category) => {
                const isActive = pathname?.startsWith(`/${category.id}`)
                return (
                  <Link
                    key={category.id}
                    href={`/${category.id}`}
                    className={navLinkClass(!!isActive)}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                )
              })}
              <Link
                href="/generators"
                className={navLinkClass(pathname === "/generators")}
                onClick={() => setMobileMenuOpen(false)}
              >
                Generators
              </Link>
              <Link
                href="/tools"
                className={navLinkClass(pathname === "/tools" || !!pathname?.startsWith("/tools/"))}
                onClick={() => setMobileMenuOpen(false)}
              >
                Tools
              </Link>
              <Link
                href="/about"
                className={navLinkClass(pathname === "/about")}
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
