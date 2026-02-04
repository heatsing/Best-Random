import { Film, BookOpen, Quote, Star, Zap, Gamepad2 } from "lucide-react"
import type { ToolConfig } from "../registry"
import moviesData from "@/data/movies.json"
import booksData from "@/data/books.json"
import quotesData from "@/data/quotes.json"
import superheroesData from "@/data/superheroes.json"
import superpowersData from "@/data/superpowers.json"
import cardsData from "@/data/cards.json"

// Random Movie Generator
export const randomMovieTool: ToolConfig = {
  slug: "random-movie-generator",
  category: "fun",
  name: "Random Movie Generator",
  shortDescription: "Discover random movies by genre — Disney, Marvel, Netflix & more",
  longDescription: "Get random movie recommendations from 350+ top-rated films across 14 genres. Choose from Disney, Marvel, Netflix, Pixar, James Bond, Action, Comedy, Drama, Horror, Thriller, Animation, Sci-Fi/Fantasy, History/Biography, or Documentaries. Perfect for movie night decisions.",
  generatorType: "list",
  defaultOptions: {
    count: 5,
    genre: "all",
    unique: true
  },
  optionSchema: {
    fields: [
      { key: "count", label: "Count", type: "number", default: 5, min: 1, max: 20 },
      {
        key: "genre",
        label: "Genre",
        type: "select",
        default: "all",
        options: [
          { value: "all", label: "All Genres" },
          { value: "disney", label: "Disney" },
          { value: "marvel", label: "Marvel" },
          { value: "netflix", label: "Netflix" },
          { value: "pixar", label: "Pixar" },
          { value: "jamesbond", label: "James Bond" },
          { value: "action", label: "Action" },
          { value: "comedy", label: "Comedy" },
          { value: "drama", label: "Drama" },
          { value: "horror", label: "Horror" },
          { value: "thriller", label: "Thriller" },
          { value: "animation", label: "Animation" },
          { value: "scifi_fantasy", label: "Sci-Fi / Fantasy" },
          { value: "scifi", label: "Sci-Fi (Classic)" },
          { value: "romance", label: "Romance" },
          { value: "history", label: "History / Biography" },
          { value: "documentary", label: "Documentary" }
        ]
      },
      { key: "unique", label: "Unique movies", type: "checkbox", default: true }
    ]
  },
  run: (ctx) => {
    const { count, genre, unique } = ctx.options
    const rng = ctx.rng
    const results: any[] = []
    const seen = new Set<string>()

    let moviePool: string[] = []
    if (genre === "all") {
      moviePool = Object.values(moviesData.movies).flat()
    } else {
      moviePool = moviesData.movies[genre as keyof typeof moviesData.movies] || []
    }

    for (let i = 0; i < count; i++) {
      let movie: string
      let attempts = 0
      do {
        movie = moviePool[Math.floor(rng() * moviePool.length)]
        attempts++
      } while (unique && seen.has(movie) && attempts < 1000)
      seen.add(movie)

      results.push({
        id: `movie-${i}`,
        value: movie,
        formatted: movie
      })
    }

    return {
      items: results,
      meta: { seedUsed: ctx.seed, count: results.length, generatedAt: Date.now() },
      previewText: results.slice(0, 3).map(r => r.value).join(", ")
    }
  },
  seo: {
    title: "Random Movie Generator: What Should I Watch Tonight? | BestRandom",
    description: "Get random movie picks from 350+ top-rated films across 14 genres including Disney, Marvel, Netflix, Pixar, James Bond, and more. End the scrolling and pick your next movie.",
    h1: "Random Movie Generator",
    faq: [
      { question: "What genres are available?", answer: "Disney, Marvel, Netflix, Pixar, James Bond, Action, Comedy, Drama, Horror, Thriller, Animation, Sci-Fi/Fantasy, History/Biography, and Documentary — 14 genres in total." },
      { question: "How many movies are in the database?", answer: "The database includes 350+ top-rated films across 14 genres." },
      { question: "Can I get unique results?", answer: "Yes. Enable 'Unique movies' to avoid duplicates." },
      { question: "Can I filter by studio like Disney or Marvel?", answer: "Yes. Select Disney, Marvel, Netflix, or Pixar from the genre dropdown." },
      { question: "Is this tool free?", answer: "Yes. No limits or sign-up required." }
    ]
  },
  icon: Film,
  popular: true
}

