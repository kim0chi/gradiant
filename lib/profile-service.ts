import { supabase } from "@/lib/supabase"

export interface Profile {
  id: string
  user_id: string
  full_name: string
  email: string
  avatar_url?: string
  role: "admin" | "teacher" | "student"
  created_at: string
  updated_at: string
}

/**
 * Gets the current user's profile
 */
export async function getUserProfile(): Promise<Profile | null> {

  // First, get the current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    console.error("Error getting user:", userError)
    return null
  }

  // For demo purposes, return a mock profile
  // In a real app, you would query your profiles table
  return {
    id: user.id,
    user_id: user.id,
    full_name: "John Doe", // This would come from your database
    email: user.email || "demo@example.com",
    role: "teacher", // This would come from your database
    created_at: user.created_at || new Date().toISOString(),
    updated_at: user.updated_at || new Date().toISOString(),
  }
}

/**
 * Updates the current user's profile
 */
export async function updateUserProfile(data: Partial<Profile>): Promise<Profile | null> {

  // First, get the current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    console.error("Error getting user:", userError)
    return null
  }

  // In a real app, you would update your profiles table
  // For demo purposes, we'll just return the updated profile

  // Simulate a delay to mimic a database operation
  await new Promise((resolve) => setTimeout(resolve, 500))

  return {
    id: user.id,
    user_id: user.id,
    full_name: data.full_name || "John Doe",
    email: user.email || "demo@example.com",
    avatar_url: data.avatar_url,
    role: "teacher",
    created_at: user.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
}
