import { createPRNG, stableStringify } from '../prng';

const WORDS = [
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
  'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
  'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
  'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
  'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me',
  'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take',
  'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other',
  'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also',
  'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way',
  'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us'
];

const SENTENCE_TEMPLATES = [
  'The {adj} {noun} {verb} {prep} the {noun}.',
  '{Noun} {verb} {prep} {adj} {noun}.',
  'When {noun} {verb}, {noun} {verb} {prep} {adj} {noun}.',
  'The {adj} {noun} {verb} {prep} {adj} {noun}.',
  '{Noun} and {noun} {verb} {prep} the {noun}.',
];

const ADJECTIVES = ['quick', 'brown', 'lazy', 'smart', 'bright', 'dark', 'light', 'heavy', 'fast', 'slow'];
const NOUNS = ['fox', 'dog', 'cat', 'bird', 'tree', 'house', 'car', 'book', 'table', 'chair'];
const VERBS = ['jumps', 'runs', 'flies', 'sits', 'stands', 'walks', 'reads', 'writes', 'paints', 'sings'];
const PREPOSITIONS = ['over', 'under', 'on', 'in', 'at', 'by', 'with', 'from', 'to', 'for'];

export interface TextGeneratorParams {
  length: 'short' | 'medium' | 'long';
  lines: number;
  seed?: string;
}

export interface TextResult {
  text: string;
  lines: string[];
}

/**
 * Generate a deterministic seed from base seed + params
 */
function getCombinedSeed(baseSeed: string, params: Omit<TextGeneratorParams, 'seed'>): string {
  const paramsStr = stableStringify(params);
  return `${baseSeed}|${paramsStr}`;
}

export function generateText(params: TextGeneratorParams): TextResult {
  const { length, lines, seed: baseSeed } = params;
  
  // Generate deterministic seed from base seed + params
  const paramsForSeed = { length, lines };
  const combinedSeed = baseSeed 
    ? getCombinedSeed(baseSeed, paramsForSeed)
    : `${Date.now()}-${Math.random()}`;
  
  const prng = createPRNG(combinedSeed);

  const wordsPerLine = length === 'short' ? 5 : length === 'medium' ? 10 : 20;
  const generatedLines: string[] = [];

  for (let lineIndex = 0; lineIndex < lines; lineIndex++) {
    const words: string[] = [];
    
    for (let i = 0; i < wordsPerLine; i++) {
      const word = WORDS[prng.nextInt(0, WORDS.length - 1)];
      words.push(word);
    }
    
    // Capitalize first word
    if (words.length > 0) {
      words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
    }
    
    // Add period at end
    const line = words.join(' ') + '.';
    generatedLines.push(line);
  }

  return {
    text: generatedLines.join('\n'),
    lines: generatedLines,
  };
}
