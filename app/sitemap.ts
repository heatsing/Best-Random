import { MetadataRoute } from 'next'
import { tools, categories } from '@/lib/registry'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://bestrandom.net'
  
  // Generate routes for all tools using new registry system
  const toolRoutes = tools.map(tool => `/${tool.category}/${tool.slug}`)
  
  // Generate category routes
  const categoryRoutes = categories.map(cat => `/${cat.id}`)
  
  const routes = [
    '',
    '/generators',
    ...categoryRoutes,
    ...toolRoutes,
    '/about',
    '/privacy',
    '/terms',
  ]

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : route.startsWith('/') && route.split('/').length === 2 ? 0.9 : 0.8,
  }))
}
