"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { Profile } from "@/lib/profile-service"

interface ProfileContextType {
  profile: Profile | null
  isLoading: boolean
  error: string | null
  updateProfile: (data: Partial<Profile>) => Promise<boolean>
  refreshProfile: () => Promise<void>
}

// Default mock profile for when API fails or during development
const DEFAULT_PROFILE: Profile = {
  id: "mock-id",
  user_id: "mock-user-id",
  full_name: "John Doe",
  email: "john.doe@example.com",
  role: "teacher",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Try to load from localStorage first for immediate display
      const savedProfile = localStorage.getItem("gradiant-profile")
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile))
      }

      const response = await fetch("/api/profile")

      if (!response.ok) {
        // If the API fails, use the default profile
        console.warn("Failed to fetch profile from API, using default profile.")
        setProfile(DEFAULT_PROFILE)
        localStorage.setItem("gradiant-profile", JSON.stringify(DEFAULT_PROFILE))
        return
      }

      const data = await response.json()

      if (data.profile) {
        setProfile(data.profile)
        localStorage.setItem("gradiant-profile", JSON.stringify(data.profile))
      } else {
        // If the API returns no profile, use the default profile
        setProfile(DEFAULT_PROFILE)
        localStorage.setItem("gradiant-profile", JSON.stringify(DEFAULT_PROFILE))
      }
    } catch (err) {
      console.error("Error fetching profile:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")

      // If there's an error, use the default profile
      setProfile(DEFAULT_PROFILE)
      localStorage.setItem("gradiant-profile", JSON.stringify(DEFAULT_PROFILE))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  const updateProfile = async (data: Partial<Profile>): Promise<boolean> => {
    setIsLoading(true)
    setError(null)

    try {
      // Update local state immediately for responsiveness
      const updatedProfile = { ...profile, ...data } as Profile
      setProfile(updatedProfile)

      // Save to localStorage for persistence
      localStorage.setItem("gradiant-profile", JSON.stringify(updatedProfile))

      // Try to save to the server
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ profile: data }),
      })

      if (!response.ok) {
        console.warn("Failed to update profile on server, but local state is updated.")
      }

      return true
    } catch (err) {
      console.error("Error updating profile:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const refreshProfile = async () => {
    await fetchProfile()
  }

  return (
    <ProfileContext.Provider value={{ profile, isLoading, error, updateProfile, refreshProfile }}>
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfile() {
  const context = useContext(ProfileContext)
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider")
  }
  return context
}
