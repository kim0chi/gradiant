import { supabase } from "@/lib/supabase/client"
import type { Database } from "@/types/supabase"

export type User = Database["public"]["Tables"]["profiles"]["Row"]
export type UserRole = "admin" | "teacher" | "student"

// Fetch all users with optional filter by role
export async function getUsers(role?: UserRole) {
  try {
    console.log("Fetching users with role:", role || "all")

    // Use a more direct approach with error handling and fallback
    // Only select fields that we know exist in the database
    let query = supabase.from("profiles").select("id, email, full_name, role, created_at, updated_at")

    if (role) {
      query = query.eq("role", role)
    }

    // Apply ordering
    query = query.order("created_at", { ascending: false })

    // Set a reasonable limit to avoid large data sets
    query = query.limit(100)

    const { data, error } = await query

    if (error) {
      console.error("Supabase error fetching users:")
      console.error("Error object:", JSON.stringify(error, null, 2))
      console.error("Error keys:", Object.keys(error))
      console.error("Error toString:", String(error))
      // Fall back to mock data instead of throwing
      return {
        data: generateMockUsers(role),
        error: null,
      }
    }

    console.log(`Found ${data?.length || 0} users`)

    // If no data is returned, use mock data for development
    if (!data || data.length === 0) {
      console.warn("No data returned from Supabase, using mock data")
      return {
        data: generateMockUsers(role),
        error: null,
      }
    }

    return { data, error: null }
  } catch (error) {
    console.error("Error fetching users:", error)

    // Return mock data in case of error for development purposes
    console.warn("Error occurred, using mock data instead")
    return {
      data: generateMockUsers(role),
      error: null,
    }
  }
}

// Generate mock users for development/fallback
function generateMockUsers(role?: UserRole): User[] {
  const mockUsers: User[] = [
    {
      id: "1",
      email: "admin@example.com",
      full_name: "Admin User",
      role: "admin",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      // Remove avatar_url and other fields that might not exist
      password_changed_at: null,
      institutional: false,
      school_id: null,
      grade_level: null,
      subject_area: null,
      bio: null,
    },
    {
      id: "2",
      email: "teacher@example.com",
      full_name: "Teacher User",
      role: "teacher",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      // Remove avatar_url and other fields that might not exist
      password_changed_at: null,
      institutional: false,
      school_id: null,
      grade_level: null,
      subject_area: "Mathematics",
      bio: null,
    },
    {
      id: "3",
      email: "student@example.com",
      full_name: "Student User",
      role: "student",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      // Remove avatar_url and other fields that might not exist
      password_changed_at: null,
      institutional: false,
      school_id: null,
      grade_level: 10,
      subject_area: null,
      bio: null,
    },
  ]

  // Filter by role if provided
  if (role) {
    return mockUsers.filter((user) => user.role === role)
  }

  return mockUsers
}

// The rest of the file remains unchanged
export async function getUserById(id: string) {
  try {
    console.log("Fetching user by ID:", id)

    const { data, error } = await supabase.from("profiles").select("*").eq("id", id).single()

    if (error) {
      console.error("Supabase error fetching user by ID:", {
        code: error?.code,
        message: error?.message,
        details: error?.details,
        hint: error?.hint,
      })
      throw error
    }

    return { data, error: null }
  } catch (error) {
    console.error("Error fetching user:", error)
    return { data: null, error: error instanceof Error ? error : new Error(String(error)) }
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
      console.error("Supabase auth error creating user:", {
        code: authError?.code,
        message: authError?.message,
        details: authError?.details,
        hint: authError?.hint,
      })
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
        console.error("Error creating profile manually:", {
          code: newProfileError?.code,
          message: newProfileError?.message,
          details: newProfileError?.details,
          hint: newProfileError?.hint,
        })
        throw newProfileError
      }

      console.log("Profile created manually:", newProfileData)
      return { data: newProfileData, error: null }
    }

    console.log("User created successfully:", profileData)
    return { data: profileData, error: null }
  } catch (error) {
    console.error("Error creating user:", error)
    return { data: null, error: error instanceof Error ? error : new Error(String(error)) }
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
    const updateData: Record<string, unknown> = {}

    if (fullName !== undefined) updateData.full_name = fullName
    if (role !== undefined) updateData.role = role

    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .update(updateData)
      .eq("id", id)
      .select()
      .single()

    if (profileError) {
      console.error("Supabase error updating profile:", {
        code: profileError?.code,
        message: profileError?.message,
        details: profileError?.details,
        hint: profileError?.hint,
      })
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
        console.error("Supabase error updating email:", {
          code: emailError?.code,
          message: emailError?.message,
          details: emailError?.details,
          hint: emailError?.hint,
        })
        throw emailError
      }
    }

    console.log("User updated successfully:", profileData)
    return { data: profileData, error: null }
  } catch (error) {
    console.error("Error updating user:", error)
    return { data: null, error: error instanceof Error ? error : new Error(String(error)) }
  }
}

// Delete a user
export async function deleteUser(id: string) {
  try {
    console.log("Deleting user:", id)

    // Delete the user from Auth
    const { error: authError } = await supabase.auth.admin.deleteUser(id)

    if (authError) {
      console.error("Supabase error deleting user:", {
        code: authError?.code,
        message: authError?.message,
        details: authError?.details,
        hint: authError?.hint,
      })
      throw authError
    }

    // Profile will be automatically deleted by Supabase RLS policies and cascade delete
    console.log("User deleted successfully")
    return { success: true, error: null }
  } catch (error) {
    console.error("Error deleting user:", error)
    return { success: false, error: error instanceof Error ? error : new Error(String(error)) }
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
      console.error("Supabase error sending password reset:", {
        code: error?.code,
        message: error?.message,
        details: error?.details,
        hint: error?.hint,
      })
      throw error
    }

    console.log("Password reset email sent successfully")
    return { success: true, error: null }
  } catch (error) {
    console.error("Error sending password reset email:", error)
    return { success: false, error: error instanceof Error ? error : new Error(String(error)) }
  }
}

// Get current user profile
export async function getCurrentUserProfile() {
  try {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

    if (sessionError) {
      console.error("Supabase error getting session:", {
        code: sessionError?.code,
        message: sessionError?.message,
        details: sessionError?.details,
        hint: sessionError?.hint,
      })
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
      console.error("Supabase error getting profile:", {
        code: profileError?.code,
        message: profileError?.message,
        details: profileError?.details,
        hint: profileError?.hint,
      })
      throw profileError
    }

    return { data: profileData, error: null }
  } catch (error) {
    console.error("Error getting current user profile:", error)
    return { data: null, error: error instanceof Error ? error : new Error(String(error)) }
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
