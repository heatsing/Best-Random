// This file will import and export all tool definitions
// Tools are organized by category for better maintainability

import { numbersTools } from "./numbers"
import { textTools } from "./text"
import { selectionTools } from "./selection"
import { designTools } from "./design"
import { securityTools } from "./security"
import { utilitiesTools } from "./utilities"
import { funTools } from "./fun"

// Games tools are currently in numbers.ts (dice, coin flip)
// Extract them later if needed
export const gamesTools: any[] = []

export const allTools = [
  ...numbersTools,
  ...textTools,
  ...selectionTools,
  ...designTools,
  ...securityTools,
  ...utilitiesTools,
  ...funTools,
  ...gamesTools,
]
