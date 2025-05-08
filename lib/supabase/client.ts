import { createClient } from "@supabase/supabase-js"
import { isDebugMode, createMockClient, getMockUser } from "@/lib/mockAuth"
import type { Database } from "@/types/supabase"

let supabaseInstance: ReturnType<typeof createClient> | null = null

// Create a real Supabase client
const createRealClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase environment variables")
    throw new Error("Missing Supabase environment variables")
  }

  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
    global: {
      fetch: (url, options) => {
        return fetch(url, {
          ...options,
          signal: AbortSignal.timeout(15000), // 15 second timeout
        })
      },
    },
  })
}

// Create a mock client for testing
const mockClient = createMockClient()

// Get the Supabase client (real or mock)
export const createBrowserClient = () => {
  if (isDebugMode()) {
    return mockClient
  }

  if (!supabaseInstance) {
    supabaseInstance = createRealClient()
  }

  return supabaseInstance
}

// Export the Supabase client
export const supabase = isDebugMode() ? mockClient : createBrowserClient()

// Helper function to get the current user
export async function getCurrentUser() {
  if (isDebugMode()) {
    const mockUser = getMockUser()
    if (!mockUser) return null

    return {
      id: mockUser.id,
      email: mockUser.email,
      role: mockUser.role,
      user_metadata: {
        full_name: mockUser.name,
      },
    }
  }

  // Use the real Supabase client
  const client = createBrowserClient()
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
      user_metadata: {
        full_name: data.user.user_metadata?.full_name || "",
      },
    }
  }

  return {
    id: data.user.id,
    email: data.user.email || "",
    role: profile.role,
    user_metadata: {
      full_name: profile.full_name || "",
    },
  }
}

// Helper function to check if a user is authenticated
export async function isAuthenticated() {
  if (isDebugMode()) {
    return !!getMockUser()
  }

  const client = createBrowserClient()
  const { data } = await client.auth.getSession()
  return !!data.session
}

// Helper function to check if the current device is mobile
export function isMobileDevice() {
  if (typeof window === "undefined") return false
  return window.innerWidth < 768
}
