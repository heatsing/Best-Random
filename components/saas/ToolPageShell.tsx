import type { ReactNode } from "react"
import type { SaasToolDefinition } from "@/lib/saas-tools"
import { Breadcrumbs } from "./Breadcrumbs"
import { RelatedTools } from "./RelatedTools"

const categoryLabel: Record<SaasToolDefinition["category"], string> = {
  generators: "Generators",
  selection: "Selection",
  utilities: "Utilities",
}

interface ToolPageShellProps {
  tool: SaasToolDefinition
  children: ReactNode
}

export function ToolPageShell({ tool, children }: ToolPageShellProps) {
  return (
    <div className="relative">
      <div className="container max-w-3xl mx-auto px-4 sm:px-6 py-10 md:py-14">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Tools", href: "/tools" },
            { label: tool.name },
          ]}
        />

        <header className="mt-8 mb-8 md:mb-10">
          <p className="mb-3">
            <span className="inline-flex items-center rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {categoryLabel[tool.category]}
            </span>
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-balance">{tool.name}</h1>
          <p className="mt-3 text-lg text-muted-foreground leading-relaxed max-w-2xl">{tool.tagline}</p>
        </header>

        <div className="rounded-2xl border border-border bg-card shadow-[0_1px_0_0_hsl(var(--border))] overflow-hidden">
          <div className="p-6 sm:p-8">{children}</div>
        </div>

        <RelatedTools current={tool} />
      </div>
    </div>
  )
}
