import { Coins, Dice1, Ticket, Grid3X3, Shuffle, Bird } from "lucide-react"
import type { ToolConfig } from "../registry"

export const lotteryQuickPickTool: ToolConfig = {
  slug: "lottery-quick-pick",
  category: "games",
  name: "Lottery Quick Pick",
  shortDescription: "Quick pick lottery tickets with configurable rules",
  longDescription: "Quick pick lottery tickets using configurable country, lottery style, and number rules. Built to match the familiar workflow while keeping BestRandom's site-wide UI.",
  generatorType: "list",
  defaultOptions: {
    ticketCount: 2,
    country: "usa",
    lottery: "powerball",
    mainCount: 5,
    mainMax: 69,
    bonusCount: 1,
    bonusMax: 26,
  },
  optionSchema: {
    fields: [
      { key: "ticketCount", label: "Pick ticket(s)", type: "number", default: 2, min: 1, max: 50 },
      {
        key: "country",
        label: "Lottery country",
        type: "select",
        default: "usa",
        options: [
          { value: "usa", label: "USA" },
          { value: "uk", label: "United Kingdom" },
          { value: "eu", label: "Europe" },
          { value: "au", label: "Australia" },
          { value: "ca", label: "Canada" },
          { value: "other", label: "Other" },
        ],
      },
      {
        key: "lottery",
        label: "Lottery",
        type: "select",
        default: "powerball",
        options: [
          { value: "powerball", label: "Powerball (Multi-State)" },
          { value: "mega-millions", label: "Mega Millions (Multi-State)" },
          { value: "euromillions", label: "EuroMillions" },
          { value: "uk-lotto", label: "UK Lotto" },
          { value: "other-lottery", label: "Other Lottery" },
        ],
      },
      { key: "mainCount", label: "Main numbers count", type: "number", default: 5, min: 1, max: 12 },
      { key: "mainMax", label: "Main numbers max", type: "number", default: 69, min: 2, max: 200 },
      { key: "bonusCount", label: "Bonus numbers count", type: "number", default: 1, min: 0, max: 10 },
      { key: "bonusMax", label: "Bonus numbers max", type: "number", default: 26, min: 2, max: 200 },
    ],
  },
  run: (ctx) => {
    const { ticketCount, country, lottery, mainCount, mainMax, bonusCount, bonusMax } = ctx.options
    const rng = ctx.rng
    const safeMainCount = Math.max(1, Math.min(Number(mainCount) || 5, 12))
    const safeMainMax = Math.max(safeMainCount, Number(mainMax) || 69)
    const safeBonusCount = Math.max(0, Math.min(Number(bonusCount) || 0, 10))
    const safeBonusMax = Math.max(2, Number(bonusMax) || 26)
    const safeTicketCount = Math.max(1, Math.min(Number(ticketCount) || 1, 50))

    const labelMap: Record<string, string> = {
      powerball: "Powerball",
      "mega-millions": "Mega Millions",
      euromillions: "EuroMillions",
      "uk-lotto": "UK Lotto",
      "other-lottery": "Other Lottery",
    }
    const lotteryLabel = labelMap[lottery] || "Lottery"

    const pickUnique = (count: number, max: number) => {
      const pool = Array.from({ length: max }, (_, i) => i + 1)
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1))
        ;[pool[i], pool[j]] = [pool[j], pool[i]]
      }
      return pool.slice(0, count).sort((a, b) => a - b)
    }

    const rows: any[] = []
    for (let t = 0; t < safeTicketCount; t++) {
      const main = pickUnique(safeMainCount, safeMainMax)
      const bonus = safeBonusCount > 0 ? pickUnique(safeBonusCount, safeBonusMax) : []
      const line = bonus.length > 0
        ? `Ticket ${t + 1} (${lotteryLabel}): ${main.join(" ")} + ${bonus.join(" ")}`
        : `Ticket ${t + 1} (${lotteryLabel}): ${main.join(" ")}`

      rows.push({
        id: `lottery-ticket-${t}`,
        value: line,
        formatted: line,
        ticket: t + 1,
        country,
        lottery,
        main,
        bonus,
      })
    }

    const combinations = (n: number, k: number) => {
      if (k < 0 || k > n) return 0
      if (k === 0 || k === n) return 1
      let r = 1
      for (let i = 1; i <= k; i++) r = (r * (n - (k - i))) / i
      return r
    }
    const oddsMain = combinations(safeMainMax, safeMainCount)
    const oddsBonus = safeBonusCount > 0 ? combinations(safeBonusMax, safeBonusCount) : 1
    const totalOdds = Math.max(1, Math.round(oddsMain * oddsBonus))

    rows.push({
      id: "lottery-odds",
      value: `Approx. jackpot odds: 1 in ${totalOdds.toLocaleString()}`,
      formatted: `Approx. jackpot odds (using current rules): 1 in ${totalOdds.toLocaleString()}`,
      isStats: true,
    } as any)

    return {
      items: rows,
      meta: { seedUsed: ctx.seed, count: rows.length, generatedAt: Date.now() },
      previewText: rows
        .filter((r: any) => !r.isStats)
        .slice(0, 2)
        .map((r: any) => r.value)
        .join(" | "),
    }
  },
  seo: {
    title: "Lottery Quick Pick - Random Lottery Numbers | BestRandom",
    description: "Quick pick lottery tickets with country, lottery type, and number-rule controls. Fast, shareable, and repeatable.",
    h1: "Lottery Quick Pick",
    faq: [
      { question: "Can I set ticket count and lottery type?", answer: "Yes. You can configure ticket count, country, and lottery style." },
      { question: "Are numbers unique within each ticket?", answer: "Yes. Main and bonus groups are generated without duplicates in each group." },
      { question: "Can I customize main and bonus rules?", answer: "Yes. Set count and max value for both main numbers and bonus numbers." },
      { question: "Can I reproduce the same result?", answer: "Yes. Use the same seed and options." },
    ],
  },
  icon: Ticket,
}

