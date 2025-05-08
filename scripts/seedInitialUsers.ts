import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// This script creates initial admin, teacher, and student users
// Run with: npx tsx scripts/seedInitialUsers.ts

async function seedInitialUsers() {
  // Get Supabase credentials from environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Missing Supabase environment variables")
    process.exit(1)
  }

  // Create Supabase admin client with service role key
  const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey)

  // Initial users to create
  const users = [
    {
      email: "admin@example.com",
      password: "password123",
      fullName: "Admin User",
      role: "admin",
    },
    {
      email: "teacher@example.com",
      password: "password123",
      fullName: "Teacher User",
      role: "teacher",
    },
    {
      email: "student@example.com",
      password: "password123",
      fullName: "Student User",
      role: "student",
    },
  ]

  console.log("Starting to seed initial users...")

  for (const user of users) {
    try {
      // Check if user already exists
      const { data: existingUser } = await supabase.from("profiles").select("*").eq("email", user.email).maybeSingle()

      if (existingUser) {
        console.log(`User ${user.email} already exists, skipping...`)
        continue
      }

      // Create user in Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: {
          full_name: user.fullName,
          role: user.role,
        },
      })

      if (authError) {
        console.error(`Error creating auth user ${user.email}:`, authError)
        continue
      }

      if (!authData.user) {
        console.error(`Failed to create auth user ${user.email}`)
        continue
      }

      // Check if profile was created by trigger
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authData.user.id)
        .maybeSingle()

      if (profileError || !profileData) {
        // Create profile manually if not created by trigger
        const { error: insertError } = await supabase.from("profiles").insert({
          id: authData.user.id,
          email: user.email,
          full_name: user.fullName,
          role: user.role,
        })

        if (insertError) {
          console.error(`Error creating profile for ${user.email}:`, insertError)
          continue
        }
      }

      console.log(`Created user: ${user.email} with role: ${user.role}`)
    } catch (error) {
      console.error(`Unexpected error creating user ${user.email}:`, error)
    }
  }

  console.log("Finished seeding initial users")
  process.exit(0)
}

seedInitialUsers()
