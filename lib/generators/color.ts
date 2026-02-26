import { createPRNG, stableStringify } from '../prng';

export type ColorFormat = 'hex' | 'rgb' | 'hsl';

export interface ColorGeneratorParams {
  count: number;
  format: ColorFormat;
  seed?: string;
}

export interface ColorResult {
  hex: string;
  rgb: string;
  hsl: string;
  rgbValues: { r: number; g: number; b: number };
  hslValues: { h: number; s: number; l: number };
  id: string;
}

/**
 * Generate a deterministic seed from base seed + params
 */
function getCombinedSeed(baseSeed: string, params: Omit<ColorGeneratorParams, 'seed'>): string {
  const paramsStr = stableStringify(params);
  return `${baseSeed}|${paramsStr}`;
}

export function generateColors(params: ColorGeneratorParams): ColorResult[] {
  const { count, format, seed: baseSeed } = params;
  
  // Generate deterministic seed from base seed + params
  const paramsForSeed = { count, format };
  const combinedSeed = baseSeed 
    ? getCombinedSeed(baseSeed, paramsForSeed)
    : `${Date.now()}-${Math.random()}`;
  
  const prng = createPRNG(combinedSeed);
  const results: ColorResult[] = [];

  for (let i = 0; i < count; i++) {
    const r = prng.nextInt(0, 255);
    const g = prng.nextInt(0, 255);
    const b = prng.nextInt(0, 255);

    const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    const rgb = `rgb(${r}, ${g}, ${b})`;

    // Convert to HSL
    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;

    const max = Math.max(rNorm, gNorm, bNorm);
    const min = Math.min(rNorm, gNorm, bNorm);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case rNorm:
          h = ((gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0)) / 6;
          break;
        case gNorm:
          h = ((bNorm - rNorm) / d + 2) / 6;
          break;
        case bNorm:
          h = ((rNorm - gNorm) / d + 4) / 6;
          break;
      }
    }

    const hDeg = Math.round(h * 360);
    const sPercent = Math.round(s * 100);
    const lPercent = Math.round(l * 100);

    const hsl = `hsl(${hDeg}, ${sPercent}%, ${lPercent}%)`;

    results.push({
      hex,
      rgb,
      hsl,
      rgbValues: { r, g, b },
      hslValues: { h: hDeg, s: sPercent, l: lPercent },
      id: `color-${i}`,
    });
  }

  return results;
}
