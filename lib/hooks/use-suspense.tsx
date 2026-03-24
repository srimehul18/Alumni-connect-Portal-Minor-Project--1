"use client"

import { Suspense } from "react"
import type React from "react"

interface UseSuspenseConfig {
  fallback?: React.ReactNode
  showAfterMs?: number
}

/**
 * Hook to easily wrap components with Suspense boundaries
 * and configure loading states
 */
export function useSuspense({ fallback = null, showAfterMs = 0 }: UseSuspenseConfig = {}) {
  return {
    Boundary: ({ children }: { children: React.ReactNode }) => <Suspense fallback={fallback}>{children}</Suspense>,
  }
}
