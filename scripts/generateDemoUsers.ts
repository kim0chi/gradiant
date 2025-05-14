/**
 * Generate Demo Users Script
 *
 * This script creates demo users in Supabase Auth and adds their profiles
 * to the profiles table. It's intended for development and testing purposes.
 *
 * Usage:
 * npm run generate:demo-users [count]
 */

import { loadDemoUsers } from "../lib/demo-service"

async function generateDemoUsers() {
  // Get count from command line arguments
  const args = process.argv.slice(2)
  const count = args.length > 0 ? Number.parseInt(args[0], 10) : undefined

  console.log(`Starting to generate ${count || "default number of"} demo users...`)

  try {
    const { success, error, count: createdCount } = await loadDemoUsers(count)

    if (success) {
      console.log(`Successfully created ${createdCount} demo users!`)
      console.log("All demo users have the password: Demo123!")
    } else {
      console.error("Error generating demo users:", error)
      process.exit(1)
    }
  } catch (error) {
    console.error("Unexpected error:", error)
    process.exit(1)
  }

  process.exit(0)
}

// Run the script
generateDemoUsers()
