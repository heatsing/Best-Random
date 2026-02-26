import { 
  Hash, 
  User, 
  FileText, 
  Shuffle, 
  Palette, 
  Key, 
  PawPrint, 
  Type,
  HelpCircle,
  Users,
  Mail,
  Globe
} from "lucide-react"
import type { FAQItem } from "./seo"

export interface ToolConfig {
  slug: string
  name: string
  category: string
  icon: typeof Hash
  metaTitle: string
  metaDescription: string
  h1: string
  intro: string
  faqs: FAQItem[]
}

export const TOOL_REGISTRY: ToolConfig[] = [
  {
    slug: "random-number-generator",
    name: "Random Number Generator",
    category: "Numbers",
    icon: Hash,
    metaTitle: "Random Number Generator - Any Range, Instant Results | Free Online",
    metaDescription: "Generate random numbers in any range instantly. Control min/max, count, uniqueness, and decimals. Shareable results with seeds. 100% free, no signup!",
    h1: "Random Number Generator",
    intro: "Generate truly random numbers with full control. Set your range, choose how many numbers to generate, enable uniqueness, and use decimal precision. Every generation uses a seed for repeatability—save your seed to reproduce the exact same results later, or share it with others.",
    faqs: [
      {
        question: "Is this random number generator truly random?",
        answer: "It uses a high-quality pseudo-random algorithm with optional seed control."
      },
      {
        question: "Can I repeat the same random numbers?",
        answer: "Yes. Using the same seed will always reproduce the same results."
      },
      {
        question: "Can I generate unique numbers only?",
        answer: "Yes. Enable the \"unique\" option to avoid duplicates."
      },
      {
        question: "Does it support decimals?",
        answer: "Yes. You can generate both integers and decimal numbers."
      },
      {
        question: "Can I share my generated numbers?",
        answer: "Yes. Use the share button to create a link with the same parameters and seed."
      },
      {
        question: "Is this tool free to use?",
        answer: "Yes. All random generators on BestRandom are free."
      }
    ]
  },
  {
    slug: "random-name-generator",
    name: "Random Name Generator",
    category: "Text",
    icon: User,
    metaTitle: "Random Name Generator - 500+ Names | Boy, Girl, Baby, Pet & Japanese",
    metaDescription: "Generate random names from 20+ categories: boy, girl, baby, last, company, team, pet, dog, cat, gamertag, nickname, band, Japanese & identities. Free!",
    h1: "Random Name Generator",
    intro: "Generate random names instantly. Choose between full names, first names only, or last names only. Every generation uses a seed for repeatability—use the same seed to get identical results, or share your seed with others.",
    faqs: [
      {
        question: "What types of names can I generate?",
        answer: "You can generate full names, first names, or last names."
      },
      {
        question: "Are the names random every time?",
        answer: "Yes, unless you reuse the same seed to repeat results."
      },
      {
        question: "Can I generate multiple names at once?",
        answer: "Yes. Choose how many names you want to generate."
      },
      {
        question: "Can I avoid duplicate names?",
        answer: "Yes. Enable the unique option to remove duplicates."
      },
      {
        question: "Can I share the generated names?",
        answer: "Yes. Shared links keep the same seed and settings."
      },
      {
        question: "Are these names real?",
        answer: "They are generated from common English name datasets."
      }
    ]
  },
  {
    slug: "last-name-generator",
    name: "Last Name Generator",
    category: "Text",
    icon: User,
    metaTitle: "Last Name Generator - 100+ Real Surnames & Family Names | Free",
    metaDescription: "Generate random last names from real English surnames. Great for fiction writing, character creation, form testing, or genealogy research. Free online!",
    h1: "Last Name Generator",
    intro: "Generate random last names instantly. Choose how many random last names to generate, enable uniqueness to avoid duplicates, and use a seed to repeat or share your results. Perfect for character creation, testing, or creative projects.",
    faqs: [
      {
        question: "What random last names are available?",
        answer: "Random last names are selected from a built-in dataset of common English surnames and family names."
      },
      {
        question: "Can I generate multiple random last names?",
        answer: "Yes. Choose how many random last names you want to generate."
      },
      {
        question: "Can I avoid duplicate last names?",
        answer: "Yes. Enable the unique option to ensure all generated last names are different."
      },
      {
        question: "Can I repeat the same random last names?",
        answer: "Yes. Use the same seed to reproduce identical results."
      },
      {
        question: "Can I share the generated random last names?",
        answer: "Yes. Shared links preserve your settings and seed for reproducibility."
      },
      {
        question: "Are these real family names?",
        answer: "Yes. All last names are from a dataset of real, common surnames and family names."
      }
    ]
  },
  {
    slug: "random-word-generator",
    name: "Random Word Generator",
    category: "Text",
    icon: FileText,
    metaTitle: "Random Word Generator - 500+ English Words | Adjustable Length",
    metaDescription: "Generate random English words with adjustable length (3-20 letters). Perfect for Scrabble, word games, vocabulary practice, or writing prompts. Free!",
    h1: "Random Word Generator",
    intro: "Generate random words from a built-in English word list. Control the minimum and maximum word length, choose how many words to generate, and use a seed to repeat or share your results.",
    faqs: [
      {
        question: "How are the random words generated?",
        answer: "Words are selected from a built-in English word list."
      },
      {
        question: "Can I control word length?",
        answer: "Yes. Set minimum and maximum word length."
      },
      {
        question: "Can I repeat the same words?",
        answer: "Yes. Use the same seed to get identical results."
      },
      {
        question: "Can I generate multiple words at once?",
        answer: "Yes. Choose how many words to generate."
      },
      {
        question: "Can I copy all generated words?",
        answer: "Yes. Use the copy button to copy them instantly."
      },
      {
        question: "Is this tool free?",
        answer: "Yes. No registration required."
      }
    ]
  },
  {
    slug: "random-picker",
    name: "Random Picker",
    category: "Selection",
    icon: Shuffle,
    metaTitle: "Random Picker - Who Goes First? Pick From Any List | Free",
    metaDescription: "Randomly pick a winner from any list. Spin a wheel or instant pick with weighted odds. Fair, shareable, and repeatable. Perfect for decisions! Free online!",
    h1: "Random Picker",
    intro: "Randomly pick items from your list. Enter your items, optionally assign weights, and pick instantly or use wheel mode for a visual random selection. Every pick uses a seed for repeatability—share your seed to reproduce the exact same pick.",
    faqs: [
      {
        question: "How does the random picker work?",
        answer: "It randomly selects items from your input list."
      },
      {
        question: "Can I spin a wheel instead of instant pick?",
        answer: "Yes. Use wheel mode for visual random selection."
      },
      {
        question: "Can I assign weights to items?",
        answer: "Yes. Items can have different selection weights."
      },
      {
        question: "Is the result fair?",
        answer: "Yes. The algorithm ensures unbiased random selection."
      },
      {
        question: "Can I repeat the same pick?",
        answer: "Yes. Using the same seed reproduces the result."
      },
      {
        question: "Can I share the result?",
        answer: "Yes. Shareable links preserve your list and seed."
      }
    ]
  },
  {
    slug: "random-color-generator",
    name: "Random Color Generator",
    category: "Design",
    icon: Palette,
    metaTitle: "Random Color Generator - HEX, RGB & HSL Palettes | Free Online",
    metaDescription: "Generate random color palettes for design projects. Export HEX, RGB, or HSL values. Lock favorites and share palettes. Perfect for designers. Free!",
    h1: "Random Color Generator",
    intro: "Generate random colors instantly. Create color palettes with up to 10 colors, lock any color to keep it unchanged while regenerating others, and export colors in HEX, RGB, or HSL formats.",
    faqs: [
      {
        question: "What color formats are supported?",
        answer: "HEX, RGB, and HSL formats are supported."
      },
      {
        question: "Can I generate a color palette?",
        answer: "Yes. Generate palettes with up to 10 colors."
      },
      {
        question: "Can I lock a color and regenerate others?",
        answer: "Yes. Lock any color to keep it unchanged."
      },
      {
        question: "Can I repeat the same colors?",
        answer: "Yes. Use the same seed to reproduce the palette."
      },
      {
        question: "Can I export colors?",
        answer: "Yes. Export as CSS variables or copy values."
      },
      {
        question: "Is this tool free?",
        answer: "Yes. All features are free."
      }
    ]
  },
  {
    slug: "random-password-generator",
    name: "Random Password Generator",
    category: "Security",
    icon: Key,
    metaTitle: "Random Password Generator - Strong & Secure | Free Online",
    metaDescription: "Generate strong random passwords with custom length, uppercase, lowercase, numbers & symbols. Generated locally, never stored. 100% secure & free!",
    h1: "Random Password Generator",
    intro: "Create strong random passwords instantly. Control password length, choose which character types to include (uppercase, lowercase, numbers, symbols), exclude confusing characters, and generate multiple passwords at once. All passwords are generated locally and never stored.",
    faqs: [
      {
        question: "Are the generated passwords secure?",
        answer: "Yes. They use randomized character selection."
      },
      {
        question: "Can I include symbols and numbers?",
        answer: "Yes. You can enable or disable each character type."
      },
      {
        question: "Can I exclude confusing characters?",
        answer: "Yes. Exclude characters like O, 0, I, and l."
      },
      {
        question: "Can I generate multiple passwords?",
        answer: "Yes. Generate several passwords at once."
      },
      {
        question: "Is password generation repeatable?",
        answer: "Yes. The same seed reproduces the same passwords."
      },
      {
        question: "Is any password stored?",
        answer: "No. All passwords are generated locally."
      }
    ]
  },
  {
    slug: "random-animal-generator",
    name: "Random Animal Generator",
    category: "Fun",
    icon: PawPrint,
    metaTitle: "Random Animal Generator - 200+ Animals for Trivia & Games",
    metaDescription: "Generate random animals from mammals, birds, reptiles, fish & amphibians. Perfect for trivia, classroom games, creative writing, or fun. Free & instant!",
    h1: "Random Animal Generator",
    intro: "Generate random animals instantly. Choose from various animal categories (mammals, birds, reptiles, etc.), generate multiple animals at once, and use a seed to repeat or share your results.",
    faqs: [
      {
        question: "What animals can be generated?",
        answer: "Animals are selected from a built-in dataset."
      },
      {
        question: "Can I filter by animal type?",
        answer: "Yes. Filter by categories like mammals or birds."
      },
      {
        question: "Can I generate multiple animals?",
        answer: "Yes. Choose how many animals to generate."
      },
      {
        question: "Can I repeat the same result?",
        answer: "Yes. Use the same seed to reproduce results."
      },
      {
        question: "Are these animals real?",
        answer: "Yes. All animals are real species names."
      },
      {
        question: "Is this tool free?",
        answer: "Yes. No limits or sign-up."
      }
    ]
  },
  {
    slug: "random-text-generator",
    name: "Random Text Generator",
    category: "Text",
    icon: Type,
    metaTitle: "Random Text Generator - Lorem Ipsum Alternative | Free Online",
    metaDescription: "Generate random placeholder text for UI mockups, design testing, or layouts. Short, medium, or long output with repeatable seeds. Free alternative to Lorem Ipsum!",
    h1: "Random Text Generator",
    intro: "Generate random text instantly. Create short, medium, or long placeholder text, control the number of lines, and use a seed to repeat or share your results. Perfect for testing layouts and designs.",
    faqs: [
      {
        question: "What kind of text is generated?",
        answer: "Short random sentences and placeholder-style text."
      },
      {
        question: "Can I control text length?",
        answer: "Yes. Choose short, medium, or long output."
      },
      {
        question: "Can I generate multiple lines?",
        answer: "Yes. Set how many lines you want."
      },
      {
        question: "Is the text repeatable?",
        answer: "Yes. The same seed produces the same text."
      },
      {
        question: "Can I copy the text easily?",
        answer: "Yes. One-click copy is supported."
      },
      {
        question: "Is this tool free?",
        answer: "Yes. Completely free to use."
      }
    ]
  },
  {
    slug: "random-team-generator",
    name: "Random Team Generator",
    category: "Selection",
    icon: Users,
    metaTitle: "Random Team Generator - Split Groups Fairly | Balanced Teams",
    metaDescription: "Split any group into balanced random teams instantly. Perfect for sports, classrooms, hackathons, or projects. Shareable results. 100% free online!",
    h1: "Random Team Generator",
    intro: "Randomly divide people into teams instantly. Enter your list of members, choose the number of teams, enable balanced distribution for equal team sizes, and use a seed to repeat or share your results. Perfect for organizing groups, sports teams, or project assignments.",
    faqs: [
      {
        question: "How does the team generator work?",
        answer: "It randomly shuffles your members and distributes them evenly or randomly across the specified number of teams."
      },
      {
        question: "Can I create balanced teams?",
        answer: "Yes. Enable balanced distribution to ensure teams have similar sizes."
      },
      {
        question: "Can I customize team names?",
        answer: "Yes. Teams are named Team 1, Team 2, etc., but you can rename them after generation."
      },
      {
        question: "Is the distribution fair?",
        answer: "Yes. The algorithm ensures unbiased random distribution."
      },
      {
        question: "Can I repeat the same team distribution?",
        answer: "Yes. Using the same seed reproduces the exact same team assignments."
      },
      {
        question: "Can I share the team distribution?",
        answer: "Yes. Shareable links preserve your member list, team count, and seed."
      }
    ]
  },
  {
    slug: "random-email-generator",
    name: "Random Email Generator",
    category: "Text",
    icon: Mail,
    metaTitle: "Random Email Generator - Fake Test Emails | Custom Domains",
    metaDescription: "Generate realistic fake email addresses for testing. Name-based, username, or random formats with custom domains. Perfect for QA testing. Free & instant!",
    h1: "Random Email Generator",
    intro: "Generate random email addresses instantly. Choose from name-based, username, or random formats, select a custom domain or use a random one, and generate multiple emails at once. Use a seed to repeat or share your results. Perfect for testing, development, or placeholder purposes.",
    faqs: [
      {
        question: "What email formats are supported?",
        answer: "You can choose name-based (firstname.lastname123), username-based, or completely random formats."
      },
      {
        question: "Can I use a custom domain?",
        answer: "Yes. You can specify a custom domain or use a random one from popular providers."
      },
      {
        question: "Are the emails unique?",
        answer: "Yes. The generator ensures all generated emails are unique within a single generation."
      },
      {
        question: "Can I repeat the same emails?",
        answer: "Yes. Use the same seed to reproduce identical email addresses."
      },
      {
        question: "Can I generate multiple emails at once?",
        answer: "Yes. Choose how many email addresses you want to generate."
      },
      {
        question: "Are these real email addresses?",
        answer: "No. These are randomly generated addresses for testing and development purposes only."
      }
    ]
  },
  {
    slug: "random-website-generator",
    name: "Random Website Generator",
    category: "Text",
    icon: Globe,
    metaTitle: "Random Website Generator - Fake URLs for Testing | Custom TLDs",
    metaDescription: "Generate random website URLs with custom TLDs, subdomains, and paths. Perfect for dev testing, UI mockups, and placeholder data. Free URL generator!",
    h1: "Random Website Generator",
    intro: "Generate random website URLs instantly. Choose from simple domains, subdomains, or paths, select a TLD or use a random one, and generate multiple URLs at once. Use a seed to repeat or share your results. Perfect for testing, development, or placeholder purposes.",
    faqs: [
      {
        question: "What URL formats are supported?",
        answer: "You can choose simple domains (example.com), subdomains (blog.example.com), or paths (example.com/path/to/page)."
      },
      {
        question: "Can I use a custom TLD?",
        answer: "Yes. You can specify a custom TLD (like .com, .org) or use a random one from popular options."
      },
      {
        question: "Are the URLs unique?",
        answer: "Yes. The generator ensures all generated URLs are unique within a single generation."
      },
      {
        question: "Can I repeat the same URLs?",
        answer: "Yes. Use the same seed to reproduce identical website URLs."
      },
      {
        question: "Can I generate multiple URLs at once?",
        answer: "Yes. Choose how many website URLs you want to generate."
      },
      {
        question: "Are these real websites?",
        answer: "No. These are randomly generated URLs for testing and development purposes only."
      }
    ]
  }
]

export function getToolBySlug(slug: string): ToolConfig | undefined {
  return TOOL_REGISTRY.find(tool => tool.slug === slug)
}

export function getAllTools(): ToolConfig[] {
  return TOOL_REGISTRY
}

export function getToolsByCategory(): Record<string, ToolConfig[]> {
  const grouped: Record<string, ToolConfig[]> = {}
  TOOL_REGISTRY.forEach(tool => {
    if (!grouped[tool.category]) {
      grouped[tool.category] = []
    }
    grouped[tool.category].push(tool)
  })
  return grouped
}
