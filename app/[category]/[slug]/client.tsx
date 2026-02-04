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
    popular?: boolean
  }
}

export function ToolPageClient({ toolData }: ToolPageClientProps) {
  // All hooks MUST be called unconditionally at the top level
  const searchParams = useSearchParams()
  const router = useRouter()
  
  // Initialize state - start with defaults, will sync from URL in useEffect
  const [seed, setSeed] = useState<string>("")
  const [options, setOptions] = useState<Record<string, any>>(toolData.defaultOptions)
  const [result, setResult] = useState<GeneratedResult | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const initializedRef = useRef(false)
  
  // Initialize state from URL params on mount and when searchParams change
  useEffect(() => {
    if (initializedRef.current) return
    
    const urlSeed = searchParams.get("seed") || ""
    setSeed(urlSeed)
    
    const opts = { ...toolData.defaultOptions }
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
    setOptions(opts)
    initializedRef.current = true
  }, [searchParams, toolData.defaultOptions, toolData.optionSchema])
  
  // Sync state when searchParams change (after initial load)
  useEffect(() => {
    if (!initializedRef.current) return
    
    const urlSeed = searchParams.get("seed") || ""
    if (urlSeed !== seed) {
      setSeed(urlSeed)
    }
    
    const opts = { ...toolData.defaultOptions }
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
    
    setOptions(opts)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])
  
  // Get full tool config including run function on client side
  const tool = getToolBySlug(toolData.slug)

  // Generate results - always creates a fresh seed for new results
  const generate = useCallback(() => {
    if (!tool) return

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    setIsGenerating(true)

    timeoutRef.current = setTimeout(() => {
      try {
        const currentSeed = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
        setSeed(currentSeed)
        const combinedSeed = createCombinedSeed(currentSeed, options)
        const prng = createPRNG(combinedSeed)
        
        const ctx = {
          seed: combinedSeed,
          rng: () => prng.next(),
          options
        }
        
        // Handle both sync and async run functions
        const runResult = tool.run(ctx)
        
        const updateURLAndFinish = (generated: GeneratedResult) => {
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
          
          setIsGenerating(false)
          timeoutRef.current = null
        }
        
        if (runResult instanceof Promise) {
          runResult.then(updateURLAndFinish).catch(error => {
            console.error("Generation error:", error)
            setIsGenerating(false)
            timeoutRef.current = null
          })
        } else {
          updateURLAndFinish(runResult)
        }
      } catch (error) {
        console.error("Generation error:", error)
        setIsGenerating(false)
        timeoutRef.current = null
      }
    }, 100)
  }, [options, tool, router, toolData.category, toolData.slug])

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

  if (!tool) {
    return <div>Tool not found</div>
  }

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
          generatorType: toolData.generatorType,
          seo: {
            h1: toolData.seo.h1
          }
        }}
        seed={seed}
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
