"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

/**
 * StudentTabs Component
 *
 * Provides tab navigation for the student dashboard
 * Matches the teacher dashboard tab style for consistency
 */
export function StudentTabs() {
  const router = useRouter()
  const pathname = usePathname()

  // Determine which tab is active based on the current path
  const getActiveTab = () => {
    if (pathname.includes("/assignments")) return "assignments"
    if (pathname.includes("/grades")) return "grades"
    if (pathname.includes("/attendance")) return "attendance"
    return "overview"
  }

  const [activeTab, setActiveTab] = useState(getActiveTab())

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value)
    router.push(`/dashboard/student/${value === "overview" ? "" : value}`)
  }

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full mb-6">
      <TabsList className="grid w-full max-w-md grid-cols-4">
        <TabsTrigger value="overview" aria-controls="overview-tab">
          Overview
        </TabsTrigger>
        <TabsTrigger value="assignments" aria-controls="assignments-tab">
          Assignments
        </TabsTrigger>
        <TabsTrigger value="grades" aria-controls="grades-tab">
          Grades
        </TabsTrigger>
        <TabsTrigger value="attendance" aria-controls="attendance-tab">
          Attendance
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
