"use client"

import { useEffect, useRef, useState } from "react"

interface UseIntersectVisibleOptions {
  threshold?: number | number[]
  rootMargin?: string
}

/**
 * Hook to detect when an element becomes visible in the viewport
 * Useful for lazy loading and performance optimization
 */
export function useIntersectVisible(options: UseIntersectVisibleOptions = {}) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true)
        observer.unobserve(entry.target)
      }
    }, options)

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [options])

  return { ref, isVisible }
}
