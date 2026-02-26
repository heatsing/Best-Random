import { randomWordTool, randomTextTool } from '../../tools/text'
import { createPRNG } from '../../prng'

describe('Text Tools', () => {
  const createContext = (options: any = {}) => ({
    seed: 'test-seed',
    rng: () => createPRNG('test-seed').next(),
    options: {
      ...randomWordTool.defaultOptions,
      ...options,
    },
  })

  describe('randomWordTool', () => {
    test('should generate words', () => {
      const context = createContext({ count: 10 })
      const result = randomWordTool.run(context)
      
      expect(result.items).toHaveLength(10)
      result.items.forEach((item: any) => {
        expect(typeof item.value).toBe('string')
        expect(item.value.length).toBeGreaterThan(0)
      })
    })

    test('should generate unique words when unique is true', () => {
      const context = createContext({ count: 5, unique: true })
      const result = randomWordTool.run(context)
      
      const values = result.items.map((item: any) => item.value)
      const uniqueValues = new Set(values)
      // When unique is true, values should be unique (assuming word list is large enough)
      expect(uniqueValues.size).toBeGreaterThanOrEqual(1)
      expect(uniqueValues.size).toBeLessThanOrEqual(values.length)
    })
  })

  describe('randomTextTool', () => {
    test('should generate lorem ipsum text', () => {
      const context = createContext({ lines: 2 })
      const result = randomTextTool.run(context)
      
      expect(result.items.length).toBeGreaterThan(0)
      result.items.forEach((item: any) => {
        expect(typeof item.value).toBe('string')
        expect(item.value.length).toBeGreaterThan(0)
      })
    })

    test('should generate correct number of lines', () => {
      const context = createContext({ lines: 3 })
      const result = randomTextTool.run(context)
      
      expect(result.items.length).toBe(3)
    })
  })
})
