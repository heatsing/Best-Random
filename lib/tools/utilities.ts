import { Code, Type, Phone, AtSign, MapPin, Package, Smile } from "lucide-react"
import type { ToolConfig } from "../registry"
import usernamesData from "@/data/usernames.json"
import addressesData from "@/data/addresses.json"
import itemsData from "@/data/items.json"
import emojisData from "@/data/emojis.json"

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
    title: "Random Letter Generator - A to Z | Numbers & Symbols | Free",
    description: "Generate random letters A-Z with optional numbers and symbols. Perfect for games, learning, password characters, or creative exercises. Free online!",
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
    title: "Random Phone Number Generator - Fake US Numbers for Testing",
    description: "Generate random US phone numbers in standard or international format. Ideal for form testing, app development, or placeholder data. Free online!",
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

// Random Username Generator
export const randomUsernameTool: ToolConfig = {
  slug: "random-username-generator",
  category: "utilities",
  name: "Random Username Generator",
  shortDescription: "Generate creative random usernames",
  longDescription: "Generate creative random usernames for social media, gaming, or any online account. Usernames are created by combining adjectives, nouns, and optional suffixes.",
  generatorType: "list",
  defaultOptions: {
    count: 10,
    style: "adjective_noun",
    unique: true
  },
  optionSchema: {
    fields: [
      { key: "count", label: "Count", type: "number", default: 10, min: 1, max: 50 },
      {
        key: "style",
        label: "Style",
        type: "select",
        default: "adjective_noun",
        options: [
          { value: "adjective_noun", label: "AdjectiveNoun (e.g., CoolWolf)" },
          { value: "adjective_noun_suffix", label: "AdjectiveNounSuffix (e.g., CoolWolf99)" },
          { value: "noun_suffix", label: "NounSuffix (e.g., Wolf99)" }
        ]
      },
      { key: "unique", label: "Unique usernames", type: "checkbox", default: true }
    ]
  },
  run: (ctx) => {
    const { count, style, unique } = ctx.options
    const rng = ctx.rng
    const results: any[] = []
    const seen = new Set<string>()

    const { adjectives, nouns, suffixes } = usernamesData

    for (let i = 0; i < count; i++) {
      let username: string
      let attempts = 0
      do {
        const adj = adjectives[Math.floor(rng() * adjectives.length)]
        const noun = nouns[Math.floor(rng() * nouns.length)]
        const suffix = suffixes[Math.floor(rng() * suffixes.length)]

        if (style === "adjective_noun") {
          username = `${adj}${noun}`
        } else if (style === "adjective_noun_suffix") {
          username = `${adj}${noun}${suffix}`
        } else {
          username = `${noun}${suffix}`
        }
        attempts++
      } while (unique && seen.has(username) && attempts < 1000)
      seen.add(username)

      results.push({
        id: `username-${i}`,
        value: username,
        formatted: username
      })
    }

    return {
      items: results,
      meta: { seedUsed: ctx.seed, count: results.length, generatedAt: Date.now() },
      previewText: results.slice(0, 3).map(r => r.value).join(", ")
    }
  },
  seo: {
    title: "Random Username Generator - Creative Usernames for Gaming & Social",
    description: "Generate creative usernames for gaming, social media, or online accounts. AdjectiveNoun, AdjectiveNounSuffix, or NounSuffix styles. Free & instant!",
    h1: "Random Username Generator",
    faq: [
      { question: "What styles are available?", answer: "AdjectiveNoun (e.g., CoolWolf), AdjectiveNounSuffix (e.g., CoolWolf99), and NounSuffix (e.g., Wolf99)." },
      { question: "Are usernames unique?", answer: "Yes, by default. Disable 'Unique usernames' to allow duplicates." },
      { question: "Can I repeat the same result?", answer: "Yes. Use the same seed to reproduce results." },
      { question: "Is this tool free?", answer: "Yes. No limits or sign-up required." }
    ]
  },
  icon: AtSign,
  popular: true
}

