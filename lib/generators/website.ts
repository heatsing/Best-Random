import { createPRNG, stableStringify } from '../prng';

const DOMAINS = [
  'com', 'org', 'net', 'io', 'co', 'dev', 'app', 'tech', 'online', 'site',
  'xyz', 'info', 'biz', 'me', 'us', 'uk', 'ca', 'au', 'de', 'fr'
];

const SUBDOMAINS = [
  'www', 'blog', 'shop', 'store', 'app', 'api', 'admin', 'mail', 'news', 'forum',
  'help', 'support', 'docs', 'wiki', 'demo', 'test', 'dev', 'staging', 'cdn', 'static'
];

const WORDS = [
  'tech', 'digital', 'cloud', 'smart', 'fast', 'secure', 'global', 'modern', 'innovative', 'creative',
  'web', 'app', 'data', 'code', 'design', 'studio', 'labs', 'hub', 'network', 'systems',
  'solutions', 'services', 'platform', 'tools', 'software', 'hardware', 'media', 'group', 'team', 'works'
];

export interface WebsiteGeneratorParams {
  count: number;
  format?: 'simple' | 'subdomain' | 'path';
  tld?: string;
  seed?: string;
}

export interface WebsiteResult {
  url: string;
  id: string;
}

/**
 * Generate a deterministic seed from base seed + params
 */
function getCombinedSeed(baseSeed: string, params: Omit<WebsiteGeneratorParams, 'seed'>): string {
  const paramsStr = stableStringify(params);
  return `${baseSeed}|${paramsStr}`;
}

export function generateWebsites(params: WebsiteGeneratorParams): WebsiteResult[] {
  const { count, format = 'simple', tld, seed: baseSeed } = params;
  
  if (count < 1) {
    return [];
  }

  // Generate deterministic seed from base seed + params
  const paramsForSeed = { count, format, tld };
  const combinedSeed = baseSeed 
    ? getCombinedSeed(baseSeed, paramsForSeed)
    : `${Date.now()}-${Math.random()}`;
  
  const prng = createPRNG(combinedSeed);
  const results: WebsiteResult[] = [];
  const usedUrls = new Set<string>();

  const selectedTld = tld || DOMAINS[prng.nextInt(0, DOMAINS.length - 1)];

  for (let i = 0; i < count; i++) {
    let url: string;
    let attempts = 0;

    do {
      const domainName = generateDomainName(prng);
      
      if (format === 'subdomain') {
        const subdomain = SUBDOMAINS[prng.nextInt(0, SUBDOMAINS.length - 1)];
        url = `https://${subdomain}.${domainName}.${selectedTld}`;
      } else if (format === 'path') {
        const path = generatePath(prng);
        url = `https://${domainName}.${selectedTld}/${path}`;
      } else {
        // simple format
        url = `https://${domainName}.${selectedTld}`;
      }
      attempts++;
    } while (usedUrls.has(url) && attempts < 100);

    usedUrls.add(url);
    results.push({
      url,
      id: `website-${i}`,
    });
  }

  return results;
}

function generateDomainName(prng: ReturnType<typeof createPRNG>): string {
  const wordCount = prng.nextInt(1, 2);
  const words: string[] = [];
  
  for (let i = 0; i < wordCount; i++) {
    words.push(WORDS[prng.nextInt(0, WORDS.length - 1)]);
  }
  
  // Sometimes add a number
  if (prng.next() < 0.3) {
    words.push(String(prng.nextInt(10, 999)));
  }
  
  return words.join('');
}

function generatePath(prng: ReturnType<typeof createPRNG>): string {
  const segments = prng.nextInt(1, 3);
  const pathSegments: string[] = [];
  
  for (let i = 0; i < segments; i++) {
    const word = WORDS[prng.nextInt(0, WORDS.length - 1)];
    pathSegments.push(word);
  }
  
  return pathSegments.join('/');
}
