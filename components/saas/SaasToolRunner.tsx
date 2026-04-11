"use client"

import type { ReactNode } from "react"
import { getSaasTool } from "@/lib/saas-tools"
import { ToolPageShell } from "./ToolPageShell"
import { RandomNameDemo } from "./demo/RandomNameDemo"
import { RandomNumberDemo } from "./demo/RandomNumberDemo"
import { RandomPickerDemo } from "./demo/RandomPickerDemo"

interface SaasToolRunnerProps {
  /** Pass slug only — registry includes icon components and cannot be serialized from RSC. */
  slug: string
}

/**
 * Maps registry slugs to demo UI — add new cases as you add tools.
 * Keeps each tool as an isolated, testable surface.
 */
export function SaasToolRunner({ slug }: SaasToolRunnerProps) {
  const tool = getSaasTool(slug)
  if (!tool) {
    return null
  }
  let body: ReactNode
  switch (tool.slug) {
    case "random-name-generator":
      body = <RandomNameDemo />
      break
    case "random-number-generator":
      body = <RandomNumberDemo />
      break
    case "random-picker":
      body = <RandomPickerDemo />
      break
    default:
      body = (
        <p className="text-muted-foreground">
          This tool is registered but has no UI module yet. Add it in{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">SaasToolRunner</code>.
        </p>
      )
  }

  return <ToolPageShell tool={tool}>{body}</ToolPageShell>
}
