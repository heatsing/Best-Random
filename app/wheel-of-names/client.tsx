"use client"

import { useState, useEffect } from "react"
import { spinWheel, parseWheelInput, type WheelItem } from "@/lib/generators/wheel"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CopyButton } from "@/components/CopyButton"
import { ShareLink } from "@/components/ShareLink"
import { RotateCcw, Play } from "lucide-react"
import { saveToHistory } from "@/lib/utils"
import { useSearchParams, useRouter } from "next/navigation"
import { generateFAQSchema } from "@/lib/seo"
import Script from "next/script"

const faqs = [
  {
    question: "如何使用名字转盘？",
    answer: "在文本框中输入名字列表（每行一个），可选设置权重（格式：名字:权重），然后点击'旋转'按钮。",
  },
  {
    question: "如何设置权重？",
    answer: "使用格式'名字:权重'，例如'张三:2'表示张三的权重是2，权重越高被选中的概率越大。",
  },
  {
    question: "可以重复输入相同的名字吗？",
    answer: "系统会自动去重，相同的名字只会保留一个。",
  },
  {
    question: "转盘结果可以分享吗？",
    answer: "可以，点击'分享'按钮，会生成一个包含种子参数的链接，其他人打开链接会看到相同的转盘和结果。",
  },
  {
    question: "转盘历史记录在哪里？",
    answer: "转盘结果会保存在浏览器本地历史记录中，您可以查看最近20次的结果。",
  },
  {
    question: "支持多少个名字？",
    answer: "理论上没有限制，但建议不超过100个名字以保证最佳性能。",
  },
]

export function WheelOfNamesClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [input, setInput] = useState(searchParams.get("items") || "")
  const [seed, setSeed] = useState(searchParams.get("seed") || "")
  const [items, setItems] = useState<WheelItem[]>([])
  const [result, setResult] = useState<ReturnType<typeof spinWheel> | null>(null)
  const [isSpinning, setIsSpinning] = useState(false)

  useEffect(() => {
    if (input) {
      const parsed = parseWheelInput(input)
      setItems(parsed)
    }
  }, [input])

  useEffect(() => {
    if (searchParams.get("seed") && items.length > 0) {
      const params = { items, seed: searchParams.get("seed") || undefined }
      const newResult = spinWheel(params)
      setResult(newResult)
    }
  }, [searchParams, items])

  const handleSpin = () => {
    if (items.length === 0) {
      const parsed = parseWheelInput(input)
      if (parsed.length === 0) {
        alert("请输入至少一个名字")
        return
      }
      setItems(parsed)
    }

    setIsSpinning(true)
    setTimeout(() => {
      const params = { items, seed: seed || undefined }
      const newResult = spinWheel(params)
      setResult(newResult)
      saveToHistory("wheel", { items, result: newResult })
      setIsSpinning(false)
      updateURL(params)
    }, 3000)
  }

  const updateURL = (params: { items: WheelItem[], seed?: string }) => {
    const url = new URL(window.location.href)
    const itemsText = params.items.map(item => 
      item.weight !== 1 ? `${item.name}:${item.weight}` : item.name
    ).join("\n")
    url.searchParams.set("items", itemsText)
    if (params.seed) {
      url.searchParams.set("seed", params.seed)
    } else {
      url.searchParams.delete("seed")
    }
    router.replace(url.pathname + url.search, { scroll: false })
  }

  const handleReset = () => {
    setInput("")
    setSeed("")
    setItems([])
    setResult(null)
    router.replace("/wheel-of-names")
  }

  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0)
  const itemAngles = items.map((item, i) => {
    const prevWeight = items.slice(0, i).reduce((sum, it) => sum + it.weight, 0)
    return (prevWeight / totalWeight) * 360
  })

  return (
    <div className="container py-12">
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFAQSchema(faqs)) }}
      />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">🎡 名字转盘</h1>
        <p className="text-muted-foreground mb-8">
          随机选择器转盘，支持权重设置。输入名字列表，旋转转盘选择获胜者。
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="input">名字列表（每行一个，可选权重：名字:权重）</Label>
              <Textarea
                id="input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="张三&#10;李四&#10;王五:2&#10;赵六:3"
                rows={10}
              />
              <p className="text-xs text-muted-foreground">
                当前有 {items.length} 个名字
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="seed">种子（可选，用于重现结果）</Label>
              <Input
                id="seed"
                value={seed}
                onChange={(e) => setSeed(e.target.value)}
                placeholder="留空则随机生成"
              />
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={handleSpin} 
                className="flex-1"
                disabled={isSpinning || items.length === 0}
              >
                <Play className="mr-2 h-4 w-4" />
                {isSpinning ? "旋转中..." : "旋转"}
              </Button>
              <Button variant="outline" onClick={handleReset}>
                <RotateCcw className="mr-2 h-4 w-4" />
                重置
              </Button>
            </div>

            {items.length > 0 && (
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">名字列表</h3>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {items.map((item, i) => (
                    <div key={i} className="text-sm">
                      {item.name} {item.weight !== 1 && <span className="text-muted-foreground">(权重: {item.weight})</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">结果</h2>
              {result && (
                <div className="flex gap-2">
                  <CopyButton text={result.winner} />
                  <ShareLink url={typeof window !== 'undefined' ? window.location.href : ''} />
                </div>
              )}
            </div>

            {result ? (
              <div className="border rounded-lg p-8 bg-muted/50 text-center">
                <div className="text-4xl mb-4">🎉</div>
                <div className="text-2xl font-bold mb-2">{result.winner}</div>
                <div className="text-sm text-muted-foreground">
                  获胜者
                </div>
              </div>
            ) : (
              <div className="border rounded-lg p-12 text-center text-muted-foreground">
                {items.length === 0 ? "输入名字列表并点击'旋转'开始" : "点击'旋转'按钮开始"}
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 space-y-4">
          <h2 className="text-2xl font-semibold">常见问题</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
