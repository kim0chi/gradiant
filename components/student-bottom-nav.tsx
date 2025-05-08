"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, BookOpen, GraduationCap, CalendarDays } from "lucide-react"

/**
 * StudentBottomNav Component
 * 
 * A bottom navigation bar for mobile devices
 * Provides quick access to main student dashboard sections
 * Only visible on mobile screens (hidden on md breakpoint and above)
 */
export function StudentBottomNav() {
  const pathname = usePathname()
  
  // Define navigation items with icons
  const navItems = [
    { 
      title: "Dashboard", 
      href: "/dashboard/student/overview", 
      icon: LayoutDashboard 
    },
    { 
      title: "Assignments", 
      href: "/dashboard/student/assignments", 
      icon: BookOpen 
    },
    { 
      title: "Grades", 
      href: "/dashboard/student/grades", 
      icon: GraduationCap 
    },
    { 
      title: "Attendance", 
      href: "/dashboard/student/attendance", 
      icon: CalendarDays 
    },
  ]

  // Check if a path is active
  const isActive = (path: string) => {
    if (path === "/dashboard/student/overview" && pathname === "/dashboard/student") {
      return true
    }
    return pathname.startsWith(path)
  }

  return (
    <div 
      className="grid grid-cols-4 h-16 md:hidden" 
      role="navigation" 
      aria-label="Mobile navigation"
    >
      {navItems.map((item) => (
        <Link
          key={item.title}
          href={item.href}
          className={cn(
            "flex flex-col items-center justify-center gap-1 text-muted-foreground",
            // Highlight active item with primary color
            isActive(item.href) && "text-primary",
            // Add top border for active state to provide visual cue
            isActive(item.href) && "border-t-2 border-primary pt-0.5",
          )}
          aria-label={item.title}
          aria-current={isActive(item.href) ? "page" : undefined}
        >
          <item.icon className="h-5 w-5" />
          <span className="text-xs">{item.title}</span>
        </Link>
      ))}
    </div>
  )
}
