import { Shuffle, Users, CircleDot } from "lucide-react"
import type { ToolConfig } from "../registry"

// Random Picker
export const randomPickerTool: ToolConfig = {
  slug: "random-picker",
  category: "selection",
  name: "Random Picker",
  shortDescription: "Randomly pick items from your list",
  longDescription: "Randomly pick items from your list. Enter your items, optionally assign weights, and pick instantly or use wheel mode for a visual random selection. Every pick uses a seed for repeatability—share your seed to reproduce the exact same pick.",
  generatorType: "picker",
  defaultOptions: {
    items: "",
    weights: false,
    wheelMode: false
  },
  optionSchema: {
    fields: [
      {
        key: "items",
        label: "Items (one per line)",
        type: "textarea",
        default: "",
        placeholder: "Item 1\nItem 2\nItem 3",
        required: true
      },
      {
        key: "weights",
        label: "Use weights (format: item:weight)",
        type: "checkbox",
        default: false
      },
      {
        key: "wheelMode",
        label: "Wheel mode (visual animation)",
        type: "checkbox",
        default: false
      }
    ]
  },
  run: (ctx) => {
    const { items, weights, wheelMode } = ctx.options
    const rng = ctx.rng
    
    if (!items || items.trim() === "") {
      return {
        items: [],
        meta: { seedUsed: ctx.seed, count: 0, generatedAt: Date.now() },
        previewText: ""
      }
    }

    const lines = items.split('\n').map((l: string) => l.trim()).filter((l: string) => l.length > 0)
    const pickerItems: Array<{ id: string; text: string; weight: number }> = []
    
    lines.forEach((line: string, i: number) => {
      if (weights && line.includes(':')) {
        const colonIndex = line.lastIndexOf(':')
        const text = line.substring(0, colonIndex).trim()
        const weightStr = line.substring(colonIndex + 1).trim()
        const weight = parseFloat(weightStr) || 1
        if (text) {
          pickerItems.push({ id: `item-${i}`, text, weight: Math.max(0, weight) })
        }
      } else {
        pickerItems.push({ id: `item-${i}`, text: line, weight: 1 })
      }
    })

    if (pickerItems.length === 0) {
      return {
        items: [],
        meta: { seedUsed: ctx.seed, count: 0, generatedAt: Date.now() },
        previewText: ""
      }
    }

    const totalWeight = pickerItems.reduce((sum, item) => sum + item.weight, 0)
    const random = rng() * totalWeight
    
    let currentWeight = 0
    let selectedIndex = 0
    
    for (let i = 0; i < pickerItems.length; i++) {
      currentWeight += pickerItems[i].weight
      if (random <= currentWeight) {
        selectedIndex = i
        break
      }
    }

    const selected = pickerItems[selectedIndex]

    return {
      items: [{
        id: selected.id,
        value: selected.text,
        formatted: selected.text,
        index: selectedIndex,
        isWinner: true
      }],
      meta: {
        seedUsed: ctx.seed,
        count: 1,
        generatedAt: Date.now()
      },
      previewText: selected.text
    }
  },
  seo: {
    title: "Random Picker - Who Goes First? Pick From Any List | Free",
    description: "Randomly pick a winner from any list. Spin a wheel or instant pick with weighted odds. Fair, shareable, and repeatable. Perfect for decisions! Free online!",
    h1: "Random Picker",
    faq: [
      { question: "How does the random picker work?", answer: "It randomly selects items from your input list." },
      { question: "Can I spin a wheel instead of instant pick?", answer: "Yes. Use wheel mode for visual random selection." },
      { question: "Can I assign weights to items?", answer: "Yes. Items can have different selection weights." },
      { question: "Is the result fair?", answer: "Yes. The algorithm ensures unbiased random selection." },
      { question: "Can I repeat the same pick?", answer: "Yes. Using the same seed reproduces the result." },
      { question: "Can I share the result?", answer: "Yes. Shareable links preserve your list and seed." }
    ]
  },
  icon: Shuffle,
  popular: true
}

