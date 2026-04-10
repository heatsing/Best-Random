import { Coins, Dice1, Ticket, Grid3X3, PlayingCards, Bird } from "lucide-react"
import type { ToolConfig } from "../registry"

export const lotteryQuickPickTool: ToolConfig = {
  slug: "lottery-quick-pick",
  category: "games",
  name: "Lottery Quick Pick",
  shortDescription: "Generate random lottery numbers instantly",
  longDescription: "Generate lottery quick pick numbers with unique picks in your chosen range. Perfect for practice, simulations, or fun random draws.",
  generatorType: "list",
  defaultOptions: {
    picks: 6,
    maxNumber: 49,
    includeBonus: true,
  },
  optionSchema: {
    fields: [
      { key: "picks", label: "Numbers to Pick", type: "number", default: 6, min: 3, max: 12 },
      { key: "maxNumber", label: "Max Number", type: "number", default: 49, min: 20, max: 99 },
      { key: "includeBonus", label: "Include bonus ball", type: "checkbox", default: true },
    ],
  },
  run: (ctx) => {
    const { picks, maxNumber, includeBonus } = ctx.options
    const rng = ctx.rng
    const pool = Array.from({ length: maxNumber }, (_, i) => i + 1)

    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1))
      ;[pool[i], pool[j]] = [pool[j], pool[i]]
    }

    const main = pool.slice(0, Math.min(picks, maxNumber)).sort((a, b) => a - b)
    const bonus = includeBonus && pool[picks] ? pool[picks] : undefined
    const rows = main.map((n, i) => ({ id: `lottery-${i}`, value: n, formatted: String(n) }))
    if (bonus !== undefined) {
      rows.push({ id: "lottery-bonus", value: bonus, formatted: `Bonus: ${bonus}` } as any)
    }

    return {
      items: rows,
      meta: { seedUsed: ctx.seed, count: rows.length, generatedAt: Date.now() },
      previewText: main.join(", "),
    }
  },
  seo: {
    title: "Lottery Quick Pick - Random Lottery Numbers | BestRandom",
    description: "Generate lottery quick pick numbers with optional bonus ball. Fast, shareable, and repeatable random picks.",
    h1: "Lottery Quick Pick",
    faq: [
      { question: "Are numbers unique?", answer: "Yes. Main picks are always unique in the selected range." },
      { question: "Can I include a bonus ball?", answer: "Yes. Toggle the bonus ball option on or off." },
      { question: "Can I reproduce the same result?", answer: "Yes. Use the same seed and options." },
    ],
  },
  icon: Ticket,
}

export const kenoQuickPickTool: ToolConfig = {
  slug: "keno-quick-pick",
  category: "games",
  name: "Keno Quick Pick",
  shortDescription: "Generate random Keno picks (1-80)",
  longDescription: "Generate Keno quick picks with unique numbers from 1 to 80. Choose your spots and instantly get a random ticket.",
  generatorType: "list",
  defaultOptions: {
    spots: 10,
  },
  optionSchema: {
    fields: [{ key: "spots", label: "Spots", type: "number", default: 10, min: 1, max: 20 }],
  },
  run: (ctx) => {
    const { spots } = ctx.options
    const rng = ctx.rng
    const pool = Array.from({ length: 80 }, (_, i) => i + 1)

    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1))
      ;[pool[i], pool[j]] = [pool[j], pool[i]]
    }

    const picks = pool.slice(0, spots).sort((a, b) => a - b)
    return {
      items: picks.map((n, i) => ({ id: `keno-${i}`, value: n, formatted: String(n) })),
      meta: { seedUsed: ctx.seed, count: picks.length, generatedAt: Date.now() },
      previewText: picks.join(", "),
    }
  },
  seo: {
    title: "Keno Quick Pick - Random Keno Numbers | BestRandom",
    description: "Generate random Keno quick picks from 1 to 80 with configurable spots.",
    h1: "Keno Quick Pick",
    faq: [
      { question: "What range is used?", answer: "Keno picks are generated from 1 to 80." },
      { question: "Can I set spot count?", answer: "Yes. Choose from 1 to 20 spots." },
      { question: "Can I share results?", answer: "Yes. Use the generated URL with seed and options." },
    ],
  },
  icon: Grid3X3,
}

