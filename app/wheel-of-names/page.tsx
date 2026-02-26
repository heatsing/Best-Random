import { Suspense } from "react"
import { WheelOfNamesClient } from "./client"
import { generateMetadata } from "@/lib/seo"
import type { Metadata } from "next"

export const metadata: Metadata = generateMetadata({
  title: "Wheel of Names – Spin to Pick a Random Name | BestRandom",
  description: "Spin a virtual wheel to pick a random name or item. Add names with optional weights and let the wheel decide.",
  path: "/wheel-of-names",
})

export default function WheelOfNamesPage() {
  return (
    <Suspense fallback={<div className="container py-12">Loading...</div>}>
      <WheelOfNamesClient />
    </Suspense>
  )
}
