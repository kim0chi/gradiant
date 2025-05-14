// app/student/attendance/page.tsx
'use client'

import { useState, useEffect } from 'react'
import AppLayout from "@/components/layout/app-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckSquare, Calendar, Clock, XCircle, AlertCircle } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format, subDays } from "date-fns"

export default function StudentAttendancePage() {
  const [attendanceData, setAttendanceData] = useState({
    present: 42,
    absent: 2,
    tardy: 1,
    excused: 3,
    total: 48,
    rate: 93.3,
  })

  const [recentAttendance, setRecentAttendance] = useState<any[]>([])

  useEffect(() => {
    // Generate mock recent attendance data
    const today = new Date()
    
    const mockData = Array.from({ length: 10 }).map((_, i) => {
      const date = subDays(today, i)
      // Generate random status with bias towards "present"
      const rand = Math.random()
      let status = "present"
      if (rand > 0.9) status = "absent"
      else if (rand > 0.85) status = "tardy"
      else if (rand > 0.8) status = "excused"
      
      return {
        date,
        status,
        note: status !== "present" ? (status === "excused" ? "Medical appointment" : "") : ""
      }
    })
    
    setRecentAttendance(mockData)
  }, [])

  return (
    <AppLayout userRole="student">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">My Attendance</h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Present Days</CardTitle>
              <CheckSquare className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{attendanceData.present}</div>
              <p className="text-xs text-muted-foreground">Out of {attendanceData.total} school days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Absent Days</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{attendanceData.absent}</div>
              <p className="text-xs text-muted-foreground">Unexcused absences</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Tardy Days</CardTitle>
              <Clock className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{attendanceData.tardy}</div>
              <p className="text-xs text-muted-foreground">Late arrivals</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
              <AlertCircle className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{attendanceData.rate}%</div>
              <p className="text-xs text-muted-foreground">Overall attendance</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Records</CardTitle>
              <CardDescription>Your recent attendance history</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentAttendance.map((record, i) => (
                    <TableRow key={i}>
                      <TableCell>{format(record.date, "EEEE, MMM d")}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            record.status === "present" 
                              ? "default" 
                              : record.status === "excused" 
                                ? "outline" 
                                : record.status === "tardy"
                                  ? "secondary"
                                  : "destructive"
                          }
                        >
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{record.note}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Attendance Calendar</CardTitle>
              <CardDescription>View your attendance record for the current term</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-12 border-2 border-dashed rounded-lg">
                <div className="text-center">
                  <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">Attendance Calendar</h3>
                  <p className="mt-2 text-sm text-muted-foreground">Your attendance calendar will be displayed here.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}