export const coinFlipperTool: ToolConfig = {
  slug: "coin-flipper",
  category: "games",
  name: "Coin Flipper",
  shortDescription: "Flip virtual coins with selectable coin type",
  longDescription: "Flip virtual coins with a selected coin type and detailed heads/tails statistics. Great for quick decisions, games, and probability demos.",
  generatorType: "game",
  defaultOptions: {
    flips: 2,
    coinType: "standard",
  },
  optionSchema: {
    fields: [
      { key: "flips", label: "Flip Count", type: "number", default: 2, min: 1, max: 200 },
      {
        key: "coinType",
        label: "Coin Type",
        type: "select",
        default: "standard",
        options: [
          { value: "standard", label: "Standard Coin" },
          { value: "us-quarter", label: "US Quarter" },
          { value: "us-penny", label: "US Penny" },
          { value: "euro-1", label: "Euro €1" },
          { value: "uk-pound", label: "British £1" },
          { value: "canadian-loonie", label: "Canadian Loonie" },
          { value: "custom-decision", label: "Decision Maker Coin" },
        ],
      },
    ],
  },
  run: (ctx) => {
    const { flips, coinType } = ctx.options
    const rng = ctx.rng
    const outcomes: string[] = []
    const coinLabelMap: Record<string, string> = {
      standard: "Standard Coin",
      "us-quarter": "US Quarter",
      "us-penny": "US Penny",
      "euro-1": "Euro €1",
      "uk-pound": "British £1",
      "canadian-loonie": "Canadian Loonie",
      "custom-decision": "Decision Maker Coin",
    }
    const coinLabel = coinLabelMap[coinType] || "Standard Coin"

    for (let i = 0; i < flips; i++) outcomes.push(rng() < 0.5 ? "Heads" : "Tails")
    const heads = outcomes.filter((x) => x === "Heads").length
    const tails = flips - heads
    const items = outcomes.map((v, i) => ({
      id: `flip-${i}`,
      value: v,
      formatted: `Flip ${i + 1} (${coinLabel}): ${v}`,
    }))
    items.push({
      id: "flip-stats",
      value: `Heads ${heads} / Tails ${tails}`,
      formatted: `Type: ${coinLabel} | Heads: ${heads} (${((heads / flips) * 100).toFixed(1)}%), Tails: ${tails} (${((tails / flips) * 100).toFixed(1)}%)`,
    } as any)
    return {
      items,
      meta: { seedUsed: ctx.seed, count: items.length, generatedAt: Date.now() },
      previewText: outcomes.slice(0, 5).join(", "),
    }
  },
  seo: {
    title: "Coin Flipper - Heads or Tails Online | BestRandom",
    description: "Flip virtual coins online with a selectable coin type and instant heads/tails statistics.",
    h1: "Coin Flipper",
    faq: [
      { question: "Can I flip multiple coins?", answer: "Yes. Set any flip count from 1 to 200." },
      { question: "Do I get stats?", answer: "Yes. Heads/tails totals and percentages are included." },
      { question: "Can I choose a coin type?", answer: "Yes. Use the coin type selector before flipping." },
      { question: "Is it deterministic with seed?", answer: "Yes. Same seed and options give same result." },
    ],
  },
  icon: Coins,
}

export const diceRollerGameTool: ToolConfig = {
  slug: "dice-roller-game",
  category: "games",
  name: "Dice Roller",
  shortDescription: "Roll custom dice and see total",
  longDescription: "Roll one or more dice with configurable sides and get per-die outcomes plus total sum.",
  generatorType: "game",
  defaultOptions: {
    diceCount: 2,
    sides: 6,
  },
  optionSchema: {
    fields: [
      { key: "diceCount", label: "Number of Dice", type: "number", default: 2, min: 1, max: 100 },
      { key: "sides", label: "Sides per Die", type: "number", default: 6, min: 2, max: 1000 },
    ],
  },
  run: (ctx) => {
    const { diceCount, sides } = ctx.options
    const rng = ctx.rng
    const rolls: number[] = []
    for (let i = 0; i < diceCount; i++) rolls.push(Math.floor(rng() * sides) + 1)
    const sum = rolls.reduce((a, b) => a + b, 0)
    const items = rolls.map((roll, i) => ({ id: `dice-${i}`, value: roll, formatted: `Die ${i + 1}: ${roll}` }))
    items.push({ id: "dice-sum", value: sum, formatted: `Total: ${sum}` } as any)
    return {
      items,
      meta: { seedUsed: ctx.seed, count: items.length, generatedAt: Date.now() },
      previewText: `Rolls: ${rolls.join(", ")} | Total: ${sum}`,
    }
  },
  seo: {
    title: "Dice Roller - Roll Virtual Dice Online | BestRandom",
    description: "Roll virtual dice with custom side count and multiple dice support.",
    h1: "Dice Roller",
    faq: [
      { question: "Can I set custom sides?", answer: "Yes. Choose any side count from 2 to 1000." },
      { question: "Can I roll many dice at once?", answer: "Yes. Set number of dice in options." },
      { question: "Does it show total?", answer: "Yes. A total row is included with every roll." },
    ],
  },
  icon: Dice1,
}

