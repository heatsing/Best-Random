import { generateMetadata } from "@/lib/seo"
import type { Metadata } from "next"

export const metadata: Metadata = generateMetadata({
  title: "About",
  description: "Learn about BestRandom - a collection of fast, seeded, and shareable random generators.",
  path: "/about",
})

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-12 sm:px-6 md:py-16">
      <header className="mb-10 border-b border-border pb-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">About</p>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">About BestRandom</h1>
      </header>

      <div className="space-y-10">
        <section className="rounded-xl border border-border bg-card/50 p-6 shadow-sm md:p-8">
          <h2 className="mb-4 text-xl font-semibold tracking-tight">What is BestRandom?</h2>
          <p className="leading-relaxed text-muted-foreground">
            BestRandom is a tool-first random generator product that provides fast random generation that
            FEELS random, with deterministic repeatability via seed, shareable URLs, and polished
            micro-interactions. Our goal is to help users quickly and easily generate various random content
            including numbers, names, words, passwords, colors, animals, and more.
          </p>
        </section>

        <section className="rounded-xl border border-border bg-card/50 p-6 shadow-sm md:p-8">
          <h2 className="mb-4 text-xl font-semibold tracking-tight">Key features</h2>
          <ul className="list-inside list-disc space-y-2 leading-relaxed text-muted-foreground marker:text-primary">
            <li>Multiple random generators to meet different needs</li>
            <li>Shareable links with seed-based reproducibility</li>
            <li>Completely free, no registration required</li>
            <li>Fast response with clean, intuitive interface</li>
            <li>Local data processing for privacy protection</li>
            <li>Keyboard shortcuts and command palette for power users</li>
            <li>History and favorites stored locally</li>
          </ul>
        </section>

        <section className="rounded-xl border border-border bg-card/50 p-6 shadow-sm md:p-8">
          <h2 className="mb-4 text-xl font-semibold tracking-tight">Technology stack</h2>
          <p className="leading-relaxed text-muted-foreground">
            BestRandom is built with Next.js, React, TypeScript, and Tailwind CSS to ensure fast loading and
            excellent user experience. All generators use deterministic pseudo-random number generators
            (Mulberry32), ensuring that the same parameters and seed will produce identical results. This
            makes it possible to share results and reproduce them exactly.
          </p>
        </section>

        <section className="rounded-xl border border-dashed border-border bg-muted/20 p-6 md:p-8">
          <h2 className="mb-4 text-xl font-semibold tracking-tight">Contact us</h2>
          <p className="leading-relaxed text-muted-foreground">
            If you have any questions, suggestions, or feedback, please feel free to contact us through our
            contact information.
          </p>
        </section>
      </div>
    </div>
  )
}
