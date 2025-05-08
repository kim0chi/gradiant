"use client"

import { StudentTabs } from "@/components/student-tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

/**
 * Student Attendance Page
 * 
 * This page shows the student's attendance records
 * It maintains the same layout and styling as other dashboard pages
 */
export default function StudentAttendancePage() {
  return (
    <div className="space-y-6">
      {/* Student Tabs for navigation */}
      <StudentTabs />
      
      <Card>
        <CardHeader>
          <CardTitle>Attendance</CardTitle>
          <CardDescription>View your attendance records</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Attendance records will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  )
}