export const kenoQuickPickTool: ToolConfig = {
  slug: "keno-quick-pick",
  category: "games",
  name: "Keno Quick Pick",
  shortDescription: "Quick pick Keno tickets with configurable rules",
  longDescription: "Quick pick random Keno tickets by setting ticket count, numbers per ticket, and maximum value. Designed to match familiar Keno controls while fitting BestRandom UI.",
  generatorType: "list",
  defaultOptions: {
    ticketCount: 2,
    numbersPerTicket: 4,
    maxValue: 80,
  },
  optionSchema: {
    fields: [
      { key: "ticketCount", label: "Different ticket(s)", type: "number", default: 2, min: 1, max: 20 },
      { key: "numbersPerTicket", label: "Number(s) each", type: "number", default: 4, min: 1, max: 20 },
      {
        key: "maxValue",
        label: "Maximum value",
        type: "select",
        default: 80,
        options: [
          { value: 62, label: "62" },
          { value: 70, label: "70" },
          { value: 80, label: "80" },
        ],
      },
    ],
  },
  run: (ctx) => {
    const { ticketCount, numbersPerTicket, maxValue } = ctx.options
    const rng = ctx.rng

    const safeTicketCount = Math.max(1, Math.min(Number(ticketCount) || 1, 20))
    const safeNumbersPerTicket = Math.max(1, Math.min(Number(numbersPerTicket) || 1, 20))
    const safeMaxValue = [62, 70, 80].includes(Number(maxValue)) ? Number(maxValue) : 80

    const pickUnique = (count: number, max: number) => {
      const pool = Array.from({ length: max }, (_, i) => i + 1)
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1))
        ;[pool[i], pool[j]] = [pool[j], pool[i]]
      }
      return pool.slice(0, Math.min(count, max)).sort((a, b) => a - b)
    }

    const tickets: any[] = []
    for (let t = 0; t < safeTicketCount; t++) {
      const picks = pickUnique(safeNumbersPerTicket, safeMaxValue)
      const line = `Ticket ${t + 1}: ${picks.join(" ")}`
      tickets.push({
        id: `keno-ticket-${t}`,
        value: line,
        formatted: line,
        ticket: t + 1,
        picks,
      })
    }

    const combinations = (n: number, k: number) => {
      if (k < 0 || k > n) return 0
      if (k === 0 || k === n) return 1
      let r = 1
      for (let i = 1; i <= k; i++) r = (r * (n - (k - i))) / i
      return r
    }
    const totalCombos = Math.max(1, Math.round(combinations(safeMaxValue, safeNumbersPerTicket)))

    tickets.push({
      id: "keno-stats",
      value: `Combinations: ${totalCombos.toLocaleString()}`,
      formatted: `Possible unique picks per ticket: ${totalCombos.toLocaleString()} (for ${safeNumbersPerTicket} of ${safeMaxValue})`,
      isStats: true,
    } as any)

    return {
      items: tickets,
      meta: { seedUsed: ctx.seed, count: tickets.length, generatedAt: Date.now() },
      previewText: tickets
        .filter((t: any) => !t.isStats)
        .slice(0, 2)
        .map((t: any) => t.value)
        .join(" | "),
    }
  },
  seo: {
    title: "Keno Quick Pick - Random Keno Numbers | BestRandom",
    description: "Quick pick random Keno tickets with configurable ticket count, numbers per ticket, and max value.",
    h1: "Keno Quick Pick",
    faq: [
      { question: "Can I set how many tickets to generate?", answer: "Yes. You can generate 1 to 20 different Keno tickets at once." },
      { question: "Can I set numbers per ticket?", answer: "Yes. Choose from 1 to 20 numbers per ticket." },
      { question: "What max values are supported?", answer: "You can choose 62, 70, or 80 as the maximum value." },
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
  shortDescription: "Roll virtual dice instantly",
  longDescription: "Roll virtual six-sided dice with a simple control for dice count, matching familiar dice roller behavior while keeping BestRandom UI.",
  generatorType: "game",
  defaultOptions: {
    diceCount: 2,
  },
  optionSchema: {
    fields: [
      { key: "diceCount", label: "Roll virtual dice", type: "number", default: 2, min: 1, max: 60 },
    ],
  },
  run: (ctx) => {
    const { diceCount } = ctx.options
    const rng = ctx.rng
    const sides = 6
    const count = Math.max(1, Math.min(Number(diceCount) || 1, 60))
    const rolls: number[] = []
    for (let i = 0; i < count; i++) rolls.push(Math.floor(rng() * sides) + 1)
    const sum = rolls.reduce((a, b) => a + b, 0)
    const items = rolls.map((roll, i) => ({ id: `dice-${i}`, value: roll, formatted: `Die ${i + 1}: ${roll}` }))
    const average = (sum / count).toFixed(2)
    items.push({ id: "dice-sum", value: sum, formatted: `Total: ${sum}` } as any)
    items.push({ id: "dice-stats", value: `Average: ${average}`, formatted: `Average: ${average} (over ${count} dice)` } as any)
    return {
      items,
      meta: { seedUsed: ctx.seed, count: items.length, generatedAt: Date.now() },
      previewText: `Rolls: ${rolls.slice(0, 8).join(", ")}${rolls.length > 8 ? "..." : ""} | Total: ${sum}`,
    }
  },
  seo: {
    title: "Dice Roller - Roll Virtual Dice Online | BestRandom",
    description: "Roll virtual six-sided dice online with configurable dice count. Fast, simple, and shareable.",
    h1: "Dice Roller",
    faq: [
      { question: "How many dice can I roll at once?", answer: "You can roll from 1 to 60 virtual dice at once." },
      { question: "What type of dice are used?", answer: "This tool uses standard six-sided dice (d6)." },
      { question: "Does it show total?", answer: "Yes. Total and average are included in the result." },
    ],
  },
  icon: Dice1,
}

export const playingCardShufflerTool: ToolConfig = {
  slug: "playing-card-shuffler",
  category: "games",
  name: "Playing Card Shuffler",
  shortDescription: "Draw cards from configurable shuffled decks",
  longDescription: "Draw playing cards from randomly shuffled decks with configurable suits, ranks, jokers, and display options.",
  generatorType: "list",
  defaultOptions: {
    drawCount: 1,
    deckCount: 1,
    includeSpades: true,
    includeHearts: true,
    includeDiamonds: true,
    includeClubs: true,
    includeA: true,
    include2: true,
    include3: true,
    include4: true,
    include5: true,
    include6: true,
    include7: true,
    include8: true,
    include9: true,
    include10: true,
    includeJ: true,
    includeQ: true,
    includeK: true,
    includeBlackJoker: false,
    includeRedJoker: false,
    showRemainingFaceDown: true,
    showAsText: true,
  },
  optionSchema: {
    fields: [
      { key: "drawCount", label: "Step 1: Draw card(s)", type: "number", default: 1, min: 1, max: 416 },
      { key: "deckCount", label: "From shuffled deck(s)", type: "number", default: 1, min: 1, max: 8 },
      { key: "includeSpades", label: "Include Spades (♠)", type: "checkbox", default: true },
      { key: "includeHearts", label: "Include Hearts (♥)", type: "checkbox", default: true },
      { key: "includeDiamonds", label: "Include Diamonds (♦)", type: "checkbox", default: true },
      { key: "includeClubs", label: "Include Clubs (♣)", type: "checkbox", default: true },
      { key: "includeA", label: "Include Aces", type: "checkbox", default: true },
      { key: "include2", label: "Include Twos", type: "checkbox", default: true },
      { key: "include3", label: "Include Threes", type: "checkbox", default: true },
      { key: "include4", label: "Include Fours", type: "checkbox", default: true },
      { key: "include5", label: "Include Fives", type: "checkbox", default: true },
      { key: "include6", label: "Include Sixes", type: "checkbox", default: true },
      { key: "include7", label: "Include Sevens", type: "checkbox", default: true },
      { key: "include8", label: "Include Eights", type: "checkbox", default: true },
      { key: "include9", label: "Include Nines", type: "checkbox", default: true },
      { key: "include10", label: "Include Tens", type: "checkbox", default: true },
      { key: "includeJ", label: "Include Jacks", type: "checkbox", default: true },
      { key: "includeQ", label: "Include Queens", type: "checkbox", default: true },
      { key: "includeK", label: "Include Kings", type: "checkbox", default: true },
      { key: "includeBlackJoker", label: "Include Black Joker", type: "checkbox", default: false },
      { key: "includeRedJoker", label: "Include Red Joker", type: "checkbox", default: false },
      { key: "showRemainingFaceDown", label: "Show remaining cards face down", type: "checkbox", default: true },
      { key: "showAsText", label: "Show cards as text instead of images", type: "checkbox", default: true },
    ],
  },
  run: (ctx) => {
    const {
      drawCount,
      deckCount,
      includeSpades,
      includeHearts,
      includeDiamonds,
      includeClubs,
      includeA,
      include2,
      include3,
      include4,
      include5,
      include6,
      include7,
      include8,
      include9,
      include10,
      includeJ,
      includeQ,
      includeK,
      includeBlackJoker,
      includeRedJoker,
      showRemainingFaceDown,
      showAsText,
    } = ctx.options
    const rng = ctx.rng

    const selectedSuits: string[] = []
    if (includeSpades) selectedSuits.push("Spades")
    if (includeHearts) selectedSuits.push("Hearts")
    if (includeDiamonds) selectedSuits.push("Diamonds")
    if (includeClubs) selectedSuits.push("Clubs")
    if (selectedSuits.length === 0) selectedSuits.push("Spades", "Hearts", "Diamonds", "Clubs")

    const selectedRanks: string[] = []
    if (includeA) selectedRanks.push("A")
    if (include2) selectedRanks.push("2")
    if (include3) selectedRanks.push("3")
    if (include4) selectedRanks.push("4")
    if (include5) selectedRanks.push("5")
    if (include6) selectedRanks.push("6")
    if (include7) selectedRanks.push("7")
    if (include8) selectedRanks.push("8")
    if (include9) selectedRanks.push("9")
    if (include10) selectedRanks.push("10")
    if (includeJ) selectedRanks.push("J")
    if (includeQ) selectedRanks.push("Q")
    if (includeK) selectedRanks.push("K")
    if (selectedRanks.length === 0) {
      selectedRanks.push("A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K")
    }

    const baseDeck: string[] = []
    for (const suit of selectedSuits) {
      for (const rank of selectedRanks) baseDeck.push(`${rank} of ${suit}`)
    }
    if (includeBlackJoker) baseDeck.push("Black Joker")
    if (includeRedJoker) baseDeck.push("Red Joker")
    if (baseDeck.length === 0) baseDeck.push("A of Spades")

    const safeDeckCount = Math.max(1, Math.min(Number(deckCount) || 1, 8))
    const fullDeck: string[] = []
    for (let d = 0; d < safeDeckCount; d++) fullDeck.push(...baseDeck)

    for (let i = fullDeck.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1))
      ;[fullDeck[i], fullDeck[j]] = [fullDeck[j], fullDeck[i]]
    }

    const safeDrawCount = Math.max(1, Math.min(Number(drawCount) || 1, fullDeck.length))
    const drawn = fullDeck.slice(0, safeDrawCount)
    const remaining = fullDeck.length - drawn.length

    const items = drawn.map((card, i) => ({
      id: `card-${i}`,
      value: card,
      formatted: showAsText ? `Card ${i + 1}: ${card}` : card,
    }))
    if (showRemainingFaceDown) {
      items.push({
        id: "cards-remaining",
        value: `${remaining} card(s) remaining`,
        formatted: `${remaining} card(s) remaining face down`,
        isStats: true,
      } as any)
    }

    return {
      items,
      meta: { seedUsed: ctx.seed, count: items.length, generatedAt: Date.now() },
      previewText: drawn.slice(0, 3).join(", "),
    }
  },
  seo: {
    title: "Playing Card Shuffler - Shuffle and Draw Cards | BestRandom",
    description: "Draw cards from configurable shuffled decks with suit/rank filters, jokers, and display options.",
    h1: "Playing Card Shuffler",
    faq: [
      { question: "How many cards can I draw?", answer: "You can draw from 1 card up to the total cards in your configured decks." },
      { question: "Can I customize suits and ranks?", answer: "Yes. You can include or exclude any suit and rank." },
      { question: "Can I include jokers?", answer: "Yes. Black Joker and Red Joker are optional." },
      { question: "Can I repeat the same shuffle?", answer: "Yes. Use the same seed and options." },
    ],
  },
  icon: Shuffle,
}

