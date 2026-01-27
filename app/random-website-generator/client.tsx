"use client"

import { useState, useEffect, useCallback } from "react"
import { generateWebsites, type WebsiteGeneratorParams } from "@/lib/generators/website"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GeneratorLayout } from "@/components/GeneratorLayout"
import { ResultList } from "@/components/ResultList"
import { RollingReveal } from "@/components/RollingReveal"
import { useSearchParams, useRouter } from "next/navigation"
import { getToolBySlug } from "@/lib/tool-registry"
import { saveToHistory } from "@/lib/history"
import Script from "next/script"
import { generateFAQSchema } from "@/lib/seo"

const TLDS = [
  'com', 'org', 'net', 'io', 'co', 'dev', 'app', 'tech', 'online', 'site',
  'xyz', 'info', 'biz', 'me', 'us', 'uk', 'ca', 'au', 'de', 'fr'
]

export function RandomWebsiteGeneratorClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const tool = getToolBySlug("random-website-generator")!
  
  const [count, setCount] = useState(Number(searchParams.get("count")) || 10)
  const [format, setFormat] = useState<'simple' | 'subdomain' | 'path'>(
    (searchParams.get("format") as 'simple' | 'subdomain' | 'path') || 'simple'
  )
  const [tld, setTld] = useState(searchParams.get("tld") || "")
  const [seed, setSeed] = useState(searchParams.get("seed") || "")
  const [results, setResults] = useState<ReturnType<typeof generateWebsites>>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const getOrCreateSeed = useCallback(() => {
    if (seed) return seed
    const newSeed = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    setSeed(newSeed)
    return newSeed
  }, [seed])

  const updateURL = useCallback((currentSeed: string, params: WebsiteGeneratorParams) => {
    const url = new URL(window.location.href)
    url.searchParams.set("count", String(params.count))
    url.searchParams.set("format", params.format || 'simple')
    if (params.tld) {
      url.searchParams.set("tld", params.tld)
    } else {
      url.searchParams.delete("tld")
    }
    url.searchParams.set("seed", currentSeed)
    router.replace(url.pathname + url.search, { scroll: false })
  }, [router])

  const generate = useCallback(() => {
    setIsGenerating(true)
    
    setTimeout(() => {
      const currentSeed = getOrCreateSeed()
      const params: WebsiteGeneratorParams = {
        count,
        format,
        tld: tld || undefined,
        seed: currentSeed,
      }
      
      const newResults = generateWebsites(params)
      setResults(newResults)
      
      saveToHistory({
        toolSlug: tool.slug,
        seed: currentSeed,
        params,
        outputPreview: newResults.slice(0, 3).map(r => r.url).join(", "),
        timestamp: Date.now(),
      })
      
      updateURL(currentSeed, params)
      setIsGenerating(false)
    }, 100)
  }, [count, format, tld, getOrCreateSeed, tool.slug, updateURL])

  const reroll = useCallback(() => {
    const newSeed = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    setSeed(newSeed)
    generate()
  }, [generate])

  const repeat = useCallback(() => {
    generate()
  }, [generate])

  useEffect(() => {
    const urlSeed = searchParams.get("seed")
    if (urlSeed) {
      setSeed(urlSeed)
      // Don't auto-generate on load, let user click
    }
  }, [searchParams])

  const handleCopyAll = () => {
    return results.map(r => r.url).join("\n")
  }

  const handleDownloadCSV = () => {
    const csv = results.map(r => r.url).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'random-websites.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const shareUrl = () => {
    const currentSeed = seed || getOrCreateSeed()
    const params = new URLSearchParams({
      count: String(count),
      format,
      seed: currentSeed,
    })
    if (tld) {
      params.set("tld", tld)
    }
    return `${window.location.origin}/random-website-generator?${params.toString()}`
  }

  const resultItems = results.map(r => ({
    id: r.id,
    value: r.url,
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
              <Label htmlFor="count">Count: {count}</Label>
              <Input
                id="count"
                type="number"
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                min={1}
                max={1000}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="format">URL Format</Label>
              <Select value={format} onValueChange={(v: 'simple' | 'subdomain' | 'path') => setFormat(v)}>
                <SelectTrigger id="format">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="simple">Simple (example.com)</SelectItem>
                  <SelectItem value="subdomain">Subdomain (blog.example.com)</SelectItem>
                  <SelectItem value="path">With Path (example.com/path/to/page)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tld">TLD (optional, leave empty for random)</Label>
              <Select value={tld} onValueChange={setTld}>
                <SelectTrigger id="tld">
                  <SelectValue placeholder="Random TLD" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Random TLD</SelectItem>
                  {TLDS.map(t => (
                    <SelectItem key={t} value={t}>.{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                value={tld}
                onChange={(e) => setTld(e.target.value)}
                placeholder="Or enter custom TLD (e.g., com, org)"
                className="mt-2"
              />
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
              {isGenerating ? "Generating..." : "Generate Websites"}
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
                Click "Generate Websites" to start
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