// Random Book Generator
export const randomBookTool: ToolConfig = {
  slug: "random-book-generator",
  category: "fun",
  name: "Random Book Generator",
  shortDescription: "Discover random books to read",
  longDescription: "Get random book recommendations from top-rated books across genres. Choose from fiction, fantasy, sci-fi, horror, mystery, non-fiction, and romance. Each result shows the title and author.",
  generatorType: "list",
  defaultOptions: {
    count: 5,
    genre: "all",
    showAuthor: true,
    unique: true
  },
  optionSchema: {
    fields: [
      { key: "count", label: "Count", type: "number", default: 5, min: 1, max: 20 },
      {
        key: "genre",
        label: "Genre",
        type: "select",
        default: "all",
        options: [
          { value: "all", label: "All Genres" },
          { value: "fiction", label: "Fiction" },
          { value: "fantasy", label: "Fantasy" },
          { value: "scifi", label: "Sci-Fi" },
          { value: "horror", label: "Horror" },
          { value: "mystery", label: "Mystery" },
          { value: "nonfiction", label: "Non-Fiction" },
          { value: "romance", label: "Romance" }
        ]
      },
      { key: "showAuthor", label: "Show author", type: "checkbox", default: true },
      { key: "unique", label: "Unique books", type: "checkbox", default: true }
    ]
  },
  run: (ctx) => {
    const { count, genre, showAuthor, unique } = ctx.options
    const rng = ctx.rng
    const results: any[] = []
    const seen = new Set<string>()

    let bookPool = booksData.books
    if (genre !== "all") {
      bookPool = booksData.books.filter(b => b.genre === genre)
    }

    for (let i = 0; i < count; i++) {
      let book: typeof booksData.books[0]
      let attempts = 0
      do {
        book = bookPool[Math.floor(rng() * bookPool.length)]
        attempts++
      } while (unique && seen.has(book.title) && attempts < 1000)
      seen.add(book.title)

      const displayValue = showAuthor ? `${book.title} — ${book.author}` : book.title

      results.push({
        id: `book-${i}`,
        value: displayValue,
        formatted: displayValue,
        title: book.title,
        author: book.author,
        genre: book.genre
      })
    }

    return {
      items: results,
      meta: { seedUsed: ctx.seed, count: results.length, generatedAt: Date.now() },
      previewText: results.slice(0, 3).map(r => r.title).join(", ")
    }
  },
  seo: {
    title: "Random Book Generator: What Book Should I Read Next? | BestRandom",
    description: "Discover your next read from 60+ highly-rated books across fiction, fantasy, sci-fi, mystery, and more. Each result includes the title and author.",
    h1: "Random Book Generator",
    faq: [
      { question: "What genres are available?", answer: "Fiction, fantasy, sci-fi, horror, mystery, non-fiction, and romance." },
      { question: "How many books are in the database?", answer: "The database includes 60+ highly-rated books across 7 genres." },
      { question: "Can I see the author?", answer: "Yes. Enable 'Show author' to see the author alongside the title." },
      { question: "Can I repeat the same result?", answer: "Yes. Use the same seed to reproduce results." },
      { question: "Is this tool free?", answer: "Yes. No limits or sign-up required." }
    ]
  },
  icon: BookOpen,
  popular: true
}

// Random Quote Generator
export const randomQuoteTool: ToolConfig = {
  slug: "random-quote-generator",
  category: "fun",
  name: "Random Quote Generator",
  shortDescription: "Get inspiring random quotes",
  longDescription: "Get random inspirational quotes from famous thinkers, leaders, and artists. Each quote comes with its author attribution. Perfect for daily motivation or social media posts.",
  generatorType: "list",
  defaultOptions: {
    count: 3,
    unique: true
  },
  optionSchema: {
    fields: [
      { key: "count", label: "Count", type: "number", default: 3, min: 1, max: 10 },
      { key: "unique", label: "Unique quotes", type: "checkbox", default: true }
    ]
  },
  run: (ctx) => {
    const { count, unique } = ctx.options
    const rng = ctx.rng
    const results: any[] = []
    const seen = new Set<string>()
    const quotes = quotesData.quotes

    for (let i = 0; i < count; i++) {
      let quote: typeof quotes[0]
      let attempts = 0
      do {
        quote = quotes[Math.floor(rng() * quotes.length)]
        attempts++
      } while (unique && seen.has(quote.text) && attempts < 1000)
      seen.add(quote.text)

      const displayValue = `"${quote.text}" — ${quote.author}`

      results.push({
        id: `quote-${i}`,
        value: displayValue,
        formatted: displayValue,
        text: quote.text,
        author: quote.author
      })
    }

    return {
      items: results,
      meta: { seedUsed: ctx.seed, count: results.length, generatedAt: Date.now() },
      previewText: results.slice(0, 1).map(r => `"${r.text.substring(0, 50)}..."`).join("")
    }
  },
  seo: {
    title: "Random Quote Generator: Get Inspired by Famous Quotes | BestRandom",
    description: "Discover inspiring quotes from famous thinkers, scientists, leaders, and artists. Perfect for daily motivation, social media, or presentations.",
    h1: "Random Quote Generator",
    faq: [
      { question: "What kind of quotes are included?", answer: "Inspirational quotes from famous thinkers, leaders, scientists, and artists." },
      { question: "Can I generate multiple quotes?", answer: "Yes. Choose how many quotes to generate." },
      { question: "Can I repeat the same result?", answer: "Yes. Use the same seed to reproduce results." },
      { question: "Is this tool free?", answer: "Yes. No limits or sign-up required." }
    ]
  },
  icon: Quote,
  popular: true
}

