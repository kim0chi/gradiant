import { createClient } from "./supabase/client"

export type SignInCredentials = {
  email: string
  password: string
}

export type SignUpCredentials = {
  email: string
  password: string
  fullName: string
  role?: "admin" | "teacher" | "student"
}

// Sign in with email and password
export async function signInWithEmail({ email, password }: SignInCredentials) {
  const supabase = createClient()

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error("Supabase auth error:", error)
      return { user: null, session: null, error: error.message }
    }

    return { user: data.user, session: data.session, error: null }
  } catch (error) {
    console.error("Error signing in:", error)
    const message = error instanceof Error ? error.message : "Failed to sign in"
    return { user: null, session: null, error: message }
  }
}

// Sign up with email and password
export async function signUpWithEmail({ email, password, fullName, role = "student" }: SignUpCredentials) {
  const supabase = createClient()

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role,
        },
      },
    })

    if (error) {
      console.error("Supabase signup error:", error)
      return { user: null, session: null, error: error.message }
    }

    // Create a profile for the new user
    if (data.user) {
      const { error: profileError } = await supabase.from("profiles").insert({
        id: data.user.id,
        email,
        full_name: fullName,
        role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

      if (profileError) {
        console.error("Error creating profile:", profileError)
        // We won't throw here as the user has been created
      }
    }

    return { user: data.user, session: data.session, error: null }
  } catch (error) {
    console.error("Error signing up:", error)
    const message = error instanceof Error ? error.message : "Failed to sign up"
    return { user: null, session: null, error: message }
  }
}

// Reset password
export async function resetPassword(email: string) {
  const supabase = createClient()

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })

    if (error) {
      console.error("Password reset error:", error)
      return { success: false, error: error.message }
    }

    return { success: true, error: null }
  } catch (error) {
    console.error("Error resetting password:", error)
    const message = error instanceof Error ? error.message : "Failed to reset password"
    return { success: false, error: message }
  }
}

// Update password
export async function updatePassword(password: string) {
  const supabase = createClient()

  try {
    const { error } = await supabase.auth.updateUser({
      password,
    })

    if (error) {
      console.error("Password update error:", error)
      return { success: false, error: error.message }
    }

    // Update the password_changed_at field in the profile
    const { data: userData } = await supabase.auth.getUser()

    if (userData.user) {
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ password_changed_at: new Date().toISOString() })
        .eq("id", userData.user.id)

      if (profileError) {
        console.error("Profile update error:", profileError)
        return { success: false, error: profileError.message }
      }
    }

    return { success: true, error: null }
  } catch (error) {
    console.error("Error updating password:", error)
    const message = error instanceof Error ? error.message : "Failed to update password"
    return { success: false, error: message }
  }
}

// Sign out
export async function signOut() {
  const supabase = createClient()

  try {
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error("Signout error:", error)
      return { success: false, error: error.message }
    }

    return { success: true, error: null }
  } catch (error) {
    console.error("Error signing out:", error)
    const message = error instanceof Error ? error.message : "Failed to sign out"
    return { success: false, error: message }
  }
}

// Get user session
export async function getSession() {
  const supabase = createClient()

  try {
    const { data, error } = await supabase.auth.getSession()

    if (error) {
      console.error("Session error:", error)
      return { session: null, error: error.message }
    }

    return { session: data.session, error: null }
  } catch (error) {
    console.error("Error getting session:", error)
    const message = error instanceof Error ? error.message : "Failed to get session"
    return { session: null, error: message }
  }
}