// Random Team Generator
export const randomTeamTool: ToolConfig = {
  slug: "random-team-generator",
  category: "selection",
  name: "Random Team Generator",
  shortDescription: "Randomly divide people into teams",
  longDescription: "Randomly divide people into teams instantly. Enter your list of members, choose the number of teams, enable balanced distribution for equal team sizes, and use a seed to repeat or share your results. Perfect for organizing groups, sports teams, or project assignments.",
  generatorType: "team",
  defaultOptions: {
    members: "",
    teamCount: 2,
    balanced: true
  },
  optionSchema: {
    fields: [
      {
        key: "members",
        label: "Members (one per line)",
        type: "textarea",
        default: "",
        placeholder: "Alice\nBob\nCharlie\nDiana",
        required: true
      },
      { key: "teamCount", label: "Number of Teams", type: "number", default: 2, min: 2, max: 50 },
      { key: "balanced", label: "Balanced distribution", type: "checkbox", default: true }
    ]
  },
  run: (ctx) => {
    const { members, teamCount, balanced } = ctx.options
    const rng = ctx.rng
    
    if (!members || members.trim() === "") {
      return {
        items: [],
        meta: { seedUsed: ctx.seed, count: 0, generatedAt: Date.now() },
        previewText: ""
      }
    }

    const memberList = members.split('\n').map((m: string) => m.trim()).filter((m: string) => m.length > 0)
    
    if (memberList.length === 0 || teamCount < 1) {
      return {
        items: [],
        meta: { seedUsed: ctx.seed, count: 0, generatedAt: Date.now() },
        previewText: ""
      }
    }

    // Shuffle members
    const shuffled = [...memberList]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }

    // Distribute to teams
    const teams: any[] = []
    const membersPerTeam = balanced ? Math.floor(memberList.length / teamCount) : 0
    const remainder = balanced ? memberList.length % teamCount : 0

    let memberIndex = 0

    for (let i = 0; i < teamCount; i++) {
      const teamMembers: string[] = []
      
      if (balanced) {
        const count = membersPerTeam + (i < remainder ? 1 : 0)
        for (let j = 0; j < count && memberIndex < shuffled.length; j++) {
          teamMembers.push(shuffled[memberIndex])
          memberIndex++
        }
      } else {
        const remainingMembers = shuffled.length - memberIndex
        const remainingTeams = teamCount - i
        
        if (remainingTeams === 1) {
          while (memberIndex < shuffled.length) {
            teamMembers.push(shuffled[memberIndex])
            memberIndex++
          }
        } else {
          const maxForThisTeam = remainingMembers - (remainingTeams - 1)
          const count = maxForThisTeam > 1 ? Math.floor(rng() * maxForThisTeam) + 1 : 1
          
          for (let j = 0; j < count && memberIndex < shuffled.length; j++) {
            teamMembers.push(shuffled[memberIndex])
            memberIndex++
          }
        }
      }

      teams.push({
        id: `team-${i + 1}`,
        value: `Team ${i + 1}: ${teamMembers.join(", ")}`,
        formatted: `Team ${i + 1}: ${teamMembers.join(", ")}`,
        teamName: `Team ${i + 1}`,
        members: teamMembers
      })
    }

    return {
      items: teams,
      meta: {
        seedUsed: ctx.seed,
        count: teams.length,
        generatedAt: Date.now()
      },
      previewText: teams.map(t => t.teamName).join(", ")
    }
  },
  seo: {
    title: "Random Team Generator - Split Groups Fairly | Balanced Teams",
    description: "Split any group into balanced random teams instantly. Perfect for sports, classrooms, hackathons, or projects. Shareable results. 100% free online!",
    h1: "Random Team Generator",
    faq: [
      { question: "How does the team generator work?", answer: "It randomly shuffles your members and distributes them evenly or randomly across the specified number of teams." },
      { question: "Can I create balanced teams?", answer: "Yes. Enable balanced distribution to ensure teams have similar sizes." },
      { question: "Can I customize team names?", answer: "Yes. Teams are named Team 1, Team 2, etc., but you can rename them after generation." },
      { question: "Is the distribution fair?", answer: "Yes. The algorithm ensures unbiased random distribution." },
      { question: "Can I repeat the same team distribution?", answer: "Yes. Using the same seed reproduces the exact same team assignments." },
      { question: "Can I share the team distribution?", answer: "Yes. Shareable links preserve your member list, team count, and seed." }
    ]
  },
  icon: Users,
  popular: true
}

