import { createClient } from "@supabase/supabase-js"
import { getQuickDemoUsers, generateDemoUsers } from "./demo-data-generator"

// Function to load demo users into the database
export async function loadDemoUsers(count?: number): Promise<{ success: boolean; error?: unknown; count?: number }> {
  try {
    // Create Supabase client
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    // Get demo users
    const demoUsers = count ? generateDemoUsers(count) : getQuickDemoUsers()

    // Clear existing demo users first (optional, based on your needs)
    // This is safer than deleting all users, as it only removes users marked as demo
    const { error: deleteError } = await supabase.from("profiles").delete().eq("is_demo", true)

    if (deleteError) {
      console.error("Error clearing existing demo users:", deleteError)
      // Continue anyway, as this is not critical
    }

    // Create users in Supabase Auth and add to profiles table
    let successCount = 0

    for (const user of demoUsers) {
      try {
        // Create user in Auth
        const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
          email: user.email,
          password: "Demo123!", // Standard password for all demo users
          email_confirm: true,
          user_metadata: {
            full_name: user.full_name,
          },
        })

        if (authError) {
          console.error(`Error creating auth user ${user.email}:`, authError)
          continue
        }

        if (authUser.user) {
          // Add user to profiles table
          const { error: profileError } = await supabase.from("profiles").insert({
            id: authUser.user.id,
            email: user.email,
            full_name: user.full_name,
            role: user.role,
            department: user.department,
            subject: user.subject,
            grade_level: user.grade_level,
            avatar_url: user.avatar_url,
            is_demo: true, // Mark as demo user for easy identification
            created_at: user.joined_date,
            last_active: user.last_active,
            status: user.status,
          })

          if (profileError) {
            console.error(`Error creating profile for ${user.email}:`, profileError)
            continue
          }

          successCount++
        }
      } catch (error) {
        console.error(`Unexpected error for ${user.email}:`, error)
      }
    }

    return { success: true, count: successCount }
  } catch (error) {
    console.error("Error loading demo users:", error)
    return { success: false, error }
  }
}

// Function to check if demo data is loaded
export async function isDemoDataLoaded(): Promise<boolean> {
  try {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

    const { count, error } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("is_demo", true)

    if (error) {
      console.error("Error checking demo data:", error)
      return false
    }

    return count !== null && count > 0
  } catch (error) {
    console.error("Error checking demo data:", error)
    return false
  }
}

// Function to clear demo data
export async function clearDemoData(): Promise<{ success: boolean; error?: unknown }> {
  try {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    // Get all demo user IDs
    const { data: demoUsers, error: fetchError } = await supabase.from("profiles").select("id").eq("is_demo", true)

    if (fetchError) {
      console.error("Error fetching demo users:", fetchError)
      return { success: false, error: fetchError }
    }

    // Delete each demo user from auth
    for (const user of demoUsers || []) {
      const { error: deleteAuthError } = await supabase.auth.admin.deleteUser(user.id)

      if (deleteAuthError) {
        console.error(`Error deleting auth user ${user.id}:`, deleteAuthError)
        // Continue anyway to try to delete as many as possible
      }
    }

    // Profiles should be deleted automatically via cascade delete

    return { success: true }
  } catch (error) {
    console.error("Error clearing demo data:", error)
    return { success: false, error }
  }
}
