import type { ReactNode } from "react"

export default function ToolsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-background via-muted/15 to-background">
      {children}
    </div>
  )
}
