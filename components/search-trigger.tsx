"use client"

import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { useEffect, useState } from "react"

interface SearchTriggerProps {
  onClick?: () => void
}

export function SearchTrigger({ onClick }: SearchTriggerProps) {
  const [isMac, setIsMac] = useState(false)

  useEffect(() => {
    setIsMac(typeof window !== "undefined" && /Mac|iPhone|iPad|iPod/.test(navigator.platform))
  }, [])

  return (
    <Button
      variant="outline"
      size="sm"
      className="w-full max-w-xs justify-between bg-muted/50 hover:bg-muted"
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Search...</span>
      </div>
      <kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
        <span className="text-xs">{isMac ? "⌘" : "Ctrl"}</span>K
      </kbd>
    </Button>
  )
}
