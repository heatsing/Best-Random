import { Hash, Dice1, Coins, Calendar, Clock } from "lucide-react"
import type { ToolConfig } from "../registry"
import { createCombinedSeed } from "../registry"
import { createPRNG } from "../prng"

// Random Number Generator
export const randomNumberTool: ToolConfig = {
  slug: "random-number-generator",
  category: "numbers",
  name: "Random Number Generator",
  shortDescription: "Generate random numbers with full control",
  longDescription: "Generate truly random numbers with full control. Set your range, choose how many numbers to generate, enable uniqueness, and use decimal precision.",
  generatorType: "list",
  defaultOptions: {
    min: 1,
    max: 100,
    count: 10,
    integer: true,
    unique: false,
    decimals: 0,
    sort: false
  },
  optionSchema: {
    fields: [
      { key: "min", label: "Minimum", type: "number", default: 1, min: -1000000, max: 1000000 },
      { key: "max", label: "Maximum", type: "number", default: 100, min: -1000000, max: 1000000 },
      { key: "count", label: "Count", type: "number", default: 10, min: 1, max: 1000 },
      { key: "integer", label: "Integer only", type: "checkbox", default: true },
      { key: "unique", label: "Unique only", type: "checkbox", default: false },
      { key: "decimals", label: "Decimal places", type: "number", default: 0, min: 0, max: 10, helpText: "Only applies when integer is disabled" },
      { key: "sort", label: "Sort results", type: "checkbox", default: false }
    ]
  },
  run: (ctx) => {
    const { min, max, count, integer, unique, decimals, sort } = ctx.options
    const rng = ctx.rng
    const results: any[] = []
    const seen = new Set<string>()
    
    if (min > max) {
      return {
        items: [],
        meta: { seedUsed: ctx.seed, count: 0, generatedAt: Date.now() },
        previewText: ""
      }
    }

    if (unique && integer && (max - min + 1) < count) {
      const available = max - min + 1
      for (let i = 0; i < available; i++) {
        results.push({
          id: `num-${i}`,
          value: min + i,
          formatted: String(min + i)
        })
      }
      return {
        items: results,
        meta: { seedUsed: ctx.seed, count: results.length, generatedAt: Date.now() },
        previewText: results.slice(0, 3).map(r => r.formatted).join(", ")
      }
    }

    for (let i = 0; i < count; i++) {
      let value: number
      let attempts = 0
      
      do {
        if (integer) {
          value = Math.floor(rng() * (max - min + 1)) + min
        } else {
          value = rng() * (max - min) + min
        }
        attempts++
      } while (unique && seen.has(value.toString()) && attempts < 1000)
      
      seen.add(value.toString())
      
      const formatted = integer 
        ? String(Math.round(value))
        : value.toFixed(decimals || 6).replace(/\.?0+$/, '')
      
      results.push({
        id: `num-${i}`,
        value,
        formatted
      })
    }
    
    if (sort) {
      results.sort((a, b) => a.value - b.value)
    }
    
    return {
      items: results,
      meta: {
        seedUsed: ctx.seed,
        count: results.length,
        generatedAt: Date.now()
      },
      previewText: results.slice(0, 3).map(r => r.formatted).join(", ")
    }
  },
  seo: {
    title: "Random Number Generator: Pick a Number Instantly | BestRandom",
    description: "Generate truly random numbers in any range. Control min/max, count, uniqueness, and decimals — share or repeat results with a seed.",
    h1: "Random Number Generator",
    faq: [
      { question: "Is this random number generator truly random?", answer: "It uses a high-quality pseudo-random algorithm with optional seed control." },
      { question: "Can I repeat the same random numbers?", answer: "Yes. Using the same seed will always reproduce the same results." },
      { question: "Can I generate unique numbers only?", answer: "Yes. Enable the \"unique\" option to avoid duplicates." },
      { question: "Does it support decimals?", answer: "Yes. You can generate both integers and decimal numbers." },
      { question: "Can I share my generated numbers?", answer: "Yes. Use the share button to create a link with the same parameters and seed." },
      { question: "Is this tool free to use?", answer: "Yes. All random generators on BestRandom are free." }
    ]
  },
  icon: Hash,
  popular: true
}

