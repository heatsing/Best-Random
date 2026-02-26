import { createPRNG, stableStringify } from '../prng';

const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';
const AMBIGUOUS = 'O0Il1';

export interface PasswordGeneratorParams {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeAmbiguous: boolean;
  count?: number;
  seed?: string;
}

export interface PasswordResult {
  password: string;
  strength: 'weak' | 'medium' | 'strong' | 'very-strong';
  entropy: number;
  id: string;
}

/**
 * Generate a deterministic seed from base seed + params
 */
function getCombinedSeed(baseSeed: string, params: Omit<PasswordGeneratorParams, 'seed'>): string {
  const paramsStr = stableStringify(params);
  return `${baseSeed}|${paramsStr}`;
}

export function generatePasswords(params: PasswordGeneratorParams): PasswordResult[] {
  const {
    length,
    includeUppercase,
    includeLowercase,
    includeNumbers,
    includeSymbols,
    excludeAmbiguous,
    count = 1,
    seed: baseSeed,
  } = params;

  // Generate deterministic seed from base seed + params
  const paramsForSeed = { length, includeUppercase, includeLowercase, includeNumbers, includeSymbols, excludeAmbiguous, count };
  const combinedSeed = baseSeed 
    ? getCombinedSeed(baseSeed, paramsForSeed)
    : `${Date.now()}-${Math.random()}`;
  
  const prng = createPRNG(combinedSeed);
  const results: PasswordResult[] = [];

  let charset = '';

  if (includeUppercase) {
    charset += excludeAmbiguous ? UPPERCASE.replace(/[OIl]/g, '') : UPPERCASE;
  }
  if (includeLowercase) {
    charset += excludeAmbiguous ? LOWERCASE.replace(/[o0il1]/g, '') : LOWERCASE;
  }
  if (includeNumbers) {
    charset += excludeAmbiguous ? NUMBERS.replace(/[01]/g, '') : NUMBERS;
  }
  if (includeSymbols) {
    charset += SYMBOLS;
  }

  if (charset.length === 0) {
    return Array.from({ length: count }, (_, i) => ({
      password: '',
      strength: 'weak' as const,
      entropy: 0,
      id: `password-${i}`,
    }));
  }

  for (let i = 0; i < count; i++) {
    let password = '';
    for (let j = 0; j < length; j++) {
      password += charset[prng.nextInt(0, charset.length - 1)];
    }

    // Calculate entropy (bits)
    const entropy = Math.log2(Math.pow(charset.length, length));

    // Determine strength
    let strength: 'weak' | 'medium' | 'strong' | 'very-strong';
    if (entropy < 40) {
      strength = 'weak';
    } else if (entropy < 60) {
      strength = 'medium';
    } else if (entropy < 80) {
      strength = 'strong';
    } else {
      strength = 'very-strong';
    }

    results.push({ password, strength, entropy, id: `password-${i}` });
  }

  return results;
}

// Backward compatibility
export function generatePassword(params: PasswordGeneratorParams): PasswordResult {
  const results = generatePasswords({ ...params, count: 1 });
  return results[0];
}
