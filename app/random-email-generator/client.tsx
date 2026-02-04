"use client"

import { useState, useEffect, useCallback } from "react"
import { generateEmails, type EmailGeneratorParams } from "@/lib/generators/email"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GeneratorLayout } from "@/components/GeneratorLayout"
import { ResultList } from "@/components/ResultList"
import { RollingReveal, StaggeredList } from "@/components/RollingReveal"
import { useSearchParams, useRouter } from "next/navigation"
import { getToolBySlug } from "@/lib/tool-registry"
import { saveToHistory } from "@/lib/history"
import Script from "next/script"
import { generateFAQSchema } from "@/lib/seo"

const DOMAINS = [
  'gmail.com',
  'yahoo.com',
  'hotmail.com',
  'outlook.com',
  'icloud.com',
  'protonmail.com',
  'mail.com',
  'aol.com',
  'zoho.com',
  'yandex.com'
]

export function RandomEmailGeneratorClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const tool = getToolBySlug("random-email-generator")!
  
  const [count, setCount] = useState(Number(searchParams.get("count")) || 10)
  const [format, setFormat] = useState<'name' | 'random' | 'username'>(
    (searchParams.get("format") as 'name' | 'random' | 'username') || 'name'
  )
  const [domain, setDomain] = useState(searchParams.get("domain") || "")
  const [seed, setSeed] = useState(searchParams.get("seed") || "")
  const [results, setResults] = useState<ReturnType<typeof generateEmails>>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const getOrCreateSeed = useCallback(() => {
    const newSeed = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    setSeed(newSeed)
    return newSeed
  }, [])

  const updateURL = useCallback((currentSeed: string, params: EmailGeneratorParams) => {
    const url = new URL(window.location.href)
    url.searchParams.set("count", String(params.count))
    url.searchParams.set("format", params.format || 'name')
    if (params.domain) {
      url.searchParams.set("domain", params.domain)
    } else {
      url.searchParams.delete("domain")
    }
    url.searchParams.set("seed", currentSeed)
    router.replace(url.pathname + url.search, { scroll: false })
  }, [router])

  const generate = useCallback((overrideSeed?: string) => {
    setIsGenerating(true)
    
    setTimeout(() => {
      const currentSeed = overrideSeed || getOrCreateSeed()
      const params: EmailGeneratorParams = {
        count,
        format,
        domain: domain || undefined,
        seed: currentSeed,
      }
      
      const newResults = generateEmails(params)
      setResults(newResults)
      
      saveToHistory({
        toolSlug: tool.slug,
        seed: currentSeed,
        params,
        outputPreview: newResults.slice(0, 3).map(r => r.email).join(", "),
        timestamp: Date.now(),
      })
      
      updateURL(currentSeed, params)
      setIsGenerating(false)
    }, 100)
  }, [count, format, domain, getOrCreateSeed, tool.slug, updateURL])

  const reroll = useCallback(() => {
    const newSeed = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    setSeed(newSeed)
    generate(newSeed)
  }, [generate])

  const repeat = useCallback(() => {
    // Generate new seed for each regeneration to get different results
    const newSeed = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    setSeed(newSeed)
    generate(newSeed)
  }, [generate])

  useEffect(() => {
    const urlSeed = searchParams.get("seed")
    if (urlSeed) {
      setSeed(urlSeed)
      // Don't auto-generate on load, let user click
    }
  }, [searchParams])

  const handleCopyAll = () => {
    return results.map(r => r.email).join("\n")
  }

  const handleDownloadCSV = () => {
    const csv = results.map(r => r.email).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'random-emails.csv'
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
    if (domain) {
      params.set("domain", domain)
    }
    return `${window.location.origin}/random-email-generator?${params.toString()}`
  }

  const resultItems = results.map(r => ({
    id: r.id,
    value: r.email,
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
              <Label htmlFor="format">Email Format</Label>
              <Select value={format} onValueChange={(v: 'name' | 'random' | 'username') => setFormat(v)}>
                <SelectTrigger id="format">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name-based (firstname.lastname123)</SelectItem>
                  <SelectItem value="username">Username (randomusername123)</SelectItem>
                  <SelectItem value="random">Random (randomstring123)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="domain">Domain (optional, leave empty for random)</Label>
              <Select value={domain} onValueChange={setDomain}>
                <SelectTrigger id="domain">
                  <SelectValue placeholder="Random domain" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Random domain</SelectItem>
                  {DOMAINS.map(d => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="Or enter custom domain"
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
              {isGenerating ? "Generating..." : "Generate Emails"}
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
                Click "Generate Emails" to start
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
