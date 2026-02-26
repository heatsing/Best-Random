import { createPRNG, stableStringify } from '../prng';

export interface WheelItem {
  name: string;
  weight: number;
}

export interface WheelGeneratorParams {
  items: WheelItem[];
  seed?: string;
}

export interface WheelResult {
  winner: string;
  index: number;
}

/**
 * Generate a deterministic seed from base seed + params
 */
function getCombinedSeed(baseSeed: string, params: Omit<WheelGeneratorParams, 'seed'>): string {
  const paramsStr = stableStringify(params);
  return `${baseSeed}|${paramsStr}`;
}

export function spinWheel(params: WheelGeneratorParams): WheelResult {
  const { items, seed: baseSeed } = params;
  
  // Generate deterministic seed from base seed + params
  const paramsForSeed = { items };
  const combinedSeed = baseSeed 
    ? getCombinedSeed(baseSeed, paramsForSeed)
    : `${Date.now()}-${Math.random()}`;
  
  const prng = createPRNG(combinedSeed);

  if (items.length === 0) {
    return { winner: '', index: -1 };
  }

  // Calculate total weight
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);

  if (totalWeight === 0) {
    // All weights are 0, pick randomly
    const index = prng.nextInt(0, items.length - 1);
    return { winner: items[index].name, index };
  }

  // Pick random number between 0 and totalWeight
  let random = prng.next() * totalWeight;

  // Find which item this falls into
  for (let i = 0; i < items.length; i++) {
    random -= items[i].weight;
    if (random <= 0) {
      return { winner: items[i].name, index: i };
    }
  }

  // Fallback to last item
  return { winner: items[items.length - 1].name, index: items.length - 1 };
}

export function parseWheelInput(input: string): WheelItem[] {
  const lines = input
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

  const items: WheelItem[] = [];
  const seen = new Set<string>();

  for (const line of lines) {
    // Check if line has weight format: "name:weight"
    const colonIndex = line.lastIndexOf(':');
    if (colonIndex > 0) {
      const name = line.substring(0, colonIndex).trim();
      const weightStr = line.substring(colonIndex + 1).trim();
      const weight = parseFloat(weightStr);

      if (name && !isNaN(weight) && weight >= 0) {
        if (!seen.has(name.toLowerCase())) {
          items.push({ name, weight: Math.max(0, weight) });
          seen.add(name.toLowerCase());
        }
      } else if (name) {
        // Invalid weight, treat as name with weight 1
        if (!seen.has(name.toLowerCase())) {
          items.push({ name, weight: 1 });
          seen.add(name.toLowerCase());
        }
      }
    } else {
      // No weight specified, default to 1
      if (!seen.has(line.toLowerCase())) {
        items.push({ name: line, weight: 1 });
        seen.add(line.toLowerCase());
      }
    }
  }

  return items;
}
