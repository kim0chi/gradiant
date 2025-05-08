// Application configuration settings

interface AppConfig {
  // Controls whether the application is in demo mode (using mock data and demo users)
  demoMode: boolean;
  
  // Whether to show a demo mode notice to users
  showDemoNotice: boolean;
  
  // Authentication settings
  auth: {
    // Minimum password length for new user registrations
    minPasswordLength: number;
    // Whether to require email verification
    requireEmailVerification: boolean;
  };
}

// Default configuration
const appConfig: AppConfig = {
  // Set to false to use real authentication and data
  demoMode: true, // Temporarily enabling demo mode to bypass authentication issues
  showDemoNotice: true,
  auth: {
    minPasswordLength: 8,
    requireEmailVerification: true,
  }
};

export default appConfig;
