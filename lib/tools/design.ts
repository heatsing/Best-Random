import { Palette } from "lucide-react"
import type { ToolConfig } from "../registry"

// Random Color Generator
export const randomColorTool: ToolConfig = {
  slug: "random-color-generator",
  category: "design",
  name: "Random Color Generator",
  shortDescription: "Generate random colors instantly",
  longDescription: "Generate random colors instantly. Create color palettes with up to 10 colors, lock any color to keep it unchanged while regenerating others, and export colors in HEX, RGB, or HSL formats.",
  generatorType: "color",
  defaultOptions: {
    count: 5,
    format: "hex"
  },
  optionSchema: {
    fields: [
      { key: "count", label: "Palette Size", type: "number", default: 5, min: 1, max: 10 },
      {
        key: "format",
        label: "Color Format",
        type: "select",
        default: "hex",
        options: [
          { value: "hex", label: "HEX" },
          { value: "rgb", label: "RGB" },
          { value: "hsl", label: "HSL" }
        ]
      }
    ]
  },
  run: (ctx) => {
    const { count, format } = ctx.options
    const rng = ctx.rng
    const results: any[] = []

    for (let i = 0; i < count; i++) {
      const r = Math.floor(rng() * 256)
      const g = Math.floor(rng() * 256)
      const b = Math.floor(rng() * 256)

      const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
      const rgb = `rgb(${r}, ${g}, ${b})`

      // Convert to HSL
      const rNorm = r / 255
      const gNorm = g / 255
      const bNorm = b / 255

      const max = Math.max(rNorm, gNorm, bNorm)
      const min = Math.min(rNorm, gNorm, bNorm)
      let h = 0
      let s = 0
      const l = (max + min) / 2

      if (max !== min) {
        const d = max - min
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

        switch (max) {
          case rNorm:
            h = ((gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0)) / 6
            break
          case gNorm:
            h = ((bNorm - rNorm) / d + 2) / 6
            break
          case bNorm:
            h = ((rNorm - gNorm) / d + 4) / 6
            break
        }
      }

      const hDeg = Math.round(h * 360)
      const sPercent = Math.round(s * 100)
      const lPercent = Math.round(l * 100)
      const hsl = `hsl(${hDeg}, ${sPercent}%, ${lPercent}%)`

      const formatted = format === 'hex' ? hex : format === 'rgb' ? rgb : hsl

      results.push({
        id: `color-${i}`,
        value: formatted,
        formatted,
        hex,
        rgb,
        hsl,
        rgbValues: { r, g, b },
        hslValues: { h: hDeg, s: sPercent, l: lPercent }
      })
    }

    return {
      items: results,
      meta: {
        seedUsed: ctx.seed,
        count: results.length,
        generatedAt: Date.now()
      },
      previewText: `${results.length} colors generated`
    }
  },
  seo: {
    title: "Random Color Generator – HEX, RGB & HSL | BestRandom",
    description: "Generate random colors instantly. Create color palettes, lock colors, and export HEX, RGB, or HSL values.",
    h1: "Random Color Generator",
    faq: [
      { question: "What color formats are supported?", answer: "HEX, RGB, and HSL formats are supported." },
      { question: "Can I generate a color palette?", answer: "Yes. Generate palettes with up to 10 colors." },
      { question: "Can I lock a color and regenerate others?", answer: "Yes. Lock any color to keep it unchanged." },
      { question: "Can I repeat the same colors?", answer: "Yes. Use the same seed to reproduce the palette." },
      { question: "Can I export colors?", answer: "Yes. Export as CSS variables or copy values." },
      { question: "Is this tool free?", answer: "Yes. All features are free." }
    ]
  },
  icon: Palette,
  popular: true
}

export const designTools: ToolConfig[] = [
  randomColorTool
]
