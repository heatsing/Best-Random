"use client"

import { ReactNode } from "react"
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

  const handleCopyAll = () => {
    if (!result) return ""
    return result.items.map((item: any) => {
      if (typeof item === 'string') return item
      if (item.value !== undefined) return String(item.value)
      if (item.formatted !== undefined) return String(item.formatted)
      return JSON.stringify(item)
    }).join("\n")
  }

  const handleDownloadCSV = () => {
    if (!result) return
    
    const csv = result.items.map((item: any) => {
      if (typeof item === 'string') return item
      if (item.value !== undefined) return String(item.value)
      if (item.formatted !== undefined) return String(item.formatted)
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
    let value: string | ReactNode
    if (typeof item === 'string') {
      value = item
    } else if (item.value !== undefined) {
      value = String(item.value)
    } else if (item.formatted !== undefined) {
      value = item.formatted
    } else {
      value = JSON.stringify(item)
    }
    
    return {
      id: item.id || `item-${i}`,
      value,
      locked: item.locked
    }
  }) || []

  return (
    <div className={`min-h-screen ${className || ""}`}>
      {/* Header Section with Structural Line */}
      <section className="border-b-2 border-border">
        <div className="container max-w-7xl mx-auto px-6 py-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">{tool.seo.h1}</h1>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-3xl">{tool.longDescription}</p>
        </div>
      </section>

      {/* Seed Bar with Structural Border */}
      <section className="border-b-2 border-border">
        <div className="container max-w-7xl mx-auto px-6 py-6">
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
        <div className="container max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-2 gap-8 border-t-2 border-border pt-12">
        {/* Options Panel with Structural Border */}
        <div className="space-y-6 border-r-2 border-border pr-8">
          <div>
            <h2 className="text-xl font-semibold mb-6 tracking-tight border-b-2 border-border pb-3">Options</h2>
            <div className="space-y-4">
              <OptionsRenderer
                schema={tool.optionSchema}
                values={options}
                onChange={onOptionChange}
              />
            </div>
          </div>
          
          <Button
            onClick={result ? onRegenerate : onGenerate}
            className="w-full border-2 border-primary bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
            size="lg"
            disabled={isGenerating}
            aria-label={isGenerating ? "Generating results" : result ? "Regenerate results" : "Generate results"}
            aria-busy={isGenerating}
          >
            {isGenerating ? "Generating..." : result ? "Regenerate" : "Generate"}
          </Button>
        </div>

        {/* Results Panel */}
        <div className="space-y-4 pl-8">
          <div className="flex items-center justify-between border-b-2 border-border pb-3">
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
