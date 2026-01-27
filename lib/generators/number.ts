import { createPRNG, stableStringify, hashStringToUint32 } from '../prng';

export interface NumberGeneratorParams {
  min: number;
  max: number;
  count: number;
  integer: boolean;
  unique: boolean;
  sort: boolean;
  decimals?: number;
  seed?: string;
}

export interface NumberResult {
  value: number;
  formatted: string;
  id: string;
}

/**
 * Generate a deterministic seed from base seed + params
 */
function getCombinedSeed(baseSeed: string, params: Omit<NumberGeneratorParams, 'seed'>): string {
  const paramsStr = stableStringify(params);
  return `${baseSeed}|${paramsStr}`;
}

export function generateNumbers(params: NumberGeneratorParams): NumberResult[] {
  const { min, max, count, integer, unique, sort, decimals = 6, seed: baseSeed } = params;
  
  // Generate deterministic seed from base seed + params
  const paramsForSeed = { min, max, count, integer, unique, sort, decimals };
  const combinedSeed = baseSeed 
    ? getCombinedSeed(baseSeed, paramsForSeed)
    : `${Date.now()}-${Math.random()}`;
  
  const prng = createPRNG(combinedSeed);
  const results: NumberResult[] = [];

  if (min > max) {
    return [];
  }

  if (unique && integer && (max - min + 1) < count) {
    // Not enough unique integers available
    const available = max - min + 1;
    for (let i = 0; i < available; i++) {
      results.push({
        value: min + i,
        formatted: String(min + i),
        id: `num-${i}`,
      });
    }
    return results;
  }

  const seen = new Set<number>();

  for (let i = 0; i < count; i++) {
    let value: number;
    
    if (integer) {
      value = prng.nextInt(min, max);
    } else {
      value = prng.nextFloat(min, max);
    }

    if (unique) {
      let attempts = 0;
      while (seen.has(value) && attempts < 1000) {
        if (integer) {
          value = prng.nextInt(min, max);
        } else {
          value = prng.nextFloat(min, max);
        }
        attempts++;
      }
      seen.add(value);
    }

    const formatted = integer 
      ? String(Math.round(value))
      : value.toFixed(decimals).replace(/\.?0+$/, '');

    results.push({
      value,
      formatted,
      id: `num-${i}`,
    });
  }

  if (sort) {
    results.sort((a, b) => a.value - b.value);
  }

  return results;
}
