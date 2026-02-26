import { Metadata } from 'next';

export interface SEOConfig {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
}

/**
 * Strip query parameters from URL for canonical
 */
export function getCanonicalUrl(path: string): string {
  const siteUrl = 'https://bestrandom.net';
  // Remove query params for canonical
  const cleanPath = path.split('?')[0];
  return `${siteUrl}${cleanPath}`;
}

export function generateMetadata(config: SEOConfig): Metadata {
  const siteUrl = 'https://bestrandom.net';
  const fullUrl = `${siteUrl}${config.path}`;
  const canonicalUrl = getCanonicalUrl(config.path);
  // Default OG image - can be customized per page later
  const ogImage = `${siteUrl}/og-image.png`;

  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: config.title,
      description: config.description,
      url: canonicalUrl, // Use canonical URL for og:url
      siteName: 'BestRandom',
      type: 'website',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: config.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: config.title,
      description: config.description,
      images: [ogImage],
    },
  };
}

export interface FAQItem {
  question: string;
  answer: string;
}

export function generateFAQSchema(faqs: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'BestRandom',
    url: 'https://bestrandom.net',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://bestrandom.net/generators?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };
}
