"use client"

import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"
import { useState } from "react"
import { copyToClipboard } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"

interface CopyButtonProps {
  text: string
  label?: string
  className?: string
}

export function CopyButton({ text, label = "复制", className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const handleCopy = async () => {
    try {
      await copyToClipboard(text)
      setCopied(true)
      toast({
        title: "已复制",
        description: "内容已复制到剪贴板",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast({
        title: "复制失败",
        description: "无法复制到剪贴板",
        variant: "destructive",
      })
    }
  }

  return (
    <Button
      onClick={handleCopy}
      variant="outline"
      size="sm"
      className={className}
      aria-label={label}
    >
      {copied ? (
        <>
          <Check className="mr-2 h-4 w-4" />
          已复制
        </>
      ) : (
        <>
          <Copy className="mr-2 h-4 w-4" />
          {label}
        </>
      )}
    </Button>
  )
}
