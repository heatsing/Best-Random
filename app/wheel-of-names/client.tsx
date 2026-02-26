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
import { saveToHistory } from "@/lib/history"
import { useSearchParams, useRouter } from "next/navigation"
import { generateFAQSchema } from "@/lib/seo"
import Script from "next/script"

const faqs = [
  {
    question: "How do I use the Wheel of Names?",
    answer: "Enter a list of names in the text area (one per line), optionally set weights (format: name:weight), then click 'Spin' to pick a random winner.",
  },
  {
    question: "How do I set weights?",
    answer: "Use the format 'name:weight', e.g., 'Alice:2' means Alice has a weight of 2. Higher weight means higher probability of being selected.",
  },
  {
    question: "Can I add duplicate names?",
    answer: "Duplicate names are automatically removed. Each name appears only once.",
  },
  {
    question: "Can I share the result?",
    answer: "Yes. Click the share button to generate a link with the seed parameter. Others will see the same wheel and result.",
  },
  {
    question: "Where is the spin history?",
    answer: "Spin results are saved in your browser's local storage. You can view the last 20 results.",
  },
  {
    question: "How many names can I add?",
    answer: "There is no hard limit, but we recommend up to 100 names for best performance.",
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
        alert("Please enter at least one name")
        return
      }
      setItems(parsed)
    }

    setIsSpinning(true)
    setTimeout(() => {
      const params = { items, seed: seed || undefined }
      const newResult = spinWheel(params)
      setResult(newResult)
      saveToHistory({
        toolSlug: "wheel-of-names",
        seed: seed || "random",
        params: { items: items.map(i => i.name).join(", ") },
        outputPreview: newResult.winner,
        timestamp: Date.now(),
      })
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

  return (
    <div className="container py-12">
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFAQSchema(faqs)) }}
      />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Wheel of Names</h1>
        <p className="text-muted-foreground mb-8">
          Spin a virtual wheel to pick a random name or item. Add names with optional weights and let the wheel decide.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="input">Names (one per line, optional weight: name:weight)</Label>
              <Textarea
                id="input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={"Alice\nBob\nCharlie:2\nDiana:3"}
                rows={10}
              />
              <p className="text-xs text-muted-foreground">
                {items.length} name{items.length !== 1 ? "s" : ""} entered
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="seed">Seed (optional, for reproducibility)</Label>
              <Input
                id="seed"
                value={seed}
                onChange={(e) => setSeed(e.target.value)}
                placeholder="Leave empty for random seed"
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleSpin}
                className="flex-1"
                disabled={isSpinning || items.length === 0}
              >
                <Play className="mr-2 h-4 w-4" />
                {isSpinning ? "Spinning..." : "Spin"}
              </Button>
              <Button variant="outline" onClick={handleReset}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
            </div>

            {items.length > 0 && (
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Name List</h3>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {items.map((item, i) => (
                    <div key={i} className="text-sm">
                      {item.name} {item.weight !== 1 && <span className="text-muted-foreground">(weight: {item.weight})</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Result</h2>
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
                  Winner
                </div>
              </div>
            ) : (
              <div className="border rounded-lg p-12 text-center text-muted-foreground">
                {items.length === 0 ? "Enter names and click 'Spin' to start" : "Click 'Spin' to start"}
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 space-y-4">
          <h2 className="text-2xl font-semibold">Frequently Asked Questions</h2>
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
