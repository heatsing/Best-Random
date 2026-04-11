import Link from "next/link"
import Image from "next/image"
import { generateMetadata } from "@/lib/seo"
import type { Metadata } from "next"
import { tools } from "@/lib/registry"
import { HomeDirectory } from "@/components/home/HomeDirectory"

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

  return (
    <div className="min-h-screen bg-background">
      {/* Minimal hero — directory-first */}
      <section className="border-b border-border/80">
        <div className="container max-w-5xl mx-auto px-4 sm:px-6 py-10 md:py-12 text-center">
          <Link href="/" className="inline-flex flex-col items-center gap-3 group">
            <Image
              src="/logo-v2.svg"
              alt="BestRandom"
              width={48}
              height={48}
              className="opacity-90 group-hover:opacity-100 transition-opacity"
              priority
            />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                BestRandom
              </h1>
              <p className="mt-2 text-sm md:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
                Free random generators with seeds, share links, and a clean directory—pick a letter or browse by
                category.
              </p>
            </div>
          </Link>
          <p className="mt-6 text-xs text-muted-foreground">
            <Link href="/tools" className="underline underline-offset-4 hover:text-foreground">
              Tools hub
            </Link>
            <span className="mx-2 text-border">·</span>
            <Link href="/generators" className="underline underline-offset-4 hover:text-foreground">
              All generators
            </Link>
          </p>
        </div>
      </section>

      <section className="container max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <HomeDirectory tools={directoryTools} />
      </section>
    </div>
  )
}
