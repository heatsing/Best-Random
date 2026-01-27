import { PawPrint, Globe2, Briefcase, Trophy, UtensilsCrossed, Building2, MapPin, Calendar, Clock, Heart, Smile, MessageSquare, Sparkles } from "lucide-react"
import type { ToolConfig } from "../registry"
import animalsData from "@/data/animals.json"
import countriesData from "@/data/countries.json"
import jobsData from "@/data/jobs.json"
import sportsData from "@/data/sports.json"
import foodData from "@/data/food.json"
import companiesData from "@/data/companies.json"
import statesData from "@/data/states.json"
import petNamesData from "@/data/pet-names.json"
import weekdaysData from "@/data/weekdays.json"
import monthsData from "@/data/months.json"
import jokesData from "@/data/jokes.json"
import questionsData from "@/data/questions.json"

// Random Animal Generator
export const randomAnimalTool: ToolConfig = {
  slug: "random-animal-generator",
  category: "fun",
  name: "Random Animal Generator",
  shortDescription: "Generate random animals instantly",
  longDescription: "Generate random animals instantly. Choose from various animal categories (mammals, birds, reptiles, etc.), generate multiple animals at once, and use a seed to repeat or share your results.",
  generatorType: "list",
  defaultOptions: {
    count: 10,
    showCategory: false,
    unique: false
  },
  optionSchema: {
    fields: [
      { key: "count", label: "Count", type: "number", default: 10, min: 1, max: 100 },
      { key: "showCategory", label: "Show category", type: "checkbox", default: false },
      { key: "unique", label: "Unique animals", type: "checkbox", default: false }
    ]
  },
  run: (ctx) => {
    const { count, showCategory, unique } = ctx.options
    const rng = ctx.rng
    const results: any[] = []
    const seen = new Set<string>()

    const allAnimals = animalsData.animals

    for (let i = 0; i < count; i++) {
      let animal: typeof allAnimals[0]
      let attempts = 0

      do {
        animal = allAnimals[Math.floor(rng() * allAnimals.length)]
        attempts++
      } while (unique && seen.has(animal.name) && attempts < 1000)

      seen.add(animal.name)
      
      const displayValue = showCategory && animal.category 
        ? `${animal.name} (${animal.category})`
        : animal.name

      results.push({
        id: `animal-${i}`,
        value: displayValue,
        formatted: displayValue,
        name: animal.name,
        category: showCategory ? animal.category : undefined
      })
    }

    return {
      items: results,
      meta: {
        seedUsed: ctx.seed,
        count: results.length,
        generatedAt: Date.now()
      },
      previewText: results.slice(0, 3).map(r => r.name).join(", ")
    }
  },
  seo: {
    title: "Random Animal Generator – Instant & Fun | BestRandom",
    description: "Generate random animals instantly. Filter by category and repeat results using a seed.",
    h1: "Random Animal Generator",
    faq: [
      { question: "What animals can be generated?", answer: "Animals are selected from a built-in dataset." },
      { question: "Can I filter by animal type?", answer: "Yes. Filter by categories like mammals or birds." },
      { question: "Can I generate multiple animals?", answer: "Yes. Choose how many animals to generate." },
      { question: "Can I repeat the same result?", answer: "Yes. Use the same seed to reproduce results." },
      { question: "Are these animals real?", answer: "Yes. All animals are real species names." },
      { question: "Is this tool free?", answer: "Yes. No limits or sign-up." }
    ]
  },
  icon: PawPrint,
  popular: true
}

