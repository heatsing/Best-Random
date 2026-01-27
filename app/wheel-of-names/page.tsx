import { Suspense } from "react"
import { WheelOfNamesClient } from "./client"
import { generateMetadata } from "@/lib/seo"
import type { Metadata } from "next"

export const metadata: Metadata = generateMetadata({
  title: "名字转盘 – 随机选择器 | BestRandom",
  description: "随机选择器转盘，支持权重设置。输入名字列表，旋转转盘选择获胜者。",
  path: "/wheel-of-names",
})

export default function WheelOfNamesPage() {
  return (
    <Suspense fallback={<div className="container py-12">Loading...</div>}>
      <WheelOfNamesClient />
    </Suspense>
  )
}
