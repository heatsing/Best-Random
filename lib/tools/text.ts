import { User, Type, AtSign, Smile, Briefcase, MessageSquare, FileText, Mail, Globe } from "lucide-react"
import type { ToolConfig } from "../registry"
import { createCombinedSeed } from "../registry"
import { createPRNG } from "../prng"
import namesData from "@/data/names.json"
import wordsData from "@/data/words.json"

// Random Name Generator
export const randomNameTool: ToolConfig = {
  slug: "random-name-generator",
  category: "text",
  name: "Random Name Generator",
  shortDescription: "Generate random names — boy, girl, baby, pet, Japanese & more",
  longDescription: "Generate random names from 20+ categories. Choose boy names, girl names, baby names, last names, company names, team names, pet/dog/cat names, gamertags, nicknames (cute/cool/funny), band names, Japanese names, or full random identities.",
  generatorType: "list",
  defaultOptions: {
    count: 10,
    nameType: "full",
    unique: true
  },
  optionSchema: {
    fields: [
      { key: "count", label: "Count", type: "number", default: 10, min: 1, max: 100 },
      {
        key: "nameType",
        label: "Name Type",
        type: "select",
        default: "full",
        options: [
          { value: "full", label: "Random Full Names" },
          { value: "boy", label: "Boy Names" },
          { value: "girl", label: "Girl Names" },
          { value: "baby", label: "Baby Names" },
          { value: "last", label: "Last Names" },
          { value: "company", label: "Company Names" },
          { value: "team", label: "Team Names" },
          { value: "pet", label: "Pet Names" },
          { value: "dog", label: "Dog Names" },
          { value: "cat", label: "Cat Names" },
          { value: "gamertag", label: "Gamertags" },
          { value: "nickname_cute", label: "Cute Nicknames" },
          { value: "nickname_cool", label: "Cool Nicknames" },
          { value: "nickname_funny", label: "Funny Nicknames" },
          { value: "band", label: "Band Names" },
          { value: "japanese", label: "Japanese Names" },
          { value: "identity", label: "Random Identity" }
        ]
      },
      { key: "unique", label: "Unique names", type: "checkbox", default: true }
    ]
  },
  run: (ctx) => {
    const { count, nameType, unique } = ctx.options
    const rng = ctx.rng
    const results: any[] = []
    const seen = new Set<string>()

    const pick = (arr: string[]) => arr[Math.floor(rng() * arr.length)]

    for (let i = 0; i < count; i++) {
      let value: string
      let attempts = 0

      do {
        if (nameType === 'full') {
          const allFirst = [...namesData.firstNames.modern, ...namesData.firstNames.classic]
          value = `${pick(allFirst)} ${pick(namesData.lastNames)}`
        } else if (nameType === 'boy') {
          value = pick(namesData.boyNames)
        } else if (nameType === 'girl') {
          value = pick(namesData.girlNames)
        } else if (nameType === 'baby') {
          value = pick(namesData.babyNames)
        } else if (nameType === 'last') {
          value = pick(namesData.lastNames)
        } else if (nameType === 'company') {
          value = pick(namesData.companyNames)
        } else if (nameType === 'team') {
          value = pick(namesData.teamNames)
        } else if (nameType === 'pet') {
          value = pick(namesData.petNames)
        } else if (nameType === 'dog') {
          value = pick(namesData.dogNames)
        } else if (nameType === 'cat') {
          value = pick(namesData.catNames)
        } else if (nameType === 'gamertag') {
          value = pick(namesData.gamertags)
        } else if (nameType === 'nickname_cute') {
          value = pick(namesData.nicknames.cute)
        } else if (nameType === 'nickname_cool') {
          value = pick(namesData.nicknames.cool)
        } else if (nameType === 'nickname_funny') {
          value = pick(namesData.nicknames.funny)
        } else if (nameType === 'band') {
          value = pick(namesData.bandNames)
        } else if (nameType === 'japanese') {
          const gender = rng() < 0.5 ? 'male' : 'female'
          const first = pick(namesData.japaneseNames[gender])
          const last = pick(namesData.japaneseNames.lastNames)
          value = `${last} ${first}`
        } else if (nameType === 'identity') {
          const allFirst = [...namesData.firstNames.modern, ...namesData.firstNames.classic]
          const name = `${pick(allFirst)} ${pick(namesData.lastNames)}`
          const age = 18 + Math.floor(rng() * 50)
          const occ = pick(namesData.identities.occupations)
          const city = pick(namesData.identities.cities)
          value = `${name}, ${age}, ${occ}, ${city}`
        } else {
          const allFirst = [...namesData.firstNames.modern, ...namesData.firstNames.classic]
          value = `${pick(allFirst)} ${pick(namesData.lastNames)}`
        }
        attempts++
      } while (unique && seen.has(value) && attempts < 1000)

      seen.add(value)
      results.push({
        id: `name-${i}`,
        value,
        formatted: value
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
    title: "Random Name Generator: Boy, Girl, Baby, Pet & Japanese Names | BestRandom",
    description: "Generate random names from 20+ categories: boy names, girl names, baby names, last names, company names, team names, pet/dog/cat names, gamertags, nicknames, band names, Japanese names, and full identities.",
    h1: "Random Name Generator",
    faq: [
      { question: "What types of names can I generate?", answer: "Over 20 types: full names, boy names, girl names, baby names, last names, company names, team names, pet/dog/cat names, gamertags, cute/cool/funny nicknames, band names, Japanese names, and random identities." },
      { question: "Can I generate boy or girl names?", answer: "Yes. Select 'Boy Names' or 'Girl Names' from the Name Type dropdown." },
      { question: "Can I generate pet or dog names?", answer: "Yes. Choose 'Pet Names', 'Dog Names', or 'Cat Names' from the dropdown." },
      { question: "What is Random Identity?", answer: "It generates a full fictional identity with name, age, occupation, and city." },
      { question: "Can I generate Japanese names?", answer: "Yes. Select 'Japanese Names' to get authentic Japanese first and last names." },
      { question: "Is this tool free?", answer: "Yes. No limits or sign-up required." }
    ]
  },
  icon: User,
  popular: true
}

// Random Word Generator
export const randomWordTool: ToolConfig = {
  slug: "random-word",
  category: "text",
  name: "Random Word Generator",
  shortDescription: "Generate random words from a word list",
  longDescription: "Generate random words from a built-in English word list. Control the minimum and maximum word length.",
  generatorType: "list",
  defaultOptions: {
    count: 10,
    minLength: 3,
    maxLength: 10,
    unique: false
  },
  optionSchema: {
    fields: [
      { key: "count", label: "Count", type: "number", default: 10, min: 1, max: 100 },
      { key: "minLength", label: "Min Length", type: "number", default: 3, min: 1, max: 20 },
      { key: "maxLength", label: "Max Length", type: "number", default: 10, min: 1, max: 20 },
      { key: "unique", label: "Unique words", type: "checkbox", default: false }
    ]
  },
  run: (ctx) => {
    const { count, minLength, maxLength, unique } = ctx.options
    const rng = ctx.rng
    const results: any[] = []
    const seen = new Set<string>()

    const filteredWords = wordsData.words.filter(
      word => word.length >= minLength && word.length <= maxLength
    )

    if (filteredWords.length === 0) {
      return {
        items: [],
        meta: { seedUsed: ctx.seed, count: 0, generatedAt: Date.now() },
        previewText: ""
      }
    }

    for (let i = 0; i < count; i++) {
      let word: string
      let attempts = 0

      do {
        word = filteredWords[Math.floor(rng() * filteredWords.length)]
        attempts++
      } while (unique && seen.has(word) && attempts < 1000)

      seen.add(word)
      results.push({
        id: `word-${i}`,
        value: word,
        formatted: word
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
    title: "Random Word Generator: Get Random English Words in Seconds | BestRandom",
    description: "Generate random English words with adjustable length. Perfect for word games, brainstorming, vocabulary practice, or creative writing prompts.",
    h1: "Random Word Generator",
    faq: [
      { question: "How are the random words generated?", answer: "Words are selected from a built-in English word list." },
      { question: "Can I control word length?", answer: "Yes. Set minimum and maximum word length." },
      { question: "Can I repeat the same words?", answer: "Yes. Use the same seed to get identical results." },
      { question: "Can I generate multiple words at once?", answer: "Yes. Choose how many words to generate." },
      { question: "Can I copy all generated words?", answer: "Yes. Use the copy button to copy them instantly." },
      { question: "Is this tool free?", answer: "Yes. No registration required." }
    ]
  },
  icon: FileText,
  popular: true
}

// Last Name Generator
export const lastNameTool: ToolConfig = {
  slug: "last-name-generator",
  category: "text",
  name: "Last Name Generator",
  shortDescription: "Generate random last names instantly",
  longDescription: "Generate random last names instantly. Choose how many random last names to generate, enable uniqueness to avoid duplicates, and use a seed to repeat or share your results. Perfect for character creation, testing, or creative projects.",
  generatorType: "list",
  defaultOptions: {
    count: 10,
    unique: false
  },
  optionSchema: {
    fields: [
      { key: "count", label: "Count", type: "number", default: 10, min: 1, max: 1000 },
      { key: "unique", label: "Unique last names", type: "checkbox", default: false }
    ]
  },
  run: (ctx) => {
    const { count, unique } = ctx.options
    const rng = ctx.rng
    const results: any[] = []
    const seen = new Set<string>()
    const lastNames = namesData.lastNames

    for (let i = 0; i < count; i++) {
      let lastName: string
      let attempts = 0

      do {
        lastName = lastNames[Math.floor(rng() * lastNames.length)]
        attempts++
      } while (unique && seen.has(lastName) && attempts < 1000)

      seen.add(lastName)
      results.push({
        id: `lastname-${i}`,
        value: lastName,
        formatted: lastName
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
    title: "Last Name Generator: Find Random Surnames & Family Names | BestRandom",
    description: "Generate random last names from a dataset of real English surnames. Great for fiction writing, game characters, form testing, or genealogy research.",
    h1: "Last Name Generator",
    faq: [
      { question: "What random last names are available?", answer: "Random last names are selected from a built-in dataset of common English surnames and family names." },
      { question: "Can I generate multiple random last names?", answer: "Yes. Choose how many random last names you want to generate." },
      { question: "Can I avoid duplicate last names?", answer: "Yes. Enable the unique option to ensure all generated last names are different." },
      { question: "Can I repeat the same random last names?", answer: "Yes. Use the same seed to reproduce identical results." },
      { question: "Can I share the generated random last names?", answer: "Yes. Shared links preserve your settings and seed for reproducibility." },
      { question: "Are these real family names?", answer: "Yes. All last names are from a dataset of real, common surnames and family names." }
    ]
  },
  icon: User
}

// Random Text Generator
export const randomTextTool: ToolConfig = {
  slug: "random-text-generator",
  category: "text",
  name: "Random Text Generator",
  shortDescription: "Generate random placeholder text",
  longDescription: "Generate random text instantly. Create short, medium, or long placeholder text, control the number of lines, and use a seed to repeat or share your results. Perfect for testing layouts and designs.",
  generatorType: "list",
  defaultOptions: {
    length: "medium",
    lines: 5
  },
  optionSchema: {
    fields: [
      {
        key: "length",
        label: "Text Length",
        type: "select",
        default: "medium",
        options: [
          { value: "short", label: "Short" },
          { value: "medium", label: "Medium" },
          { value: "long", label: "Long" }
        ]
      },
      { key: "lines", label: "Number of Lines", type: "number", default: 5, min: 1, max: 50 }
    ]
  },
  run: (ctx) => {
    const { length, lines } = ctx.options
    const rng = ctx.rng
    
    const WORDS = [
      'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
      'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
      'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
      'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
      'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me',
      'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take',
      'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other',
      'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also',
      'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way',
      'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us'
    ]

    const wordsPerLine = length === 'short' ? 5 : length === 'medium' ? 10 : 20
    const generatedLines: string[] = []

    for (let lineIndex = 0; lineIndex < lines; lineIndex++) {
      const words: string[] = []
      
      for (let i = 0; i < wordsPerLine; i++) {
        const word = WORDS[Math.floor(rng() * WORDS.length)]
        words.push(word)
      }
      
      if (words.length > 0) {
        words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1)
      }
      
      const line = words.join(' ') + '.'
      generatedLines.push(line)
    }

    const text = generatedLines.join('\n')
    const results = generatedLines.map((line, i) => ({
      id: `line-${i}`,
      value: line,
      formatted: line
    }))

    return {
      items: results,
      meta: {
        seedUsed: ctx.seed,
        count: results.length,
        generatedAt: Date.now()
      },
      previewText: generatedLines.slice(0, 2).join(" ")
    }
  },
  seo: {
    title: "Random Text Generator: Create Placeholder Text Instantly | BestRandom",
    description: "Generate random placeholder text for UI mockups, design testing, or layout prototyping. Choose short, medium, or long output with repeatable seeds.",
    h1: "Random Text Generator",
    faq: [
      { question: "What kind of text is generated?", answer: "Short random sentences and placeholder-style text." },
      { question: "Can I control text length?", answer: "Yes. Choose short, medium, or long output." },
      { question: "Can I generate multiple lines?", answer: "Yes. Set how many lines you want." },
      { question: "Is the text repeatable?", answer: "Yes. The same seed produces the same text." },
      { question: "Can I copy the text easily?", answer: "Yes. One-click copy is supported." },
      { question: "Is this tool free?", answer: "Yes. Completely free to use." }
    ]
  },
  icon: Type
}

// Random Email Generator
export const randomEmailTool: ToolConfig = {
  slug: "random-email-generator",
  category: "text",
  name: "Random Email Generator",
  shortDescription: "Generate random email addresses instantly",
  longDescription: "Generate random email addresses instantly. Choose from name-based, username, or random formats, select a custom domain or use a random one, and generate multiple emails at once. Use a seed to repeat or share your results. Perfect for testing, development, or placeholder purposes.",
  generatorType: "list",
  defaultOptions: {
    count: 10,
    format: "name",
    domain: ""
  },
  optionSchema: {
    fields: [
      { key: "count", label: "Count", type: "number", default: 10, min: 1, max: 1000 },
      {
        key: "format",
        label: "Email Format",
        type: "select",
        default: "name",
        options: [
          { value: "name", label: "Name-based (firstname.lastname123)" },
          { value: "username", label: "Username (randomusername123)" },
          { value: "random", label: "Random (randomstring123)" }
        ]
      },
      { key: "domain", label: "Domain (optional, leave empty for random)", type: "text", default: "", placeholder: "e.g., example.com" }
    ]
  },
  run: (ctx) => {
    const { count, format, domain } = ctx.options
    const rng = ctx.rng
    
    const FIRST_NAMES = [
      'alex', 'alexander', 'alice', 'amy', 'andrew', 'anna', 'anthony', 'ashley',
      'benjamin', 'brian', 'brittany', 'charlie', 'chris', 'christopher', 'daniel', 'david',
      'emily', 'emma', 'ethan', 'james', 'jennifer', 'jessica', 'john', 'joshua',
      'kate', 'katie', 'kevin', 'lisa', 'michael', 'michelle', 'nick', 'olivia',
      'rachel', 'robert', 'sarah', 'steven', 'thomas', 'william'
    ]

    const LAST_NAMES = [
      'anderson', 'brown', 'clark', 'davis', 'garcia', 'harris', 'jackson', 'johnson',
      'jones', 'lee', 'lewis', 'martin', 'martinez', 'miller', 'moore', 'rodriguez',
      'smith', 'taylor', 'thomas', 'thompson', 'walker', 'white', 'williams', 'wilson'
    ]

    const DOMAINS = [
      'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com',
      'protonmail.com', 'mail.com', 'aol.com', 'zoho.com', 'yandex.com'
    ]

    const selectedDomain = domain || DOMAINS[Math.floor(rng() * DOMAINS.length)]
    const results: any[] = []
    const usedEmails = new Set<string>()

    const generateUsername = () => {
      const length = Math.floor(rng() * 7) + 6
      const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
      let username = chars[Math.floor(rng() * 26)]
      for (let i = 1; i < length; i++) {
        username += chars[Math.floor(rng() * chars.length)]
      }
      return username
    }

    const generateRandomString = (min: number, max: number) => {
      const length = Math.floor(rng() * (max - min + 1)) + min
      const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
      let str = ''
      for (let i = 0; i < length; i++) {
        str += chars[Math.floor(rng() * chars.length)]
      }
      return str
    }

    for (let i = 0; i < count; i++) {
      let email: string
      let attempts = 0

      do {
        if (format === 'name') {
          const firstName = FIRST_NAMES[Math.floor(rng() * FIRST_NAMES.length)]
          const lastName = LAST_NAMES[Math.floor(rng() * LAST_NAMES.length)]
          const number = Math.floor(rng() * 9900) + 100
          email = `${firstName}.${lastName}${number}@${selectedDomain}`
        } else if (format === 'username') {
          const username = generateUsername()
          email = `${username}@${selectedDomain}`
        } else {
          const randomString = generateRandomString(8, 12)
          const number = Math.floor(rng() * 990) + 10
          email = `${randomString}${number}@${selectedDomain}`
        }
        attempts++
      } while (usedEmails.has(email) && attempts < 100)

      usedEmails.add(email)
      results.push({
        id: `email-${i}`,
        value: email,
        formatted: email
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
    title: "Random Email Generator: Create Test Email Addresses Fast | BestRandom",
    description: "Generate realistic random email addresses for software testing, form validation, or placeholder data. Choose name-based, username, or random formats with custom domains.",
    h1: "Random Email Generator",
    faq: [
      { question: "What email formats are supported?", answer: "You can choose name-based (firstname.lastname123), username-based, or completely random formats." },
      { question: "Can I use a custom domain?", answer: "Yes. You can specify a custom domain or use a random one from popular providers." },
      { question: "Are the emails unique?", answer: "Yes. The generator ensures all generated emails are unique within a single generation." },
      { question: "Can I repeat the same emails?", answer: "Yes. Use the same seed to reproduce identical email addresses." },
      { question: "Can I generate multiple emails at once?", answer: "Yes. Choose how many email addresses you want to generate." },
      { question: "Are these real email addresses?", answer: "No. These are randomly generated addresses for testing and development purposes only." }
    ]
  },
  icon: Mail
}

// Random Website Generator
export const randomWebsiteTool: ToolConfig = {
  slug: "random-website-generator",
  category: "text",
  name: "Random Website Generator",
  shortDescription: "Generate random website URLs instantly",
  longDescription: "Generate random website URLs instantly. Choose from simple domains, subdomains, or paths, select a TLD or use a random one, and generate multiple URLs at once. Use a seed to repeat or share your results. Perfect for testing, development, or placeholder purposes.",
  generatorType: "list",
  defaultOptions: {
    count: 10,
    format: "simple",
    tld: ""
  },
  optionSchema: {
    fields: [
      { key: "count", label: "Count", type: "number", default: 10, min: 1, max: 1000 },
      {
        key: "format",
        label: "URL Format",
        type: "select",
        default: "simple",
        options: [
          { value: "simple", label: "Simple (example.com)" },
          { value: "subdomain", label: "Subdomain (blog.example.com)" },
          { value: "path", label: "Path (example.com/path/to/page)" }
        ]
      },
      { key: "tld", label: "TLD (optional, leave empty for random)", type: "text", default: "", placeholder: "e.g., com, org" }
    ]
  },
  run: (ctx) => {
    const { count, format, tld } = ctx.options
    const rng = ctx.rng
    
    const DOMAINS = [
      'com', 'org', 'net', 'io', 'co', 'dev', 'app', 'tech', 'online', 'site',
      'xyz', 'info', 'biz', 'me', 'us', 'uk', 'ca', 'au', 'de', 'fr'
    ]

    const SUBDOMAINS = [
      'www', 'blog', 'shop', 'store', 'app', 'api', 'admin', 'mail', 'news', 'forum',
      'help', 'support', 'docs', 'wiki', 'demo', 'test', 'dev', 'staging', 'cdn', 'static'
    ]

    const WORDS = [
      'tech', 'digital', 'cloud', 'smart', 'fast', 'secure', 'global', 'modern', 'innovative', 'creative',
      'web', 'app', 'data', 'code', 'design', 'studio', 'labs', 'hub', 'network', 'systems',
      'solutions', 'services', 'platform', 'tools', 'software', 'hardware', 'media', 'group', 'team', 'works'
    ]

    const selectedTld = tld || DOMAINS[Math.floor(rng() * DOMAINS.length)]
    const results: any[] = []
    const usedUrls = new Set<string>()

    const generateDomainName = () => {
      const wordCount = Math.floor(rng() * 2) + 1
      const words: string[] = []
      for (let i = 0; i < wordCount; i++) {
        words.push(WORDS[Math.floor(rng() * WORDS.length)])
      }
      if (rng() < 0.3) {
        words.push(String(Math.floor(rng() * 990) + 10))
      }
      return words.join('')
    }

    const generatePath = () => {
      const segments = Math.floor(rng() * 3) + 1
      const pathSegments: string[] = []
      for (let i = 0; i < segments; i++) {
        pathSegments.push(WORDS[Math.floor(rng() * WORDS.length)])
      }
      return pathSegments.join('/')
    }

    for (let i = 0; i < count; i++) {
      let url: string
      let attempts = 0

      do {
        const domainName = generateDomainName()
        
        if (format === 'subdomain') {
          const subdomain = SUBDOMAINS[Math.floor(rng() * SUBDOMAINS.length)]
          url = `https://${subdomain}.${domainName}.${selectedTld}`
        } else if (format === 'path') {
          const path = generatePath()
          url = `https://${domainName}.${selectedTld}/${path}`
        } else {
          url = `https://${domainName}.${selectedTld}`
        }
        attempts++
      } while (usedUrls.has(url) && attempts < 100)

      usedUrls.add(url)
      results.push({
        id: `website-${i}`,
        value: url,
        formatted: url
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
    title: "Random Website Generator: Create Fake URLs for Testing | BestRandom",
    description: "Generate random website URLs with custom TLDs, subdomains, and paths. Ideal for development testing, UI mockups, and placeholder data.",
    h1: "Random Website Generator",
    faq: [
      { question: "What URL formats are supported?", answer: "You can choose simple domains (example.com), subdomains (blog.example.com), or paths (example.com/path/to/page)." },
      { question: "Can I use a custom TLD?", answer: "Yes. You can specify a custom TLD (like .com, .org) or use a random one from popular options." },
      { question: "Are the URLs unique?", answer: "Yes. The generator ensures all generated URLs are unique within a single generation." },
      { question: "Can I repeat the same URLs?", answer: "Yes. Use the same seed to reproduce identical website URLs." },
      { question: "Can I generate multiple URLs at once?", answer: "Yes. Choose how many website URLs you want to generate." },
      { question: "Are these real websites?", answer: "No. These are randomly generated URLs for testing and development purposes only." }
    ]
  },
  icon: Globe
}

export const textTools: ToolConfig[] = [
  randomNameTool,
  randomWordTool,
  lastNameTool,
  randomTextTool,
  randomEmailTool,
  randomWebsiteTool
]