// Random Country Generator
export const randomCountryTool: ToolConfig = {
  slug: "random-country-generator",
  category: "fun",
  name: "Random Country Generator",
  shortDescription: "Generate random countries with flags",
  longDescription: "Generate random countries instantly. See the country name, flag emoji, and continent. Perfect for travel inspiration, geography games, or classroom fun.",
  generatorType: "list",
  defaultOptions: {
    count: 10,
    showContinent: true,
    unique: false
  },
  optionSchema: {
    fields: [
      { key: "count", label: "Count", type: "number", default: 10, min: 1, max: 100 },
      { key: "showContinent", label: "Show continent", type: "checkbox", default: true },
      { key: "unique", label: "Unique countries", type: "checkbox", default: false }
    ]
  },
  run: (ctx) => {
    const { count, showContinent, unique } = ctx.options
    const rng = ctx.rng
    const results: any[] = []
    const seen = new Set<string>()
    const countries = countriesData.countries

    for (let i = 0; i < count; i++) {
      let country: typeof countries[0]
      let attempts = 0

      do {
        country = countries[Math.floor(rng() * countries.length)]
        attempts++
      } while (unique && seen.has(country.name) && attempts < 1000)

      seen.add(country.name)
      
      const displayValue = showContinent
        ? `${country.flagEmoji} ${country.name} (${country.continent})`
        : `${country.flagEmoji} ${country.name}`

      results.push({
        id: `country-${i}`,
        value: displayValue,
        formatted: displayValue,
        name: country.name,
        code: country.code,
        continent: country.continent,
        flagEmoji: country.flagEmoji
      })
    }

    return {
      items: results,
      meta: {
        seedUsed: ctx.seed,
        count: results.length,
        generatedAt: Date.now()
      },
      previewText: results.slice(0, 3).map(r => r.name).join(", ")
    }
  },
  seo: {
    title: "Random Country Generator – Travel Inspiration | BestRandom",
    description: "Generate random countries with flags and continents. Perfect for travel inspiration, geography games, or classroom fun.",
    h1: "Random Country Generator",
    faq: [
      { question: "What countries are included?", answer: "The generator includes countries from all continents with their flags and continent information." },
      { question: "Can I generate multiple countries?", answer: "Yes. Choose how many countries to generate." },
      { question: "Can I see the continent?", answer: "Yes. Enable 'Show continent' to see which continent each country belongs to." },
      { question: "Can I repeat the same result?", answer: "Yes. Use the same seed to reproduce results." },
      { question: "Is this tool free?", answer: "Yes. No limits or sign-up required." }
    ]
  },
  icon: Globe2,
  popular: true
}

