import type { CategoryId } from "./registry"

export interface CategorySeriesContent {
  /** H1 can stay category.name; this refines the "what is" H2 */
  whatIsHeading: string
  whatIsParagraphs: string[]
  useCasesHeading: string
  useCases: string[]
  /** Other hub pages to funnel authority */
  relatedSeries: { id: CategoryId; title: string; blurb: string }[]
  /** Optional cross-category tool deep links */
  relatedCrossTools?: { slug: string; category: CategoryId; title: string; blurb: string }[]
  faq: { question: string; answer: string }[]
}

const SERIES_LABELS: Record<CategoryId, string> = {
  numbers: "Numbers",
  text: "Text",
  selection: "Selection",
  design: "Design",
  security: "Security",
  utilities: "Utilities",
  fun: "Fun",
  games: "Games",
}

const SERIES_BLURBS: Record<CategoryId, string> = {
  numbers: "Dice, integers, ranges, and numeric experiments.",
  text: "Names, words, emails, and copy placeholders.",
  selection: "Pickers, teams, wheels, and fair splits.",
  design: "Colors, palettes, and gradients for UI work.",
  security: "Passwords, tokens, UUIDs, and secrets.",
  utilities: "Hashes, encodings, and developer utilities.",
  fun: "Animals, countries, and lightweight entertainment.",
  games: "Lottery-style picks, cards, and quick game helpers.",
}

/** Curated internal links to other series hubs (SEO + crawl paths). */
function rel(...ids: CategoryId[]): { id: CategoryId; title: string; blurb: string }[] {
  return ids.map((id) => ({
    id,
    title: `${SERIES_LABELS[id]} generators`,
    blurb: SERIES_BLURBS[id],
  }))
}

