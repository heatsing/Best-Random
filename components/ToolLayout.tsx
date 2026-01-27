"use client"

import { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { SeedBar } from "./SeedBar"
import { OptionsRenderer } from "./OptionsRenderer"
import { ResultList } from "./ResultList"
import { RollingReveal } from "./RollingReveal"
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
    <div className={`container py-8 max-w-6xl mx-auto ${className || ""}`}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{tool.seo.h1}</h1>
        <p className="text-muted-foreground text-lg">{tool.longDescription}</p>
      </div>

      {/* Seed Bar */}
      <div className="mb-6 p-4 bg-muted/50 rounded-lg border">
        <SeedBar
          seed={seed}
          onSeedChange={onSeedChange}
          onRandomSeed={onRandomSeed}
          onShare={handleShare}
        />
      </div>

      {/* Main Content */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Options Panel */}
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Options</h2>
            <OptionsRenderer
              schema={tool.optionSchema}
              values={options}
              onChange={onOptionChange}
            />
          </div>
          
          <Button
            onClick={result ? onRegenerate : onGenerate}
            className="w-full"
            size="lg"
            disabled={isGenerating}
            aria-label={isGenerating ? "Generating results" : result ? "Regenerate results" : "Generate results"}
            aria-busy={isGenerating}
          >
            {isGenerating ? "Generating..." : result ? "Regenerate" : "Generate"}
          </Button>
        </div>

        {/* Results Panel */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Results</h2>
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
            <div key="generating" className="border rounded-lg p-12 text-center text-muted-foreground">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              Generating...
            </div>
          ) : result && result.items.length > 0 ? (
            <RollingReveal key="results" delay={300}>
              <ResultList
                items={resultItems}
                onCopyAll={handleCopyAll}
                onDownloadCSV={handleDownloadCSV}
                showDownload={true}
              />
            </RollingReveal>
          ) : (
            <div key="empty" className="border rounded-lg p-12 text-center text-muted-foreground">
              Click &quot;Generate&quot; to create results
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
