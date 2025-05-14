"use client"

import { useState, useEffect } from "react"

/**
 * Custom hook for responsive design
 *
 * This hook allows components to respond to media query changes
 * It's optimized to only run on the client side and handles cleanup properly
 *
 * @param {string} query - CSS media query string
 * @returns {boolean} - Whether the media query matches
 */
export function useMediaQuery(query: string): boolean {
  // Initialize with null and update after mount to avoid hydration mismatch
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    // Create media query list
    const media = window.matchMedia(query)

    // Set initial value
    setMatches(media.matches)

    // Define listener function
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    // Add listener
    media.addEventListener("change", listener)

    // Clean up
    return () => {
      media.removeEventListener("change", listener)
    }
  }, [query]) // Only re-run if query changes

  return matches
}
