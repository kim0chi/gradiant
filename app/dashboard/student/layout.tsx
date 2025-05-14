"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { RoleNav } from "@/components/role-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { LogOut, Menu, Settings, User } from "lucide-react"
import { getUserRole, clearUser, getUser } from "@/lib/mockAuth"
import { useSettings } from "@/contexts/settings-context"
import { ProfileProvider } from "@/contexts/profile-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

/**
 * Student Dashboard Layout
 *
 * This layout wraps all student dashboard routes
 * It uses the same structure as the teacher dashboard for consistency
 */
export default function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const router = useRouter()
  const { settings, updateSettings } = useSettings()

  useEffect(() => {
    // Check if user is authenticated
    const userRole = getUserRole()
    const userData = getUser()

    if (!userRole || userRole !== "student") {
      // Redirect to login if not authenticated or not a student
      router.push("/login")
      return
    }

    setUser(userData)
    setLoading(false)
  }, [router])

  // Use the sidebar collapsed state from settings
  const isSidebarCollapsed = settings.sidebarCollapsed || false

  const handleLogout = () => {
    clearUser()
    router.push("/login")
  }

  const toggleSidebar = () => {
    const newState = !isSidebarCollapsed
    updateSettings({ sidebarCollapsed: newState })
  }

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  // Get first name
  const getFirstName = () => {
    if (!user?.name) return ""
    return user.name.split(" ")[0]
  }

  return (
    <ProfileProvider>
      <div className="flex min-h-screen bg-background">
        {/* 
          Desktop Sidebar - Hidden on mobile, visible on md and up
          The hidden md:block classes ensure this is only shown on desktop
        */}
        <div
          className={`hidden md:block fixed left-0 top-0 h-full bg-background border-r transition-all duration-300 z-20 ${
            isSidebarCollapsed ? "w-16" : "w-60"
          }`}
          aria-label="Main navigation"
          role="navigation"
        >
          {/* 
            Pass the student role to RoleNav to render the appropriate navigation items
            This ensures the sidebar works specifically for students
          */}
          <RoleNav
            role="student"
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={toggleSidebar}
            variant="desktop"
            currentPath={pathname}
          />
        </div>

        {/* 
          Main Content Area - Adjusts margin based on sidebar state
          The left margin ensures content doesn't overlap with the sidebar on desktop
        */}
        <div
          className={`flex-1 flex flex-col min-h-screen ${
            isSidebarCollapsed ? "md:ml-16" : "md:ml-60"
          } transition-all duration-300`}
        >
          {/* Header - Sticky at the top of the page */}
          <header className="sticky top-0 z-10 border-b bg-background p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* 
                Mobile menu trigger - Only visible on mobile
                The md:hidden class ensures this is only shown on mobile devices
              */}
              <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open navigation menu">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className="w-[80%] sm:w-[350px] p-0"
                  onCloseAutoFocus={(e) => {
                    // Prevent focus returning to trigger to improve accessibility
                    e.preventDefault()
                  }}
                >
                  {/* 
                    Mobile drawer navigation - Only visible when drawer is open
                    Pass the student role to render the appropriate navigation items
                  */}
                  <RoleNav
                    role="student"
                    variant="mobile"
                    onClose={() => setIsMobileNavOpen(false)}
                    currentPath={pathname}
                  />
                </SheetContent>
              </Sheet>

              {/* Personalized greeting as requested */}
              <h1 className="text-xl font-semibold">
                {getGreeting()}, {getFirstName()} 👋
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <ThemeToggle />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full" aria-label="User menu">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{user?.name ? getInitials(user.name) : "S"}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push("/dashboard/student/profile")}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/dashboard/student/settings")}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 dark:text-red-400">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* 
            Main content - This renders the child route content
            The pb-16 class on mobile adds padding to account for the bottom nav bar
          */}
          <main className="flex-1 p-4 md:p-6 overflow-auto pb-16 md:pb-6">{children}</main>

          {/* 
            Mobile Bottom Tab Bar - Only visible on mobile
            The md:hidden class ensures this is only shown on mobile devices
          */}
          <div
            className="fixed bottom-0 left-0 z-30 w-full border-t bg-background md:hidden"
            aria-label="Mobile navigation"
          >
            {/* 
              Pass the student role to render the appropriate navigation items
              This ensures the bottom nav works specifically for students
            */}
            <RoleNav role="student" variant="tabs" currentPath={pathname} />
          </div>
        </div>
      </div>
    </ProfileProvider>
  )
}