// Secret Santa Generator
export const secretSantaTool: ToolConfig = {
  slug: "secret-santa-generator",
  category: "selection",
  name: "Secret Santa Generator",
  shortDescription: "Generate Secret Santa assignments",
  longDescription: "Generate Secret Santa assignments for your group. Enter names, add exclusions (e.g., 'Alice>Bob' means Alice cannot be assigned to Bob), and get random assignments ensuring no one gets themselves and all exclusions are respected.",
  generatorType: "secret-santa",
  defaultOptions: {
    names: "",
    exclusions: ""
  },
  optionSchema: {
    fields: [
      {
        key: "names",
        label: "Names (one per line)",
        type: "textarea",
        default: "",
        placeholder: "Alice\nBob\nCharlie\nDiana",
        required: true
      },
      {
        key: "exclusions",
        label: "Exclusions (one per line, format: Name1>Name2)",
        type: "textarea",
        default: "",
        placeholder: "Alice>Bob\nCharlie>Diana",
        helpText: "Format: Name1>Name2 means Name1 cannot be assigned to Name2"
      }
    ]
  },
  run: (ctx) => {
    const { names, exclusions } = ctx.options
    const rng = ctx.rng
    
    if (!names || names.trim() === "") {
      return {
        items: [],
        meta: { seedUsed: ctx.seed, count: 0, generatedAt: Date.now() },
        previewText: ""
      }
    }

    const nameList = names.split('\n').map((n: string) => n.trim()).filter((n: string) => n.length > 0)
    const exclusionMap = new Map<string, Set<string>>()
    
    // Parse exclusions
    if (exclusions && exclusions.trim()) {
      exclusions.split('\n').forEach((line: string) => {
        const trimmed = line.trim()
        if (trimmed.includes('>')) {
          const [from, to] = trimmed.split('>').map((s: string) => s.trim())
          if (from && to) {
            if (!exclusionMap.has(from)) {
              exclusionMap.set(from, new Set())
            }
            exclusionMap.get(from)!.add(to)
          }
        }
      })
    }

    if (nameList.length < 2) {
      return {
        items: [],
        meta: { seedUsed: ctx.seed, count: 0, generatedAt: Date.now() },
        previewText: ""
      }
    }

    // Try to generate valid assignments (max 100 attempts)
    let assignments: Array<{ giver: string; receiver: string }> = []
    let attempts = 0
    const maxAttempts = 100

    while (attempts < maxAttempts) {
      const receivers = [...nameList]
      
      // Shuffle receivers
      for (let i = receivers.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1))
        ;[receivers[i], receivers[j]] = [receivers[j], receivers[i]]
      }

      assignments = nameList.map((giver: string, i: number) => ({
        giver,
        receiver: receivers[i]
      }))

      // Check if valid
      let valid = true
      for (const assignment of assignments) {
        // Cannot assign to self
        if (assignment.giver === assignment.receiver) {
          valid = false
          break
        }
        // Check exclusions
        const exclusionsForGiver = exclusionMap.get(assignment.giver)
        if (exclusionsForGiver && exclusionsForGiver.has(assignment.receiver)) {
          valid = false
          break
        }
      }

      if (valid) {
        break
      }

      attempts++
    }

    if (attempts >= maxAttempts) {
      return {
        items: [{
          id: "error",
          value: "Could not generate valid assignments. Try removing some exclusions.",
          formatted: "Could not generate valid assignments. Try removing some exclusions."
        }],
        meta: { seedUsed: ctx.seed, count: 0, generatedAt: Date.now() },
        previewText: "Error: Could not generate valid assignments"
      }
    }

    return {
      items: assignments.map((assignment, i) => ({
        id: `assignment-${i}`,
        value: `${assignment.giver} → ${assignment.receiver}`,
        formatted: `${assignment.giver} → ${assignment.receiver}`,
        giver: assignment.giver,
        receiver: assignment.receiver
      })),
      meta: {
        seedUsed: ctx.seed,
        count: assignments.length,
        generatedAt: Date.now()
      },
      previewText: assignments.slice(0, 3).map(a => `${a.giver}→${a.receiver}`).join(", ")
    }
  },
  seo: {
    title: "Secret Santa Generator - Create Gift Exchange Pairings | Free",
    description: "Generate fair Secret Santa assignments with exclusion rules. No one draws themselves. Perfect for office parties, families, or friend groups. Free online!",
    h1: "Secret Santa Generator",
    faq: [
      { question: "How does Secret Santa assignment work?", answer: "It randomly pairs each person with another, ensuring no one gets themselves and all exclusions are respected." },
      { question: "Can I exclude certain pairings?", answer: "Yes. Use the exclusions field with format 'Name1>Name2' to prevent Name1 from being assigned to Name2." },
      { question: "What if no valid assignment is possible?", answer: "The tool will try up to 100 times. If it fails, try removing some exclusions." },
      { question: "Can I repeat the same assignments?", answer: "Yes. Using the same seed reproduces the exact same assignments." },
      { question: "Can I share the assignments?", answer: "Yes. Shareable links preserve your names, exclusions, and seed." },
      { question: "Is this tool free?", answer: "Yes. No limits or sign-up required." }
    ]
  },
  icon: Users,
  popular: true
}