// Random Address Generator
export const randomAddressTool: ToolConfig = {
  slug: "random-address-generator",
  category: "utilities",
  name: "Random Address Generator",
  shortDescription: "Generate random US addresses",
  longDescription: "Generate random US street addresses with city, state, and ZIP code. Perfect for testing forms, development, or placeholder data. All addresses are fictional.",
  generatorType: "list",
  defaultOptions: {
    count: 5,
    unique: true
  },
  optionSchema: {
    fields: [
      { key: "count", label: "Count", type: "number", default: 5, min: 1, max: 20 },
      { key: "unique", label: "Unique addresses", type: "checkbox", default: true }
    ]
  },
  run: (ctx) => {
    const { count, unique } = ctx.options
    const rng = ctx.rng
    const results: any[] = []
    const seen = new Set<string>()

    const { streets, cities } = addressesData

    for (let i = 0; i < count; i++) {
      let address: string
      let attempts = 0
      do {
        const streetNum = Math.floor(100 + rng() * 9900)
        const street = streets[Math.floor(rng() * streets.length)]
        const city = cities[Math.floor(rng() * cities.length)]
        const zipSuffix = Math.floor(rng() * 90 + 10)
        address = `${streetNum} ${street}, ${city.name}, ${city.state} ${city.zip.substring(0, 3)}${zipSuffix}`
        attempts++
      } while (unique && seen.has(address) && attempts < 1000)
      seen.add(address)

      results.push({
        id: `address-${i}`,
        value: address,
        formatted: address
      })
    }

    return {
      items: results,
      meta: { seedUsed: ctx.seed, count: results.length, generatedAt: Date.now() },
      previewText: results.slice(0, 2).map(r => r.value).join("; ")
    }
  },
  seo: {
    title: "Random Address Generator - Fake US Addresses for Testing | Free",
    description: "Generate realistic fake US addresses with street, city, state & ZIP. Perfect for form testing, development, or mock data. Free online address generator!",
    h1: "Random Address Generator",
    faq: [
      { question: "Are these real addresses?", answer: "No. All addresses are randomly generated and fictional." },
      { question: "What format are the addresses?", answer: "US format: Street Number + Street Name, City, State ZIP." },
      { question: "Can I repeat the same result?", answer: "Yes. Use the same seed to reproduce results." },
      { question: "Is this tool free?", answer: "Yes. No limits or sign-up required." }
    ]
  },
  icon: MapPin,
  popular: true
}

// Random Item Generator
export const randomItemTool: ToolConfig = {
  slug: "random-item-generator",
  category: "utilities",
  name: "Random Item Generator",
  shortDescription: "Generate random everyday items",
  longDescription: "Generate random everyday items from categories like household, kitchen, office, outdoor, tech, and clothing. Over 120 items to discover. Great for scavenger hunts, creative writing, or games.",
  generatorType: "list",
  defaultOptions: {
    count: 10,
    category: "all",
    unique: true
  },
  optionSchema: {
    fields: [
      { key: "count", label: "Count", type: "number", default: 10, min: 1, max: 50 },
      {
        key: "category",
        label: "Category",
        type: "select",
        default: "all",
        options: [
          { value: "all", label: "All Categories" },
          { value: "household", label: "Household" },
          { value: "kitchen", label: "Kitchen" },
          { value: "office", label: "Office" },
          { value: "outdoor", label: "Outdoor" },
          { value: "tech", label: "Tech" },
          { value: "clothing", label: "Clothing" }
        ]
      },
      { key: "unique", label: "Unique items", type: "checkbox", default: true }
    ]
  },
  run: (ctx) => {
    const { count, category, unique } = ctx.options
    const rng = ctx.rng
    const results: any[] = []
    const seen = new Set<string>()

    let itemPool: string[] = []
    if (category === "all") {
      itemPool = Object.values(itemsData.items).flat()
    } else {
      itemPool = itemsData.items[category as keyof typeof itemsData.items] || []
    }

    for (let i = 0; i < count; i++) {
      let item: string
      let attempts = 0
      do {
        item = itemPool[Math.floor(rng() * itemPool.length)]
        attempts++
      } while (unique && seen.has(item) && attempts < 1000)
      seen.add(item)

      results.push({
        id: `item-${i}`,
        value: item,
        formatted: item
      })
    }

    return {
      items: results,
      meta: { seedUsed: ctx.seed, count: results.length, generatedAt: Date.now() },
      previewText: results.slice(0, 3).map(r => r.value).join(", ")
    }
  },
  seo: {
    title: "Random Item Generator - 300+ Everyday Objects by Category | Free",
    description: "Generate random everyday items from household, kitchen, office, outdoor, tech, sports, toys & clothing. 300+ objects for scavenger hunts or games. Free!",
    h1: "Random Item Generator",
    faq: [
      { question: "What categories are available?", answer: "Household, kitchen, office, outdoor, tech, and clothing." },
      { question: "How many items are in the database?", answer: "Over 120 everyday items across 6 categories." },
      { question: "Can I repeat the same result?", answer: "Yes. Use the same seed to reproduce results." },
      { question: "Is this tool free?", answer: "Yes. No limits or sign-up required." }
    ]
  },
  icon: Package,
  popular: true
}

