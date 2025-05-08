"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

/**
 * StudentTabs Component
 * 
 * A tab navigation component for the student dashboard
 * Provides navigation between Overview, Assignments, Grades, and Attendance sections
 * Includes ARIA roles and keyboard support for accessibility
 */
export function StudentTabs() {
  const pathname = usePathname()
  
  // Define the tab items with their paths
  const tabs = [
    { label: "Overview", path: "/dashboard/student/overview" },
    { label: "Assignments", path: "/dashboard/student/assignments" },
    { label: "Grades", path: "/dashboard/student/grades" },
    { label: "Attendance", path: "/dashboard/student/attendance" },
  ]

  // Determine which tab is active based on the current path
  const getActiveTab = () => {
    // Default to overview if not on a specific tab
    if (pathname === "/dashboard/student") return tabs[0].path
    
    // Find the matching tab or default to the first one
    const activeTab = tabs.find(tab => pathname.startsWith(tab.path))
    return activeTab ? activeTab.path : tabs[0].path
  }

  return (
    <Tabs defaultValue={getActiveTab()} className="w-full">
      <TabsList className="w-full justify-start border-b rounded-none h-auto p-0" 
               role="tablist"
               aria-label="Student dashboard sections">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.path}
            value={tab.path}
            className={cn(
              "rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary",
              "focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:bg-accent/50",
              "transition-all duration-200"
            )}
            asChild
            role="tab"
            aria-selected={pathname.startsWith(tab.path)}
            aria-controls={`${tab.label.toLowerCase()}-panel`}
          >
            <Link href={tab.path}>
              {tab.label}
            </Link>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
