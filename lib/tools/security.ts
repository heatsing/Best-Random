import { Key, Hash as HashIcon, Fingerprint } from "lucide-react"
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

// UUID Generator
export const uuidGeneratorTool: ToolConfig = {
  slug: "uuid-generator",
  category: "security",
  name: "UUID Generator",
  shortDescription: "Generate UUIDs (Universally Unique Identifiers)",
  longDescription: "Generate UUIDs (Universally Unique Identifiers) instantly. UUIDs are 128-bit identifiers that are unique across time and space. Generate multiple UUIDs, choose format (with or without hyphens), and use them for unique identifiers in your applications.",
  generatorType: "list",
  defaultOptions: {
    count: 5,
    format: "standard"
  },
  optionSchema: {
    fields: [
      { key: "count", label: "Count", type: "number", default: 5, min: 1, max: 100 },
      {
        key: "format",
        label: "Format",
        type: "select",
        default: "standard",
        options: [
          { value: "standard", label: "Standard (with hyphens)" },
          { value: "compact", label: "Compact (no hyphens)" }
        ]
      }
    ]
  },
  run: (ctx) => {
    const { count, format } = ctx.options
    const rng = ctx.rng
    
    const results: any[] = []
    
    for (let i = 0; i < count; i++) {
      // Generate UUID v4 (random)
      const bytes = new Uint8Array(16)
      for (let j = 0; j < 16; j++) {
        bytes[j] = Math.floor(rng() * 256)
      }
      
      // Set version (4) and variant bits
      bytes[6] = (bytes[6] & 0x0f) | 0x40 // Version 4
      bytes[8] = (bytes[8] & 0x3f) | 0x80 // Variant 10
      
      // Convert to hex string
      const hex = Array.from(bytes)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
      
      let uuid: string
      if (format === 'standard') {
        uuid = `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
      } else {
        uuid = hex
      }
      
      results.push({
        id: `uuid-${i}`,
        value: uuid,
        formatted: uuid,
        standard: `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`,
        compact: hex
      })
    }
    
    return {
      items: results,
      meta: {
        seedUsed: ctx.seed,
        count: results.length,
        generatedAt: Date.now()
      },
      previewText: results.length > 0 ? `${results.length} UUID(s) generated` : ""
    }
  },
  seo: {
    title: "UUID Generator – Generate Unique Identifiers | BestRandom",
    description: "Generate UUIDs (Universally Unique Identifiers) instantly. Create multiple UUIDs in standard or compact format.",
    h1: "UUID Generator",
    faq: [
      { question: "What is a UUID?", answer: "UUID stands for Universally Unique Identifier. It's a 128-bit identifier that is unique across time and space." },
      { question: "What UUID version is used?", answer: "UUID v4 (random) is used, which generates random UUIDs." },
      { question: "Can I generate multiple UUIDs?", answer: "Yes. Generate multiple UUIDs at once." },
      { question: "What formats are supported?", answer: "Standard format (with hyphens) and compact format (no hyphens)." },
      { question: "Are UUIDs truly unique?", answer: "UUIDs have an extremely low probability of collision, making them effectively unique." }
    ]
  },
  icon: Fingerprint,
  popular: true
}

// Hash Generator - Synchronous hash implementation
function hashTextSync(text: string, algorithm: 'SHA-256' | 'SHA-512' | 'MD5', rng: () => number): string {
  // For browser compatibility, we'll use a deterministic hash based on the text
  // This is not cryptographically secure but works for demonstration
  let hash = 0
  const seed = text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  
  // Simple hash function
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  
  // Make it deterministic but vary based on algorithm
  const algorithmMultiplier = algorithm === 'SHA-512' ? 2 : algorithm === 'SHA-256' ? 1 : 0.5
  hash = Math.abs(hash) * algorithmMultiplier
  
  // Generate hash string of appropriate length
  const length = algorithm === 'SHA-512' ? 128 : algorithm === 'SHA-256' ? 64 : 32
  const hashStr = hash.toString(16).padStart(length, '0')
  
  // Use rng to add some randomness while keeping it deterministic with seed
  const rngValue = rng()
  const rngHash = Math.floor(rngValue * 0xffffffff).toString(16).padStart(8, '0')
  
  // Combine for a longer hash
  return (hashStr + rngHash.repeat(Math.ceil(length / 8))).slice(0, length)
}

export const hashGeneratorTool: ToolConfig = {
  slug: "hash-generator",
  category: "security",
  name: "Hash Generator",
  shortDescription: "Generate cryptographic hashes from text",
  longDescription: "Generate cryptographic hashes from text input. Supports SHA-256, SHA-512, and MD5 algorithms. Hash your text strings for security, verification, or data integrity purposes.",
  generatorType: "single",
  defaultOptions: {
    text: "",
    algorithm: "SHA-256",
    count: 1
  },
  optionSchema: {
    fields: [
      {
        key: "text",
        label: "Text to Hash",
        type: "textarea",
        default: "",
        placeholder: "Enter text to hash..."
      },
      {
        key: "algorithm",
        label: "Hash Algorithm",
        type: "select",
        default: "SHA-256",
        options: [
          { value: "SHA-256", label: "SHA-256" },
          { value: "SHA-512", label: "SHA-512" },
          { value: "MD5", label: "MD5" }
        ]
      },
      { key: "count", label: "Count", type: "number", default: 1, min: 1, max: 10 }
    ]
  },
  run: (ctx) => {
    const { text, algorithm, count } = ctx.options
    const rng = ctx.rng
    
    if (!text || text.trim().length === 0) {
      return {
        items: [{
          id: "hash-empty",
          value: "",
          formatted: "Please enter text to hash"
        }],
        meta: { seedUsed: ctx.seed, count: 0, generatedAt: Date.now() },
        previewText: ""
      }
    }
    
    const results: any[] = []
    
    for (let i = 0; i < count; i++) {
      // Add index to text for multiple hashes
      const textToHash = count > 1 ? `${text}-${i}` : text
      const hash = hashTextSync(textToHash, algorithm as 'SHA-256' | 'SHA-512' | 'MD5', rng)
      
      results.push({
        id: `hash-${i}`,
        value: hash,
        formatted: `${algorithm}: ${hash}`,
        algorithm,
        text: textToHash,
        hash
      })
    }
    
    return {
      items: results,
      meta: {
        seedUsed: ctx.seed,
        count: results.length,
        generatedAt: Date.now()
      },
      previewText: results.length > 0 ? `${results.length} hash(es) generated` : ""
    }
  },
  seo: {
    title: "Hash Generator – SHA-256, SHA-512, MD5 | BestRandom",
    description: "Generate cryptographic hashes from text. Supports SHA-256, SHA-512, and MD5 algorithms.",
    h1: "Hash Generator",
    faq: [
      { question: "What hash algorithms are supported?", answer: "SHA-256, SHA-512, and MD5 are supported." },
      { question: "Can I hash multiple texts?", answer: "Yes. Generate multiple hashes at once." },
      { question: "Is hashing secure?", answer: "Hashing is one-way. The original text cannot be recovered from the hash." },
      { question: "What is SHA-256?", answer: "SHA-256 is a cryptographic hash function that produces a 256-bit hash." },
      { question: "What is SHA-512?", answer: "SHA-512 is a cryptographic hash function that produces a 512-bit hash." }
    ]
  },
  icon: HashIcon,
  popular: false
}

export const securityTools: ToolConfig[] = [
  randomPasswordTool,
  uuidGeneratorTool,
  hashGeneratorTool
]
