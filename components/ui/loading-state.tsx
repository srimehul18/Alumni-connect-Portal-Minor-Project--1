"use client"

import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

interface LoadingStateProps {
  title?: string
  description?: string
  className?: string
  size?: "sm" | "md" | "lg"
}

export function LoadingState({
  title = "Loading",
  description = "Please wait...",
  className,
  size = "md",
}: LoadingStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 px-4 text-center space-y-4", className)}>
      <Spinner className={cn(size === "sm" && "h-6 w-6", size === "md" && "h-8 w-8", size === "lg" && "h-12 w-12")} />

      <div>
        <h3 className="text-sm font-medium text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </div>
    </div>
  )
}
