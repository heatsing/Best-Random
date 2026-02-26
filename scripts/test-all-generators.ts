/**
 * Comprehensive test: execute every generator's run() function
 * and verify it returns a valid GeneratedResult
 */

const { allTools } = require('./lib/tools/index.ts') ? {} : {}

// We need to use dynamic import or tsx for TS files
// Instead, let's create a simpler Node.js compatible test

const { execSync } = require('child_process')

// Use tsx to run our actual test
const testCode = `
import { allTools } from './lib/tools/index'
import { createPRNG, hashStringToUint32, stableStringify } from './lib/prng'
import { createCombinedSeed } from './lib/registry'

function createTestContext(tool: any) {
  const seed = 'test-seed-12345'
  const options = { ...tool.defaultOptions }

  // For tools requiring textarea input, provide test data
  if (options.items !== undefined) {
    options.items = 'Apple\\nBanana\\nCherry\\nDog\\nElephant'
  }
  if (options.members !== undefined) {
    options.members = 'Alice\\nBob\\nCharlie\\nDiana\\nEve\\nFrank'
  }
  if (options.names !== undefined) {
    options.names = 'Alice\\nBob\\nCharlie\\nDiana'
  }
  if (options.text !== undefined && tool.slug === 'hash-generator') {
    options.text = 'Hello World'
  }

  const combinedSeed = createCombinedSeed(seed, options)
  const prng = createPRNG(combinedSeed)

  return {
    seed: combinedSeed,
    rng: () => prng.next(),
    options
  }
}

let passed = 0
let failed = 0
const failures: string[] = []

console.log('=== Testing All ' + allTools.length + ' Generators ===\\n')

for (const tool of allTools) {
  try {
    const ctx = createTestContext(tool)
    const result = tool.run(ctx)

    // Handle async results
    const checkResult = (res: any) => {
      // Verify structure
      if (!res || typeof res !== 'object') {
        throw new Error('Result is not an object')
      }
      if (!Array.isArray(res.items)) {
        throw new Error('Result.items is not an array')
      }
      if (!res.meta || typeof res.meta !== 'object') {
        throw new Error('Result.meta is not an object')
      }
      if (typeof res.meta.seedUsed !== 'string') {
        throw new Error('Result.meta.seedUsed is not a string')
      }
      if (typeof res.meta.count !== 'number') {
        throw new Error('Result.meta.count is not a number')
      }
      if (typeof res.meta.generatedAt !== 'number') {
        throw new Error('Result.meta.generatedAt is not a number')
      }
      if (typeof res.previewText !== 'string') {
        throw new Error('Result.previewText is not a string')
      }

      // For most tools, items should not be empty (except when input is empty)
      if (res.items.length === 0 && tool.generatorType !== 'picker' && tool.generatorType !== 'team' && tool.generatorType !== 'secret-santa') {
        throw new Error('Result.items is empty')
      }

      // Verify each item has required fields
      for (const item of res.items) {
        if (!item.id) throw new Error('Item missing id')
        if (item.value === undefined) throw new Error('Item missing value')
        if (item.formatted === undefined) throw new Error('Item missing formatted')
      }

      console.log('  ✓ ' + tool.slug + ' (' + tool.category + ') - ' + res.items.length + ' items generated')
      passed++
    }

    if (result instanceof Promise) {
      result.then(checkResult).catch((err: Error) => {
        console.log('  ✗ ' + tool.slug + ' (' + tool.category + ') - ERROR: ' + err.message)
        failures.push(tool.slug + ': ' + err.message)
        failed++
      })
    } else {
      checkResult(result)
    }
  } catch (err: any) {
    console.log('  ✗ ' + tool.slug + ' (' + tool.category + ') - ERROR: ' + err.message)
    failures.push(tool.slug + ': ' + err.message)
    failed++
  }
}

// Wait a bit for any async results
setTimeout(() => {
  console.log('\\n=== Results ===')
  console.log('Passed: ' + passed + '/' + (passed + failed))
  console.log('Failed: ' + failed + '/' + (passed + failed))

  if (failures.length > 0) {
    console.log('\\n=== Failures ===')
    failures.forEach(f => console.log('  - ' + f))
  }

  process.exit(failed > 0 ? 1 : 0)
}, 2000)
`

require('fs').writeFileSync('/tmp/test-generators.ts', testCode)