// Random Emoji Generator
export const randomEmojiTool: ToolConfig = {
  slug: "random-emoji-generator",
  category: "utilities",
  name: "Random Emoji Generator",
  shortDescription: "Generate random emojis",
  longDescription: "Generate random emojis from categories including smileys, animals, food, activities, travel, and objects. Over 180 emojis to discover. Copy and paste them anywhere.",
  generatorType: "list",
  defaultOptions: {
    count: 10,
    category: "all",
    unique: true
  },
  optionSchema: {
    fields: [
      { key: "count", label: "Count", type: "number", default: 10, min: 1, max: 50 },
      {
        key: "category",
        label: "Category",
        type: "select",
        default: "all",
        options: [
          { value: "all", label: "All Categories" },
          { value: "smileys", label: "Smileys & People" },
          { value: "animals", label: "Animals & Nature" },
          { value: "food", label: "Food & Drink" },
          { value: "activities", label: "Activities & Sports" },
          { value: "travel", label: "Travel & Places" },
          { value: "objects", label: "Objects" }
        ]
      },
      { key: "unique", label: "Unique emojis", type: "checkbox", default: true }
    ]
  },
  run: (ctx) => {
    const { count, category, unique } = ctx.options
    const rng = ctx.rng
    const results: any[] = []
    const seen = new Set<string>()

    let emojiPool: string[] = []
    if (category === "all") {
      emojiPool = Object.values(emojisData.emojis).flat()
    } else {
      emojiPool = emojisData.emojis[category as keyof typeof emojisData.emojis] || []
    }

    for (let i = 0; i < count; i++) {
      let emoji: string
      let attempts = 0
      do {
        emoji = emojiPool[Math.floor(rng() * emojiPool.length)]
        attempts++
      } while (unique && seen.has(emoji) && attempts < 1000)
      seen.add(emoji)

      results.push({
        id: `emoji-${i}`,
        value: emoji,
        formatted: emoji
      })
    }

    return {
      items: results,
      meta: { seedUsed: ctx.seed, count: results.length, generatedAt: Date.now() },
      previewText: results.slice(0, 10).map(r => r.value).join("")
    }
  },
  seo: {
    title: "Random Emoji Generator - 200+ Emojis to Copy & Paste | Free",
    description: "Generate random emojis from smileys, animals, food, activities, travel & objects. 200+ emojis to copy & paste for messaging or social media. Free!",
    h1: "Random Emoji Generator",
    faq: [
      { question: "What categories are available?", answer: "Smileys, animals, food, activities, travel, and objects." },
      { question: "How many emojis are available?", answer: "Over 180 emojis across 6 categories." },
      { question: "Can I copy the emojis?", answer: "Yes. Use the copy button to copy them to your clipboard." },
      { question: "Can I repeat the same result?", answer: "Yes. Use the same seed to reproduce results." },
      { question: "Is this tool free?", answer: "Yes. No limits or sign-up required." }
    ]
  },
  icon: Smile,
  popular: true
}

export const utilitiesTools: ToolConfig[] = [
  randomLetterTool,
  randomPhoneNumberTool,
  randomUsernameTool,
  randomAddressTool,
  randomItemTool,
  randomEmojiTool
]
