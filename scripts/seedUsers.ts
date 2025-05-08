/**
 * Seed Users Script
 *
 * This script creates sample users in Supabase Auth and ensures their profiles
 * are properly set up. It's intended for development and testing purposes.
 *
 * Usage:
 * npm run seed:users
 */

import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"

// Load environment variables
dotenv.config()

// Define sample users with different roles
const SAMPLE_USERS = [
  {
    email: "admin@gradiant.edu",
    password: "Admin123!",
    full_name: "Alex Administrator",
    role: "admin",
  },
  {
    email: "teacher1@gradiant.edu",
    password: "Teacher123!",
    full_name: "Taylor Teacher",
    role: "teacher",
  },
  {
    email: "teacher2@gradiant.edu",
    password: "Teacher123!",
    full_name: "Morgan Mathematics",
    role: "teacher",
  },
  {
    email: "student1@gradiant.edu",
    password: "Student123!",
    full_name: "Sam Student",
    role: "student",
  },
  {
    email: "student2@gradiant.edu",
    password: "Student123!",
    full_name: "Jordan Junior",
    role: "student",
  },
  {
    email: "student3@gradiant.edu",
    password: "Student123!",
    full_name: "Riley Researcher",
    role: "student",
  },
]

async function seedUsers() {
  // Validate environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Missing required environment variables: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
    process.exit(1)
  }

  // Create Supabase client with service role key for admin privileges
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  console.log("Starting to seed sample users...")

  for (const user of SAMPLE_USERS) {
    try {
      // Check if user already exists by email
      const { data: existingUsers, error: searchError } = await supabase
        .from("profiles")
        .select("id, email")
        .eq("email", user.email)

      if (searchError) {
        console.error(`Error searching for user ${user.email}:`, searchError.message)
        continue
      }

      if (existingUsers && existingUsers.length > 0) {
        console.log(`User ${user.email} already exists, skipping...`)
        continue
      }

      // Create user in Supabase Auth
      const { data, error } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true, // Auto-confirm email to avoid verification step
        user_metadata: {
          full_name: user.full_name,
          role: user.role,
        },
      })

      if (error) {
        console.error(`Error creating user ${user.email}:`, error.message)
        continue
      }

      if (!data.user) {
        console.error(`Failed to create user ${user.email}: No user returned`)
        continue
      }

      // Check if profile was created by the trigger
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single()

      if (profileError) {
        console.error(`Error checking profile for ${user.email}:`, profileError.message)

        // Create profile manually if it doesn't exist
        const { error: insertError } = await supabase.from("profiles").insert({
          id: data.user.id,
          email: user.email,
          full_name: user.full_name,
          role: user.role,
        })

        if (insertError) {
          console.error(`Error creating profile for ${user.email}:`, insertError.message)
          continue
        }
      }

      console.log(`Created sample user: ${user.email} (${user.role})`)
    } catch (error) {
      console.error(`Unexpected error for ${user.email}:`, error)
    }
  }

  console.log("Sample user seeding complete!")
}

// Run the seed function
seedUsers()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Fatal error:", error)
    process.exit(1)
  })
