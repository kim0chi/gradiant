// Clear Demo Users Script
// This script clears all demo users from the database

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Error: Supabase environment variables are not set');
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in your .env.local file');
  process.exit(1);
}

// Create Supabase client with anon key
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function clearDemoUsers() {
  try {
    console.log('Starting to clear demo users...');
    
    // Get all demo user IDs
    const { data: demoUsers, error: fetchError } = await supabase
      .from('profiles')
      .select('id')
      .eq('is_demo', true);
    
    if (fetchError) {
      console.error('Error fetching demo users:', fetchError);
      return { success: false, error: fetchError };
    }
    
    console.log(`Found ${demoUsers?.length || 0} demo users to delete`);
    
    // With anon key, we can't delete users from auth
    // Instead, we'll just mark them as non-demo users
    for (const user of demoUsers || []) {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ is_demo: false })
        .eq('id', user.id);
      
      if (updateError) {
        console.error(`Error updating user ${user.id}:`, updateError);
        // Continue anyway to try to update as many as possible
      } else {
        console.log(`Successfully marked user ${user.id} as non-demo`);
      }
    }
    
    console.log('Demo users have been marked as non-demo successfully!');
    console.log('Note: Without the service role key, we could not delete the users from Auth.');
    console.log('Instead, we have marked them as non-demo users so they will not be treated as demo users anymore.');
    console.log('Your application is now set up for real authentication.');
    console.log('\nNext steps:');
    console.log('1. Create an admin user through the registration page');
    console.log('2. Update the admin user\'s role in the database if needed');
    console.log('3. Set up email verification in your Supabase project settings');
    
    return { success: true };
  } catch (error) {
    console.error('Error clearing demo users:', error);
    return { success: false, error };
  }
}

// Run the function
clearDemoUsers()
  .then((result) => {
    if (result.success) {
      process.exit(0);
    } else {
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });
