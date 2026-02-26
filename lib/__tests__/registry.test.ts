import { tools, categories, getToolBySlug, getToolsByCategory, getPopularTools } from '../registry'

describe('Registry', () => {
  describe('tools', () => {
    test('should have tools', () => {
      expect(tools.length).toBeGreaterThan(0)
    })

    test('each tool should have required properties', () => {
      tools.forEach(tool => {
        expect(tool).toHaveProperty('slug')
        expect(tool).toHaveProperty('category')
        expect(tool).toHaveProperty('name')
        expect(tool).toHaveProperty('shortDescription')
        expect(tool).toHaveProperty('longDescription')
        expect(tool).toHaveProperty('generatorType')
        expect(tool).toHaveProperty('defaultOptions')
        expect(tool).toHaveProperty('optionSchema')
        expect(tool).toHaveProperty('run')
        expect(tool).toHaveProperty('seo')
        expect(tool).toHaveProperty('icon')
        
        expect(typeof tool.slug).toBe('string')
        expect(typeof tool.category).toBe('string')
        expect(typeof tool.name).toBe('string')
        expect(typeof tool.shortDescription).toBe('string')
        expect(typeof tool.longDescription).toBe('string')
        expect(typeof tool.run).toBe('function')
      })
    })

    test('each tool should have unique slug', () => {
      const slugs = tools.map(t => t.slug)
      const uniqueSlugs = new Set(slugs)
      expect(slugs.length).toBe(uniqueSlugs.size)
    })
  })

  describe('categories', () => {
    test('should have categories', () => {
      expect(categories.length).toBeGreaterThan(0)
    })

    test('each category should have required properties', () => {
      categories.forEach(category => {
        expect(category).toHaveProperty('id')
        expect(category).toHaveProperty('name')
        expect(category).toHaveProperty('description')
        expect(category).toHaveProperty('icon')
        
        expect(typeof category.id).toBe('string')
        expect(typeof category.name).toBe('string')
        expect(typeof category.description).toBe('string')
      })
    })

    test('each category should have unique id', () => {
      const ids = categories.map(c => c.id)
      const uniqueIds = new Set(ids)
      expect(ids.length).toBe(uniqueIds.size)
    })
  })

  describe('getToolBySlug', () => {
    test('should return tool for valid slug', () => {
      const tool = getToolBySlug('random-number-generator')
      expect(tool).toBeDefined()
      expect(tool?.slug).toBe('random-number-generator')
    })

    test('should return undefined for invalid slug', () => {
      const tool = getToolBySlug('non-existent-tool')
      expect(tool).toBeUndefined()
    })
  })

  describe('getToolsByCategory', () => {
    test('should return tools for valid category', () => {
      const categoryTools = getToolsByCategory('numbers')
      expect(categoryTools.length).toBeGreaterThan(0)
      categoryTools.forEach(tool => {
        expect(tool.category).toBe('numbers')
      })
    })

    test('should return empty array for invalid category', () => {
      const categoryTools = getToolsByCategory('non-existent-category' as any)
      expect(categoryTools).toEqual([])
    })
  })

  describe('getPopularTools', () => {
    test('should return popular tools', () => {
      const popularTools = getPopularTools()
      expect(popularTools.length).toBeGreaterThan(0)
      popularTools.forEach(tool => {
        expect(tool.popular).toBe(true)
      })
    })
  })

  describe('tool run functions', () => {
    test('should generate results with valid context', () => {
      const tool = getToolBySlug('random-number-generator')
      if (!tool) {
        throw new Error('Tool not found')
      }

      const context = {
        seed: 'test-seed',
        rng: () => Math.random(),
        options: tool.defaultOptions,
      }

      const result = tool.run(context)
      expect(result).toBeDefined()
      expect(result).toHaveProperty('items')
      expect(Array.isArray(result.items)).toBe(true)
    })
  })
})