// Random Superhero Generator
export const randomSuperheroTool: ToolConfig = {
  slug: "random-superhero-generator",
  category: "fun",
  name: "Random Superhero Generator",
  shortDescription: "Generate random superheroes from Marvel & DC",
  longDescription: "Discover random superheroes from the Marvel and DC universes. Choose from Marvel, DC, or both. Perfect for trivia, character exploration, or just for fun.",
  generatorType: "list",
  defaultOptions: {
    count: 6,
    universe: "all",
    unique: true
  },
  optionSchema: {
    fields: [
      { key: "count", label: "Count", type: "number", default: 6, min: 1, max: 40 },
      {
        key: "universe",
        label: "Universe",
        type: "select",
        default: "all",
        options: [
          { value: "all", label: "All (Marvel + DC)" },
          { value: "marvel", label: "Marvel" },
          { value: "dc", label: "DC" }
        ]
      },
      { key: "unique", label: "Unique heroes", type: "checkbox", default: true }
    ]
  },
  run: (ctx) => {
    const { count, universe, unique } = ctx.options
    const rng = ctx.rng
    const results: any[] = []
    const seen = new Set<string>()

    let heroPool: Array<{ name: string; universe: string }> = []
    if (universe === "all" || universe === "marvel") {
      heroPool.push(...superheroesData.superheroes.marvel.map(name => ({ name, universe: "Marvel" })))
    }
    if (universe === "all" || universe === "dc") {
      heroPool.push(...superheroesData.superheroes.dc.map(name => ({ name, universe: "DC" })))
    }

    for (let i = 0; i < count; i++) {
      let hero: typeof heroPool[0]
      let attempts = 0
      do {
        hero = heroPool[Math.floor(rng() * heroPool.length)]
        attempts++
      } while (unique && seen.has(hero.name) && attempts < 1000)
      seen.add(hero.name)

      const displayValue = `${hero.name} (${hero.universe})`

      results.push({
        id: `hero-${i}`,
        value: displayValue,
        formatted: displayValue,
        name: hero.name,
        universe: hero.universe
      })
    }

    return {
      items: results,
      meta: { seedUsed: ctx.seed, count: results.length, generatedAt: Date.now() },
      previewText: results.slice(0, 3).map(r => r.name).join(", ")
    }
  },
  seo: {
    title: "Random Superhero Generator: Discover Marvel & DC Heroes | BestRandom",
    description: "Generate random superheroes from 80 Marvel and DC characters. Perfect for trivia nights, character debates, or discovering new heroes to read about.",
    h1: "Random Superhero Generator",
    faq: [
      { question: "What heroes are included?", answer: "40 popular Marvel heroes and 40 popular DC heroes." },
      { question: "Can I filter by universe?", answer: "Yes. Choose Marvel, DC, or both." },
      { question: "Can I repeat the same result?", answer: "Yes. Use the same seed to reproduce results." },
      { question: "Is this tool free?", answer: "Yes. No limits or sign-up required." }
    ]
  },
  icon: Star,
  popular: true
}

