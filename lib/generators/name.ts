import { createPRNG, stableStringify } from '../prng';
import namesData from '@/data/names.json';

export interface NameGeneratorParams {
  count: number;
  style: 'modern' | 'classic' | 'mixed';
  unique: boolean;
  seed?: string;
}

export interface NameResult {
  fullName: string;
  firstName: string;
  lastName: string;
  id: string;
}

/**
 * Generate a deterministic seed from base seed + params
 */
function getCombinedSeed(baseSeed: string, params: Omit<NameGeneratorParams, 'seed'>): string {
  const paramsStr = stableStringify(params);
  return `${baseSeed}|${paramsStr}`;
}

export function generateNames(params: NameGeneratorParams): NameResult[] {
  const { count, style, unique, seed: baseSeed } = params;
  
  // Generate deterministic seed from base seed + params
  const paramsForSeed = { count, style, unique };
  const combinedSeed = baseSeed 
    ? getCombinedSeed(baseSeed, paramsForSeed)
    : `${Date.now()}-${Math.random()}`;
  
  const prng = createPRNG(combinedSeed);
  const results: NameResult[] = [];
  const seen = new Set<string>();

  const firstNames = style === 'modern' 
    ? namesData.firstNames.modern 
    : style === 'classic'
    ? namesData.firstNames.classic
    : [...namesData.firstNames.modern, ...namesData.firstNames.classic];

  const lastNames = namesData.lastNames;

  for (let i = 0; i < count; i++) {
    let firstName: string;
    let lastName: string;
    let fullName: string;
    let attempts = 0;

    do {
      firstName = firstNames[prng.nextInt(0, firstNames.length - 1)];
      lastName = lastNames[prng.nextInt(0, lastNames.length - 1)];
      fullName = `${firstName} ${lastName}`;
      attempts++;
    } while (unique && seen.has(fullName) && attempts < 1000);

    seen.add(fullName);
    results.push({ 
      fullName, 
      firstName, 
      lastName,
      id: `name-${i}`,
    });
  }

  return results;
}
