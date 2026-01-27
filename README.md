# BestRandom - Fast, Seeded & Shareable Random Generators

A tool-first random generator product built with Next.js, featuring deterministic randomness via seeds, shareable URLs, and polished micro-interactions.

## Features

### Core Functionality
- 🎲 **8 Random Generators**: Numbers, Names, Words, Picker, Colors, Passwords, Animals, Text
- 🌱 **Deterministic Randomness**: Every tool uses seeds for repeatability
- 🔗 **Shareable URLs**: Share links that reproduce exact results
- ⌨️ **Keyboard Shortcuts**: G (Generate), R (Reroll), C (Copy), S (Share), ? (Help)
- 🔍 **Command Palette**: Ctrl/Cmd+K to search and navigate tools
- 📜 **History & Favorites**: LocalStorage-based history and favorites
- 🎨 **Polished UX**: Rolling animations, staggered reveals, micro-interactions

### Technical Features
- ⚡ **Performance**: Lightweight, no heavy animation libs
- 🔒 **SEO Optimized**: FAQ schema, canonical URLs, OpenGraph, Twitter cards
- ♿ **Accessible**: Full keyboard support, ARIA labels, focus rings
- 📱 **Responsive**: Mobile-first design

## Setup

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000)

## Build

```bash
npm run build
npm start
```

## Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Vercel will automatically detect Next.js and configure the build settings
4. Deploy!

The project is Vercel-ready with no backend required.

## Project Structure

```
app/                    # Next.js App Router pages
  random-*-generator/  # Individual tool pages
components/            # Reusable React components
  ui/                  # shadcn/ui components
lib/                   # Core utilities
  generators/          # Generator functions
  prng.ts             # Mulberry32 PRNG implementation
  tool-registry.ts    # Central tool registry
  seo.ts              # SEO helpers
  history.ts          # History management
  favorites.ts        # Favorites management
data/                  # JSON datasets (animals, names, words)
```

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** components
- **lucide-react** icons
- **Mulberry32 PRNG** for deterministic randomness

## Key Concepts

### Deterministic Randomness
- Every tool uses a seed for reproducibility
- Same seed + same params = identical results
- **Repeat** = reuse current seed and regenerate (same output)
- **Reroll** = create new seed and regenerate (new output)
- **Share** = URL encodes seed + params; visiting link reproduces exact output

### Seed Generation
- Seeds are combined with parameters using `stableStringify` to ensure param changes don't accidentally reuse sequences
- Format: `hash(seed + stableStringify(params))`

## Available Tools

1. **Random Number Generator** - Range, count, uniqueness, decimals, sorting
2. **Random Name Generator** - Full names, first names, last names
3. **Random Word Generator** - Word length control, count
4. **Random Picker** - List items with weights, wheel mode
5. **Random Color Generator** - HEX, RGB, HSL, palettes, lock colors
6. **Random Password Generator** - Length, character types, exclude confusing chars
7. **Random Animal Generator** - Filter by category
8. **Random Text Generator** - Short/medium/long, multiple lines

## Keyboard Shortcuts

- **Ctrl/Cmd + K**: Open command palette
- **G**: Generate/Repeat
- **R**: Reroll (new seed)
- **C**: Copy all results
- **S**: Copy share link
- **?**: Show shortcuts help

## License

MIT
