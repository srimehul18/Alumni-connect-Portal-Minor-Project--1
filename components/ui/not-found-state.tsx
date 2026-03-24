"use client"

import { Search, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface NotFoundStateProps {
  title?: string
  description?: string
  searchQuery?: string
  backHref?: string
  className?: string
}

export function NotFoundState({
  title = "No results found",
  description = "Try adjusting your search or filters",
  searchQuery,
  backHref,
  className,
}: NotFoundStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 px-4 text-center space-y-4 animate-in-up",
        className,
      )}
    >
      {/* Search icon */}
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/50">
        <Search className="h-8 w-8 text-muted-foreground" />
      </div>

      {/* Content */}
      <div>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm">{description}</p>
        {searchQuery && (
          <p className="text-xs text-muted-foreground mt-2">
            No matches for <span className="font-medium text-foreground">&quot;{searchQuery}&quot;</span>
          </p>
        )}
      </div>

      {/* Actions */}
      {backHref && (
        <Button variant="outline" size="sm" className="magnetic-hover gap-2 bg-transparent" asChild>
          <Link href={backHref}>
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Link>
        </Button>
      )}
    </div>
  )
}
