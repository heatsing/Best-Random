import { Key } from "lucide-react"
import type { ToolConfig } from "../registry"

const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz'
const NUMBERS = '0123456789'
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?'

// Random Password Generator
export const randomPasswordTool: ToolConfig = {
  slug: "random-password-generator",
  category: "security",
  name: "Random Password Generator",
  shortDescription: "Create strong random passwords instantly",
  longDescription: "Create strong random passwords instantly. Control password length, choose which character types to include (uppercase, lowercase, numbers, symbols), exclude confusing characters, and generate multiple passwords at once. All passwords are generated locally and never stored.",
  generatorType: "password",
  defaultOptions: {
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: false,
    excludeAmbiguous: false,
    count: 1
  },
  optionSchema: {
    fields: [
      { key: "length", label: "Password Length", type: "number", default: 16, min: 4, max: 128 },
      { key: "count", label: "Count", type: "number", default: 1, min: 1, max: 20 },
      { key: "includeUppercase", label: "Uppercase (A-Z)", type: "checkbox", default: true },
      { key: "includeLowercase", label: "Lowercase (a-z)", type: "checkbox", default: true },
      { key: "includeNumbers", label: "Numbers (0-9)", type: "checkbox", default: true },
      { key: "includeSymbols", label: "Symbols (!@#$...)", type: "checkbox", default: false },
      { key: "excludeAmbiguous", label: "Exclude ambiguous (O0Il1)", type: "checkbox", default: false }
    ]
  },
  run: (ctx) => {
    const { length, includeUppercase, includeLowercase, includeNumbers, includeSymbols, excludeAmbiguous, count } = ctx.options
    const rng = ctx.rng
    
    let charset = ''
    if (includeUppercase) {
      charset += excludeAmbiguous ? UPPERCASE.replace(/[OIl]/g, '') : UPPERCASE
    }
    if (includeLowercase) {
      charset += excludeAmbiguous ? LOWERCASE.replace(/[o0il1]/g, '') : LOWERCASE
    }
    if (includeNumbers) {
      charset += excludeAmbiguous ? NUMBERS.replace(/[01]/g, '') : NUMBERS
    }
    if (includeSymbols) {
      charset += SYMBOLS
    }

    if (charset.length === 0) {
      return {
        items: Array.from({ length: count }, (_, i) => ({
          id: `password-${i}`,
          value: '',
          formatted: '',
          strength: 'weak',
          entropy: 0
        })),
        meta: { seedUsed: ctx.seed, count, generatedAt: Date.now() },
        previewText: ""
      }
    }

    const results: any[] = []

    for (let i = 0; i < count; i++) {
      let password = ''
      for (let j = 0; j < length; j++) {
        password += charset[Math.floor(rng() * charset.length)]
      }

      const entropy = Math.log2(Math.pow(charset.length, length))
      let strength: 'weak' | 'medium' | 'strong' | 'very-strong'
      if (entropy < 40) {
        strength = 'weak'
      } else if (entropy < 60) {
        strength = 'medium'
      } else if (entropy < 80) {
        strength = 'strong'
      } else {
        strength = 'very-strong'
      }

      results.push({
        id: `password-${i}`,
        value: password,
        formatted: password,
        strength,
        entropy
      })
    }

    return {
      items: results,
      meta: {
        seedUsed: ctx.seed,
        count: results.length,
        generatedAt: Date.now()
      },
      previewText: results.length > 0 ? `${results.length} password(s) generated` : ""
    }
  },
  seo: {
    title: "Random Password Generator – Secure & Customizable | BestRandom",
    description: "Create strong random passwords instantly. Control length, characters, and generate multiple secure passwords at once.",
    h1: "Random Password Generator",
    faq: [
      { question: "Are the generated passwords secure?", answer: "Yes. They use randomized character selection." },
      { question: "Can I include symbols and numbers?", answer: "Yes. You can enable or disable each character type." },
      { question: "Can I exclude confusing characters?", answer: "Yes. Exclude characters like O, 0, I, and l." },
      { question: "Can I generate multiple passwords?", answer: "Yes. Generate several passwords at once." },
      { question: "Is password generation repeatable?", answer: "Yes. The same seed reproduces the same passwords." },
      { question: "Is any password stored?", answer: "No. All passwords are generated locally." }
    ]
  },
  icon: Key,
  popular: true
}

export const securityTools: ToolConfig[] = [
  randomPasswordTool
]
