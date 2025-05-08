import { supabase } from "@/lib/supabase/client"
import type { Database } from "@/types/supabase"

export type User = Database["public"]["Tables"]["profiles"]["Row"]
export type UserRole = "admin" | "teacher" | "student"

// Fetch all users with optional filter by role
export async function getUsers(role?: UserRole) {
  try {
    console.log("Fetching users with role:", role || "all")

    let query = supabase.from("profiles").select("*")

    if (role) {
      query = query.eq("role", role)
    }

    // Apply ordering after all filters have been applied
    query = query.order("created_at", { ascending: false })

    const { data, error } = await query

    if (error) {
      console.error("Supabase error fetching users:", error)
      throw error
    }

    console.log(`Found ${data?.length || 0} users`)

    return { data, error: null }
  } catch (error: any) {
    console.error("Error fetching users:", error)
    return { data: null, error }
  }
}

// Fetch a single user by ID
export async function getUserById(id: string) {
  try {
    console.log("Fetching user by ID:", id)

    const { data, error } = await supabase.from("profiles").select("*").eq("id", id).single()

    if (error) {
      console.error("Supabase error fetching user by ID:", error)
      throw error
    }

    return { data, error: null }
  } catch (error: any) {
    console.error("Error fetching user:", error)
    return { data: null, error }
  }
}

// Create a new user
export async function createUser({
  email,
  password,
  fullName,
  role,
}: {
  email: string
  password: string
  fullName: string
  role: UserRole
}) {
  try {
    console.log("Creating new user:", email, "with role:", role)

    // Create the user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        role,
      },
    })

    if (authError) {
      console.error("Supabase auth error creating user:", authError)
      throw authError
    }

    if (!authData.user) {
      const error = new Error("Failed to create user account")
      console.error(error)
      throw error
    }

    // The profile should be created automatically by the database trigger
    // Let's fetch it to confirm and return it
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authData.user.id)
      .single()

    if (profileError) {
      console.log("Profile not found after user creation, creating manually")

      // If there was an error fetching the profile, it might not have been created
      // Let's create it manually
      const { data: newProfileData, error: newProfileError } = await supabase
        .from("profiles")
        .insert({
          id: authData.user.id,
          email,
          full_name: fullName,
          role,
        })
        .select()
        .single()

      if (newProfileError) {
        console.error("Error creating profile manually:", newProfileError)
        throw newProfileError
      }

      console.log("Profile created manually:", newProfileData)
      return { data: newProfileData, error: null }
    }

    console.log("User created successfully:", profileData)
    return { data: profileData, error: null }
  } catch (error: any) {
    console.error("Error creating user:", error)
    return { data: null, error }
  }
}

// Update a user
export async function updateUser(
  id: string,
  { email, fullName, role }: { email?: string; fullName?: string; role?: UserRole },
) {
  try {
    console.log("Updating user:", id, { email, fullName, role })

    // Update profile
    const updateData: Record<string, any> = {}

    if (fullName !== undefined) updateData.full_name = fullName
    if (role !== undefined) updateData.role = role

    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .update(updateData)
      .eq("id", id)
      .select()
      .single()

    if (profileError) {
      console.error("Supabase error updating profile:", profileError)
      throw profileError
    }

    // Update email if provided
    if (email !== undefined) {
      const { error: emailError } = await supabase.auth.admin.updateUserById(id, {
        email,
        user_metadata: {
          full_name: fullName || profileData.full_name,
          role: role || profileData.role,
        },
      })

      if (emailError) {
        console.error("Supabase error updating email:", emailError)
        throw emailError
      }
    }

    console.log("User updated successfully:", profileData)
    return { data: profileData, error: null }
  } catch (error: any) {
    console.error("Error updating user:", error)
    return { data: null, error }
  }
}

// Delete a user
export async function deleteUser(id: string) {
  try {
    console.log("Deleting user:", id)

    // Delete the user from Auth
    const { error: authError } = await supabase.auth.admin.deleteUser(id)

    if (authError) {
      console.error("Supabase error deleting user:", authError)
      throw authError
    }

    // Profile will be automatically deleted by Supabase RLS policies and cascade delete
    console.log("User deleted successfully")
    return { success: true, error: null }
  } catch (error: any) {
    console.error("Error deleting user:", error)
    return { success: false, error }
  }
}

// Send password reset email
export async function sendPasswordResetEmail(email: string) {
  try {
    console.log("Sending password reset email to:", email)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })

    if (error) {
      console.error("Supabase error sending password reset:", error)
      throw error
    }

    console.log("Password reset email sent successfully")
    return { success: true, error: null }
  } catch (error: any) {
    console.error("Error sending password reset email:", error)
    return { success: false, error }
  }
}

// Get current user profile
export async function getCurrentUserProfile() {
  try {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

    if (sessionError) {
      console.error("Supabase error getting session:", sessionError)
      throw sessionError
    }

    if (!sessionData.session) {
      console.log("No active session found")
      return { data: null, error: null }
    }

    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", sessionData.session.user.id)
      .single()

    if (profileError) {
      console.error("Supabase error getting profile:", profileError)
      throw profileError
    }

    return { data: profileData, error: null }
  } catch (error: any) {
    console.error("Error getting current user profile:", error)
    return { data: null, error }
  }
}

// Check if user has a specific role
export async function hasRole(role: UserRole) {
  try {
    const { data, error } = await getCurrentUserProfile()

    if (error) throw error

    return data?.role === role
  } catch (error) {
    console.error("Error checking user role:", error)
    return false
  }
}

// Get user activity log (mock implementation)
export async function getUserActivityLog(userId: string) {
  // This is a mock implementation
  // In a real application, you would fetch this from a database
  return {
    data: [
      {
        id: "1",
        userId,
        action: "Login",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        ipAddress: "192.168.1.1",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      {
        id: "2",
        userId,
        action: "Profile Update",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
        ipAddress: "192.168.1.1",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      {
        id: "3",
        userId,
        action: "Password Reset",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
        ipAddress: "192.168.1.1",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    ],
    error: null,
  }
}

// Create a test user for development purposes
export async function createTestUser() {
  const testUser = {
    email: "test@example.com",
    password: "password123",
    fullName: "Test User",
    role: "admin" as UserRole,
  }

  return createUser(testUser)
}
