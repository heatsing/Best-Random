const SITE = "https://bestrandom.net"

export function saasBreadcrumbJsonLd(slug: string, name: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${SITE}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Tools",
        item: `${SITE}/tools`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name,
        item: `${SITE}/tools/${slug}`,
      },
    ],
  }
}

export function saasWebPageJsonLd(params: {
  slug: string
  name: string
  description: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: params.name,
    description: params.description,
    url: `${SITE}/tools/${params.slug}`,
    isPartOf: {
      "@type": "WebSite",
      name: "BestRandom",
      url: SITE,
    },
  }
}
