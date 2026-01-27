import { MetadataRoute } from 'next'
import { TOOL_REGISTRY } from '@/lib/tool-registry'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://bestrandom.net'
  
  const toolRoutes = TOOL_REGISTRY.map(tool => `/${tool.slug}`)
  
  const routes = [
    '',
    '/generators',
    ...toolRoutes,
    '/about',
    '/privacy',
    '/terms',
  ]

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))
}
