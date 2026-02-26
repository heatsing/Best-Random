"use client"

import { useState, useEffect, useCallback } from "react"
import { generateNumbers, type NumberGeneratorParams } from "@/lib/generators/number"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { GeneratorLayout } from "@/components/GeneratorLayout"
import { ResultList } from "@/components/ResultList"
import { RollingReveal, StaggeredList } from "@/components/RollingReveal"
import { useSearchParams, useRouter } from "next/navigation"
import { getToolBySlug } from "@/lib/tool-registry"
import { saveToHistory } from "@/lib/history"
import Script from "next/script"
import { generateFAQSchema } from "@/lib/seo"

export function RandomNumberGeneratorClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const tool = getToolBySlug("random-number-generator")!
  
  const [min, setMin] = useState(Number(searchParams.get("min")) || 1)
  const [max, setMax] = useState(Number(searchParams.get("max")) || 100)
  const [count, setCount] = useState(Number(searchParams.get("count")) || 10)
  const [integer, setInteger] = useState(searchParams.get("integer") !== "false")
  const [unique, setUnique] = useState(searchParams.get("unique") === "true")
  const [sort, setSort] = useState(searchParams.get("sort") === "true")
  const [decimals, setDecimals] = useState(Number(searchParams.get("decimals")) || 2)
  const [seed, setSeed] = useState(searchParams.get("seed") || "")
  const [results, setResults] = useState<ReturnType<typeof generateNumbers>>([])
  const [lockedIds, setLockedIds] = useState<Set<string>>(new Set())
  const [isGenerating, setIsGenerating] = useState(false)

  // Generate seed if not provided
  const getOrCreateSeed = useCallback(() => {
    const newSeed = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    setSeed(newSeed)
    return newSeed
  }, [])

  // Update URL
  const updateURL = useCallback((currentSeed: string, params: NumberGeneratorParams) => {
    const url = new URL(window.location.href)
    url.searchParams.set("min", String(params.min))
    url.searchParams.set("max", String(params.max))
    url.searchParams.set("count", String(params.count))
    url.searchParams.set("integer", String(params.integer))
    url.searchParams.set("unique", String(params.unique))
    url.searchParams.set("sort", String(params.sort))
    url.searchParams.set("decimals", String(params.decimals))
    url.searchParams.set("seed", currentSeed)
    router.replace(url.pathname + url.search, { scroll: false })
  }, [router])

  // Generate numbers
  const generate = useCallback((newSeed?: string, preserveLocks = false) => {
    setIsGenerating(true)
    
    // Small delay for rolling animation
    setTimeout(() => {
      const currentSeed = newSeed || getOrCreateSeed()
      const params: NumberGeneratorParams = {
        min,
        max,
        count,
        integer,
        unique,
        sort,
        decimals,
        seed: currentSeed,
      }
      
      const newResults = generateNumbers(params)
      
      // Preserve locked items
      if (preserveLocks && lockedIds.size > 0) {
        setResults(prevResults => {
          const lockedResults = prevResults.filter(r => lockedIds.has(r.id))
          const unlockedCount = count - lockedResults.length
          
          if (unlockedCount > 0) {
            const unlockedParams = { ...params, count: unlockedCount }
            const unlockedResults = generateNumbers(unlockedParams)
            
            // Combine locked and unlocked
            const combined = [...lockedResults, ...unlockedResults]
            if (sort) {
              combined.sort((a, b) => a.value - b.value)
            }
            return combined
          } else {
            return lockedResults
          }
        })
      } else {
        setResults(newResults)
      }
      
      // Save to history
      saveToHistory({
        toolSlug: tool.slug,
        seed: currentSeed,
        params,
        outputPreview: newResults.slice(0, 3).map(r => r.formatted).join(", "),
        timestamp: Date.now(),
      })
      
      updateURL(currentSeed, params)
      setIsGenerating(false)
    }, 100)
  }, [min, max, count, integer, unique, sort, decimals, getOrCreateSeed, lockedIds, tool.slug, updateURL])

  // Reroll with new seed
  const reroll = useCallback(() => {
    const newSeed = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    setSeed(newSeed)
    setLockedIds(new Set())
    generate(newSeed, false)
  }, [generate])

  // Repeat with same seed
  const repeat = useCallback(() => {
    generate(undefined, false)
  }, [generate])

  // Initialize from URL params
  useEffect(() => {
    const urlSeed = searchParams.get("seed")
    if (urlSeed) {
      setSeed(urlSeed)
      // Don't auto-generate on load, let user click
    }
  }, [searchParams])

  const handleLockToggle = (id: string) => {
    const newLocked = new Set(lockedIds)
    if (newLocked.has(id)) {
      newLocked.delete(id)
    } else {
      newLocked.add(id)
    }
    setLockedIds(newLocked)
  }

  const handleCopyAll = () => {
    return results.map(r => r.formatted).join("\n")
  }

  const handleDownloadCSV = () => {
    const csv = results.map(r => r.formatted).join("\n")
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'random-numbers.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const shareUrl = () => {
    const currentSeed = seed || getOrCreateSeed()
    const params = new URLSearchParams({
      min: String(min),
      max: String(max),
      count: String(count),
      integer: String(integer),
      unique: String(unique),
      sort: String(sort),
      decimals: String(decimals),
      seed: currentSeed,
    })
    return `${window.location.origin}/random-number-generator?${params.toString()}`
  }

  const resultItems = results.map(r => ({
    id: r.id,
    value: r.formatted,
    locked: lockedIds.has(r.id),
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
              <Label>Minimum: {min}</Label>
              <Slider
                value={[min]}
                onValueChange={([value]) => setMin(value)}
                min={-1000}
                max={1000}
                step={1}
              />
              <Input
                type="number"
                value={min}
                onChange={(e) => setMin(Number(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label>Maximum: {max}</Label>
              <Slider
                value={[max]}
                onValueChange={([value]) => setMax(value)}
                min={-1000}
                max={1000}
                step={1}
              />
              <Input
                type="number"
                value={max}
                onChange={(e) => setMax(Number(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label>Count: {count}</Label>
              <Slider
                value={[count]}
                onValueChange={([value]) => setCount(value)}
                min={1}
                max={1000}
                step={1}
              />
              <Input
                type="number"
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                min={1}
                max={1000}
              />
            </div>

            {!integer && (
              <div className="space-y-2">
                <Label>Decimal Places: {decimals}</Label>
                <Slider
                  value={[decimals]}
                  onValueChange={([value]) => setDecimals(value)}
                  min={0}
                  max={10}
                  step={1}
                />
                <Input
                  type="number"
                  value={decimals}
                  onChange={(e) => setDecimals(Number(e.target.value))}
                  min={0}
                  max={10}
                />
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Switch
                id="integer"
                checked={integer}
                onCheckedChange={setInteger}
              />
              <Label htmlFor="integer">Integers only</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="unique"
                checked={unique}
                onCheckedChange={setUnique}
              />
              <Label htmlFor="unique">Unique values</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="sort"
                checked={sort}
                onCheckedChange={setSort}
              />
              <Label htmlFor="sort">Sort results</Label>
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
              {isGenerating ? "Generating..." : "Generate"}
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
                  onLockToggle={handleLockToggle}
                  onCopyAll={handleCopyAll}
                  onDownloadCSV={handleDownloadCSV}
                  showLock={true}
                  showDownload={true}
                />
              </RollingReveal>
            ) : (
              <div className="border rounded-lg p-12 text-center text-muted-foreground">
                Click "Generate" to start
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
