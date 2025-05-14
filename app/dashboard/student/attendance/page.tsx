"use client"

import { StudentTabs } from "@/components/student-tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function StudentAttendancePage() {
  return (
    <div className="space-y-6">
      <StudentTabs />

      <Card>
        <CardHeader>
          <CardTitle>Attendance</CardTitle>
          <CardDescription>View your attendance record</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Attendance content will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  )
}
