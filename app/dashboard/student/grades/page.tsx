"use client"

import { StudentTabs } from "@/components/student-tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function StudentGradesPage() {
  return (
    <div className="space-y-6">
      <StudentTabs />

      <Card>
        <CardHeader>
          <CardTitle>Grades</CardTitle>
          <CardDescription>View your grades for all classes</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Grades content will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  )
}