// Dice Roller
export const diceRollerTool: ToolConfig = {
  slug: "dice-roller",
  category: "games",
  name: "Dice Roller",
  shortDescription: "Roll dice of various types",
  longDescription: "Roll dice of various types (d4, d6, d8, d10, d12, d20) or custom dice. See each roll and the sum.",
  generatorType: "game",
  defaultOptions: {
    diceType: "d6",
    diceCount: 1,
    customSides: 6
  },
  optionSchema: {
    fields: [
      {
        key: "diceType",
        label: "Dice Type",
        type: "select",
        default: "d6",
        options: [
          { value: "d4", label: "d4 (4-sided)" },
          { value: "d6", label: "d6 (6-sided)" },
          { value: "d8", label: "d8 (8-sided)" },
          { value: "d10", label: "d10 (10-sided)" },
          { value: "d12", label: "d12 (12-sided)" },
          { value: "d20", label: "d20 (20-sided)" },
          { value: "custom", label: "Custom" }
        ]
      },
      {
        key: "diceCount",
        label: "Number of Dice",
        type: "number",
        default: 1,
        min: 1,
        max: 100
      },
      {
        key: "customSides",
        label: "Custom Sides",
        type: "number",
        default: 6,
        min: 2,
        max: 1000,
        helpText: "Only used when dice type is custom"
      }
    ]
  },
  run: (ctx) => {
    const { diceType, diceCount, customSides } = ctx.options
    const rng = ctx.rng
    const sides = diceType === "custom" ? customSides : parseInt(diceType.replace("d", ""))
    const rolls: number[] = []
    
    for (let i = 0; i < diceCount; i++) {
      rolls.push(Math.floor(rng() * sides) + 1)
    }
    
    const sum = rolls.reduce((a, b) => a + b, 0)
    
    return {
      items: rolls.map((roll, i) => ({
        id: `roll-${i}`,
        value: roll,
        formatted: `d${sides}: ${roll}`,
        roll,
        dice: i + 1
      })).concat([{
        id: "sum",
        value: sum,
        formatted: `Sum: ${sum}`,
        roll: sum,
        dice: 0,
        isSum: true
      } as any]),
      meta: {
        seedUsed: ctx.seed,
        count: rolls.length,
        generatedAt: Date.now()
      },
      previewText: `Rolls: ${rolls.join(", ")}, Sum: ${sum}`
    }
  },
  seo: {
    title: "Dice Roller: Roll Any Dice Online (d4–d20 & Custom) | BestRandom",
    description: "Roll virtual dice online — d4, d6, d8, d10, d12, d20, or custom. See every roll and the total. Perfect for D&D, board games, and more.",
    h1: "Dice Roller",
    faq: [
      { question: "What dice types are supported?", answer: "d4, d6, d8, d10, d12, d20, and custom dice with any number of sides." },
      { question: "Can I roll multiple dice at once?", answer: "Yes. Set the number of dice to roll multiple dice simultaneously." },
      { question: "Can I use custom dice?", answer: "Yes. Select 'Custom' and specify the number of sides." }
    ]
  },
  icon: Dice1,
  popular: true
}

