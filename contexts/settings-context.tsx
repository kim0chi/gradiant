"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

interface Settings {
  theme?: "light" | "dark" | "system"
  sidebarCollapsed?: boolean
  emailNotifications?: boolean
  pushNotifications?: boolean
  defaultGradeView?: "table" | "card"
  showGradePercentages?: boolean
  defaultCalendarView?: "month" | "week" | "day"
  showWeekends?: boolean
  bio?: string
  [key: string]: any
}

interface SettingsContextType {
  settings: Settings
  updateSettings: (newSettings: Partial<Settings>) => Promise<void>
  isSaving: boolean
}

const DEFAULT_SETTINGS: Settings = {
  theme: "system",
  sidebarCollapsed: false,
  emailNotifications: true,
  pushNotifications: false,
  defaultGradeView: "table",
  showGradePercentages: true,
  defaultCalendarView: "month",
  showWeekends: true,
  bio: "",
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load settings on initial mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        // Try to load from localStorage first for immediate display
        const savedSettings = localStorage.getItem("gradiant-settings")
        if (savedSettings) {
          setSettings(JSON.parse(savedSettings))
        }

        // Then try to load from the server
        const response = await fetch("/api/settings")
        if (response.ok) {
          const data = await response.json()
          if (data.settings) {
            setSettings(data.settings)
            localStorage.setItem("gradiant-settings", JSON.stringify(data.settings))
          }
        }
      } catch (error) {
        console.error("Failed to load settings:", error)
      } finally {
        setIsLoaded(true)
      }
    }

    loadSettings()
  }, [])

  const updateSettings = async (newSettings: Partial<Settings>) => {
    setIsSaving(true)
    try {
      // Update local state immediately for responsiveness
      const updatedSettings = { ...settings, ...newSettings }
      setSettings(updatedSettings)

      // Save to localStorage for persistence
      localStorage.setItem("gradiant-settings", JSON.stringify(updatedSettings))

      // Save to server in the background
      await fetch("/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ settings: updatedSettings }),
      })
    } catch (error) {
      console.error("Failed to save settings:", error)
    } finally {
      setIsSaving(false)
    }
  }

  return <SettingsContext.Provider value={{ settings, updateSettings, isSaving }}>{children}</SettingsContext.Provider>
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider")
  }
  return context
}