export const birdieFundGeneratorTool: ToolConfig = {
  slug: "birdie-fund-generator",
  category: "games",
  name: "Birdie Fund Randomizer",
  shortDescription: "Generate random birdie holes for golf funds",
  longDescription: "Generate random birdie holes for golf birdie funds based on course type. Built to match familiar controls while keeping BestRandom's unified UI.",
  generatorType: "list",
  defaultOptions: {
    holeCount: 1,
    courseType: "18-hole",
  },
  optionSchema: {
    fields: [
      { key: "holeCount", label: "Generate birdie hole(s)", type: "number", default: 1, min: 1, max: 18 },
      {
        key: "courseType",
        label: "Course Type",
        type: "select",
        default: "18-hole",
        options: [
          { value: "front-9", label: "9-hole (Front 9)" },
          { value: "back-9", label: "9-hole (Back 9)" },
          { value: "18-hole", label: "18-hole" },
        ],
      },
    ],
  },
  run: (ctx) => {
    const { holeCount, courseType } = ctx.options
    const rng = ctx.rng

    let holeRange: number[] = []
    if (courseType === "front-9") {
      holeRange = Array.from({ length: 9 }, (_, i) => i + 1)
    } else if (courseType === "back-9") {
      holeRange = Array.from({ length: 9 }, (_, i) => i + 10)
    } else {
      holeRange = Array.from({ length: 18 }, (_, i) => i + 1)
    }

    const maxSelectable = holeRange.length
    const safeHoleCount = Math.max(1, Math.min(Number(holeCount) || 1, maxSelectable))

    // Fisher-Yates shuffle
    for (let i = holeRange.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1))
      ;[holeRange[i], holeRange[j]] = [holeRange[j], holeRange[i]]
    }

    const selected = holeRange.slice(0, safeHoleCount).sort((a, b) => a - b)
    const items: any[] = selected.map((hole, idx) => ({
      id: `birdie-hole-${idx}`,
      value: `Hole ${hole}`,
      formatted: `Hole ${hole}`,
      hole,
    }))

    const courseLabel =
      courseType === "front-9"
        ? "9-hole (Front 9)"
        : courseType === "back-9"
        ? "9-hole (Back 9)"
        : "18-hole"

    items.push({
      id: "birdie-summary",
      value: `Course: ${courseLabel} | Holes: ${selected.join(", ")}`,
      formatted: `Course: ${courseLabel} | Selected birdie holes: ${selected.join(", ")}`,
      isStats: true,
    } as any)

    return {
      items,
      meta: { seedUsed: ctx.seed, count: items.length, generatedAt: Date.now() },
      previewText: selected.map((h) => `Hole ${h}`).join(", "),
    }
  },
  seo: {
    title: "Birdie Fund Randomizer - Random Golf Birdie Holes | BestRandom",
    description: "Generate random birdie holes for front 9, back 9, or full 18-hole courses. Fast, fair, and repeatable with seed.",
    h1: "Birdie Fund Randomizer",
    faq: [
      { question: "What does this randomizer generate?", answer: "It generates random birdie hole numbers for your selected golf course type." },
      { question: "Can I choose front 9, back 9, or full 18?", answer: "Yes. Select the course type in options before generating." },
      { question: "Can I generate multiple holes at once?", answer: "Yes. Set how many birdie holes to generate." },
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