export const categorySeriesContent: Record<CategoryId, CategorySeriesContent> = {
  numbers: {
    whatIsHeading: "What Are Random Number Generators?",
    whatIsParagraphs: [
      "Random number generators (RNGs) produce unpredictable numeric outcomes—perfect for simulations, giveaways, classroom demos, and QA test data. On the web, most tools use cryptographically inspired or pseudo-random algorithms so each refresh can feel “truly random” while still supporting reproducible runs when you fix a seed.",
      "BestRandom’s number tools focus on clarity: set a range, choose how many values you need, and copy results instantly. They complement our text and selection hubs when you need both labels and numeric draws in the same workflow.",
    ],
    useCasesHeading: "Use Cases",
    useCases: [
      "Pick a random integer between two values for contests and classroom callouts.",
      "Generate random percentages (any min/max) for mock metrics, probability demos, or QA dashboards.",
      "Generate multiple random numbers for spreadsheet or load-test seeding.",
      "Simulate dice rolls and coin flips without physical props.",
      "Create quick samples for statistics exercises and Monte Carlo intuition.",
      "Pair with our random picker when you need both numeric weights and labeled options.",
    ],
    relatedSeries: rel("text", "selection", "games", "security"),
    relatedCrossTools: [
      {
        slug: "random-picker",
        category: "selection",
        title: "Random Picker",
        blurb: "Turn lines of text into a single unbiased choice.",
      },
      {
        slug: "random-yes-no-generator",
        category: "selection",
        title: "Random Yes or No Generator",
        blurb: "Binary outcomes when you only need a fair yes/no, not a full range.",
      },
      {
        slug: "random-password-generator",
        category: "security",
        title: "Random Password Generator",
        blurb: "After you draw IDs, generate strong secrets to match.",
      },
    ],
    faq: [
      {
        question: "Are these random numbers truly random?",
        answer:
          "Browser-based tools typically use pseudo-randomness that is statistically random for everyday use. For security keys or cryptography, use dedicated security tooling—not general-purpose number toys.",
      },
      {
        question: "Can I repeat the same sequence?",
        answer:
          "Many BestRandom generators support seeds or shareable URLs so you can reproduce a run for testing or demos. Check the individual tool for seed and share options.",
      },
      {
        question: "What is the difference between integers and floats?",
        answer:
          "Integer generators return whole numbers inside your range. Floating tools (where available) can return decimal values—useful for probabilities and simulations.",
      },
      {
        question: "Can I use results commercially?",
        answer:
          "Generated numbers themselves are not copyrighted, but always follow your organization’s policies and any applicable contest rules.",
      },
    ],
  },

  text: {
    whatIsHeading: "What Are Random Text Generators?",
    whatIsParagraphs: [
      "Random text generators create names, words, paragraphs, or structured strings on demand. They are ideal for UX copy placeholders, character creation, anonymized examples, and rapid brainstorming without starting from a blank page.",
      "This hub groups linguistic tools together so writers, developers, and marketers can jump between syllables, “readable” fakes, and shareable outputs with a consistent experience.",
    ],
    useCasesHeading: "Use Cases",
    useCases: [
      "Prototype UI with realistic-looking names instead of “Lorem ipsum” everywhere.",
      "Brainstorm brandable usernames, project codenames, or book characters.",
      "Populate dev databases with anonymized-but-plausible strings.",
      "Generate random words for creative writing prompts or icebreaker games.",
      "Pair with number generators when you need both labels and numeric samples.",
    ],
    relatedSeries: rel("numbers", "selection", "design", "fun"),
    relatedCrossTools: [
      {
        slug: "random-number-generator",
        category: "numbers",
        title: "Random Number Generator",
        blurb: "Add numeric draws alongside your text samples.",
      },
      {
        slug: "random-color-generator",
        category: "design",
        title: "Random Color Generator",
        blurb: "Match placeholder copy with quick palette ideas.",
      },
    ],
    faq: [
      {
        question: "Are generated names safe to use commercially?",
        answer:
          "Short random combinations are generally fine, but verify trademarks and similarity to real brands before shipping a product name.",
      },
      {
        question: "Can I control language or style?",
        answer:
          "Each tool exposes different options—style presets, syllable counts, or dictionaries. Open the specific generator to see what it supports.",
      },
      {
        question: "Do you store what I generate?",
        answer:
          "Generation happens in your session for most tools. Review the privacy policy for retention details on analytics and hosting.",
      },
    ],
  },

  selection: {
    whatIsHeading: "What Are Random Selection Tools?",
    whatIsParagraphs: [
      "Selection tools help groups make unbiased choices: pick one winner, shuffle a list, split teams, or spin a wheel. They reduce arguments about “who goes first” and are popular for classrooms, standups, and live streams.",
      "Use this category when your input is a set of labeled options—then pair with numeric generators if you also need random counts or ranges.",
    ],
    useCasesHeading: "Use Cases",
    useCases: [
      "Run fair standup order or retrospective facilitation.",
      "Get fast Yes/No (or True/False) chains when you only need a binary answer.",
      "Choose giveaway winners from a pasted list of entrants.",
      "Split players into balanced teams for sports or games.",
      "Shuffle quiz answer order to reduce pattern bias.",
      "Create quick icebreaker prompts when combined with text generators.",
    ],
    relatedSeries: rel("numbers", "text", "games", "fun"),
    relatedCrossTools: [
      {
        slug: "random-number-generator",
        category: "numbers",
        title: "Random Number Generator",
        blurb: "Draw numeric ranges when weights or counts matter.",
      },
      {
        slug: "random-percentage-generator",
        category: "numbers",
        title: "Random Percentage Generator",
        blurb: "Pair labeled picks with believable mock percentages.",
      },
      {
        slug: "wheel-of-names",
        category: "selection",
        title: "Wheel of Names",
        blurb: "Visual spins for audiences when presentation matters.",
      },
    ],
    faq: [
      {
        question: "How do I avoid duplicates when picking multiple winners?",
        answer:
          "Use tools that explicitly support sampling without replacement, or remove winners from your list between rounds.",
      },
      {
        question: "Is a wheel fair?",
        answer:
          "Digital wheels use randomness similar to other generators. For high-stakes contests, document your process and consider third-party auditing.",
      },
      {
        question: "Can I import hundreds of lines?",
        answer:
          "Most pickers accept large pasted lists, but extremely large inputs may be slower on older devices—trim whitespace for best results.",
      },
    ],
  },

  design: {
    whatIsHeading: "What Are Random Design Generators?",
    whatIsParagraphs: [
      "Design generators produce colors, palettes, and gradients you can drop straight into Figma, CSS, or slide decks. They accelerate exploration when you do not want to stare at a color wheel.",
      "Combine these tools with text placeholders to mock full UI states that feel realistic at a glance.",
    ],
    useCasesHeading: "Use Cases",
    useCases: [
      "Explore accessible palette directions before brand polish.",
      "Generate CSS-friendly hex codes for prototypes.",
      "Create gradient backgrounds for landing page hero tests.",
      "Pair colors with random names to stress-test component theming.",
      "Teach color theory by rapidly sampling harmonious sets.",
    ],
    relatedSeries: rel("text", "utilities", "fun", "numbers"),
    relatedCrossTools: [
      {
        slug: "random-name-generator",
        category: "text",
        title: "Random Name Generator",
        blurb: "Label mock users to match your new palette.",
      },
    ],
    faq: [
      {
        question: "Will colors meet contrast requirements?",
        answer:
          "Random palettes are exploratory. Run your picks through a contrast checker before shipping UI for accessibility.",
      },
      {
        question: "Can I export to CSS?",
        answer:
          "Many tools display hex/RGB values you can copy; some include gradient CSS snippets—open the tool to see export options.",
      },
    ],
  },

  security: {
    whatIsHeading: "What Are Random Security Generators?",
    whatIsParagraphs: [
      "Security-focused generators create passwords, tokens, UUIDs, and other high-entropy strings. They are built for everyday developer and IT workflows—rotate API keys, seed local databases, or generate one-off credentials.",
      "For production secrets, always follow your organization’s key management policies; these tools are convenient, but not a replacement for HSMs or cloud KMS for regulated environments.",
    ],
    useCasesHeading: "Use Cases",
    useCases: [
      "Generate strong passwords with configurable length and symbol rules.",
      "Create UUIDs for database primary keys in prototypes.",
      "Produce API tokens for local integration tests.",
      "Teach entropy and password hygiene with visible randomness.",
      "Pair with numeric tools when generating structured test fixtures.",
    ],
    relatedSeries: rel("utilities", "numbers", "text", "selection"),
    relatedCrossTools: [
      {
        slug: "random-letter-generator",
        category: "utilities",
        title: "Random Letter Generator",
        blurb: "Sample alphabetic characters when you do not need full passwords.",
      },
    ],
    faq: [
      {
        question: "Are generated passwords stored?",
        answer:
          "BestRandom is designed for client-side convenience. Treat outputs as sensitive and avoid sharing screenshots of secrets.",
      },
      {
        question: "How long should a password be?",
        answer:
          "Longer is generally better. Many experts recommend 12+ characters with mixed character classes, or passphrases with high entropy.",
      },
    ],
  },

  utilities: {
    whatIsHeading: "What Are Random Utility Generators?",
    whatIsParagraphs: [
      "Utility generators cover hashes, encodings, and developer-friendly strings that do not fit purely numeric or narrative categories. They are handy when you need reproducible fingerprints or quick tokens during debugging.",
      "Bookmark this hub when you are scripting, teaching CS concepts, or pairing random data with APIs.",
    ],
    useCasesHeading: "Use Cases",
    useCases: [
      "Generate sample hashes for teaching checksums and integrity concepts.",
      "Create identifiers for logs, mocks, and scratch databases.",
      "Combine with security tools when you need both entropy and formatting.",
      "Prototype ETL pipelines with anonymized column values.",
    ],
    relatedSeries: rel("security", "text", "numbers", "design"),
    relatedCrossTools: [
      {
        slug: "uuid-generator",
        category: "security",
        title: "UUID Generator",
        blurb: "Structured IDs when random strings need a standard shape.",
      },
    ],
    faq: [
      {
        question: "Are hashes reversible?",
        answer:
          "Cryptographic hashes are one-way. You cannot recover the original input from the hash alone.",
      },
      {
        question: "Which encoding should I use?",
        answer:
          "Pick the encoding expected by your consumer—Base64 for binary-safe text, hex for readable fingerprints, etc.",
      },
    ],
  },

  fun: {
    whatIsHeading: "What Are Fun Random Generators?",
    whatIsParagraphs: [
      "Fun generators lean into delight: random animals, countries, movie ideas, and lightweight games. They are great for icebreakers, party games, and low-stakes creativity.",
      "They complement our selection and text hubs when you want inspiration without heavy configuration.",
    ],
    useCasesHeading: "Use Cases",
    useCases: [
      "Break the ice in meetings with random prompts.",
      "Spin up writing prompts or sketch ideas.",
      "Teach geography or biology with surprise examples.",
      "Combine with pickers for quick tournament brackets.",
    ],
    relatedSeries: rel("games", "selection", "text", "design"),
    relatedCrossTools: [
      {
        slug: "random-picker",
        category: "selection",
        title: "Random Picker",
        blurb: "Choose between fun options you generate elsewhere.",
      },
    ],
    faq: [
      {
        question: "Are movie or character suggestions copyrighted?",
        answer:
          "Lists may reference popular culture; use outputs as inspiration, not as official endorsements or licensed assets.",
      },
    ],
  },

  games: {
    whatIsHeading: "What Are Game Random Generators?",
    whatIsParagraphs: [
      "Game generators model dice, lottery draws, card shuffles, and quick contests. They mirror tabletop and casino-style workflows while staying fast in the browser.",
      "Use them alongside numeric generators when you need raw integers separate from game-specific rules.",
    ],
    useCasesHeading: "Use Cases",
    useCases: [
      "Run lottery-style quick picks with configurable rules.",
      "Roll dice pools for tabletop sessions.",
      "Shuffle decks and draw hands for card games.",
      "Create golf or charity event hole picks with transparent randomness.",
    ],
    relatedSeries: rel("numbers", "fun", "selection", "security"),
    relatedCrossTools: [
      {
        slug: "coin-flip",
        category: "numbers",
        title: "Coin Flip",
        blurb: "Binary outcomes when decks or dice are overkill.",
      },
      {
        slug: "dice-roller",
        category: "numbers",
        title: "Dice Roller",
        blurb: "Classic polyhedral rolls with simple controls.",
      },
    ],
    faq: [
      {
        question: "Are these suitable for real-money gaming?",
        answer:
          "These are general-purpose utilities. Regulated gaming has legal and audit requirements—use certified systems where required.",
      },
      {
        question: "Can I fix a seed for replay?",
        answer:
          "Many tools support seeds or share links so you can reproduce a draw—check each generator’s options.",
      },
    ],
  },
}

export function getCategorySeriesContent(id: CategoryId): CategorySeriesContent {
  return categorySeriesContent[id]
}
