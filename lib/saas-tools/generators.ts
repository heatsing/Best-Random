/**
 * Lightweight demo generators — Math.random only.
 * Swap for seeded PRNG / API later without changing UI contracts.
 */

const FIRST = [
  "Avery", "Jordan", "Riley", "Quinn", "Morgan", "Casey", "Skyler", "Reese",
  "Rowan", "Sage", "Phoenix", "River", "Eden", "Blair", "Emery",
]

const LAST = [
  "Hayes", "Brooks", "Reed", "Gray", "Fox", "Stone", "West", "Knight",
  "Frost", "Lane", "Cross", "Blake", "Summers", "Winter", "Lake",
]

function pick<T>(arr: T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)]!
}

export function demoRandomNames(count: number, rng: () => number = Math.random): string[] {
  const n = Math.min(25, Math.max(1, Math.floor(count)))
  const out: string[] = []
  const seen = new Set<string>()
  let guard = 0
  while (out.length < n && guard < n * 20) {
    guard++
    const full = `${pick(FIRST, rng)} ${pick(LAST, rng)}`
    if (seen.has(full)) continue
    seen.add(full)
    out.push(full)
  }
  return out
}

export function demoRandomIntegers(
  count: number,
  min: number,
  max: number,
  rng: () => number = Math.random
): number[] {
  const lo = Math.min(min, max)
  const hi = Math.max(min, max)
  const n = Math.min(50, Math.max(1, Math.floor(count)))
  const out: number[] = []
  for (let i = 0; i < n; i++) {
    out.push(Math.floor(rng() * (hi - lo + 1)) + lo)
  }
  return out
}

export function demoRandomPick(lines: string[], rng: () => number = Math.random): string | null {
  const items = lines.map((s) => s.trim()).filter(Boolean)
  if (items.length === 0) return null
  return pick(items, rng)
}
