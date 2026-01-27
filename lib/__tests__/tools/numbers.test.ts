import { randomNumberTool, diceRollerTool, coinFlipTool } from '../../tools/numbers'
import { createPRNG } from '../../prng'

describe('Number Tools', () => {
  const createContext = (options: any = {}) => ({
    seed: 'test-seed',
    rng: () => createPRNG('test-seed').next(),
    options: {
      ...randomNumberTool.defaultOptions,
      ...options,
    },
  })

  describe('randomNumberTool', () => {
    test('should generate numbers within range', () => {
      const context = createContext({ min: 1, max: 100, count: 10 })
      const result = randomNumberTool.run(context)
      
      expect(result.items).toHaveLength(10)
      result.items.forEach((item: any) => {
        expect(item.value).toBeGreaterThanOrEqual(1)
        expect(item.value).toBeLessThanOrEqual(100)
      })
    })

    test('should generate unique numbers when unique is true', () => {
      const context = createContext({ min: 1, max: 20, count: 10, unique: true })
      const result = randomNumberTool.run(context)
      
      const values = result.items.map((item: any) => item.value)
      const uniqueValues = new Set(values)
      // When unique is true and range is large enough, all values should be unique
      expect(uniqueValues.size).toBeGreaterThanOrEqual(Math.min(10, 20 - 1 + 1))
    })

    test('should sort numbers when sort is true', () => {
      const context = createContext({ min: 1, max: 100, count: 10, sort: true })
      const result = randomNumberTool.run(context)
      
      const values = result.items.map((item: any) => item.value)
      const sortedValues = [...values].sort((a, b) => a - b)
      expect(values).toEqual(sortedValues)
    })
  })

  describe('diceRollerTool', () => {
    test('should roll dice with correct number of sides', () => {
      const context = {
        seed: 'test-seed',
        rng: () => createPRNG('test-seed').next(),
        options: {
          ...diceRollerTool.defaultOptions,
          diceType: 'd6',
          diceCount: 1,
        },
      }
      const result = diceRollerTool.run(context)
      
      // Result includes individual rolls and sum
      expect(result.items.length).toBeGreaterThanOrEqual(1)
      const rollItems = result.items.filter((item: any) => !item.isSum)
      rollItems.forEach((item: any) => {
        expect(item.value).toBeGreaterThanOrEqual(1)
        expect(item.value).toBeLessThanOrEqual(6)
      })
    })

    test('should calculate sum when multiple dice', () => {
      const context = {
        seed: 'test-seed',
        rng: () => createPRNG('test-seed').next(),
        options: {
          ...diceRollerTool.defaultOptions,
          diceType: 'd6',
          diceCount: 2,
        },
      }
      const result = diceRollerTool.run(context)
      
      // Should have 2 roll items + 1 sum item
      expect(result.items.length).toBeGreaterThanOrEqual(2)
      const sumItem = result.items.find((item: any) => item.isSum)
      expect(sumItem).toBeDefined()
    })
  })

  describe('coinFlipTool', () => {
    test('should flip coin and return heads or tails', () => {
      const context = {
        seed: 'test-seed',
        rng: () => createPRNG('test-seed').next(),
        options: {
          ...coinFlipTool.defaultOptions,
          flips: 10,
        },
      }
      const result = coinFlipTool.run(context)
      
      // Should have 10 flip items + 1 stats item
      expect(result.items.length).toBe(11)
      const flipItems = result.items.filter((item: any) => item.id !== 'stats')
      expect(flipItems.length).toBe(10)
      flipItems.forEach((item: any) => {
        expect(['Heads', 'Tails']).toContain(item.value)
      })
    })

    test('should include statistics', () => {
      const context = {
        seed: 'test-seed',
        rng: () => createPRNG('test-seed').next(),
        options: {
          ...coinFlipTool.defaultOptions,
          flips: 10,
        },
      }
      const result = coinFlipTool.run(context)
      
      // Statistics are added as the last item with id "stats"
      const statsItem = result.items.find((item: any) => item.id === 'stats')
      expect(statsItem).toBeDefined()
      expect(statsItem?.value).toContain('Heads')
      expect(statsItem?.value).toContain('Tails')
    })
  })
})
