import Link from "next/link"
import Image from "next/image"
import { generateMetadata } from "@/lib/seo"
import type { Metadata } from "next"
import { tools, categories } from "@/lib/registry"
import { SAAS_TOOLS } from "@/lib/saas-tools"
import { HomeDirectory } from "@/components/home/HomeDirectory"
import { Sparkles } from "lucide-react"

export const dynamic = "force-static"
export const revalidate = 86400

export const metadata: Metadata = generateMetadata({
  title: "The Best Random Tools & Generators Website Online",
  description:
    "Generate truly random numbers, names, words, colors, passwords, and more. All tools support seeds for repeatability and shareable links.",
  path: "/",
})

export default function HomePage() {
  const directoryTools = tools.map((t) => ({
    slug: t.slug,
    category: t.category,
    name: t.name,
  }))

  const saasTools = SAAS_TOOLS.map((t) => ({ slug: t.slug, name: t.name }))
  const toolCount = tools.length
  const seriesCount = categories.length

  return (
    <div className="min-h-screen">
      <section className="relative border-b border-border bg-gradient-to-b from-muted/40 to-background">
        <div className="container max-w-[1400px] mx-auto px-4 sm:px-6 py-12 md:py-16">
          <div className="grid gap-10 lg:grid-cols-[1fr_minmax(260px,320px)] lg:items-center lg:gap-14">
            <div className="text-center lg:text-left">
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-1 text-xs font-medium uppercase tracking-wider text-muted-foreground shadow-sm">
                <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden />
                Free · Seeds · Share links
              </p>
              <Link href="/" className="group inline-flex flex-col items-center gap-4 lg:items-start">
                <Image
                  src="/logo-v2.svg"
                  alt="BestRandom"
                  width={56}
                  height={56}
                  className="opacity-95 transition-opacity group-hover:opacity-100"
                  priority
                />
                <span className="sr-only">BestRandom home</span>
              </Link>
              <h1 className="mt-6 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                Random generators,{" "}
                <span className="text-primary">structured</span> for speed
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground lg:mx-0">
                Main tools live at{" "}
                <span className="font-mono text-foreground/90">/category/tool-name</span>; the{" "}
                <span className="font-mono text-foreground/90">/tools</span> hub lists modular demos
                below.
              </p>
              <p className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm lg:justify-start">
                <Link
                  href="/tools"
                  className="rounded-lg border border-border bg-background px-4 py-2 font-medium text-foreground shadow-sm transition-colors hover:border-primary/40 hover:bg-primary/5"
                >
                  Tools hub
                </Link>
                <Link
                  href="/generators"
                  className="rounded-lg border border-transparent px-4 py-2 font-medium text-primary underline-offset-4 transition-colors hover:underline"
                >
                  Full directory
                </Link>
              </p>
            </div>

            <aside className="structure-card mx-auto w-full max-w-sm lg:mx-0 lg:max-w-none">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Catalog
              </p>
              <p className="mt-2 font-mono text-4xl font-bold tabular-nums text-primary md:text-5xl">
                {toolCount}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">tools in the main generator index</p>
              <div className="mt-6 grid grid-cols-2 gap-3 border-t border-border pt-6 text-center">
                <div className="rounded-lg border border-border/80 bg-muted/30 px-3 py-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Hub</p>
                  <p className="mt-1 font-mono text-sm font-semibold text-foreground">{saasTools.length}</p>
                  <p className="text-[11px] text-muted-foreground">/tools demos</p>
                </div>
                <div className="rounded-lg border border-border/80 bg-muted/30 px-3 py-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Series</p>
                  <p className="mt-1 font-mono text-sm font-semibold text-foreground">{seriesCount}</p>
                  <p className="text-[11px] text-muted-foreground">categories</p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="container max-w-[1400px] mx-auto px-4 sm:px-6 py-12 md:py-16">
        <HomeDirectory tools={directoryTools} saasTools={saasTools} />
      </section>
    </div>
  )
}
