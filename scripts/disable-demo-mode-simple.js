// Disable Demo Mode Script (Simple Version)
// This script disables demo mode in the application configuration

const fs = require('fs');
const path = require('path');

// Path to the app-config.ts file
const configPath = path.join(__dirname, '..', 'lib', 'app-config.ts');

try {
  console.log('Reading app-config.ts file...');
  
  // Read the current configuration file
  let configContent = fs.readFileSync(configPath, 'utf8');
  
  // Check if demo mode is already disabled
  if (configContent.includes('demoMode: false')) {
    console.log('Demo mode is already disabled in app-config.ts');
  } else {
    // Replace 'demoMode: true' with 'demoMode: false'
    configContent = configContent.replace(/demoMode:\s*true/g, 'demoMode: false');
    
    // Write the updated content back to the file
    fs.writeFileSync(configPath, configContent, 'utf8');
    
    console.log('Successfully disabled demo mode in app-config.ts');
  }
  
  console.log('\nYour application is now set up for real authentication.');
  console.log('\nNext steps:');
  console.log('1. Restart your application with npm run dev');
  console.log('2. Create a new user through the registration page');
  console.log('3. Log in with your new user credentials');
  
} catch (error) {
  console.error('Error disabling demo mode:', error);
  process.exit(1);
}
