// Apply Migration Script
// This script applies the demo user fields migration to the database

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

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

async function applyMigration() {
  try {
    console.log('Starting to apply migration...');
    
    // Read the migration SQL file
    const migrationPath = path.join(__dirname, '..', 'migrations', 'add_demo_user_fields.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Split the SQL into individual statements
    const statements = migrationSQL
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0);
    
    console.log(`Found ${statements.length} SQL statements to execute`);
    
    // Execute each statement
    for (const statement of statements) {
      try {
        console.log(`Executing: ${statement}`);
        const { error } = await supabase.rpc('exec_sql', { sql: statement });
        
        if (error) {
          if (error.message.includes('column already exists')) {
            console.log('Column already exists, continuing...');
          } else {
            console.error('Error executing SQL statement:', error);
          }
        } else {
          console.log('Statement executed successfully');
        }
      } catch (statementError) {
        console.error('Error executing statement:', statementError);
      }
    }
    
    console.log('Migration applied successfully!');
    console.log('Now you can run npm run clear:demo to disable demo mode');
    
    return { success: true };
  } catch (error) {
    console.error('Error applying migration:', error);
    return { success: false, error };
  }
}

// Run the function
applyMigration()
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
