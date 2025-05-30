"use client"

import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "@/types/supabase"

// Create a singleton instance of the Supabase client to prevent multiple instances
let supabaseInstance: ReturnType<typeof createBrowserClient<Database>> | null = null

export const createClient = () => {
  if (!supabaseInstance) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Missing Supabase environment variables")
      throw new Error("Missing Supabase environment variables")
    }

    console.log("Initializing Supabase client with URL:", supabaseUrl)

    supabaseInstance = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
  }

  return supabaseInstance
}

// Export the Supabase client for direct usage
export const supabase = createClient()

// Helper function to get the current user
export async function getCurrentUser() {
  const client = createClient()
  const { data, error } = await client.auth.getUser()

  if (error || !data.user) {
    console.error("Error getting user:", error)
    return null
  }

  // Get the user's profile from the profiles table
  const { data: profile, error: profileError } = await client
    .from("profiles")
    .select("*")
    .eq("id", data.user.id)
    .single()

  if (profileError || !profile) {
    console.error("Error getting user profile:", profileError)
    // Return basic user info even if profile fetch fails
    return {
      id: data.user.id,
      email: data.user.email || "",
      role: "student", // Default role
      full_name: data.user.user_metadata?.full_name || "",
    }
  }

  return {
    ...profile,
    id: data.user.id,
    email: data.user.email || "",
  }
}

// Helper function to check if a user is authenticated
export async function isAuthenticated() {
  const client = createClient()
  const { data } = await client.auth.getSession()
  return !!data.session
}
