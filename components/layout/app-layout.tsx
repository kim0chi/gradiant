// components/layout/app-layout.tsx
'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  LayoutDashboard, 
  BookOpen, 
  Calendar, 
  Settings,
  GraduationCap,
  User,
  LogOut,
  Menu,
  ChevronLeft,
  ChevronRight,
  Moon,
  Sun,
  ClipboardList,
  FileText,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet'

interface AppLayoutProps {
  children: React.ReactNode
  userRole?: 'student' | 'teacher' | 'admin'
}

export default function AppLayout({ children, userRole = 'student' }: AppLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  // Wait for component to be mounted before accessing theme to prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const isTeacher = userRole === 'teacher' || userRole === 'admin'
  const isStudent = userRole === 'student'

  // Define navigation items based on role
  const navItems = isStudent ? [
    {
      name: 'Dashboard',
      href: '/student',
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: 'Grades & Attendance',
      href: '/student/grades',
      icon: <GraduationCap className="h-5 w-5" />,
    },
    {
      name: 'Tasks',
      href: '/student/tasks',
      icon: <ClipboardList className="h-5 w-5" />,
    },
    {
      name: 'Performance',
      href: '/student/performance',
      icon: <ClipboardList className="h-5 w-5" />,
    },
  ] : [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: 'Gradebook',
      href: '/gradebook',
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      name: 'Attendance',
      href: '/attendance',
      icon: <FileText className="h-5 w-5" />,
    },
    {
      name: 'Calendar',
      href: '/calendar',
      icon: <Calendar className="h-5 w-5" />,
    },
  ];
  
  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  // Handle sign out
  const handleSignOut = () => {
    // Add your sign out logic here
    router.push('/login')
  }

  // Toggle sidebar collapsed state
  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside 
        className={`hidden md:flex md:flex-col fixed left-0 top-0 h-full bg-background border-r transition-all duration-300 z-20 ${
          isSidebarCollapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          {!isSidebarCollapsed && <h1 className="text-xl font-bold">Gradiant</h1>}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleSidebar}
            aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={isSidebarCollapsed ? "mx-auto" : ""}
          >
            {isSidebarCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </Button>
        </div>
        
        <nav className="flex-1 py-4 overflow-y-auto">
          <div className="space-y-1 px-3">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
                    ${isActive 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    }
                    ${isSidebarCollapsed ? 'justify-center' : ''}
                  `}
                >
                  <div className={isSidebarCollapsed ? "" : "mr-3"}>{item.icon}</div>
                  {!isSidebarCollapsed && <span>{item.name}</span>}
                </Link>
              )
            })}
          </div>
        </nav>
      </aside>

      {/* Mobile Navigation */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b">
              <h1 className="text-xl font-bold">Gradiant</h1>
            </div>
            
            <nav className="flex-1 py-4 overflow-y-auto">
              <div className="space-y-1 px-3">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`
                        flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
                        ${isActive 
                          ? 'bg-primary/10 text-primary' 
                          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                        }
                      `}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="mr-3">{item.icon}</div>
                      <span>{item.name}</span>
                    </Link>
                  )
                })}
              </div>
            </nav>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div 
        className={`flex flex-col flex-1 min-h-screen transition-all duration-300 ${
          isSidebarCollapsed ? "md:ml-20" : "md:ml-64"
        }`}
      >
        {/* Header */}
        <header className="sticky top-0 z-10 border-b bg-background p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open main menu</span>
            </Button>
            
            {/* Greeting */}
            <div className="text-sm px-3 py-1.5 bg-muted rounded-md flex items-center">
              <span className="font-medium">
                {getGreeting()}, Jane
              </span>
              <span className="ml-1 text-muted-foreground">👋</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            {mounted && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? 
                  <Sun className="h-5 w-5" /> : 
                  <Moon className="h-5 w-5" />
                }
              </Button>
            )}
            
            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="rounded-full"
                  aria-label="Open user menu"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" alt="User" />
                    <AvatarFallback>JS</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/student/profile" className="flex cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/student/settings" className="flex cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="flex cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 pb-16 md:pb-0">
          {children}
        </main>

        {/* Mobile bottom navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t z-10">
          <div className="grid grid-cols-4 h-16">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex flex-col items-center justify-center"
                >
                  <div className={`
                    ${isActive ? 'text-primary' : 'text-muted-foreground'}
                  `}>
                    {item.icon}
                  </div>
                  <span className="text-xs mt-1">
                    {item.name}
                  </span>
                </Link>
              )
            })}
          </div>
        </nav>
      </div>
    </div>
  )
}