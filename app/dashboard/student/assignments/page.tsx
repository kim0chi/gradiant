"use client"

import { StudentTabs } from "@/components/student-tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

/**
 * Student Assignments Page
 * 
 * This page shows the student's assignments
 * It maintains the same layout and styling as other dashboard pages
 */
export default function StudentAssignmentsPage() {
  return (
    <div className="space-y-6">
      {/* Student Tabs for navigation */}
      <StudentTabs />
      
      <Card>
        <CardHeader>
          <CardTitle>Assignments</CardTitle>
          <CardDescription>View and manage your assignments</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Assignments content will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  )
}
