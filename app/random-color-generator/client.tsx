"use client"

import { useState, useEffect, useCallback } from "react"
import { generateColors, type ColorGeneratorParams, type ColorFormat } from "@/lib/generators/color"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
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
import { Copy, Lock, Unlock, Download } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function RandomColorGeneratorClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const tool = getToolBySlug("random-color-generator")!
  const { toast } = useToast()
  
  const [count, setCount] = useState(Number(searchParams.get("count")) || 5)
  const [format, setFormat] = useState<ColorFormat>((searchParams.get("format") as ColorFormat) || "hex")
  const [seed, setSeed] = useState(searchParams.get("seed") || "")
  const [results, setResults] = useState<ReturnType<typeof generateColors>>([])
  const [lockedIds, setLockedIds] = useState<Set<string>>(new Set())
  const [isGenerating, setIsGenerating] = useState(false)

  const getOrCreateSeed = useCallback(() => {
    if (seed) return seed
    const newSeed = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    setSeed(newSeed)
    return newSeed
  }, [seed])

  const updateURL = useCallback((currentSeed: string, params: ColorGeneratorParams) => {
    const url = new URL(window.location.href)
    url.searchParams.set("count", String(params.count))
    url.searchParams.set("format", params.format)
    url.searchParams.set("seed", currentSeed)
    router.replace(url.pathname + url.search, { scroll: false })
  }, [router])

  const generate = useCallback((newSeed?: string, preserveLocks = false) => {
    setIsGenerating(true)
    
    setTimeout(() => {
      const currentSeed = newSeed || getOrCreateSeed()
      const params: ColorGeneratorParams = {
        count,
        format,
        seed: currentSeed,
      }
      
      const newResults = generateColors(params)
      
      // Preserve locked items
      if (preserveLocks && lockedIds.size > 0) {
        const lockedResults = results.filter(r => lockedIds.has(r.id))
        const unlockedCount = count - lockedResults.length
        
        if (unlockedCount > 0) {
          const unlockedParams = { ...params, count: unlockedCount }
          const unlockedResults = generateColors(unlockedParams)
          setResults([...lockedResults, ...unlockedResults])
        } else {
          setResults(lockedResults)
        }
      } else {
        setResults(newResults)
      }
      
      saveToHistory({
        toolSlug: tool.slug,
        seed: currentSeed,
        params,
        outputPreview: `${newResults.length} colors generated`,
        timestamp: Date.now(),
      })
      
      updateURL(currentSeed, params)
      setIsGenerating(false)
    }, 100)
  }, [count, format, seed, getOrCreateSeed, lockedIds, results, tool.slug, updateURL])

  const reroll = useCallback(() => {
    const newSeed = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    setSeed(newSeed)
    setLockedIds(new Set())
    generate(newSeed, false)
  }, [generate])

  const repeat = useCallback(() => {
    generate(undefined, false)
  }, [generate])

  useEffect(() => {
    const urlSeed = searchParams.get("seed")
    if (urlSeed) {
      setSeed(urlSeed)
      // Don't auto-generate on load, let user click
    }
  }, [])

  const handleLockToggle = (id: string) => {
    const newLocked = new Set(lockedIds)
    if (newLocked.has(id)) {
      newLocked.delete(id)
    } else {
      newLocked.add(id)
    }
    setLockedIds(newLocked)
  }

  const handleCopyColor = (color: typeof results[0]) => {
    const value = color[format]
    navigator.clipboard.writeText(value)
    toast({
      title: "Copied",
      description: `${value} copied to clipboard`,
    })
  }

  const handleCopyAll = () => {
    const text = results.map(r => r[format]).join("\n")
    navigator.clipboard.writeText(text)
    toast({
      title: "All colors copied",
      description: "All color values copied to clipboard",
    })
  }

  const handleExportCSS = () => {
    const css = results.map((color, i) => 
      `  --color-${i + 1}: ${color[format]};`
    ).join("\n")
    const fullCSS = `:root {\n${css}\n}`
    navigator.clipboard.writeText(fullCSS)
    toast({
      title: "CSS exported",
      description: "CSS variables copied to clipboard",
    })
  }

  const shareUrl = () => {
    const currentSeed = seed || getOrCreateSeed()
    const params = new URLSearchParams({
      count: String(count),
      format,
      seed: currentSeed,
    })
    return `${window.location.origin}/random-color-generator?${params.toString()}`
  }

  const getColorValue = (color: typeof results[0]) => {
    return color[format]
  }

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
        onCopy={handleCopyAll}
        onShare={shareUrl}
      >
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="format">Color Format</Label>
              <Select value={format} onValueChange={(v: ColorFormat) => setFormat(v)}>
                <SelectTrigger id="format">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hex">HEX</SelectItem>
                  <SelectItem value="rgb">RGB</SelectItem>
                  <SelectItem value="hsl">HSL</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="count">Palette Size: {count}</Label>
              <Slider
                value={[count]}
                onValueChange={([value]) => setCount(value)}
                min={1}
                max={10}
                step={1}
              />
              <Input
                id="count"
                type="number"
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                min={1}
                max={10}
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
              {isGenerating ? "Generating..." : "Generate Colors"}
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
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Colors</h2>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopyAll}
                        className="gap-2"
                      >
                        <Copy className="h-4 w-4" />
                        Copy All
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleExportCSS}
                        className="gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Export CSS
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {results.map((color, i) => (
                      <RollingReveal key={color.id} delay={300 + i * 100}>
                        <div className={`border rounded-lg overflow-hidden ${lockedIds.has(color.id) ? 'bg-muted/50' : ''}`}>
                          <div
                            className="h-24 w-full"
                            style={{ backgroundColor: color.hex }}
                          />
                          <div className="p-4 bg-card">
                            <div className="flex items-center justify-between">
                              <div className="space-y-1 flex-1">
                                <div className="font-mono text-sm font-medium">{getColorValue(color)}</div>
                                <div className="text-xs text-muted-foreground">
                                  HEX: {color.hex} | RGB: {color.rgb} | HSL: {color.hsl}
                                </div>
                              </div>
                              <div className="flex items-center gap-2 ml-4">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleCopyColor(color)}
                                  className="h-8 w-8"
                                  aria-label="Copy color"
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleLockToggle(color.id)}
                                  className="h-8 w-8"
                                  aria-label={lockedIds.has(color.id) ? "Unlock color" : "Lock color"}
                                >
                                  {lockedIds.has(color.id) ? (
                                    <Lock className="h-4 w-4 text-primary" />
                                  ) : (
                                    <Unlock className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </RollingReveal>
                    ))}
                  </div>
                </div>
              </RollingReveal>
            ) : (
              <div className="border rounded-lg p-12 text-center text-muted-foreground">
                Click "Generate Colors" to start
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
