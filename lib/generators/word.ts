import { createPRNG, stableStringify } from '../prng';
import wordsData from '@/data/words.json';

export interface WordGeneratorParams {
  count: number;
  minLength: number;
  maxLength: number;
  unique?: boolean;
  seed?: string;
}

export interface WordResult {
  word: string;
  id: string;
}

/**
 * Generate a deterministic seed from base seed + params
 */
function getCombinedSeed(baseSeed: string, params: Omit<WordGeneratorParams, 'seed'>): string {
  const paramsStr = stableStringify(params);
  return `${baseSeed}|${paramsStr}`;
}

export function generateWords(params: WordGeneratorParams): WordResult[] {
  const { count, minLength, maxLength, unique = false, seed: baseSeed } = params;
  
  // Generate deterministic seed from base seed + params
  const paramsForSeed = { count, minLength, maxLength, unique };
  const combinedSeed = baseSeed 
    ? getCombinedSeed(baseSeed, paramsForSeed)
    : `${Date.now()}-${Math.random()}`;
  
  const prng = createPRNG(combinedSeed);
  const results: WordResult[] = [];
  const seen = new Set<string>();

  const filteredWords = wordsData.words.filter(
    word => word.length >= minLength && word.length <= maxLength
  );

  if (filteredWords.length === 0) {
    return [];
  }

  for (let i = 0; i < count; i++) {
    let word: string;
    let attempts = 0;

    do {
      word = filteredWords[prng.nextInt(0, filteredWords.length - 1)];
      attempts++;
    } while (unique && seen.has(word) && attempts < 1000);

    seen.add(word);
    results.push({
      word,
      id: `word-${i}`,
    });
  }

  return results;
}
