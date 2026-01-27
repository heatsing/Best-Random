import { generateMetadata } from "@/lib/seo"
import type { Metadata } from "next"

export const metadata: Metadata = generateMetadata({
  title: "About – BestRandom",
  description: "Learn about BestRandom - a collection of fast, seeded, and shareable random generators.",
  path: "/about",
})

export default function AboutPage() {
  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">About BestRandom</h1>
        
        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">What is BestRandom?</h2>
            <p className="text-muted-foreground">
              BestRandom is a tool-first random generator product that provides fast random generation 
              that FEELS random, with deterministic repeatability via seed, shareable URLs, and polished 
              micro-interactions. Our goal is to help users quickly and easily generate various random 
              content including numbers, names, words, passwords, colors, animals, and more.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Multiple random generators to meet different needs</li>
              <li>Shareable links with seed-based reproducibility</li>
              <li>Completely free, no registration required</li>
              <li>Fast response with clean, intuitive interface</li>
              <li>Local data processing for privacy protection</li>
              <li>Keyboard shortcuts and command palette for power users</li>
              <li>History and favorites stored locally</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Technology Stack</h2>
            <p className="text-muted-foreground">
              BestRandom is built with Next.js, React, TypeScript, and Tailwind CSS to ensure fast 
              loading and excellent user experience. All generators use deterministic pseudo-random 
              number generators (Mulberry32), ensuring that the same parameters and seed will produce 
              identical results. This makes it possible to share results and reproduce them exactly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="text-muted-foreground">
              If you have any questions, suggestions, or feedback, please feel free to contact us 
              through our contact information.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
