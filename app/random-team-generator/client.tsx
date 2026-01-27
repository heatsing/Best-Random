"use client"

import { useState, useEffect, useCallback } from "react"
import { generateTeams, type TeamGeneratorParams } from "@/lib/generators/team"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { GeneratorLayout } from "@/components/GeneratorLayout"
import { RollingReveal } from "@/components/RollingReveal"
import { useSearchParams, useRouter } from "next/navigation"
import { getToolBySlug } from "@/lib/tool-registry"
import { saveToHistory } from "@/lib/history"
import Script from "next/script"
import { generateFAQSchema } from "@/lib/seo"
import { Users, Copy } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function RandomTeamGeneratorClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const tool = getToolBySlug("random-team-generator")!
  const { toast } = useToast()
  
  const [membersText, setMembersText] = useState(searchParams.get("members") || "")
  const [teamCount, setTeamCount] = useState(Number(searchParams.get("teamCount")) || 2)
  const [balanced, setBalanced] = useState(searchParams.get("balanced") !== "false")
  const [seed, setSeed] = useState(searchParams.get("seed") || "")
  const [result, setResult] = useState<ReturnType<typeof generateTeams> | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const members = membersText
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)

  const getOrCreateSeed = useCallback(() => {
    if (seed) return seed
    const newSeed = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    setSeed(newSeed)
    return newSeed
  }, [seed])

  const generate = useCallback(() => {
    if (members.length === 0) {
      toast({
        title: "No members",
        description: "Please enter at least one member",
        variant: "destructive",
      })
      return
    }

    if (teamCount < 1 || teamCount > members.length) {
      toast({
        title: "Invalid team count",
        description: `Team count must be between 1 and ${members.length}`,
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    
    setTimeout(() => {
      const currentSeed = getOrCreateSeed()
      const params: TeamGeneratorParams = {
        members,
        teamCount,
        balanced,
        seed: currentSeed,
      }
      
      const newResult = generateTeams(params)
      setResult(newResult)
      
      saveToHistory({
        toolSlug: tool.slug,
        seed: currentSeed,
        params,
        outputPreview: `${newResult.teams.length} teams created`,
        timestamp: Date.now(),
      })
      
      updateURL(currentSeed, params)
      setIsGenerating(false)
    }, 100)
  }, [members, teamCount, balanced, seed, getOrCreateSeed, tool.slug, toast])

  const reroll = useCallback(() => {
    const newSeed = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    setSeed(newSeed)
    generate()
  }, [generate])

  const repeat = useCallback(() => {
    generate()
  }, [generate])

  const updateURL = (currentSeed: string, params: TeamGeneratorParams) => {
    const url = new URL(window.location.href)
    url.searchParams.set("members", membersText)
    url.searchParams.set("teamCount", String(params.teamCount))
    url.searchParams.set("balanced", String(params.balanced))
    url.searchParams.set("seed", currentSeed)
    router.replace(url.pathname + url.search, { scroll: false })
  }

  useEffect(() => {
    const urlSeed = searchParams.get("seed")
    const urlMembers = searchParams.get("members")
    if (urlSeed && urlMembers) {
      setSeed(urlSeed)
      setMembersText(urlMembers)
      // Don't auto-generate on load, let user click
    }
  }, [])

  const shareUrl = () => {
    const currentSeed = seed || getOrCreateSeed()
    const params = new URLSearchParams({
      members: membersText,
      teamCount: String(teamCount),
      balanced: String(balanced),
      seed: currentSeed,
    })
    return `${window.location.origin}/random-team-generator?${params.toString()}`
  }

  const handleCopyTeam = (team: { name: string; members: string[] }) => {
    const text = `${team.name}: ${team.members.join(', ')}`
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied",
      description: `${team.name} copied to clipboard`,
    })
  }

  const handleCopyAll = () => {
    if (!result) return
    const text = result.teams
      .map(team => `${team.name}: ${team.members.join(', ')}`)
      .join('\n')
    navigator.clipboard.writeText(text)
    toast({
      title: "All teams copied",
      description: "All teams copied to clipboard",
    })
  }

  return (
    <>
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFAQSchema(tool.faqs)) }}
      />
      <GeneratorLayout
        tool={tool}
        seed={seed || getOrCreateSeed()}
        onRepeat={repeat}
        onReroll={reroll}
        onCopy={handleCopyAll}
        onShare={shareUrl}
      >
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="members">Members (one per line)</Label>
              <Textarea
                id="members"
                value={membersText}
                onChange={(e) => setMembersText(e.target.value)}
                placeholder="Alice&#10;Bob&#10;Charlie&#10;Diana"
                rows={10}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Enter one member name per line
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="teamCount">Number of Teams: {teamCount}</Label>
              <Input
                id="teamCount"
                type="number"
                value={teamCount}
                onChange={(e) => setTeamCount(Number(e.target.value))}
                min={1}
                max={members.length || 100}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="balanced"
                checked={balanced}
                onCheckedChange={setBalanced}
              />
              <Label htmlFor="balanced">Balanced distribution (equal team sizes)</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="seed">Seed (optional, for reproducibility)</Label>
              <Input
                id="seed"
                value={seed}
                onChange={(e) => setSeed(e.target.value)}
                placeholder="Leave empty for random seed"
              />
            </div>

            <Button 
              onClick={repeat} 
              className="w-full"
              disabled={members.length === 0 || isGenerating}
            >
              {isGenerating ? "Generating..." : "Generate Teams"}
            </Button>

            {members.length > 0 && (
              <div className="text-sm text-muted-foreground">
                {members.length} member{members.length !== 1 ? 's' : ''} ready
                {balanced && teamCount > 0 && (
                  <span className="ml-2">
                    ({Math.floor(members.length / teamCount)} per team, {members.length % teamCount} extra)
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="space-y-4">
            {isGenerating ? (
              <div className="border rounded-lg p-12 text-center text-muted-foreground">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                Generating teams...
              </div>
            ) : result && result.teams.length > 0 ? (
              <RollingReveal delay={300}>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Teams</h2>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyAll}
                      className="gap-2"
                    >
                      <Copy className="h-4 w-4" />
                      Copy All
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {result.teams.map((team, index) => (
                      <RollingReveal key={team.id} delay={300 + index * 100}>
                        <div className="border rounded-lg p-4 bg-card">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-primary" />
                              <h3 className="font-semibold">{team.name}</h3>
                              <span className="text-xs text-muted-foreground">
                                ({team.members.length} member{team.members.length !== 1 ? 's' : ''})
                              </span>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleCopyTeam(team)}
                              className="h-8 w-8"
                              aria-label={`Copy ${team.name}`}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {team.members.map((member, memberIndex) => (
                              <span
                                key={memberIndex}
                                className="px-2 py-1 bg-muted rounded text-sm"
                              >
                                {member}
                              </span>
                            ))}
                          </div>
                        </div>
                      </RollingReveal>
                    ))}
                  </div>
                </div>
              </RollingReveal>
            ) : (
              <div className="border rounded-lg p-12 text-center text-muted-foreground">
                Click "Generate Teams" to start
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 space-y-4">
          <h2 className="text-2xl font-semibold">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {tool.faqs.map((faq, i) => (
              <div key={i} className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </GeneratorLayout>
    </>
  )
}