// Random Superpower Generator
export const randomSuperpowerTool: ToolConfig = {
  slug: "random-superpower-generator",
  category: "fun",
  name: "Random Superpower Generator",
  shortDescription: "Generate random superpowers",
  longDescription: "Get random superpowers from a collection of 100 abilities. Perfect for creative writing, character creation, RPGs, or party games. What power would you get?",
  generatorType: "list",
  defaultOptions: {
    count: 3,
    unique: true
  },
  optionSchema: {
    fields: [
      { key: "count", label: "Count", type: "number", default: 3, min: 1, max: 20 },
      { key: "unique", label: "Unique powers", type: "checkbox", default: true }
    ]
  },
  run: (ctx) => {
    const { count, unique } = ctx.options
    const rng = ctx.rng
    const results: any[] = []
    const seen = new Set<string>()
    const powers = superpowersData.superpowers

    for (let i = 0; i < count; i++) {
      let power: string
      let attempts = 0
      do {
        power = powers[Math.floor(rng() * powers.length)]
        attempts++
      } while (unique && seen.has(power) && attempts < 1000)
      seen.add(power)

      results.push({
        id: `power-${i}`,
        value: power,
        formatted: power
      })
    }

    return {
      items: results,
      meta: { seedUsed: ctx.seed, count: results.length, generatedAt: Date.now() },
      previewText: results.slice(0, 3).map(r => r.value).join(", ")
    }
  },
  seo: {
    title: "Random Superpower Generator: What Power Would You Have? | BestRandom",
    description: "Get a random superpower from 100 unique abilities. Ideal for creative writing, RPG character builds, party games, or \"what if\" conversations.",
    h1: "Random Superpower Generator",
    faq: [
      { question: "How many superpowers are available?", answer: "The database includes 100 unique superpowers." },
      { question: "Can I generate multiple powers?", answer: "Yes. Choose how many superpowers to generate." },
      { question: "Can I repeat the same result?", answer: "Yes. Use the same seed to reproduce results." },
      { question: "Is this tool free?", answer: "Yes. No limits or sign-up required." }
    ]
  },
  icon: Zap,
  popular: true
}

// Random Playing Card Generator
export const randomCardTool: ToolConfig = {
  slug: "random-card-generator",
  category: "games",
  name: "Random Playing Card Generator",
  shortDescription: "Draw random playing cards",
  longDescription: "Draw random playing cards from a standard 52-card deck. Choose how many cards to draw and whether to allow duplicates. Perfect for card games, magic tricks, or probability exercises.",
  generatorType: "list",
  defaultOptions: {
    count: 5,
    unique: true
  },
  optionSchema: {
    fields: [
      { key: "count", label: "Cards to draw", type: "number", default: 5, min: 1, max: 52 },
      { key: "unique", label: "No duplicates (like a real deck)", type: "checkbox", default: true }
    ]
  },
  run: (ctx) => {
    const { count, unique } = ctx.options
    const rng = ctx.rng
    const results: any[] = []
    const seen = new Set<string>()

    const { suits, suitNames, ranks, rankNames } = cardsData

    for (let i = 0; i < count; i++) {
      let suitIdx: number, rankIdx: number, cardKey: string
      let attempts = 0
      do {
        suitIdx = Math.floor(rng() * suits.length)
        rankIdx = Math.floor(rng() * ranks.length)
        cardKey = `${rankIdx}-${suitIdx}`
        attempts++
      } while (unique && seen.has(cardKey) && attempts < 1000)
      seen.add(cardKey)

      const displayValue = `${ranks[rankIdx]}${suits[suitIdx]}`
      const fullName = `${rankNames[rankIdx]} of ${suitNames[suitIdx]}`

      results.push({
        id: `card-${i}`,
        value: displayValue,
        formatted: `${displayValue} (${fullName})`,
        rank: ranks[rankIdx],
        suit: suits[suitIdx],
        fullName
      })
    }

    return {
      items: results,
      meta: { seedUsed: ctx.seed, count: results.length, generatedAt: Date.now() },
      previewText: results.slice(0, 5).map(r => r.value).join(" ")
    }
  },
  seo: {
    title: "Random Card Generator: Draw Cards from a 52-Card Deck | BestRandom",
    description: "Draw random playing cards from a standard 52-card deck with no-duplicate mode. Perfect for card games, magic tricks, or probability exercises.",
    h1: "Random Playing Card Generator",
    faq: [
      { question: "Is this a standard deck?", answer: "Yes. 52 cards with 4 suits (Spades, Hearts, Diamonds, Clubs) and 13 ranks (A through K)." },
      { question: "Can I draw without replacement?", answer: "Yes. Enable 'No duplicates' to simulate drawing from a real deck." },
      { question: "How many cards can I draw?", answer: "Up to 52 cards (the full deck)." },
      { question: "Can I repeat the same result?", answer: "Yes. Use the same seed to reproduce results." },
      { question: "Is this tool free?", answer: "Yes. No limits or sign-up required." }
    ]
  },
  icon: Gamepad2,
  popular: true
}

export const entertainmentTools: ToolConfig[] = [
  randomMovieTool,
  randomBookTool,
  randomQuoteTool,
  randomSuperheroTool,
  randomSuperpowerTool,
  randomCardTool
]
