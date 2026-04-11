"use client"

import { ReactNode } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { SeedBar } from "./SeedBar"
import { OptionsRenderer } from "./OptionsRenderer"
import { ResultList } from "./ResultList"
import { GradientDisplay } from "./GradientDisplay"
import { RollingReveal } from "./RollingReveal"
import { ResultSkeleton, ColorSkeleton } from "./LoadingSkeleton"
import type { OptionSchema, GeneratedResult } from "@/lib/registry"
import { Download, FileJson } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface ToolLayoutProps {
  tool: {
    slug: string
    category: string
    name: string
    longDescription: string
    optionSchema: OptionSchema
    generatorType?: string
    seo: {
      h1: string
    }
  }
  seed: string
  options: Record<string, any>
  result: GeneratedResult | null
  isGenerating: boolean
  onSeedChange: (seed: string) => void
  onRandomSeed: () => void
  onOptionChange: (key: string, value: any) => void
  onGenerate: () => void
  onRegenerate: () => void
  className?: string
}

export function ToolLayout({
  tool,
  seed,
  options,
  result,
  isGenerating,
  onSeedChange,
  onRandomSeed,
  onOptionChange,
  onGenerate,
  onRegenerate,
  className
}: ToolLayoutProps) {
  const { toast } = useToast()

  const isStepStyleTool = [
    "lottery-quick-pick",
    "keno-quick-pick",
    "dice-roller-game",
    "birdie-fund-generator",
  ].includes(tool.slug)

  const stepIntroMap: Record<string, string> = {
    "lottery-quick-pick":
      "This form allows you to quick pick lottery tickets with configurable rules.",
    "keno-quick-pick":
      "This form allows you to quick pick random keno tickets with configurable rules.",
    "dice-roller-game":
      "This form allows you to roll virtual dice with a simple quantity control.",
    "birdie-fund-generator":
      "This form allows you to generate random birdie holes for golf funds.",
  }

  const stepOneTitleMap: Record<string, string> = {
    "lottery-quick-pick": "Step 1: Lottery Setup",
    "keno-quick-pick": "Step 1: Keno Setup",
    "dice-roller-game": "Step 1: Dice Setup",
    "birdie-fund-generator": "Part 1: The Golf Course",
  }

  const stepTwoTitleMap: Record<string, string> = {
    "lottery-quick-pick": "Step 2: Go!",
    "keno-quick-pick": "Step 2: Go!",
    "dice-roller-game": "Step 2: Go!",
    "birdie-fund-generator": "Part 2: Go!",
  }

  const handleCopyAll = () => {
    if (!result) return ""
    return result.items.map((item: any) => {
      if (typeof item === 'string') return item
      if (item.formatted !== undefined) return String(item.formatted)
      if (item.value !== undefined) return String(item.value)
      return JSON.stringify(item)
    }).join("\n")
  }

  const handleDownloadCSV = () => {
    if (!result) return
    
    const csv = result.items.map((item: any) => {
      if (typeof item === 'string') return item
      if (item.formatted !== undefined) return String(item.formatted)
      if (item.value !== undefined) return String(item.value)
      return JSON.stringify(item)
    }).join('\n')
    
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${tool.slug}-${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
    
    toast({
      title: "Downloaded",
      description: "CSV file downloaded",
    })
  }

  const handleDownloadJSON = () => {
    if (!result) return
    
    const json = JSON.stringify({
      tool: tool.name,
      seed: result.meta.seedUsed,
      options,
      items: result.items,
      generatedAt: new Date(result.meta.generatedAt).toISOString()
    }, null, 2)
    
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${tool.slug}-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
    
    toast({
      title: "Downloaded",
      description: "JSON file downloaded",
    })
  }

  const handleShare = () => {
    const params = new URLSearchParams({
      seed,
      ...Object.entries(options).reduce((acc, [k, v]) => {
        if (v !== null && v !== undefined && v !== '') {
          acc[k] = String(v)
        }
        return acc
      }, {} as Record<string, string>)
    })
    return `${window.location.origin}/${tool.category}/${tool.slug}?${params.toString()}`
  }

  const resultItems = result?.items.map((item: any, i: number) => {
    // Plain text used for copy/export
    let copyText: string
    if (typeof item === 'string') {
      copyText = item
    } else if (item.formatted !== undefined) {
      copyText = String(item.formatted)
    } else if (item.value !== undefined) {
      copyText = String(item.value)
    } else {
      copyText = JSON.stringify(item)
    }

    let value: string | ReactNode = copyText

    // Special display for random-country-generator: SVG flag + name text
    if (tool.slug === "random-country-generator" && typeof item === "object") {
      const code = (item.code || "").toLowerCase()
      const hasCode = code.length === 2
      const flagUrl = hasCode ? `https://flagcdn.com/${code}.svg` : undefined

      value = (
        <span className="inline-flex items-center gap-2">
          {flagUrl && (
            <Image
              src={flagUrl}
              alt={item.name ? `${item.name} flag` : "Country flag"}
              width={24}
              height={16}
              className="h-4 w-6 rounded-sm border border-border object-cover"
              unoptimized
            />
          )}
          <span>{copyText}</span>
        </span>
      )
    }
    
    return {
      id: item.id || `item-${i}`,
      value,
      copyText,
      locked: item.locked
    }
  }) || []

  return (
    <div className={`min-h-screen ${className || ""}`}>
      {/* Header Section with Structural Line */}
      <section className="border-b border-border bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-14">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">Generator</p>
          <h1 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
            {tool.seo.h1}
          </h1>
          <p className="max-w-3xl text-lg leading-relaxed text-muted-foreground">{tool.longDescription}</p>
          {isStepStyleTool && (
            <p className="text-muted-foreground mt-4 max-w-4xl">{stepIntroMap[tool.slug]}</p>
          )}
        </div>
      </section>

      {/* Seed Bar with Structural Border */}
      <section className="border-b border-border">
        <div className="container mx-auto max-w-7xl px-4 py-6 sm:px-6">
          <div className="structure-card">
            <SeedBar
              seed={seed}
              onSeedChange={onSeedChange}
              onRandomSeed={onRandomSeed}
              onShare={handleShare}
            />
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section>
        <div className="container mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-12">
          <div className="grid gap-10 border-t border-border pt-10 md:grid-cols-2 md:gap-0 md:divide-x md:divide-border md:pt-12">
        {/* Options Panel with Structural Border */}
        <div className="space-y-6 border-b border-border pb-10 md:border-b-0 md:pb-0 md:pr-10">
          <div>
            <h2 className="mb-6 border-b border-border pb-3 text-xl font-semibold tracking-tight">
              {isStepStyleTool ? stepOneTitleMap[tool.slug] : "Options"}
            </h2>
            <div className="space-y-4">
              <OptionsRenderer
                schema={tool.optionSchema}
                values={options}
                onChange={onOptionChange}
              />
            </div>
          </div>

          {isStepStyleTool && (
            <div className="text-sm text-muted-foreground border-t border-border pt-4">
              Be patient! It may take a little while to generate your results...
            </div>
          )}
          
          {isStepStyleTool && (
            <p className="text-sm font-medium">{stepTwoTitleMap[tool.slug]}</p>
          )}

          <Button
            onClick={result ? onRegenerate : onGenerate}
            className="w-full font-semibold shadow-sm"
            size="lg"
            disabled={isGenerating}
            aria-label={isGenerating ? "Generating results" : result ? "Regenerate results" : "Generate results"}
            aria-busy={isGenerating}
          >
            {isGenerating ? "Generating..." : result ? "Regenerate" : "Generate"}
          </Button>
        </div>

        {/* Results Panel */}
        <div className="space-y-4 md:pl-10">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h2 className="text-xl font-semibold tracking-tight">Results</h2>
            {result && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadCSV}
                  aria-label="Download results as CSV"
                >
                  <Download className="h-4 w-4 mr-2" aria-hidden="true" />
                  CSV
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadJSON}
                  aria-label="Download results as JSON"
                >
                  <FileJson className="h-4 w-4 mr-2" aria-hidden="true" />
                  JSON
                </Button>
              </div>
            )}
          </div>

          {isGenerating ? (
            <div key="generating" className="structure-card">
              {tool.generatorType === "color" || tool.generatorType === "gradient" ? (
                <ColorSkeleton count={options.count || 5} />
              ) : (
                <ResultSkeleton count={Math.min(options.count || 10, 10)} />
              )}
            </div>
          ) : result && result.items.length > 0 ? (
            tool.generatorType === "gradient" ? (
              <div key="results" className="structure-card">
                <GradientDisplay
                  gradient={result.items[0] as any}
                  onCopy={handleCopyAll}
                />
              </div>
            ) : (
              <RollingReveal key="results" delay={300}>
                <div className="structure-card">
                  <ResultList
                    items={resultItems}
                    onCopyAll={handleCopyAll}
                    onDownloadCSV={handleDownloadCSV}
                    showDownload={true}
                  />
                </div>
              </RollingReveal>
            )
          ) : (
            <div key="empty" className="structure-card text-center text-muted-foreground py-16">
              <p className="text-lg">Click &quot;Generate&quot; to create results</p>
            </div>
          )}
        </div>
          </div>
        </div>
      </section>
    </div>
  )
}
