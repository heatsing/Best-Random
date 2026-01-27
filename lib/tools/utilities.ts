import { Code, Type, Phone } from "lucide-react"
import type { ToolConfig } from "../registry"

// Random Letter Generator
export const randomLetterTool: ToolConfig = {
  slug: "random-letter-generator",
  category: "utilities",
  name: "Random Letter Generator",
  shortDescription: "Generate random letters",
  longDescription: "Easily generate a list of randomized letters (A-Z) or add more characters like numbers or symbols. Then just choose how many characters you want to see.",
  generatorType: "list",
  defaultOptions: {
    count: 10,
    includeNumbers: false,
    includeSymbols: false,
    uppercase: true,
    unique: false
  },
  optionSchema: {
    fields: [
      { key: "count", label: "Count", type: "number", default: 10, min: 1, max: 100 },
      { key: "includeNumbers", label: "Include numbers (0-9)", type: "checkbox", default: false },
      { key: "includeSymbols", label: "Include symbols", type: "checkbox", default: false },
      { key: "uppercase", label: "Uppercase", type: "checkbox", default: true },
      { key: "unique", label: "Unique characters", type: "checkbox", default: false }
    ]
  },
  run: (ctx) => {
    const { count, includeNumbers, includeSymbols, uppercase, unique } = ctx.options
    const rng = ctx.rng
    const results: any[] = []
    const seen = new Set<string>()

    let charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    if (includeNumbers) charset += "0123456789"
    if (includeSymbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?"

    if (!uppercase) {
      charset = charset.toLowerCase()
    }

    for (let i = 0; i < count; i++) {
      let char: string
      let attempts = 0

      do {
        char = charset[Math.floor(rng() * charset.length)]
        attempts++
      } while (unique && seen.has(char) && attempts < 1000)

      seen.add(char)

      results.push({
        id: `letter-${i}`,
        value: char,
        formatted: char
      })
    }

    return {
      items: results,
      meta: {
        seedUsed: ctx.seed,
        count: results.length,
        generatedAt: Date.now()
      },
      previewText: results.slice(0, 10).map(r => r.value).join("")
    }
  },
  seo: {
    title: "Random Letter Generator – A-Z Letters & More | BestRandom",
    description: "Easily generate a list of randomized letters (A-Z) or add more characters like numbers or symbols.",
    h1: "Random Letter Generator",
    faq: [
      { question: "What characters can be generated?", answer: "Letters A-Z, optionally with numbers 0-9 and symbols." },
      { question: "Can I use lowercase letters?", answer: "Yes. Disable 'Uppercase' to use lowercase letters." },
      { question: "Can I generate multiple letters?", answer: "Yes. Choose how many characters to generate." },
      { question: "Can I repeat the same result?", answer: "Yes. Use the same seed to reproduce results." },
      { question: "Is this tool free?", answer: "Yes. No limits or sign-up required." }
    ]
  },
  icon: Type,
  popular: false
}

// Random Phone Number Generator
export const randomPhoneNumberTool: ToolConfig = {
  slug: "random-phone-number-generator",
  category: "utilities",
  name: "Random Phone Number Generator",
  shortDescription: "Generate random phone numbers",
  longDescription: "Generate random phone numbers instantly. Perfect for testing, games, or fake contact info. Rerun for a new number every time!",
  generatorType: "list",
  defaultOptions: {
    count: 10,
    format: "US",
    unique: false
  },
  optionSchema: {
    fields: [
      { key: "count", label: "Count", type: "number", default: 10, min: 1, max: 100 },
      {
        key: "format",
        label: "Format",
        type: "select",
        default: "US",
        options: [
          { value: "US", label: "US (XXX) XXX-XXXX" },
          { value: "International", label: "International +1 XXX XXX XXXX" }
        ]
      },
      { key: "unique", label: "Unique numbers", type: "checkbox", default: false }
    ]
  },
  run: (ctx) => {
    const { count, format, unique } = ctx.options
    const rng = ctx.rng
    const results: any[] = []
    const seen = new Set<string>()

    const generatePhoneNumber = (): string => {
      const areaCode = Math.floor(100 + rng() * 800) // 100-899
      const exchange = Math.floor(200 + rng() * 800) // 200-999
      const number = Math.floor(1000 + rng() * 9000) // 1000-9999

      if (format === "US") {
        return `(${areaCode}) ${exchange}-${number}`
      } else {
        return `+1 ${areaCode} ${exchange} ${number}`
      }
    }

    for (let i = 0; i < count; i++) {
      let phone: string
      let attempts = 0

      do {
        phone = generatePhoneNumber()
        attempts++
      } while (unique && seen.has(phone) && attempts < 1000)

      seen.add(phone)

      results.push({
        id: `phone-${i}`,
        value: phone,
        formatted: phone
      })
    }

    return {
      items: results,
      meta: {
        seedUsed: ctx.seed,
        count: results.length,
        generatedAt: Date.now()
      },
      previewText: results.slice(0, 3).map(r => r.value).join(", ")
    }
  },
  seo: {
    title: "Random Phone Number Generator – Fake Phone Numbers | BestRandom",
    description: "Generate random phone numbers instantly. Perfect for testing, games, or fake contact info.",
    h1: "Random Phone Number Generator",
    faq: [
      { question: "What formats are available?", answer: "US format (XXX) XXX-XXXX and International format +1 XXX XXX XXXX are available." },
      { question: "Are these real phone numbers?", answer: "No. These are randomly generated numbers for testing purposes only." },
      { question: "Can I generate multiple numbers?", answer: "Yes. Choose how many phone numbers to generate." },
      { question: "Can I repeat the same result?", answer: "Yes. Use the same seed to reproduce results." },
      { question: "Is this tool free?", answer: "Yes. No limits or sign-up required." }
    ]
  },
  icon: Phone,
  popular: true
}

export const utilitiesTools: ToolConfig[] = [
  randomLetterTool,
  randomPhoneNumberTool
]