// Random Job Title Generator
export const randomJobTool: ToolConfig = {
  slug: "random-job-generator",
  category: "fun",
  name: "Random Job Title Generator",
  shortDescription: "Generate random job titles by industry",
  longDescription: "Generate random job titles from various industries. Choose from tech, health, creative, business, education, or service industries.",
  generatorType: "list",
  defaultOptions: {
    count: 10,
    industry: "all",
    unique: false
  },
  optionSchema: {
    fields: [
      { key: "count", label: "Count", type: "number", default: 10, min: 1, max: 100 },
      {
        key: "industry",
        label: "Industry",
        type: "select",
        default: "all",
        options: [
          { value: "all", label: "All Industries" },
          { value: "tech", label: "Technology" },
          { value: "health", label: "Healthcare" },
          { value: "creative", label: "Creative" },
          { value: "business", label: "Business" },
          { value: "education", label: "Education" },
          { value: "service", label: "Service" }
        ]
      },
      { key: "unique", label: "Unique jobs", type: "checkbox", default: false }
    ]
  },
  run: (ctx) => {
    const { count, industry, unique } = ctx.options
    const rng = ctx.rng
    const results: any[] = []
    const seen = new Set<string>()

    let jobPool: string[] = []
    if (industry === "all") {
      jobPool = Object.values(jobsData.jobs).flat()
    } else {
      jobPool = jobsData.jobs[industry as keyof typeof jobsData.jobs] || []
    }

    for (let i = 0; i < count; i++) {
      let job: string
      let attempts = 0

      do {
        job = jobPool[Math.floor(rng() * jobPool.length)]
        attempts++
      } while (unique && seen.has(job) && attempts < 1000)

      seen.add(job)

      results.push({
        id: `job-${i}`,
        value: job,
        formatted: job
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
    title: "Random Job Title Generator – Career Inspiration | BestRandom",
    description: "Generate random job titles from various industries. Perfect for career exploration, character creation, or inspiration.",
    h1: "Random Job Title Generator",
    faq: [
      { question: "What industries are available?", answer: "Tech, health, creative, business, education, and service industries are included." },
      { question: "Can I filter by industry?", answer: "Yes. Select a specific industry or choose 'All Industries'." },
      { question: "Can I generate multiple jobs?", answer: "Yes. Choose how many job titles to generate." },
      { question: "Can I repeat the same result?", answer: "Yes. Use the same seed to reproduce results." },
      { question: "Is this tool free?", answer: "Yes. No limits or sign-up required." }
    ]
  },
  icon: Briefcase,
  popular: true
}

// Random Sport Generator
export const randomSportTool: ToolConfig = {
  slug: "random-sport-generator",
  category: "fun",
  name: "Random Sport Generator",
  shortDescription: "Generate random sports",
  longDescription: "Generate random sports from a massive list. Find your next obsession or just a really good excuse to avoid the gym.",
  generatorType: "list",
  defaultOptions: {
    count: 10,
    unique: false
  },
  optionSchema: {
    fields: [
      { key: "count", label: "Count", type: "number", default: 10, min: 1, max: 100 },
      { key: "unique", label: "Unique sports", type: "checkbox", default: false }
    ]
  },
  run: (ctx) => {
    const { count, unique } = ctx.options
    const rng = ctx.rng
    const results: any[] = []
    const seen = new Set<string>()
    const sports = sportsData.sports

    for (let i = 0; i < count; i++) {
      let sport: string
      let attempts = 0

      do {
        sport = sports[Math.floor(rng() * sports.length)]
        attempts++
      } while (unique && seen.has(sport) && attempts < 1000)

      seen.add(sport)

      results.push({
        id: `sport-${i}`,
        value: sport,
        formatted: sport
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
    title: "Random Sport Generator – Find Your Next Activity | BestRandom",
    description: "Generate random sports from a massive list. Find your next obsession or just a really good excuse to avoid the gym.",
    h1: "Random Sport Generator",
    faq: [
      { question: "What sports are included?", answer: "The generator includes a wide variety of sports from soccer to curling." },
      { question: "Can I generate multiple sports?", answer: "Yes. Choose how many sports to generate." },
      { question: "Can I repeat the same result?", answer: "Yes. Use the same seed to reproduce results." },
      { question: "Is this tool free?", answer: "Yes. No limits or sign-up required." }
    ]
  },
  icon: Trophy,
  popular: false
}

// Random Food Generator
export const randomFoodTool: ToolConfig = {
  slug: "random-food-generator",
  category: "fun",
  name: "Random Food Generator",
  shortDescription: "Generate random food items",
  longDescription: "Generate random food items to help you decide what to eat. Smart food combining made easy by just picking whatever few food items that come up.",
  generatorType: "list",
  defaultOptions: {
    count: 10,
    unique: false
  },
  optionSchema: {
    fields: [
      { key: "count", label: "Count", type: "number", default: 10, min: 1, max: 100 },
      { key: "unique", label: "Unique foods", type: "checkbox", default: false }
    ]
  },
  run: (ctx) => {
    const { count, unique } = ctx.options
    const rng = ctx.rng
    const results: any[] = []
    const seen = new Set<string>()
    const foods = foodData.food

    for (let i = 0; i < count; i++) {
      let food: string
      let attempts = 0

      do {
        food = foods[Math.floor(rng() * foods.length)]
        attempts++
      } while (unique && seen.has(food) && attempts < 1000)

      seen.add(food)

      results.push({
        id: `food-${i}`,
        value: food,
        formatted: food
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
    title: "Random Food Generator – Decide What to Eat | BestRandom",
    description: "Generate random food items to help you decide what to eat. Smart food combining made easy.",
    h1: "Random Food Generator",
    faq: [
      { question: "What foods are included?", answer: "The generator includes a wide variety of foods from different cuisines." },
      { question: "Can I generate multiple foods?", answer: "Yes. Choose how many food items to generate." },
      { question: "Can I repeat the same result?", answer: "Yes. Use the same seed to reproduce results." },
      { question: "Is this tool free?", answer: "Yes. No limits or sign-up required." }
    ]
  },
  icon: UtensilsCrossed,
  popular: true
}

// Random Company Generator
export const randomCompanyTool: ToolConfig = {
  slug: "random-company-generator",
  category: "fun",
  name: "Random Company Generator",
  shortDescription: "Generate random companies and brands",
  longDescription: "Generate a list of random companies and brands from the most well known or profitable businesses. Chances are you know someone working for these companies.",
  generatorType: "list",
  defaultOptions: {
    count: 10,
    unique: false
  },
  optionSchema: {
    fields: [
      { key: "count", label: "Count", type: "number", default: 10, min: 1, max: 100 },
      { key: "unique", label: "Unique companies", type: "checkbox", default: false }
    ]
  },
  run: (ctx) => {
    const { count, unique } = ctx.options
    const rng = ctx.rng
    const results: any[] = []
    const seen = new Set<string>()
    const companies = companiesData.companies

    for (let i = 0; i < count; i++) {
      let company: string
      let attempts = 0

      do {
        company = companies[Math.floor(rng() * companies.length)]
        attempts++
      } while (unique && seen.has(company) && attempts < 1000)

      seen.add(company)

      results.push({
        id: `company-${i}`,
        value: company,
        formatted: company
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
    title: "Random Company Generator – Well-Known Brands | BestRandom",
    description: "Generate random companies and brands from the most well known or profitable businesses.",
    h1: "Random Company Generator",
    faq: [
      { question: "What companies are included?", answer: "The generator includes well-known companies and brands from various industries." },
      { question: "Can I generate multiple companies?", answer: "Yes. Choose how many companies to generate." },
      { question: "Can I repeat the same result?", answer: "Yes. Use the same seed to reproduce results." },
      { question: "Is this tool free?", answer: "Yes. No limits or sign-up required." }
    ]
  },
  icon: Building2,
  popular: false
}

// Random US State Generator
export const randomStateTool: ToolConfig = {
  slug: "random-state-generator",
  category: "fun",
  name: "Random US State Generator",
  shortDescription: "Generate random US states",
  longDescription: "Shuffle the 50 United States and pick one at random. Or, generate a whole list of randomized states. A great start to a DIY witness protection program.",
  generatorType: "list",
  defaultOptions: {
    count: 10,
    showAbbreviation: true,
    unique: false
  },
  optionSchema: {
    fields: [
      { key: "count", label: "Count", type: "number", default: 10, min: 1, max: 50 },
      { key: "showAbbreviation", label: "Show abbreviation", type: "checkbox", default: true },
      { key: "unique", label: "Unique states", type: "checkbox", default: false }
    ]
  },
  run: (ctx) => {
    const { count, showAbbreviation, unique } = ctx.options
    const rng = ctx.rng
    const results: any[] = []
    const seen = new Set<string>()
    const states = statesData.states

    for (let i = 0; i < count; i++) {
      let state: typeof states[0]
      let attempts = 0

      do {
        state = states[Math.floor(rng() * states.length)]
        attempts++
      } while (unique && seen.has(state.name) && attempts < 1000)

      seen.add(state.name)
      
      const displayValue = showAbbreviation
        ? `${state.name} (${state.abbreviation})`
        : state.name

      results.push({
        id: `state-${i}`,
        value: displayValue,
        formatted: displayValue,
        name: state.name,
        abbreviation: state.abbreviation
      })
    }

    return {
      items: results,
      meta: {
        seedUsed: ctx.seed,
        count: results.length,
        generatedAt: Date.now()
      },
      previewText: results.slice(0, 3).map(r => r.name).join(", ")
    }
  },
  seo: {
    title: "Random US State Generator – All 50 States | BestRandom",
    description: "Shuffle the 50 United States and pick one at random. Or, generate a whole list of randomized states.",
    h1: "Random US State Generator",
    faq: [
      { question: "Are all 50 states included?", answer: "Yes. All 50 United States are included in the generator." },
      { question: "Can I see state abbreviations?", answer: "Yes. Enable 'Show abbreviation' to see the two-letter state code." },
      { question: "Can I generate multiple states?", answer: "Yes. Choose how many states to generate." },
      { question: "Can I repeat the same result?", answer: "Yes. Use the same seed to reproduce results." },
      { question: "Is this tool free?", answer: "Yes. No limits or sign-up required." }
    ]
  },
  icon: MapPin,
  popular: false
}

// Random Pet Name Generator
export const randomPetNameTool: ToolConfig = {
  slug: "random-pet-name-generator",
  category: "fun",
  name: "Random Pet Name Generator",
  shortDescription: "Generate unique pet names",
  longDescription: "Generate unique pet names instantly with our random pet name generator. Perfect for dogs, cats, or any furry friend. Rerun to find a new random list!",
  generatorType: "list",
  defaultOptions: {
    count: 10,
    petType: "all",
    unique: false
  },
  optionSchema: {
    fields: [
      { key: "count", label: "Count", type: "number", default: 10, min: 1, max: 100 },
      {
        key: "petType",
        label: "Pet Type",
        type: "select",
        default: "all",
        options: [
          { value: "all", label: "All Types" },
          { value: "dogs", label: "Dogs" },
          { value: "cats", label: "Cats" },
          { value: "birds", label: "Birds" },
          { value: "other", label: "Other" }
        ]
      },
      { key: "unique", label: "Unique names", type: "checkbox", default: false }
    ]
  },
  run: (ctx) => {
    const { count, petType, unique } = ctx.options
    const rng = ctx.rng
    const results: any[] = []
    const seen = new Set<string>()

    let namePool: string[] = []
    if (petType === "all") {
      namePool = Object.values(petNamesData.petNames).flat()
    } else {
      namePool = petNamesData.petNames[petType as keyof typeof petNamesData.petNames] || []
    }

    for (let i = 0; i < count; i++) {
      let name: string
      let attempts = 0

      do {
        name = namePool[Math.floor(rng() * namePool.length)]
        attempts++
      } while (unique && seen.has(name) && attempts < 1000)

      seen.add(name)

      results.push({
        id: `pet-name-${i}`,
        value: name,
        formatted: name
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
    title: "Random Pet Name Generator – Unique Pet Names | BestRandom",
    description: "Generate unique pet names instantly. Perfect for dogs, cats, or any furry friend.",
    h1: "Random Pet Name Generator",
    faq: [
      { question: "What pet types are available?", answer: "Dogs, cats, birds, and other pets are included." },
      { question: "Can I filter by pet type?", answer: "Yes. Select a specific pet type or choose 'All Types'." },
      { question: "Can I generate multiple names?", answer: "Yes. Choose how many pet names to generate." },
      { question: "Can I repeat the same result?", answer: "Yes. Use the same seed to reproduce results." },
      { question: "Is this tool free?", answer: "Yes. No limits or sign-up required." }
    ]
  },
  icon: Heart,
  popular: true
}

// Random Weekday Generator
export const randomWeekdayTool: ToolConfig = {
  slug: "random-weekday-generator",
  category: "fun",
  name: "Random Weekday Generator",
  shortDescription: "Generate random days of the week",
  longDescription: "The 7 days of the week shuffled randomly. Generate a list of as many days as needed, including or excluding duplicates.",
  generatorType: "list",
  defaultOptions: {
    count: 7,
    unique: false
  },
  optionSchema: {
    fields: [
      { key: "count", label: "Count", type: "number", default: 7, min: 1, max: 100 },
      { key: "unique", label: "Unique days only", type: "checkbox", default: false }
    ]
  },
  run: (ctx) => {
    const { count, unique } = ctx.options
    const rng = ctx.rng
    const results: any[] = []
    const seen = new Set<string>()
    const weekdays = weekdaysData.weekdays

    for (let i = 0; i < count; i++) {
      let weekday: string
      let attempts = 0

      do {
        weekday = weekdays[Math.floor(rng() * weekdays.length)]
        attempts++
      } while (unique && seen.has(weekday) && attempts < 1000)

      seen.add(weekday)

      results.push({
        id: `weekday-${i}`,
        value: weekday,
        formatted: weekday
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
    title: "Random Weekday Generator – Days of the Week | BestRandom",
    description: "The 7 days of the week shuffled randomly. Generate a list of as many days as needed.",
    h1: "Random Weekday Generator",
    faq: [
      { question: "What days are included?", answer: "All 7 days of the week: Monday through Sunday." },
      { question: "Can I generate multiple days?", answer: "Yes. Choose how many days to generate." },
      { question: "Can I repeat the same result?", answer: "Yes. Use the same seed to reproduce results." },
      { question: "Is this tool free?", answer: "Yes. No limits or sign-up required." }
    ]
  },
  icon: Calendar,
  popular: false
}

// Random Month Generator
export const randomMonthTool: ToolConfig = {
  slug: "random-month-generator",
  category: "fun",
  name: "Random Month Generator",
  shortDescription: "Generate random months of the year",
  longDescription: "The twelve months of the year, generated randomly. Use this to pick an arbitrary deadline, a vacation month, or a random anniversary for your partner.",
  generatorType: "list",
  defaultOptions: {
    count: 12,
    unique: false
  },
  optionSchema: {
    fields: [
      { key: "count", label: "Count", type: "number", default: 12, min: 1, max: 100 },
      { key: "unique", label: "Unique months only", type: "checkbox", default: false }
    ]
  },
  run: (ctx) => {
    const { count, unique } = ctx.options
    const rng = ctx.rng
    const results: any[] = []
    const seen = new Set<string>()
    const months = monthsData.months

    for (let i = 0; i < count; i++) {
      let month: string
      let attempts = 0

      do {
        month = months[Math.floor(rng() * months.length)]
        attempts++
      } while (unique && seen.has(month) && attempts < 1000)

      seen.add(month)

      results.push({
        id: `month-${i}`,
        value: month,
        formatted: month
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
    title: "Random Month Generator – Months of the Year | BestRandom",
    description: "The twelve months of the year, generated randomly. Use this to pick an arbitrary deadline, a vacation month, or a random anniversary.",
    h1: "Random Month Generator",
    faq: [
      { question: "What months are included?", answer: "All 12 months of the year: January through December." },
      { question: "Can I generate multiple months?", answer: "Yes. Choose how many months to generate." },
      { question: "Can I repeat the same result?", answer: "Yes. Use the same seed to reproduce results." },
      { question: "Is this tool free?", answer: "Yes. No limits or sign-up required." }
    ]
  },
  icon: Calendar,
  popular: false
}

// Random Joke Generator
export const randomJokeTool: ToolConfig = {
  slug: "random-joke-generator",
  category: "fun",
  name: "Random Joke Generator",
  shortDescription: "Generate random jokes",
  longDescription: "Funny jokes and appropriate for kids or co-workers. Get a random 'dad joke', a classic one-liner, or just a silly pun.",
  generatorType: "list",
  defaultOptions: {
    count: 5,
    unique: false
  },
  optionSchema: {
    fields: [
      { key: "count", label: "Count", type: "number", default: 5, min: 1, max: 20 },
      { key: "unique", label: "Unique jokes", type: "checkbox", default: false }
    ]
  },
  run: (ctx) => {
    const { count, unique } = ctx.options
    const rng = ctx.rng
    const results: any[] = []
    const seen = new Set<string>()
    const jokes = jokesData.jokes

    for (let i = 0; i < count; i++) {
      let joke: string
      let attempts = 0

      do {
        joke = jokes[Math.floor(rng() * jokes.length)]
        attempts++
      } while (unique && seen.has(joke) && attempts < 1000)

      seen.add(joke)

      results.push({
        id: `joke-${i}`,
        value: joke,
        formatted: joke
      })
    }

    return {
      items: results,
      meta: {
        seedUsed: ctx.seed,
        count: results.length,
        generatedAt: Date.now()
      },
      previewText: results.slice(0, 1).map(r => r.value).join("")
    }
  },
  seo: {
    title: "Random Joke Generator – Funny Jokes | BestRandom",
    description: "Funny jokes and appropriate for kids or co-workers. Get a random 'dad joke', a classic one-liner, or just a silly pun.",
    h1: "Random Joke Generator",
    faq: [
      { question: "What types of jokes are included?", answer: "The generator includes dad jokes, one-liners, and puns appropriate for all ages." },
      { question: "Can I generate multiple jokes?", answer: "Yes. Choose how many jokes to generate." },
      { question: "Can I repeat the same result?", answer: "Yes. Use the same seed to reproduce results." },
      { question: "Is this tool free?", answer: "Yes. No limits or sign-up required." }
    ]
  },
  icon: Smile,
  popular: true
}

// Random Question Generator
export const randomQuestionTool: ToolConfig = {
  slug: "random-question-generator",
  category: "fun",
  name: "Random Question Generator",
  shortDescription: "Generate random icebreaker questions",
  longDescription: "Great icebreaker questions to help spark a conversation. Jump between these random questions on your next first date, gathering, or just with a random friend.",
  generatorType: "list",
  defaultOptions: {
    count: 5,
    unique: false
  },
  optionSchema: {
    fields: [
      { key: "count", label: "Count", type: "number", default: 5, min: 1, max: 25 },
      { key: "unique", label: "Unique questions", type: "checkbox", default: false }
    ]
  },
  run: (ctx) => {
    const { count, unique } = ctx.options
    const rng = ctx.rng
    const results: any[] = []
    const seen = new Set<string>()
    const questions = questionsData.questions

    for (let i = 0; i < count; i++) {
      let question: string
      let attempts = 0

      do {
        question = questions[Math.floor(rng() * questions.length)]
        attempts++
      } while (unique && seen.has(question) && attempts < 1000)

      seen.add(question)

      results.push({
        id: `question-${i}`,
        value: question,
        formatted: question
      })
    }

    return {
      items: results,
      meta: {
        seedUsed: ctx.seed,
        count: results.length,
        generatedAt: Date.now()
      },
      previewText: results.slice(0, 1).map(r => r.value).join("")
    }
  },
  seo: {
    title: "Random Question Generator – Icebreaker Questions | BestRandom",
    description: "Great icebreaker questions to help spark a conversation. Perfect for first dates, gatherings, or conversations with friends.",
    h1: "Random Question Generator",
    faq: [
      { question: "What types of questions are included?", answer: "The generator includes icebreaker questions perfect for starting conversations." },
      { question: "Can I generate multiple questions?", answer: "Yes. Choose how many questions to generate." },
      { question: "Can I repeat the same result?", answer: "Yes. Use the same seed to reproduce results." },
      { question: "Is this tool free?", answer: "Yes. No limits or sign-up required." }
    ]
  },
  icon: MessageSquare,
  popular: true
}

export const funTools: ToolConfig[] = [
  randomAnimalTool,
  randomCountryTool,
  randomJobTool,
  randomSportTool,
  randomFoodTool,
  randomCompanyTool,
  randomStateTool,
  randomPetNameTool,
  randomWeekdayTool,
  randomMonthTool,
  randomJokeTool,
  randomQuestionTool
]