// Coin Flip
export const coinFlipTool: ToolConfig = {
  slug: "coin-flip",
  category: "games",
  name: "Coin Flip",
  shortDescription: "Flip a coin multiple times",
  longDescription: "Flip a coin one or multiple times. See results and statistics.",
  generatorType: "game",
  defaultOptions: {
    flips: 1
  },
  optionSchema: {
    fields: [
      {
        key: "flips",
        label: "Number of Flips",
        type: "number",
        default: 1,
        min: 1,
        max: 1000
      }
    ]
  },
  run: (ctx) => {
    const { flips } = ctx.options
    const rng = ctx.rng
    const results: string[] = []
    
    for (let i = 0; i < flips; i++) {
      results.push(rng() < 0.5 ? "Heads" : "Tails")
    }
    
    const heads = results.filter(r => r === "Heads").length
    const tails = results.filter(r => r === "Tails").length
    
    return {
      items: results.map((result, i) => ({
        id: `flip-${i}`,
        value: result,
        formatted: `Flip ${i + 1}: ${result}`
      })).concat([{
        id: "stats",
        value: `Heads: ${heads}, Tails: ${tails}`,
        formatted: `Statistics - Heads: ${heads} (${((heads/flips)*100).toFixed(1)}%), Tails: ${tails} (${((tails/flips)*100).toFixed(1)}%)`
      } as any]),
      meta: {
        seedUsed: ctx.seed,
        count: results.length,
        generatedAt: Date.now()
      },
      previewText: results.join(", ")
    }
  },
  seo: {
    title: "Coin Flip: Heads or Tails? Flip a Coin Online | BestRandom",
    description: "Flip a coin one or many times and see live heads/tails statistics. Fair, instant, and shareable results.",
    h1: "Coin Flip",
    faq: [
      { question: "Can I flip multiple coins?", answer: "Yes. Set the number of flips to flip multiple times." },
      { question: "Are the results truly random?", answer: "Yes. Results are generated using a high-quality random number generator." }
    ]
  },
  icon: Coins,
  popular: true
}

