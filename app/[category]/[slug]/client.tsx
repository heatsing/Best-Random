"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import * as React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { ToolLayout } from "@/components/ToolLayout"
import Script from "next/script"
import { generateFAQSchema } from "@/lib/seo"
import type { GeneratedResult } from "@/lib/registry"
import { createPRNG } from "@/lib/prng"
import { createCombinedSeed, getToolBySlug } from "@/lib/registry"

interface ToolPageClientProps {
  toolData: {
    slug: string
    category: string
    name: string
    shortDescription: string
    longDescription: string
    generatorType: string
    defaultOptions: Record<string, any>
    optionSchema: any
    seo: any
    icon?: any
    popular?: boolean
  }
}

export function ToolPageClient({ toolData }: ToolPageClientProps) {
  // Get full tool config including run function on client side
  const tool = getToolBySlug(toolData.slug)
  
  if (!tool) {
    return <div>Tool not found</div>
  }
  const searchParams = useSearchParams()
  const router = useRouter()
  
  // Initialize state from URL params or defaults
  const [seed, setSeed] = useState(() => searchParams.get("seed") || "")
  const [options, setOptions] = useState(() => {
    const opts = { ...toolData.defaultOptions }
    // Load from URL params
    toolData.optionSchema.fields.forEach((field: any) => {
      const param = searchParams.get(field.key)
      if (param !== null) {
        if (field.type === "number" || field.type === "range") {
          opts[field.key] = Number(param)
        } else if (field.type === "checkbox") {
          opts[field.key] = param === "true"
        } else {
          opts[field.key] = param
        }
      }
    })
    return opts
  })
  
  const [result, setResult] = useState<GeneratedResult | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Generate random seed if not provided
  const getOrCreateSeed = useCallback(() => {
    if (seed) return seed
    const newSeed = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    setSeed(newSeed)
    return newSeed
  }, [seed])

  // Generate results
  const generate = useCallback(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    setIsGenerating(true)
    
    timeoutRef.current = setTimeout(() => {
      try {
        const currentSeed = getOrCreateSeed()
        const combinedSeed = createCombinedSeed(currentSeed, options)
        const prng = createPRNG(combinedSeed)
        
        const ctx = {
          seed: combinedSeed,
          rng: () => prng.next(),
          options
        }
        
        const generated = tool.run(ctx)
        setResult(generated)
        
        // Update URL
        const params = new URLSearchParams({
          seed: currentSeed,
          ...Object.entries(options).reduce((acc, [k, v]) => {
            if (v !== null && v !== undefined && v !== '') {
              acc[k] = String(v)
            }
            return acc
          }, {} as Record<string, string>)
        })
        router.replace(`/${toolData.category}/${toolData.slug}?${params.toString()}`, { scroll: false })
      } catch (error) {
        console.error("Generation error:", error)
      } finally {
        setIsGenerating(false)
        timeoutRef.current = null
      }
    }, 100)
  }, [options, tool, getOrCreateSeed, router, toolData.category, toolData.slug])

  const handleRandomSeed = () => {
    const newSeed = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    setSeed(newSeed)
  }

  const handleOptionChange = (key: string, value: any) => {
    setOptions(prev => ({ ...prev, [key]: value }))
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [])

  return (
    <>
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFAQSchema(toolData.seo.faq)) }}
      />
      <ToolLayout
        tool={{
          slug: toolData.slug,
          category: toolData.category,
          name: toolData.name,
          longDescription: toolData.longDescription,
          optionSchema: toolData.optionSchema,
          seo: {
            h1: toolData.seo.h1
          }
        }}
        seed={seed || getOrCreateSeed()}
        options={options}
        result={result}
        isGenerating={isGenerating}
        onSeedChange={setSeed}
        onRandomSeed={handleRandomSeed}
        onOptionChange={handleOptionChange}
        onGenerate={generate}
        onRegenerate={generate}
      />
      
      {/* FAQ Section */}
      <div className="container py-8 max-w-6xl mx-auto mt-12">
        <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {toolData.seo.faq.map((faq: any, i: number) => (
            <div key={i} className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">{faq.question}</h3>
              <p className="text-muted-foreground">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
