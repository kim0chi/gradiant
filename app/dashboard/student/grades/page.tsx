"use client"

import { StudentTabs } from "@/components/student-tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

/**
 * Student Grades Page
 * 
 * This page shows the student's grades
 * It maintains the same layout and styling as other dashboard pages
 */
export default function StudentGradesPage() {
  return (
    <div className="space-y-6">
      {/* Student Tabs for navigation */}
      <StudentTabs />
      
      <Card>
        <CardHeader>
          <CardTitle>Grades</CardTitle>
          <CardDescription>View your academic performance</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Grades content will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  )
}
