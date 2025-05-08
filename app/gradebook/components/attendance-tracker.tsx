"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { CalendarIcon, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { getStudentsInClass, getAttendanceForClass, recordAttendance } from "@/lib/supabase/data-service"
import { useSupabaseSubscription } from "@/hooks/use-supabase-subscription"

type AttendanceTrackerProps = {
  classId: string
}

export function AttendanceTracker({ classId }: AttendanceTrackerProps) {
  const [date, setDate] = useState<Date>(new Date())
  const [students, setStudents] = useState<any[]>([])
  const [attendance, setAttendance] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const { toast } = useToast()

  // Subscribe to real-time updates
  useSupabaseSubscription("attendance", {
    callback: () => {
      // Refetch attendance when it changes
      fetchAttendance(format(date, "yyyy-MM-dd"))
    },
  })

  // Fetch data on component mount and when date changes
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const [studentsData] = await Promise.all([getStudentsInClass(classId)])

        setStudents(studentsData)
        await fetchAttendance(format(date, "yyyy-MM-dd"))
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error loading data",
          description: "There was a problem loading the attendance data.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [classId, date, toast])

  // Function to fetch attendance for a specific date
  async function fetchAttendance(dateStr: string) {
    try {
      const attendanceData = await getAttendanceForClass(classId, dateStr)
      setAttendance(attendanceData)
    } catch (error) {
      console.error("Error fetching attendance:", error)
    }
  }

  // Get attendance status for a specific student
  const getAttendanceStatus = (studentId: string) => {
    const record = attendance.find((a) => a.student_id === studentId)

    return record?.status || null
  }

  // Update attendance status
  const updateAttendance = async (studentId: string, status: "present" | "absent" | "tardy") => {
    setUpdating(studentId)

    try {
      await recordAttendance({
        student_id: studentId,
        class_id: classId,
        date: format(date, "yyyy-MM-dd"),
        status,
      })

      // Refresh attendance
      await fetchAttendance(format(date, "yyyy-MM-dd"))

      toast({
        title: "Attendance updated",
        description: "The attendance record has been updated successfully.",
      })
    } catch (error) {
      console.error("Error updating attendance:", error)
      toast({
        title: "Error updating attendance",
        description: "There was a problem updating the attendance record.",
        variant: "destructive",
      })
    } finally {
      setUpdating(null)
    }
  }

  // Render loading state
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-8 w-24" />
        </div>
        <div className="border rounded-md">
          <div className="h-12 border-b bg-muted/50" />
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 border-b" />
          ))}
        </div>
      </div>
    )
  }

  // Render empty state
  if (students.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center border rounded-md bg-muted/10">
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-2" />
        <h3 className="text-lg font-medium">No students enrolled</h3>
        <p className="text-muted-foreground mt-1">Add students to this class to start tracking attendance.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Attendance</h3>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(date, "PPP")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar mode="single" selected={date} onSelect={(newDate) => newDate && setDate(newDate)} initialFocus />
          </PopoverContent>
        </Popover>
      </div>

      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => {
              const status = getAttendanceStatus(student.id)
              const isUpdating = updating === student.id

              return (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.full_name}</TableCell>
                  <TableCell>
                    {status === "present" && (
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Present
                      </div>
                    )}
                    {status === "absent" && (
                      <div className="flex items-center text-red-600">
                        <XCircle className="h-4 w-4 mr-1" />
                        Absent
                      </div>
                    )}
                    {status === "tardy" && (
                      <div className="flex items-center text-amber-600">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        Tardy
                      </div>
                    )}
                    {!status && <span className="text-muted-foreground">Not recorded</span>}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      <Button
                        variant={status === "present" ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateAttendance(student.id, "present")}
                        disabled={isUpdating}
                      >
                        Present
                      </Button>
                      <Button
                        variant={status === "absent" ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateAttendance(student.id, "absent")}
                        disabled={isUpdating}
                      >
                        Absent
                      </Button>
                      <Button
                        variant={status === "tardy" ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateAttendance(student.id, "tardy")}
                        disabled={isUpdating}
                      >
                        Tardy
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
