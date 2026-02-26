/**
 * Hash a string to a 32-bit unsigned integer
 */
export function hashStringToUint32(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash | 0; // Convert to 32-bit integer
  }
  return hash >>> 0; // Convert to unsigned 32-bit
}

/**
 * Stable stringify for deterministic hashing of objects
 */
export function stableStringify(obj: any): string {
  if (obj === null || obj === undefined) return String(obj);
  if (typeof obj !== 'object') return String(obj);
  
  if (Array.isArray(obj)) {
    return '[' + obj.map(stableStringify).join(',') + ']';
  }
  
  const keys = Object.keys(obj).sort();
  return '{' + keys.map(k => `${stableStringify(k)}:${stableStringify(obj[k])}`).join(',') + '}';
}

/**
 * Mulberry32 PRNG - fast, high-quality seeded random number generator
 */
export class Mulberry32 {
  private state: number;

  constructor(seed: number) {
    this.state = seed;
  }

  /**
   * Generate next random number between 0 (inclusive) and 1 (exclusive)
   */
  next(): number {
    let t = this.state += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }

  /**
   * Generate random integer between min (inclusive) and max (inclusive)
   */
  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  /**
   * Generate random float between min (inclusive) and max (exclusive)
   */
  nextFloat(min: number, max: number): number {
    return this.next() * (max - min) + min;
  }

  /**
   * Shuffle array using Fisher-Yates algorithm
   */
  shuffle<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = this.nextInt(0, i);
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  /**
   * Pick random element from array
   */
  pick<T>(array: T[]): T {
    return array[this.nextInt(0, array.length - 1)];
  }

  /**
   * Pick multiple random elements from array (without replacement)
   */
  pickMultiple<T>(array: T[], count: number): T[] {
    const shuffled = this.shuffle(array);
    return shuffled.slice(0, Math.min(count, array.length));
  }
}

/**
 * Create a new PRNG instance from a seed string
 * The seed is hashed to a uint32, then used to initialize Mulberry32
 */
export function createPRNG(seed: string): Mulberry32 {
  const seedUint32 = hashStringToUint32(seed);
  return new Mulberry32(seedUint32);
}
