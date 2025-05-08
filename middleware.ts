import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import appConfig from "./lib/app-config"

export async function middleware(request: NextRequest) {
  console.log('Middleware: Processing request for path:', request.nextUrl.pathname);
  
  // Get the pathname of the request
  const path = request.nextUrl.pathname
  
  // Public paths that don't require authentication
  const publicPaths = [
    '/login',
    '/auth/register',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/auth/callback',
    '/api/auth',
    '/test-dashboard' // Allow access to test dashboard
  ]
  
  // Check if the path is public
  const isPublicPath = publicPaths.some(publicPath => 
    path === publicPath || path.startsWith(`${publicPath}/`)
  )
  
  // If demo mode is enabled, bypass authentication checks
  if (appConfig.demoMode) {
    return NextResponse.next()
  }
  
  // Check for Supabase auth cookies
  const hasSession = Array.from(request.cookies.getAll())
    .some(cookie => {
      return cookie.name.startsWith('sb-') && cookie.name.includes('auth')
    })

  console.log('Middleware: Path is', path, 'isPublic:', isPublicPath, 'hasSession:', hasSession);
  
  // If the path is public and the user is logged in, redirect to dashboard
  if (isPublicPath && hasSession && path !== '/test-dashboard') {
    console.log('Middleware: Redirecting to dashboard');
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  // If the path is private and the user is not logged in, redirect to login
  if (!isPublicPath && !hasSession) {
    console.log('Middleware: Redirecting to login');
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  return NextResponse.next()
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
