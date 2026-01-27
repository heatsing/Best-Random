"use client"

import { useState, useEffect, useCallback } from "react"
import { generateNames, type NameGeneratorParams } from "@/lib/generators/name"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { GeneratorLayout } from "@/components/GeneratorLayout"
import { ResultList } from "@/components/ResultList"
import { RollingReveal } from "@/components/RollingReveal"
import { useSearchParams, useRouter } from "next/navigation"
import { getToolBySlug } from "@/lib/tool-registry"
import { saveToHistory } from "@/lib/history"
import Script from "next/script"
import { generateFAQSchema } from "@/lib/seo"

export function RandomNameGeneratorClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const tool = getToolBySlug("random-name-generator")!
  
  const [count, setCount] = useState(Number(searchParams.get("count")) || 10)
  const [style, setStyle] = useState<"modern" | "classic" | "mixed">(
    (searchParams.get("style") as "modern" | "classic" | "mixed") || "mixed"
  )
  const [unique, setUnique] = useState(searchParams.get("unique") === "true")
  const [seed, setSeed] = useState(searchParams.get("seed") || "")
  const [results, setResults] = useState<ReturnType<typeof generateNames>>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const getOrCreateSeed = useCallback(() => {
    if (seed) return seed
    const newSeed = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    setSeed(newSeed)
    return newSeed
  }, [seed])

  const generate = useCallback(() => {
    setIsGenerating(true)
    
    setTimeout(() => {
      const currentSeed = getOrCreateSeed()
      const params: NameGeneratorParams = {
        count,
        style,
        unique,
        seed: currentSeed,
      }
      
      const newResults = generateNames(params)
      setResults(newResults)
      
      saveToHistory({
        toolSlug: tool.slug,
        seed: currentSeed,
        params,
        outputPreview: newResults.slice(0, 3).map(r => r.fullName).join(", "),
        timestamp: Date.now(),
      })
      
      updateURL(currentSeed, params)
      setIsGenerating(false)
    }, 100)
  }, [count, style, unique, seed, getOrCreateSeed, tool.slug])

  const reroll = useCallback(() => {
    const newSeed = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    setSeed(newSeed)
    generate()
  }, [generate])

  const repeat = useCallback(() => {
    generate()
  }, [generate])

  const updateURL = (currentSeed: string, params: NameGeneratorParams) => {
    const url = new URL(window.location.href)
    url.searchParams.set("count", String(params.count))
    url.searchParams.set("style", params.style)
    url.searchParams.set("unique", String(params.unique))
    url.searchParams.set("seed", currentSeed)
    router.replace(url.pathname + url.search, { scroll: false })
  }

  useEffect(() => {
    const urlSeed = searchParams.get("seed")
    if (urlSeed) {
      setSeed(urlSeed)
      // Don't auto-generate on load, let user click
    }
  }, [])

  const handleCopyAll = () => {
    return results.map(r => r.fullName).join("\n")
  }

  const handleDownloadCSV = () => {
    const csv = results.map(r => r.fullName).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'random-names.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const shareUrl = () => {
    const currentSeed = seed || getOrCreateSeed()
    const params = new URLSearchParams({
      count: String(count),
      style,
      unique: String(unique),
      seed: currentSeed,
    })
    return `${window.location.origin}/random-name-generator?${params.toString()}`
  }

  const resultItems = results.map(r => ({
    id: r.id,
    value: r.fullName,
  }))

  return (
    <>
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFAQSchema(tool.faqs)) }}
      />
      <GeneratorLayout
        tool={tool}
        seed={seed || getOrCreateSeed()}
        onRepeat={repeat}
        onReroll={reroll}
        onCopy={() => navigator.clipboard.writeText(handleCopyAll())}
        onShare={shareUrl}
      >
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="style">Name Style</Label>
              <Select value={style} onValueChange={(v: "modern" | "classic" | "mixed") => setStyle(v)}>
                <SelectTrigger id="style">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="modern">Modern</SelectItem>
                  <SelectItem value="classic">Classic</SelectItem>
                  <SelectItem value="mixed">Mixed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="count">Count: {count}</Label>
              <Slider
                value={[count]}
                onValueChange={([value]) => setCount(value)}
                min={1}
                max={100}
                step={1}
              />
              <Input
                id="count"
                type="number"
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                min={1}
                max={100}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="unique"
                checked={unique}
                onCheckedChange={setUnique}
              />
              <Label htmlFor="unique">Unique names (no duplicates)</Label>
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

            <Button 
              onClick={repeat} 
              className="w-full"
              disabled={isGenerating}
            >
              {isGenerating ? "Generating..." : "Generate Names"}
            </Button>
          </div>

          <div className="space-y-4">
            {isGenerating ? (
              <div className="border rounded-lg p-12 text-center text-muted-foreground">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                Generating...
              </div>
            ) : results.length > 0 ? (
              <RollingReveal delay={300}>
                <ResultList
                  items={resultItems}
                  onCopyAll={handleCopyAll}
                  onDownloadCSV={handleDownloadCSV}
                  showDownload={true}
                />
              </RollingReveal>
            ) : (
              <div className="border rounded-lg p-12 text-center text-muted-foreground">
                Click "Generate Names" to start
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 space-y-4">
          <h2 className="text-2xl font-semibold">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {tool.faqs.map((faq, i) => (
              <div key={i} className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </GeneratorLayout>
    </>
  )
}
