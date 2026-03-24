"use client"

import { useCallback } from "react"

export function useCommandPalette() {
  const openPalette = useCallback(() => {
    // Dispatch custom event to open command palette
    const event = new CustomEvent("open-command-palette")
    window.dispatchEvent(event)
  }, [])

  return { openPalette }
}
