import { createPRNG, stableStringify } from '../prng';
import animalsData from '@/data/animals.json';

export interface AnimalGeneratorParams {
  count: number;
  showCategory: boolean;
  unique?: boolean;
  seed?: string;
}

export interface AnimalResult {
  name: string;
  category?: string;
  id: string;
}

/**
 * Generate a deterministic seed from base seed + params
 */
function getCombinedSeed(baseSeed: string, params: Omit<AnimalGeneratorParams, 'seed'>): string {
  const paramsStr = stableStringify(params);
  return `${baseSeed}|${paramsStr}`;
}

export function generateAnimals(params: AnimalGeneratorParams): AnimalResult[] {
  const { count, showCategory, unique = false, seed: baseSeed } = params;
  
  // Generate deterministic seed from base seed + params
  const paramsForSeed = { count, showCategory, unique };
  const combinedSeed = baseSeed 
    ? getCombinedSeed(baseSeed, paramsForSeed)
    : `${Date.now()}-${Math.random()}`;
  
  const prng = createPRNG(combinedSeed);
  const results: AnimalResult[] = [];
  const seen = new Set<string>();

  const allAnimals = animalsData.animals;

  for (let i = 0; i < count; i++) {
    let animal: typeof allAnimals[0];
    let attempts = 0;

    do {
      animal = allAnimals[prng.nextInt(0, allAnimals.length - 1)];
      attempts++;
    } while (unique && seen.has(animal.name) && attempts < 1000);

    seen.add(animal.name);
    results.push({
      name: animal.name,
      category: showCategory ? animal.category : undefined,
      id: `animal-${i}`,
    });
  }

  return results;
}
