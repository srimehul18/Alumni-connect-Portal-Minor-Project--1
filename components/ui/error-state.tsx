"use client"

import { AlertTriangle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ErrorStateProps {
  title?: string
  description?: string
  errorCode?: number | string
  retryAction?: () => void
  className?: string
}

export function ErrorState({
  title = "Something went wrong",
  description = "We encountered an error. Please try again.",
  errorCode,
  retryAction,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 px-4 text-center space-y-4 animate-in-up",
        className,
      )}
    >
      {/* Error icon with animation */}
      <div className="relative">
        <div className="absolute inset-0 bg-destructive/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 relative z-10 group hover:bg-destructive/20 transition-colors duration-300">
          <AlertTriangle className="h-8 w-8 text-destructive animate-pulse" />
        </div>
      </div>

      {/* Content */}
      <div>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm">{description}</p>
      </div>

      {/* Error code */}
      {errorCode && (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted/50 border border-border/50">
          <span className="text-xs font-mono text-muted-foreground">Error: {errorCode}</span>
        </div>
      )}

      {/* Retry button */}
      {retryAction && (
        <Button onClick={retryAction} variant="default" size="sm" className="magnetic-hover gap-2 mt-2">
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
      )}

      {/* Support hint */}
      <p className="text-xs text-muted-foreground">
        If the problem persists, please{" "}
        <Button variant="link" size="sm" className="h-auto p-0 underline">
          contact support
        </Button>
      </p>
    </div>
  )
}
