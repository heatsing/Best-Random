import { createPRNG, stableStringify } from '../prng';

const FIRST_NAMES = [
  'alex', 'alexander', 'alice', 'amy', 'andrew', 'anna', 'anthony', 'ashley',
  'benjamin', 'brian', 'brittany', 'charlie', 'chris', 'christopher', 'daniel', 'david',
  'emily', 'emma', 'ethan', 'james', 'jennifer', 'jessica', 'john', 'joshua',
  'kate', 'katie', 'kevin', 'lisa', 'michael', 'michelle', 'nick', 'olivia',
  'rachel', 'robert', 'sarah', 'steven', 'thomas', 'william'
];

const LAST_NAMES = [
  'anderson', 'brown', 'clark', 'davis', 'garcia', 'harris', 'jackson', 'johnson',
  'jones', 'lee', 'lewis', 'martin', 'martinez', 'miller', 'moore', 'rodriguez',
  'smith', 'taylor', 'thomas', 'thompson', 'walker', 'white', 'williams', 'wilson'
];

const DOMAINS = [
  'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com',
  'protonmail.com', 'mail.com', 'aol.com', 'zoho.com', 'yandex.com'
];

export interface EmailGeneratorParams {
  count: number;
  format?: 'name' | 'random' | 'username';
  domain?: string;
  seed?: string;
}

export interface EmailResult {
  email: string;
  id: string;
}

/**
 * Generate a deterministic seed from base seed + params
 */
function getCombinedSeed(baseSeed: string, params: Omit<EmailGeneratorParams, 'seed'>): string {
  const paramsStr = stableStringify(params);
  return `${baseSeed}|${paramsStr}`;
}

export function generateEmails(params: EmailGeneratorParams): EmailResult[] {
  const { count, format = 'name', domain, seed: baseSeed } = params;
  
  if (count < 1) {
    return [];
  }

  // Generate deterministic seed from base seed + params
  const paramsForSeed = { count, format, domain };
  const combinedSeed = baseSeed 
    ? getCombinedSeed(baseSeed, paramsForSeed)
    : `${Date.now()}-${Math.random()}`;
  
  const prng = createPRNG(combinedSeed);
  const results: EmailResult[] = [];
  const usedEmails = new Set<string>();

  const selectedDomain = domain || DOMAINS[prng.nextInt(0, DOMAINS.length - 1)];

  for (let i = 0; i < count; i++) {
    let email: string;
    let attempts = 0;

    do {
      if (format === 'name') {
        const firstName = FIRST_NAMES[prng.nextInt(0, FIRST_NAMES.length - 1)];
        const lastName = LAST_NAMES[prng.nextInt(0, LAST_NAMES.length - 1)];
        const number = prng.nextInt(100, 9999);
        email = `${firstName}.${lastName}${number}@${selectedDomain}`;
      } else if (format === 'username') {
        const username = generateUsername(prng);
        email = `${username}@${selectedDomain}`;
      } else {
        // random format
        const randomString = generateRandomString(prng, 8, 12);
        const number = prng.nextInt(10, 999);
        email = `${randomString}${number}@${selectedDomain}`;
      }
      attempts++;
    } while (usedEmails.has(email) && attempts < 100);

    usedEmails.add(email);
    results.push({
      email,
      id: `email-${i}`,
    });
  }

  return results;
}

function generateUsername(prng: ReturnType<typeof createPRNG>): string {
  const length = prng.nextInt(6, 12);
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let username = '';
  
  // Start with a letter
  username += chars[prng.nextInt(0, 25)];
  
  // Add remaining characters
  for (let i = 1; i < length; i++) {
    username += chars[prng.nextInt(0, chars.length - 1)];
  }
  
  return username;
}

function generateRandomString(prng: ReturnType<typeof createPRNG>, minLength: number, maxLength: number): string {
  const length = prng.nextInt(minLength, maxLength);
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let str = '';
  
  for (let i = 0; i < length; i++) {
    str += chars[prng.nextInt(0, chars.length - 1)];
  }
  
  return str;
}
