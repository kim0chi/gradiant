# Gradiant - Education Management System

Gradiant is a Progressive Web App (PWA) for grading, attendance tracking, and analytics, built with Next.js 15.2.1 and Tailwind CSS v3.

## Features

- **Role-based Authentication**: Admin, Teacher, and Student roles with different permissions and views
- **Gradebook**: Manage grades, assignments, and categories
- **Attendance Tracking**: Track student attendance with flexible options
- **Analytics**: Visualize student performance data with charts and insights
- **Progressive Web App**: Works offline and can be installed on mobile devices
- **Responsive Design**: Works on desktop and mobile devices

## Development Setup

### Prerequisites

- Node.js 18+ and npm
- Supabase account and project

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/yourusername/gradiant.git
   cd gradiant
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Create a `.env.local` file with your Supabase credentials:
   \`\`\`
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
   \`\`\`

4. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Debug Mode

For development and testing, you can run the app in debug mode to bypass real authentication:

\`\`\`bash
NEXT_PUBLIC_DEBUG=true npm run dev
\`\`\`

In debug mode, you can use the `?testUser=role` query parameter to simulate different user roles:

- `?testUser=admin` - Admin user
- `?testUser=teacher` - Teacher user
- `?testUser=student` - Student user

Example: `http://localhost:3000/dashboard?testUser=teacher`

## Test Users

You can seed test users in your Supabase project for testing:

\`\`\`bash
npm run seed:test-users
\`\`\`

This will create the following test accounts:

- **Admin**: `admin@test.com` / `Admin123!`
- **Teacher**: `teacher@test.com` / `Teacher123!`
- **Student**: `student@test.com` / `Student123!`

## User Registration

### Personal Registration

New users can sign up at `/auth/register` and choose their role (student or teacher).

### Institutional Users

Administrators can create institutional teacher accounts at `/settings/institutional-users`. These accounts:

1. Are created with a temporary password
2. Receive an email with login instructions
3. Are required to change their password on first login
4. Are marked as institutional accounts

## Project Structure

\`\`\`
/app                    # Next.js App Router pages
  /(auth)               # Authentication routes
  /(dashboard)          # Teacher/admin dashboard routes
  /(student)            # Student routes
/components             # Reusable React components
/lib                    # Utility functions and libraries
  /supabase             # Supabase client and helpers
/public                 # Static assets
/scripts                # Utility scripts
/types                  # TypeScript type definitions
\`\`\`

## Authentication Flow

1. **Login**: Users log in at `/login` with email/password or magic link
2. **Role-based Routing**: 
   - Students are directed to `/student`
   - Teachers are directed to `/dashboard`
   - Admins are directed to `/dashboard` with additional admin features
3. **Device-based Restrictions**:
   - Students can only access from mobile devices
   - Teachers and admins can only access from desktop devices
4. **Institutional Users**:
   - On first login, institutional users are redirected to `/auth/change-password`
   - After changing their password, they can access the dashboard

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
\`\`\`

Let's update the login page to include a link to the registration page:
