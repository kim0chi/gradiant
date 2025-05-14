"use client"

import type * as React from "react"

/**
 * Slot Component
 *
 * This component is used to render children directly without adding any
 * additional DOM elements. It's useful for passing children through
 * to another component or element.
 *
 * In the context of the App Router, it helps ensure proper rendering
 * of child components within layouts.
 */
export function Slot({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