// Random Date Generator
export const randomDateTool: ToolConfig = {
  slug: "random-date-generator",
  category: "numbers",
  name: "Random Date Generator",
  shortDescription: "Generate random dates within a range",
  longDescription: "Give a start and end date range and generate multiple random dates within that range. Generate random birthdays, event dates, etc.",
  generatorType: "list",
  defaultOptions: {
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    count: 10,
    format: "YYYY-MM-DD",
    unique: false
  },
  optionSchema: {
    fields: [
      { key: "startDate", label: "Start Date", type: "text", default: "2024-01-01", placeholder: "YYYY-MM-DD" },
      { key: "endDate", label: "End Date", type: "text", default: "2024-12-31", placeholder: "YYYY-MM-DD" },
      { key: "count", label: "Count", type: "number", default: 10, min: 1, max: 100 },
      {
        key: "format",
        label: "Date Format",
        type: "select",
        default: "YYYY-MM-DD",
        options: [
          { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
          { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
          { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
          { value: "Month DD, YYYY", label: "Month DD, YYYY" }
        ]
      },
      { key: "unique", label: "Unique dates", type: "checkbox", default: false }
    ]
  },
  run: (ctx) => {
    const { startDate, endDate, count, format, unique } = ctx.options
    const rng = ctx.rng
    const results: any[] = []
    const seen = new Set<string>()

    const start = new Date(startDate)
    const end = new Date(endDate)
    
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) {
      return {
        items: [],
        meta: { seedUsed: ctx.seed, count: 0, generatedAt: Date.now() },
        previewText: ""
      }
    }

    const startTime = start.getTime()
    const endTime = end.getTime()
    const timeRange = endTime - startTime

    const formatDate = (date: Date): string => {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"]

      switch (format) {
        case "MM/DD/YYYY":
          return `${month}/${day}/${year}`
        case "DD/MM/YYYY":
          return `${day}/${month}/${year}`
        case "Month DD, YYYY":
          return `${monthNames[date.getMonth()]} ${day}, ${year}`
        default:
          return `${year}-${month}-${day}`
      }
    }

    for (let i = 0; i < count; i++) {
      let date: Date
      let attempts = 0
      let formatted: string

      do {
        const randomTime = startTime + (rng() * timeRange)
        date = new Date(randomTime)
        formatted = formatDate(date)
        attempts++
      } while (unique && seen.has(formatted) && attempts < 1000)

      seen.add(formatted)

      results.push({
        id: `date-${i}`,
        value: formatted,
        formatted,
        date: date.toISOString().split('T')[0]
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
    title: "Random Date Generator: Pick a Random Day in Any Range | BestRandom",
    description: "Generate random dates between any two dates. Great for birthdays, deadlines, event planning, or just picking a random day.",
    h1: "Random Date Generator",
    faq: [
      { question: "How does the date generator work?", answer: "It generates random dates between your specified start and end dates." },
      { question: "What date formats are supported?", answer: "YYYY-MM-DD, MM/DD/YYYY, DD/MM/YYYY, and Month DD, YYYY formats are available." },
      { question: "Can I generate multiple dates?", answer: "Yes. Choose how many dates to generate." },
      { question: "Can I repeat the same result?", answer: "Yes. Use the same seed to reproduce results." },
      { question: "Is this tool free?", answer: "Yes. No limits or sign-up required." }
    ]
  },
  icon: Calendar,
  popular: true
}

// Random Time Generator
export const randomTimeTool: ToolConfig = {
  slug: "random-time-generator",
  category: "numbers",
  name: "Random Time Generator",
  shortDescription: "Generate random times of day",
  longDescription: "Generate a random time of day, down to the minute. Use this clock time generator to pick a random hour, schedule a truly random event, or test your alarm clock.",
  generatorType: "list",
  defaultOptions: {
    count: 10,
    format: "12h",
    unique: false
  },
  optionSchema: {
    fields: [
      { key: "count", label: "Count", type: "number", default: 10, min: 1, max: 100 },
      {
        key: "format",
        label: "Time Format",
        type: "select",
        default: "12h",
        options: [
          { value: "12h", label: "12-hour (3:45 PM)" },
          { value: "24h", label: "24-hour (15:45)" }
        ]
      },
      { key: "unique", label: "Unique times", type: "checkbox", default: false }
    ]
  },
  run: (ctx) => {
    const { count, format, unique } = ctx.options
    const rng = ctx.rng
    const results: any[] = []
    const seen = new Set<string>()

    const formatTime = (minutes: number): string => {
      const hours = Math.floor(minutes / 60) % 24
      const mins = minutes % 60

      if (format === "24h") {
        return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`
      } else {
        const period = hours >= 12 ? "PM" : "AM"
        const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours
        return `${displayHours}:${String(mins).padStart(2, '0')} ${period}`
      }
    }

    for (let i = 0; i < count; i++) {
      let time: string
      let attempts = 0

      do {
        const randomMinutes = Math.floor(rng() * 1440) // 0 to 1439 (24 hours * 60 minutes)
        time = formatTime(randomMinutes)
        attempts++
      } while (unique && seen.has(time) && attempts < 1000)

      seen.add(time)

      results.push({
        id: `time-${i}`,
        value: time,
        formatted: time
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
    title: "Random Time Generator: What Time Should I…? | BestRandom",
    description: "Pick a random time of day down to the minute. 12-hour or 24-hour format — ideal for scheduling, games, or creative prompts.",
    h1: "Random Time Generator",
    faq: [
      { question: "How does the time generator work?", answer: "It generates random times throughout a 24-hour period, down to the minute." },
      { question: "What time formats are supported?", answer: "Both 12-hour (3:45 PM) and 24-hour (15:45) formats are available." },
      { question: "Can I generate multiple times?", answer: "Yes. Choose how many times to generate." },
      { question: "Can I repeat the same result?", answer: "Yes. Use the same seed to reproduce results." },
      { question: "Is this tool free?", answer: "Yes. No limits or sign-up required." }
    ]
  },
  icon: Clock,
  popular: true
}

export const numbersTools: ToolConfig[] = [
  randomNumberTool,
  diceRollerTool,
  coinFlipTool,
  randomDateTool,
  randomTimeTool
]
