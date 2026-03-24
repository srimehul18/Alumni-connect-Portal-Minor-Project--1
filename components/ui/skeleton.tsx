import type React from "react"
import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-accent/50 animate-pulse rounded-md skeleton-shimmer", className)}
      {...props}
    />
  )
}

interface CardSkeletonProps {
  lines?: number
  className?: string
}

export function CardSkeleton({ lines = 3, className }: CardSkeletonProps) {
  return (
    <div className={cn("space-y-3 p-4", className)}>
      <Skeleton className="h-4 w-32" />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className="h-3 w-full" />
      ))}
      <Skeleton className="h-9 w-20" />
    </div>
  )
}

interface SkeletonLineProps {
  width?: string | number
  height?: string | number
  className?: string
}

export function SkeletonLine({ width = "100%", height = "1rem", className }: SkeletonLineProps) {
  return <Skeleton style={{ width, height }} className={className} />
}

interface SkeletonCircleProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export function SkeletonCircle({ size = "md", className }: SkeletonCircleProps) {
  const sizeClass = size === "sm" ? "h-8 w-8" : size === "md" ? "h-12 w-12" : size === "lg" ? "h-16 w-16" : "h-12 w-12"
  return <Skeleton className={cn("rounded-full", sizeClass, className)} />
}

interface ListSkeletonProps {
  count?: number
  className?: string
}

export function ListSkeleton({ count = 3, className }: ListSkeletonProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex gap-3">
          <SkeletonCircle size="sm" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

interface TableSkeletonProps {
  rows?: number
  columns?: number
  className?: string
}

export function TableSkeleton({ rows = 5, columns = 4, className }: TableSkeletonProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-2">
          {Array.from({ length: columns }).map((_, j) => (
            <Skeleton key={j} className="h-10 flex-1" />
          ))}
        </div>
      ))}
    </div>
  )
}

export { Skeleton }
