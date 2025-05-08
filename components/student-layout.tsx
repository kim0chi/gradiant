"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { BookOpen, Home, User, Menu, X, BarChart2, CheckSquare, BookmarkIcon, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { getMockUser, clearUser } from "@/lib/mockAuth"
import { LogoutButton } from "@/components/logout-button"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkAuth = async () => {
      const mockUser = getMockUser()

      if (!mockUser || mockUser.role !== "student") {
        router.push("/login")
        return
      }

      setUser(mockUser)
      setLoading(false)
    }

    checkAuth()
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    )
  }

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`)
  }

  const handleLogout = () => {
    clearUser()
    router.push("/login")
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <Link href="/student" className="flex items-center gap-2 font-semibold text-xl">
            <BookOpen className="h-6 w-6 text-primary" />
            <span>Gradiant</span>
          </Link>
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} className="lg:hidden">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <ScrollArea className="flex-1 h-[calc(100vh-4rem)]">
          <div className="py-4">
            <nav className="space-y-1 px-2">
              <Link
                href="/student"
                className={cn(
                  "flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground",
                  isActive("/student") && pathname === "/student" && "bg-accent text-accent-foreground font-medium",
                )}
              >
                <Home className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/student/grades"
                className={cn(
                  "flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground",
                  isActive("/student/grades") && "bg-accent text-accent-foreground font-medium",
                )}
              >
                <BookOpen className="h-5 w-5" />
                <span>Grades</span>
              </Link>
              <Link
                href="/student/attendance"
                className={cn(
                  "flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground",
                  isActive("/student/attendance") && "bg-accent text-accent-foreground font-medium",
                )}
              >
                <CheckSquare className="h-5 w-5" />
                <span>Attendance</span>
              </Link>
              <Link
                href="/student/tasks"
                className={cn(
                  "flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground",
                  isActive("/student/tasks") && "bg-accent text-accent-foreground font-medium",
                )}
              >
                <BookmarkIcon className="h-5 w-5" />
                <span>Assignments</span>
              </Link>
              <Link
                href="/student/performance"
                className={cn(
                  "flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground",
                  isActive("/student/performance") && "bg-accent text-accent-foreground font-medium",
                )}
              >
                <BarChart2 className="h-5 w-5" />
                <span>Performance</span>
              </Link>
              <Link
                href="/student/profile"
                className={cn(
                  "flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground",
                  isActive("/student/profile") && "bg-accent text-accent-foreground font-medium",
                )}
              >
                <User className="h-5 w-5" />
                <span>Profile</span>
              </Link>
              <Link
                href="/student/settings"
                className={cn(
                  "flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground",
                  isActive("/student/settings") && "bg-accent text-accent-foreground font-medium",
                )}
              >
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </Link>
            </nav>
          </div>
        </ScrollArea>

        {/* User info at bottom of sidebar */}
        <div className="absolute bottom-0 left-0 right-0 border-t p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/10 text-primary">{user?.name?.charAt(0) || "S"}</AvatarFallback>
              </Avatar>
              <div className="ml-2">
                <p className="text-sm font-medium">{user?.name || "Student"}</p>
                <p className="text-xs text-muted-foreground capitalize">{user?.role || "Student"}</p>
              </div>
            </div>
            <LogoutButton />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navigation */}
        <header className="h-16 border-b flex items-center justify-between px-4">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)} className="lg:hidden mr-2">
              <Menu className="h-5 w-5" />
            </Button>
            <div className="hidden md:block">
              <h2 className="text-lg font-medium">
                Good {new Date().getHours() < 12 ? "Morning" : new Date().getHours() < 18 ? "Afternoon" : "Evening"},
                {user?.name ? ` ${user.name.split(" ")[0]}` : " Student"}
              </h2>
              <p className="text-sm text-muted-foreground">Welcome to your student dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-sm text-muted-foreground bg-yellow-100 dark:bg-yellow-900/30 px-3 py-1 rounded-full">
              Testing Mode: {user?.role}
            </div>
            <ThemeToggle />
            <div className="relative">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 border">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {user?.name?.charAt(0) || "S"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/student/profile">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/student/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
