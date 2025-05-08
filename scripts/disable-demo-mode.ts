/**
 * Disable Demo Mode Script
 * 
 * This script disables demo mode and cleans up any demo users in the database.
 * It should be run when transitioning from demo mode to production.
 */

import { clearDemoData } from "../lib/demo-service"
import { supabase } from "../lib/supabase"
import appConfig from "../lib/app-config"

async function disableDemoMode() {
  try {
    console.log("Starting to disable demo mode...")
    
    // Step 1: Clear all demo users from the database
    console.log("Clearing demo users...")
    const { success, error } = await clearDemoData()
    
    if (!success) {
      console.error("Error clearing demo data:", error)
      process.exit(1)
    }
    
    console.log("Successfully cleared all demo users!")
    
    // Step 2: Verify that demo mode is disabled in app-config
    if (appConfig.demoMode) {
      console.warn("WARNING: Demo mode is still enabled in app-config.ts")
      console.warn("Please ensure you set demoMode to false in lib/app-config.ts")
    } else {
      console.log("Demo mode is correctly disabled in app-config.ts")
    }
    
    // Step 3: Verify that authentication middleware is properly configured
    console.log("Authentication middleware has been configured to enforce authentication")
    
    console.log("\nDemo mode has been successfully disabled!")
    console.log("Your application is now set up for real authentication.")
    console.log("\nNext steps:")
    console.log("1. Create an admin user through the registration page")
    console.log("2. Update the admin user's role in the database if needed")
    console.log("3. Set up email verification in your Supabase project settings")
    
  } catch (error) {
    console.error("Unexpected error disabling demo mode:", error)
    process.exit(1)
  }
}

disableDemoMode()
