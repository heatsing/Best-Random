import { createPRNG, stableStringify } from '../prng';

export interface PickerItem {
  id: string;
  text: string;
  weight?: number;
}

export interface PickerGeneratorParams {
  items: PickerItem[];
  seed?: string;
  wheelMode?: boolean;
}

export interface PickerResult {
  item: PickerItem;
  index: number;
}

/**
 * Generate a deterministic seed from base seed + params
 */
function getCombinedSeed(baseSeed: string, params: Omit<PickerGeneratorParams, 'seed'>): string {
  const paramsStr = stableStringify(params);
  return `${baseSeed}|${paramsStr}`;
}

export function pickRandomItem(params: PickerGeneratorParams): PickerResult {
  const { items, seed: baseSeed, wheelMode } = params;
  
  if (items.length === 0) {
    throw new Error("No items to pick from");
  }

  // Generate deterministic seed from base seed + params
  const paramsForSeed = { items: items.map(i => ({ id: i.id, text: i.text, weight: i.weight })), wheelMode };
  const combinedSeed = baseSeed 
    ? getCombinedSeed(baseSeed, paramsForSeed)
    : `${Date.now()}-${Math.random()}`;
  
  const prng = createPRNG(combinedSeed);

  // Calculate total weight
  const totalWeight = items.reduce((sum, item) => sum + (item.weight || 1), 0);
  
  // Pick random value
  const random = prng.next() * totalWeight;
  
  // Find selected item
  let currentWeight = 0;
  let selectedIndex = 0;
  
  for (let i = 0; i < items.length; i++) {
    currentWeight += items[i].weight || 1;
    if (random <= currentWeight) {
      selectedIndex = i;
      break;
    }
  }

  return {
    item: items[selectedIndex],
    index: selectedIndex,
  };
}
