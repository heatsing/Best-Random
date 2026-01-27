"use client"

import { useState, useEffect, useCallback } from "react"
import { generateText, type TextGeneratorParams } from "@/lib/generators/text"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GeneratorLayout } from "@/components/GeneratorLayout"
import { RollingReveal } from "@/components/RollingReveal"
import { useSearchParams, useRouter } from "next/navigation"
import { getToolBySlug } from "@/lib/tool-registry"
import { saveToHistory } from "@/lib/history"
import Script from "next/script"
import { generateFAQSchema } from "@/lib/seo"
import { Textarea } from "@/components/ui/textarea"

export function RandomTextGeneratorClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const tool = getToolBySlug("random-text-generator")!
  
  const [length, setLength] = useState<'short' | 'medium' | 'long'>(
    (searchParams.get("length") as 'short' | 'medium' | 'long') || 'medium'
  )
  const [lines, setLines] = useState(Number(searchParams.get("lines")) || 5)
  const [seed, setSeed] = useState(searchParams.get("seed") || "")
  const [result, setResult] = useState<ReturnType<typeof generateText> | null>(null)
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
      const params: TextGeneratorParams = {
        length,
        lines,
        seed: currentSeed,
      }
      
      const newResult = generateText(params)
      setResult(newResult)
      
      saveToHistory({
        toolSlug: tool.slug,
        seed: currentSeed,
        params,
        outputPreview: newResult.lines[0] || '',
        timestamp: Date.now(),
      })
      
      updateURL(currentSeed, params)
      setIsGenerating(false)
    }, 100)
  }, [length, lines, seed, getOrCreateSeed, tool.slug])

  const reroll = useCallback(() => {
    const newSeed = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    setSeed(newSeed)
    generate()
  }, [generate])

  const repeat = useCallback(() => {
    generate()
  }, [generate])

  const updateURL = (currentSeed: string, params: TextGeneratorParams) => {
    const url = new URL(window.location.href)
    url.searchParams.set("length", params.length)
    url.searchParams.set("lines", String(params.lines))
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

  const shareUrl = () => {
    const currentSeed = seed || getOrCreateSeed()
    const params = new URLSearchParams({
      length,
      lines: String(lines),
      seed: currentSeed,
    })
    return `${window.location.origin}/random-text-generator?${params.toString()}`
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
        onCopy={() => result ? navigator.clipboard.writeText(result.text) : undefined}
        onShare={shareUrl}
      >
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="length">Text Length</Label>
              <Select value={length} onValueChange={(v: 'short' | 'medium' | 'long') => setLength(v)}>
                <SelectTrigger id="length">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">Short (5 words per line)</SelectItem>
                  <SelectItem value="medium">Medium (10 words per line)</SelectItem>
                  <SelectItem value="long">Long (20 words per line)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lines">Number of Lines: {lines}</Label>
              <Input
                id="lines"
                type="number"
                value={lines}
                onChange={(e) => setLines(Number(e.target.value))}
                min={1}
                max={50}
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
              {isGenerating ? "Generating..." : "Generate Text"}
            </Button>
          </div>

          <div className="space-y-4">
            {isGenerating ? (
              <div className="border rounded-lg p-12 text-center text-muted-foreground">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                Generating...
              </div>
            ) : result ? (
              <RollingReveal delay={300}>
                <div className="space-y-4">
                  <Textarea
                    value={result.text}
                    readOnly
                    rows={10}
                    className="font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    onClick={() => navigator.clipboard.writeText(result.text)}
                    className="w-full"
                  >
                    Copy Text
                  </Button>
                </div>
              </RollingReveal>
            ) : (
              <div className="border rounded-lg p-12 text-center text-muted-foreground">
                Click "Generate Text" to start
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
