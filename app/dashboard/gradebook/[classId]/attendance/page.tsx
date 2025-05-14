"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AttendanceTracker } from "./attendance-tracker"
import { AttendanceAnalytics } from "./attendance-analytics"

export default function AttendancePage({ params }: { params: { classId: string } }) {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Class Attendance</h1>

      <Tabs defaultValue="tracking">
        <TabsList>
          <TabsTrigger value="tracking">Attendance Tracking</TabsTrigger>
          <TabsTrigger value="analytics">Analytics & Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="tracking" className="mt-6">
          <AttendanceTracker classId={params.classId} />
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <AttendanceAnalytics classId={params.classId} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
