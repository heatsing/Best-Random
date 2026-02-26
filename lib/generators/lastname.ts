import { createPRNG, stableStringify } from '../prng';
import namesData from '@/data/names.json';

export interface LastNameGeneratorParams {
  count: number;
  unique: boolean;
  seed?: string;
}

export interface LastNameResult {
  lastName: string;
  id: string;
}

/**
 * Generate a deterministic seed from base seed + params
 */
function getCombinedSeed(baseSeed: string, params: Omit<LastNameGeneratorParams, 'seed'>): string {
  const paramsStr = stableStringify(params);
  return `${baseSeed}|${paramsStr}`;
}

export function generateLastNames(params: LastNameGeneratorParams): LastNameResult[] {
  const { count, unique, seed: baseSeed } = params;
  
  if (count < 1) {
    return [];
  }

  // Generate deterministic seed from base seed + params
  const paramsForSeed = { count, unique };
  const combinedSeed = baseSeed 
    ? getCombinedSeed(baseSeed, paramsForSeed)
    : `${Date.now()}-${Math.random()}`;
  
  const prng = createPRNG(combinedSeed);
  const results: LastNameResult[] = [];
  const seen = new Set<string>();
  const lastNames = namesData.lastNames;

  for (let i = 0; i < count; i++) {
    let lastName: string;
    let attempts = 0;

    do {
      lastName = lastNames[prng.nextInt(0, lastNames.length - 1)];
      attempts++;
    } while (unique && seen.has(lastName) && attempts < 1000);

    seen.add(lastName);
    results.push({
      lastName,
      id: `lastname-${i}`,
    });
  }

  return results;
}
