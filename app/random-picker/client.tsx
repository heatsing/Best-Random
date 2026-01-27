"use client"

import { useState, useEffect, useCallback } from "react"
import { pickRandomItem, type PickerItem, type PickerGeneratorParams } from "@/lib/generators/picker"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { GeneratorLayout } from "@/components/GeneratorLayout"
import { RollingReveal } from "@/components/RollingReveal"
import { useSearchParams, useRouter } from "next/navigation"
import { getToolBySlug } from "@/lib/tool-registry"
import { saveToHistory } from "@/lib/history"
import Script from "next/script"
import { generateFAQSchema } from "@/lib/seo"

export function RandomPickerClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const tool = getToolBySlug("random-picker")!
  
  const [itemsText, setItemsText] = useState(searchParams.get("items") || "")
  const [wheelMode, setWheelMode] = useState(searchParams.get("wheelMode") === "true")
  const [seed, setSeed] = useState(searchParams.get("seed") || "")
  const [result, setResult] = useState<ReturnType<typeof pickRandomItem> | null>(null)
  const [history, setHistory] = useState<ReturnType<typeof pickRandomItem>[]>([])
  const [isSpinning, setIsSpinning] = useState(false)
  const [wheelRotation, setWheelRotation] = useState(0)

  const items: PickerItem[] = itemsText
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .map((line, index) => {
      // Support format: "item:weight" or just "item"
      const parts = line.split(':')
      return {
        id: `item-${index}`,
        text: parts[0].trim(),
        weight: parts[1] ? Number(parts[1].trim()) || 1 : 1,
      }
    })

  const getOrCreateSeed = useCallback(() => {
    if (seed) return seed
    const newSeed = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    setSeed(newSeed)
    return newSeed
  }, [seed])

  const updateURL = useCallback((currentSeed: string) => {
    const url = new URL(window.location.href)
    url.searchParams.set("items", itemsText)
    url.searchParams.set("wheelMode", String(wheelMode))
    url.searchParams.set("seed", currentSeed)
    router.replace(url.pathname + url.search, { scroll: false })
  }, [router, itemsText, wheelMode])

  const pick = useCallback((newSeed?: string) => {
    if (items.length === 0) return

    const currentSeed = newSeed || getOrCreateSeed()
    
    if (wheelMode) {
      setIsSpinning(true)
      // Animate wheel
      const baseRotation = wheelRotation
      const spins = 5 + Math.random() * 3 // 5-8 spins
      const targetRotation = baseRotation + spins * 360
      
      // Animate
      let startTime: number | null = null
      const duration = 2000
      
      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp
        const progress = Math.min((timestamp - startTime) / duration, 1)
        const easeOut = 1 - Math.pow(1 - progress, 3)
        const currentRotation = baseRotation + (targetRotation - baseRotation) * easeOut
        setWheelRotation(currentRotation)
        
        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          setIsSpinning(false)
          const picked = pickRandomItem({
            items,
            seed: currentSeed,
            wheelMode: true,
          })
          setResult(picked)
          setHistory(prev => [picked, ...prev].slice(0, 20))
          
          saveToHistory({
            toolSlug: tool.slug,
            seed: currentSeed,
            params: { items, wheelMode: true },
            outputPreview: picked.item.text,
            timestamp: Date.now(),
          })
          
          updateURL(currentSeed)
        }
      }
      
      requestAnimationFrame(animate)
    } else {
      const picked = pickRandomItem({
        items,
        seed: currentSeed,
        wheelMode: false,
      })
      setResult(picked)
      setHistory(prev => [picked, ...prev].slice(0, 20))
      
      saveToHistory({
        toolSlug: tool.slug,
        seed: currentSeed,
        params: { items, wheelMode: false },
        outputPreview: picked.item.text,
        timestamp: Date.now(),
      })
      
      updateURL(currentSeed)
    }
  }, [items, getOrCreateSeed, wheelMode, wheelRotation, tool.slug, updateURL])

  const reroll = useCallback(() => {
    const newSeed = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    setSeed(newSeed)
    pick(newSeed)
  }, [pick])

  const repeat = useCallback(() => {
    pick()
  }, [pick])

  useEffect(() => {
    const urlSeed = searchParams.get("seed")
    const urlItems = searchParams.get("items")
    if (urlSeed && urlItems) {
      setSeed(urlSeed)
      setItemsText(urlItems)
      // Don't auto-pick on load, let user click
    }
  }, [searchParams])

  const shareUrl = () => {
    const currentSeed = seed || getOrCreateSeed()
    const params = new URLSearchParams({
      items: itemsText,
      wheelMode: String(wheelMode),
      seed: currentSeed,
    })
    return `${window.location.origin}/random-picker?${params.toString()}`
  }

  // Calculate wheel segments
  const totalWeight = items.reduce((sum, item) => sum + (item.weight || 1), 0)
  const segmentAngles = items.map(item => ((item.weight || 1) / totalWeight) * 360)

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
        onShare={shareUrl}
      >
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="items">Items (one per line, optional weight with :)</Label>
              <Textarea
                id="items"
                value={itemsText}
                onChange={(e) => setItemsText(e.target.value)}
                placeholder="Item 1&#10;Item 2:2&#10;Item 3"
                rows={10}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Format: "item" or "item:weight" (e.g., "Apple:2" means Apple has 2x weight)
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="wheelMode"
                checked={wheelMode}
                onCheckedChange={setWheelMode}
              />
              <Label htmlFor="wheelMode">Wheel mode (visual spin)</Label>
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
              disabled={items.length === 0 || isSpinning}
            >
              {isSpinning ? "Spinning..." : wheelMode ? "Spin Wheel" : "Pick Random"}
            </Button>

            {items.length > 0 && (
              <div className="text-sm text-muted-foreground">
                {items.length} item{items.length !== 1 ? 's' : ''} ready
              </div>
            )}
          </div>

          <div className="space-y-4">
            {wheelMode && items.length > 0 && (
              <div className="aspect-square relative">
                <div 
                  className="w-full h-full rounded-full border-4 border-primary relative overflow-hidden"
                  style={{
                    transform: `rotate(${wheelRotation}deg)`,
                    transition: isSpinning ? 'none' : 'transform 0.3s ease-out',
                  }}
                >
                  {items.map((item, index) => {
                    const startAngle = segmentAngles.slice(0, index).reduce((sum, angle) => sum + angle, 0)
                    const angle = segmentAngles[index]
                    const rotation = startAngle + angle / 2
                    
                    return (
                      <div
                        key={item.id}
                        className="absolute inset-0"
                        style={{
                          clipPath: `polygon(50% 50%, ${50 + 50 * Math.cos((startAngle - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin((startAngle - 90) * Math.PI / 180)}%, ${50 + 50 * Math.cos((startAngle + angle - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin((startAngle + angle - 90) * Math.PI / 180)}%)`,
                        }}
                      >
                        <div
                          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                          style={{
                            transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                            width: '100%',
                            height: '100%',
                          }}
                        >
                          <div className="text-xs font-medium text-center whitespace-nowrap" style={{ transform: 'rotate(90deg)' }}>
                            {item.text}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
                  <div className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-primary"></div>
                </div>
              </div>
            )}

            {result && (
              <RollingReveal delay={wheelMode ? 500 : 100}>
                <div className="border rounded-lg p-8 bg-muted/50 text-center">
                  <div className="text-sm text-muted-foreground mb-2">Selected:</div>
                  <div className="text-3xl font-bold">{result.item.text}</div>
                  {result.item.weight && result.item.weight !== 1 && (
                    <div className="text-sm text-muted-foreground mt-2">
                      Weight: {result.item.weight}
                    </div>
                  )}
                </div>
              </RollingReveal>
            )}

            {history.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">History</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {history.map((h, i) => (
                    <div key={i} className="p-2 border rounded text-sm">
                      {h.item.text}
                    </div>
                  ))}
                </div>
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
