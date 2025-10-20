import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function middleware(request: NextRequest) {
  // TEMPORARY: Authentication disabled for development
  return NextResponse.next();
  // Create a Supabase client configured to use cookies
  const supabase = await createServerSupabaseClient()

  // Refresh session if expired - if not it's a no-op
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Define public routes that don't require authentication
  const isPublicRoute =
    request.nextUrl.pathname === "/" ||
    request.nextUrl.pathname === "/login" ||
    request.nextUrl.pathname === "/student/login" ||
    request.nextUrl.pathname === "/student-portal" ||
    request.nextUrl.pathname.startsWith("/auth/") ||
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname.startsWith("/api/auth")

  // If no session and trying to access protected routes
  if (!session && !isPublicRoute) {
    // Determine which login page to redirect to based on the requested path
    let redirectUrl
    if (request.nextUrl.pathname.startsWith("/student")) {
      redirectUrl = new URL("/student/login", request.url)
    } else {
      redirectUrl = new URL("/login", request.url)
    }
    redirectUrl.searchParams.set("redirect", request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // If user is authenticated, handle role-based access
  if (session) {
    // Get user profile to check role
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", session.user.id).single()

    if (profile) {
      const { role } = profile
      const pathname = request.nextUrl.pathname

      // Student portal specific checks
      if (pathname.startsWith("/student") && role !== "student") {
        // Non-students trying to access student portal
        return NextResponse.redirect(new URL("/login", request.url))
      }

      // Admin portal specific checks
      if (pathname.startsWith("/admin") && role !== "admin") {
        // Non-admins trying to access admin portal
        if (role === "student") {
          return NextResponse.redirect(new URL("/student", request.url))
        } else {
          return NextResponse.redirect(new URL("/dashboard", request.url))
        }
      }

      // Teacher dashboard specific checks
      if (pathname === "/dashboard" && role === "student") {
        // Students trying to access teacher dashboard
        return NextResponse.redirect(new URL("/student", request.url))
      }

      // Redirect authenticated users away from login pages
      if (pathname === "/login" || pathname === "/student/login" || pathname.startsWith("/auth/")) {
        if (role === "student") {
          return NextResponse.redirect(new URL("/student", request.url))
        } else if (role === "admin") {
          return NextResponse.redirect(new URL("/admin/dashboard", request.url))
        } else {
          return NextResponse.redirect(new URL("/dashboard", request.url))
        }
      }
    }
  }

  return NextResponse.next()
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - / (root path)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!$|_next/static|_next/image|favicon.ico).*)",
  ],
}
