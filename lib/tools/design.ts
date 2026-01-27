import { Palette, Sparkles } from "lucide-react"
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

// Gradient Generator
export const gradientGeneratorTool: ToolConfig = {
  slug: "gradient-generator",
  category: "design",
  name: "Gradient Generator",
  shortDescription: "Generate beautiful CSS gradients",
  longDescription: "Generate beautiful CSS gradients instantly. Create linear, radial, or conic gradients with customizable colors and angles. Export CSS code ready to use in your projects.",
  generatorType: "gradient",
  defaultOptions: {
    type: "linear",
    colorCount: 3,
    angle: 90
  },
  optionSchema: {
    fields: [
      {
        key: "type",
        label: "Gradient Type",
        type: "select",
        default: "linear",
        options: [
          { value: "linear", label: "Linear" },
          { value: "radial", label: "Radial" },
          { value: "conic", label: "Conic (Angular)" }
        ]
      },
      { key: "colorCount", label: "Number of Colors", type: "number", default: 3, min: 2, max: 10 },
      { key: "angle", label: "Angle (degrees)", type: "number", default: 90, min: 0, max: 360, helpText: "Only applies to linear and conic gradients" }
    ]
  },
  run: (ctx) => {
    const { type, colorCount, angle } = ctx.options
    const rng = ctx.rng
    
    // Generate colors
    const colors: string[] = []
    for (let i = 0; i < colorCount; i++) {
      const r = Math.floor(rng() * 256)
      const g = Math.floor(rng() * 256)
      const b = Math.floor(rng() * 256)
      const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
      colors.push(hex)
    }
    
    // Generate color stops with positions
    const stops = colors.map((color, i) => {
      const position = Math.round((i / (colors.length - 1)) * 100)
      return { color, position }
    })
    
    // Generate CSS
    let css = ""
    if (type === "linear") {
      css = `linear-gradient(${angle}deg, ${stops.map(s => `${s.color} ${s.position}%`).join(", ")})`
    } else if (type === "radial") {
      css = `radial-gradient(circle, ${stops.map(s => `${s.color} ${s.position}%`).join(", ")})`
    } else {
      // conic
      css = `conic-gradient(from ${angle}deg, ${stops.map(s => `${s.color} ${s.position}%`).join(", ")})`
    }
    
    const fullCSS = `background: ${css};`
    
    return {
      items: [{
        id: "gradient-1",
        value: css,
        formatted: css,
        type,
        colors,
        stops,
        angle: type !== "radial" ? angle : undefined,
        css: fullCSS,
        cssProperty: css
      }],
      meta: {
        seedUsed: ctx.seed,
        count: 1,
        generatedAt: Date.now()
      },
      previewText: `${type} gradient with ${colorCount} colors`
    }
  },
  seo: {
    title: "Gradient Generator – CSS Gradients | BestRandom",
    description: "Generate beautiful CSS gradients instantly. Create linear, radial, or conic gradients with customizable colors and export CSS code.",
    h1: "Gradient Generator",
    faq: [
      { question: "What gradient types are supported?", answer: "Linear, radial, and conic (angular) gradients are supported." },
      { question: "How many colors can I use?", answer: "You can use 2 to 10 colors in your gradient." },
      { question: "Can I customize the angle?", answer: "Yes. Set the angle for linear and conic gradients (0-360 degrees)." },
      { question: "Can I export CSS code?", answer: "Yes. Copy the CSS code directly to use in your projects." },
      { question: "Are gradients repeatable?", answer: "Yes. Use the same seed to reproduce the same gradient." }
    ]
  },
  icon: Sparkles,
  popular: true
}

export const designTools: ToolConfig[] = [
  randomColorTool,
  gradientGeneratorTool
]
