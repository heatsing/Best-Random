import { SeededPRNG } from '../prng'

describe('SeededPRNG', () => {
  test('相同种子产生相同序列', () => {
    const prng1 = new SeededPRNG(12345)
    const prng2 = new SeededPRNG(12345)
    
    for (let i = 0; i < 10; i++) {
      expect(prng1.next()).toBe(prng2.next())
    }
  })

  test('不同种子产生不同序列', () => {
    const prng1 = new SeededPRNG(12345)
    const prng2 = new SeededPRNG(67890)
    
    const values1 = Array.from({ length: 10 }, () => prng1.next())
    const values2 = Array.from({ length: 10 }, () => prng2.next())
    
    expect(values1).not.toEqual(values2)
  })

  test('nextInt 在范围内', () => {
    const prng = new SeededPRNG(12345)
    
    for (let i = 0; i < 100; i++) {
      const value = prng.nextInt(1, 10)
      expect(value).toBeGreaterThanOrEqual(1)
      expect(value).toBeLessThanOrEqual(10)
    }
  })

  test('nextFloat 在范围内', () => {
    const prng = new SeededPRNG(12345)
    
    for (let i = 0; i < 100; i++) {
      const value = prng.nextFloat(0, 1)
      expect(value).toBeGreaterThanOrEqual(0)
      expect(value).toBeLessThan(1)
    }
  })

  test('shuffle 保持元素', () => {
    const prng = new SeededPRNG(12345)
    const array = [1, 2, 3, 4, 5]
    const shuffled = prng.shuffle(array)
    
    expect(shuffled).toHaveLength(array.length)
    expect(shuffled.sort()).toEqual(array.sort())
  })

  test('pick 从数组中选取', () => {
    const prng = new SeededPRNG(12345)
    const array = [1, 2, 3, 4, 5]
    const picked = prng.pick(array)
    
    expect(array).toContain(picked)
  })

  test('pickMultiple 返回正确数量', () => {
    const prng = new SeededPRNG(12345)
    const array = [1, 2, 3, 4, 5]
    const picked = prng.pickMultiple(array, 3)
    
    expect(picked).toHaveLength(3)
    picked.forEach(item => {
      expect(array).toContain(item)
    })
  })
})
