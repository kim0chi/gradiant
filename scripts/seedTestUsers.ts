/**
 * Seed Test Users Script
 *
 * This script creates test users in Supabase Auth and adds their profiles
 * to the profiles table. It's intended for development and testing purposes.
 *
 * Usage:
 * npm run seed:test-users
 */

import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"

// Load environment variables
dotenv.config()

// Define test users
const TEST_USERS = [
  {
    email: "admin@test.com",
    password: "Admin123!",
    full_name: "Admin User",
    role: "admin",
    institutional: true,
  },
  {
    email: "teacher@test.com",
    password: "Teacher123!",
    full_name: "Teacher User",
    role: "teacher",
    institutional: false,
  },
  {
    email: "student@test.com",
    password: "Student123!",
    full_name: "Student User",
    role: "student",
    institutional: false,
  },
]

async function seedTestUsers() {
  // Create Supabase client with service role key
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

  console.log("Starting to seed test users...")

  for (const user of TEST_USERS) {
    try {
      // Check if user already exists
      const { data: existingUser } = await supabase.from("profiles").select("*").eq("email", user.email).single()

      if (existingUser) {
        console.log(`User ${user.email} already exists, skipping...`)
        continue
      }

      // Create user in Supabase Auth
      const { data, error } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: {
          full_name: user.full_name,
        },
      })

      if (error) {
        console.error(`Error creating user ${user.email}:`, error.message)
        continue
      }

      // Create profile record
      if (data.user) {
        const { error: profileError } = await supabase.from("profiles").insert({
          id: data.user.id,
          email: user.email,
          full_name: user.full_name,
          role: user.role,
          institutional: user.institutional,
          password_changed_at: user.institutional ? null : new Date().toISOString(),
        })

        if (profileError) {
          console.error(`Error creating profile for ${user.email}:`, profileError.message)
          continue
        }

        console.log(`Created test user: ${user.email} (${user.role})`)
      }
    } catch (error) {
      console.error(`Unexpected error for ${user.email}:`, error)
    }
  }

  console.log("Test user seeding complete!")
}

// Run the seed function
seedTestUsers()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Fatal error:", error)
    process.exit(1)
  })