export const playingCardShufflerTool: ToolConfig = {
  slug: "playing-card-shuffler",
  category: "games",
  name: "Playing Card Shuffler",
  shortDescription: "Shuffle a deck and draw random cards",
  longDescription: "Shuffle a standard 52-card deck and draw any number of cards for games, simulations, or quick random picks.",
  generatorType: "list",
  defaultOptions: {
    drawCount: 5,
  },
  optionSchema: {
    fields: [{ key: "drawCount", label: "Cards to Draw", type: "number", default: 5, min: 1, max: 52 }],
  },
  run: (ctx) => {
    const { drawCount } = ctx.options
    const rng = ctx.rng
    const suits = ["Spades", "Hearts", "Diamonds", "Clubs"]
    const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]
    const deck: string[] = []
    for (const suit of suits) {
      for (const rank of ranks) deck.push(`${rank} of ${suit}`)
    }

    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1))
      ;[deck[i], deck[j]] = [deck[j], deck[i]]
    }

    const drawn = deck.slice(0, drawCount)
    return {
      items: drawn.map((card, i) => ({ id: `card-${i}`, value: card, formatted: card })),
      meta: { seedUsed: ctx.seed, count: drawn.length, generatedAt: Date.now() },
      previewText: drawn.slice(0, 3).join(", "),
    }
  },
  seo: {
    title: "Playing Card Shuffler - Shuffle and Draw Cards | BestRandom",
    description: "Shuffle a 52-card deck and draw random cards instantly.",
    h1: "Playing Card Shuffler",
    faq: [
      { question: "How many cards can I draw?", answer: "You can draw from 1 to 52 cards." },
      { question: "Is a full deck used?", answer: "Yes. Standard 52-card deck with 4 suits." },
      { question: "Can I repeat the same shuffle?", answer: "Yes. Use the same seed and options." },
    ],
  },
  icon: PlayingCards,
}

export const birdieFundGeneratorTool: ToolConfig = {
  slug: "birdie-fund-generator",
  category: "games",
  name: "Birdie Fund Generator",
  shortDescription: "Generate random Birdie fund challenge ideas",
  longDescription: "Create random Birdie fund challenge names, goals, and contribution rules for fun golf pools or team games.",
  generatorType: "list",
  defaultOptions: {
    count: 5,
    minGoal: 100,
    maxGoal: 5000,
  },
  optionSchema: {
    fields: [
      { key: "count", label: "Ideas", type: "number", default: 5, min: 1, max: 20 },
      { key: "minGoal", label: "Min Goal ($)", type: "number", default: 100, min: 10, max: 100000 },
      { key: "maxGoal", label: "Max Goal ($)", type: "number", default: 5000, min: 20, max: 200000 },
    ],
  },
  run: (ctx) => {
    const { count, minGoal, maxGoal } = ctx.options
    const rng = ctx.rng
    const adjectives = ["Weekend", "Clubhouse", "Sunrise", "Rookie", "Pro", "Eagle", "Fairway", "Green"]
    const nouns = ["Birdie Fund", "Putter Pot", "Par Challenge", "Back Nine Pool", "Ace Bank", "Mulligan Jar"]
    const rules = [
      "$5 per birdie",
      "$2 per par save",
      "$10 for nearest pin",
      "$3 per front-nine birdie",
      "$7 for longest putt",
      "$1 per green in regulation",
    ]
    const low = Math.min(minGoal, maxGoal)
    const high = Math.max(minGoal, maxGoal)
    const items: any[] = []

    for (let i = 0; i < count; i++) {
      const adj = adjectives[Math.floor(rng() * adjectives.length)]
      const noun = nouns[Math.floor(rng() * nouns.length)]
      const rule = rules[Math.floor(rng() * rules.length)]
      const goal = Math.floor(rng() * (high - low + 1)) + low
      const line = `${adj} ${noun} - Goal: $${goal} - Rule: ${rule}`
      items.push({ id: `birdie-${i}`, value: line, formatted: line })
    }

    return {
      items,
      meta: { seedUsed: ctx.seed, count: items.length, generatedAt: Date.now() },
      previewText: items.slice(0, 2).map((x) => x.value).join(" | "),
    }
  },
  seo: {
    title: "Birdie Fund Generator - Random Golf Fund Ideas | BestRandom",
    description: "Generate random Birdie fund challenge ideas with goals and contribution rules.",
    h1: "Birdie Fund Generator",
    faq: [
      { question: "What does this generate?", answer: "It creates random Birdie fund names, goal amounts, and simple rules." },
      { question: "Can I control goal range?", answer: "Yes. Set minimum and maximum goal values." },
      { question: "Can I create multiple ideas?", answer: "Yes. Choose how many ideas to generate." },
    ],
  },
  icon: Bird,
}

export const gamesTools: ToolConfig[] = [
  lotteryQuickPickTool,
  kenoQuickPickTool,
  coinFlipperTool,
  diceRollerGameTool,
  playingCardShufflerTool,
  birdieFundGeneratorTool,
]

