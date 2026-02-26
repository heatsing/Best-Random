import { Mulberry32, createPRNG } from '../prng'

describe('Mulberry32 PRNG', () => {
  test('same seed produces same sequence', () => {
    const prng1 = createPRNG('test-seed-12345')
    const prng2 = createPRNG('test-seed-12345')
    
    for (let i = 0; i < 10; i++) {
      expect(prng1.next()).toBe(prng2.next())
    }
  })

  test('different seeds produce different sequences', () => {
    const prng1 = createPRNG('test-seed-12345')
    const prng2 = createPRNG('test-seed-67890')
    
    const values1 = Array.from({ length: 10 }, () => prng1.next())
    const values2 = Array.from({ length: 10 }, () => prng2.next())
    
    expect(values1).not.toEqual(values2)
  })

  test('nextInt returns values in range', () => {
    const prng = createPRNG('test-seed-12345')
    
    for (let i = 0; i < 100; i++) {
      const value = prng.nextInt(1, 10)
      expect(value).toBeGreaterThanOrEqual(1)
      expect(value).toBeLessThanOrEqual(10)
    }
  })

  test('nextFloat returns values in range', () => {
    const prng = createPRNG('test-seed-12345')
    
    for (let i = 0; i < 100; i++) {
      const value = prng.nextFloat(0, 1)
      expect(value).toBeGreaterThanOrEqual(0)
      expect(value).toBeLessThan(1)
    }
  })

  test('shuffle keeps all elements', () => {
    const prng = createPRNG('test-seed-12345')
    const array = [1, 2, 3, 4, 5]
    const shuffled = prng.shuffle(array)
    
    expect(shuffled).toHaveLength(array.length)
    expect(shuffled.sort()).toEqual(array.sort())
  })

  test('pick selects element from array', () => {
    const prng = createPRNG('test-seed-12345')
    const array = [1, 2, 3, 4, 5]
    const picked = prng.pick(array)
    
    expect(array).toContain(picked)
  })

  test('pickMultiple returns correct count', () => {
    const prng = createPRNG('test-seed-12345')
    const array = [1, 2, 3, 4, 5]
    const picked = prng.pickMultiple(array, 3)
    
    expect(picked).toHaveLength(3)
    picked.forEach(item => {
      expect(array).toContain(item)
    })
  })
})
