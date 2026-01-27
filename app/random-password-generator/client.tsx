"use client"

import { useState, useEffect, useCallback } from "react"
import { generatePasswords, type PasswordGeneratorParams } from "@/lib/generators/password"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { GeneratorLayout } from "@/components/GeneratorLayout"
import { ResultList } from "@/components/ResultList"
import { RollingReveal } from "@/components/RollingReveal"
import { useSearchParams, useRouter } from "next/navigation"
import { getToolBySlug } from "@/lib/tool-registry"
import { saveToHistory } from "@/lib/history"
import Script from "next/script"
import { generateFAQSchema } from "@/lib/seo"
import { CheckCircle2, AlertCircle, XCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function RandomPasswordGeneratorClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const tool = getToolBySlug("random-password-generator")!
  const { toast } = useToast()
  
  const [length, setLength] = useState(Number(searchParams.get("length")) || 16)
  const [includeUppercase, setIncludeUppercase] = useState(searchParams.get("includeUppercase") !== "false")
  const [includeLowercase, setIncludeLowercase] = useState(searchParams.get("includeLowercase") !== "false")
  const [includeNumbers, setIncludeNumbers] = useState(searchParams.get("includeNumbers") !== "false")
  const [includeSymbols, setIncludeSymbols] = useState(searchParams.get("includeSymbols") === "true")
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(searchParams.get("excludeAmbiguous") === "true")
  const [count, setCount] = useState(Number(searchParams.get("count")) || 1)
  const [seed, setSeed] = useState(searchParams.get("seed") || "")
  const [results, setResults] = useState<ReturnType<typeof generatePasswords>>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const getOrCreateSeed = useCallback(() => {
    if (seed) return seed
    const newSeed = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    setSeed(newSeed)
    return newSeed
  }, [seed])

  const updateURL = useCallback((currentSeed: string, params: PasswordGeneratorParams) => {
    const url = new URL(window.location.href)
    url.searchParams.set("length", String(params.length))
    url.searchParams.set("includeUppercase", String(params.includeUppercase))
    url.searchParams.set("includeLowercase", String(params.includeLowercase))
    url.searchParams.set("includeNumbers", String(params.includeNumbers))
    url.searchParams.set("includeSymbols", String(params.includeSymbols))
    url.searchParams.set("excludeAmbiguous", String(params.excludeAmbiguous))
    url.searchParams.set("count", String(params.count || 1))
    url.searchParams.set("seed", currentSeed)
    router.replace(url.pathname + url.search, { scroll: false })
  }, [router])

  const generate = useCallback(() => {
    if (!includeUppercase && !includeLowercase && !includeNumbers && !includeSymbols) {
      toast({
        title: "Invalid settings",
        description: "Please enable at least one character type",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    
    setTimeout(() => {
      const currentSeed = getOrCreateSeed()
      const params: PasswordGeneratorParams = {
        length,
        includeUppercase,
        includeLowercase,
        includeNumbers,
        includeSymbols,
        excludeAmbiguous,
        count,
        seed: currentSeed,
      }
      
      const newResults = generatePasswords(params)
      setResults(newResults)
      
      saveToHistory({
        toolSlug: tool.slug,
        seed: currentSeed,
        params,
        outputPreview: `${newResults.length} password(s) generated`,
        timestamp: Date.now(),
      })
      
      updateURL(currentSeed, params)
      setIsGenerating(false)
    }, 100)
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols, excludeAmbiguous, count, getOrCreateSeed, tool.slug, toast, updateURL])

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
    return results.map(r => r.password).join("\n")
  }

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case "weak":
        return "text-red-500"
      case "medium":
        return "text-yellow-500"
      case "strong":
        return "text-blue-500"
      case "very-strong":
        return "text-green-500"
      default:
        return "text-muted-foreground"
    }
  }

  const getStrengthIcon = (strength: string) => {
    switch (strength) {
      case "weak":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "medium":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case "strong":
        return <CheckCircle2 className="h-5 w-5 text-blue-500" />
      case "very-strong":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      default:
        return null
    }
  }

  const getStrengthText = (strength: string) => {
    switch (strength) {
      case "weak":
        return "Weak"
      case "medium":
        return "Medium"
      case "strong":
        return "Strong"
      case "very-strong":
        return "Very Strong"
      default:
        return "Unknown"
    }
  }

  const shareUrl = () => {
    const currentSeed = seed || getOrCreateSeed()
    const params = new URLSearchParams({
      length: String(length),
      includeUppercase: String(includeUppercase),
      includeLowercase: String(includeLowercase),
      includeNumbers: String(includeNumbers),
      includeSymbols: String(includeSymbols),
      excludeAmbiguous: String(excludeAmbiguous),
      count: String(count),
      seed: currentSeed,
    })
    return `${window.location.origin}/random-password-generator?${params.toString()}`
  }

  const resultItems = results.map(r => ({
    id: r.id,
    value: (
      <div className="space-y-2">
        <div className="font-mono text-lg break-all">{r.password}</div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            {getStrengthIcon(r.strength)}
            <span className={getStrengthColor(r.strength)}>
              {getStrengthText(r.strength)}
            </span>
          </div>
          <span className="text-muted-foreground">
            Entropy: {r.entropy.toFixed(2)} bits
          </span>
        </div>
      </div>
    ),
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
              <Label htmlFor="length">Password Length: {length}</Label>
              <Slider
                value={[length]}
                onValueChange={([value]) => setLength(value)}
                min={4}
                max={128}
                step={1}
              />
              <Input
                id="length"
                type="number"
                value={length}
                onChange={(e) => setLength(Number(e.target.value))}
                min={4}
                max={128}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="count">Count: {count}</Label>
              <Input
                id="count"
                type="number"
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                min={1}
                max={20}
              />
            </div>

            <div className="space-y-4">
              <Label>Character Types</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="uppercase"
                  checked={includeUppercase}
                  onCheckedChange={setIncludeUppercase}
                />
                <Label htmlFor="uppercase">Uppercase (A-Z)</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="lowercase"
                  checked={includeLowercase}
                  onCheckedChange={setIncludeLowercase}
                />
                <Label htmlFor="lowercase">Lowercase (a-z)</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="numbers"
                  checked={includeNumbers}
                  onCheckedChange={setIncludeNumbers}
                />
                <Label htmlFor="numbers">Numbers (0-9)</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="symbols"
                  checked={includeSymbols}
                  onCheckedChange={setIncludeSymbols}
                />
                <Label htmlFor="symbols">Symbols (!@#$%...)</Label>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="ambiguous"
                checked={excludeAmbiguous}
                onCheckedChange={setExcludeAmbiguous}
              />
              <Label htmlFor="ambiguous">Exclude ambiguous (O0Il1)</Label>
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
              {isGenerating ? "Generating..." : "Generate Passwords"}
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
                  showDownload={false}
                />
              </RollingReveal>
            ) : (
              <div className="border rounded-lg p-12 text-center text-muted-foreground">
                Click "Generate Passwords" to start
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