// Wheel of Names
export const wheelOfNamesTool: ToolConfig = {
  slug: "wheel-of-names",
  category: "selection",
  name: "Wheel of Names",
  shortDescription: "Spin a wheel to pick a random name",
  longDescription: "Spin a virtual wheel to pick a random name or item from your list. Add names, assign optional weights, and let the wheel decide. Every spin uses a seed for repeatability—share your seed to reproduce the exact same result.",
  generatorType: "picker",
  defaultOptions: {
    items: "",
  },
  optionSchema: {
    fields: [
      {
        key: "items",
        label: "Names (one per line, optional weight: name:weight)",
        type: "textarea",
        default: "",
        placeholder: "Alice\nBob\nCharlie:2\nDiana:3",
        required: true
      }
    ]
  },
  run: (ctx) => {
    const { items } = ctx.options
    const rng = ctx.rng

    if (!items || items.trim() === "") {
      return {
        items: [],
        meta: { seedUsed: ctx.seed, count: 0, generatedAt: Date.now() },
        previewText: ""
      }
    }

    const lines = items.split('\n').map((l: string) => l.trim()).filter((l: string) => l.length > 0)
    const wheelItems: Array<{ name: string; weight: number }> = []
    const seen = new Set<string>()

    for (const line of lines) {
      const colonIndex = line.lastIndexOf(':')
      if (colonIndex > 0) {
        const name = line.substring(0, colonIndex).trim()
        const weightStr = line.substring(colonIndex + 1).trim()
        const weight = parseFloat(weightStr)
        if (name && !isNaN(weight) && weight >= 0 && !seen.has(name.toLowerCase())) {
          wheelItems.push({ name, weight: Math.max(0, weight) })
          seen.add(name.toLowerCase())
        } else if (name && !seen.has(name.toLowerCase())) {
          wheelItems.push({ name, weight: 1 })
          seen.add(name.toLowerCase())
        }
      } else if (!seen.has(line.toLowerCase())) {
        wheelItems.push({ name: line, weight: 1 })
        seen.add(line.toLowerCase())
      }
    }

    if (wheelItems.length === 0) {
      return {
        items: [],
        meta: { seedUsed: ctx.seed, count: 0, generatedAt: Date.now() },
        previewText: ""
      }
    }

    const totalWeight = wheelItems.reduce((sum, item) => sum + item.weight, 0)
    let random = rng() * totalWeight
    let selectedIndex = wheelItems.length - 1

    for (let i = 0; i < wheelItems.length; i++) {
      random -= wheelItems[i].weight
      if (random <= 0) {
        selectedIndex = i
        break
      }
    }

    const winner = wheelItems[selectedIndex]

    return {
      items: [{
        id: "winner",
        value: winner.name,
        formatted: winner.name,
        index: selectedIndex,
        isWinner: true
      }],
      meta: {
        seedUsed: ctx.seed,
        count: 1,
        generatedAt: Date.now()
      },
      previewText: winner.name
    }
  },
  seo: {
    title: "Wheel of Names - Spin & Pick a Random Winner | Free Online",
    description: "Spin a colorful virtual wheel to pick a random name or item. Add weights, customize colors, share results. Perfect for giveaways & classrooms. Free!",
    h1: "Wheel of Names",
    faq: [
      { question: "How do I use the Wheel of Names?", answer: "Enter a list of names (one per line), optionally set weights (format: name:weight), then click 'Spin' to pick a random winner." },
      { question: "How do I set weights?", answer: "Use the format 'name:weight', e.g., 'Alice:2' means Alice has a weight of 2. Higher weight means higher probability of being selected." },
      { question: "Can I add duplicate names?", answer: "Duplicate names are automatically removed. Each name appears only once." },
      { question: "Can I share the result?", answer: "Yes. Click the share button to generate a link with the seed parameter. Others will see the same wheel and result." },
      { question: "How many names can I add?", answer: "There is no hard limit, but we recommend up to 100 names for best performance." },
      { question: "Is the result repeatable?", answer: "Yes. Using the same seed and names will always produce the same winner." }
    ]
  },
  icon: CircleDot,
  popular: true
}

export const selectionTools: ToolConfig[] = [
  randomPickerTool,
  randomTeamTool,
  secretSantaTool,
  wheelOfNamesTool
]
