'use client'

import { useState, useEffect } from 'react'
import AppLayout from "@/components/layout/app-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GraduationCap, BookOpen, BarChart2, CheckSquare, Calendar as CalendarIcon, Clock, XCircle, AlertCircle } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format, subDays, getDate } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  BarChart,
  Bar,
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend as RechartsLegend, 
  ResponsiveContainer 
} from "recharts"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"

export default function StudentGradesPage() {
  const [attendanceData, setAttendanceData] = useState({
    present: 42,
    absent: 2,
    tardy: 1,
    excused: 3,
    total: 48,
    rate: 93.3,
  })

  const [recentAttendance, setRecentAttendance] = useState<any[]>([])
  const [selectedTerm, setSelectedTerm] = useState("spring2023")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [calendarAttendance, setCalendarAttendance] = useState<{[key: string]: {status: string, note: string}}>({})

  // Mock past term grades data
  const pastTermsData = {
    spring2023: [
      { subject: "Mathematics", grade: "B+", percentage: "88%" },
      { subject: "Science", grade: "A-", percentage: "91%" },
      { subject: "History", grade: "B", percentage: "85%" },
      { subject: "English", grade: "A", percentage: "94%" },
      { subject: "Physical Education", grade: "A", percentage: "96%" },
    ],
    fall2022: [
      { subject: "Mathematics", grade: "B", percentage: "84%" },
      { subject: "Science", grade: "B+", percentage: "87%" },
      { subject: "History", grade: "B-", percentage: "82%" },
      { subject: "English", grade: "A-", percentage: "92%" },
      { subject: "Physical Education", grade: "A", percentage: "95%" },
    ],
    spring2022: [
      { subject: "Mathematics", grade: "C+", percentage: "78%" },
      { subject: "Science", grade: "B", percentage: "85%" },
      { subject: "History", grade: "B", percentage: "83%" },
      { subject: "English", grade: "B+", percentage: "88%" },
      { subject: "Physical Education", grade: "A-", percentage: "91%" },
    ],
  }

  // Mock analytics data
  const gradeProgressionData = [
    { term: "Spring 2022", Mathematics: 78, Science: 85, History: 83, English: 88, PE: 91 },
    { term: "Fall 2022", Mathematics: 84, Science: 87, History: 82, English: 92, PE: 95 },
    { term: "Spring 2023", Mathematics: 88, Science: 91, History: 85, English: 94, PE: 96 },
    { term: "Current", Mathematics: 95, Science: 92, History: 88, English: 94, PE: 98 },
  ]

  const gradeDistributionData = [
    { name: "A", value: 2, color: "#4ade80" },
    { name: "B", value: 3, color: "#22d3ee" },
    { name: "C", value: 0, color: "#facc15" },
    { name: "D", value: 0, color: "#f87171" },
    { name: "F", value: 0, color: "#ef4444" },
  ]

  const subjectPerformanceData = [
    { subject: "Mathematics", score: 95, average: 82 },
    { subject: "Science", score: 92, average: 79 },
    { subject: "History", score: 88, average: 76 },
    { subject: "English", score: 94, average: 81 },
    { subject: "P.E.", score: 98, average: 88 },
  ]

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
    
    // Generate attendance data for the calendar - using a simpler approach with a dictionary
    const today2 = new Date()
    const attendanceMap: {[key: string]: {status: string, note: string}} = {}
    
    // Generate 31 days of data
    for (let i = 0; i < 31; i++) {
      const day = new Date(today2.getFullYear(), today2.getMonth(), today2.getDate() - i)
      
      // Skip weekends
      if (day.getDay() === 0 || day.getDay() === 6) {
        attendanceMap[day.toISOString().split('T')[0]] = { 
          status: "weekend",
          note: "Weekend - No school" 
        }
        continue
      }
      
      // For days in the future
      if (day > today2) {
        attendanceMap[day.toISOString().split('T')[0]] = { 
          status: "future",
          note: "Upcoming" 
        }
        continue
      }
      
      // Generate random status with bias towards present
      const rand = Math.random()
      let status = "present"
      let note = "Present"
      
      if (rand > 0.9) {
        status = "absent"
        note = "Unexcused absence"
      } else if (rand > 0.85) {
        status = "tardy" 
        note = "Late arrival"
      } else if (rand > 0.8) {
        status = "excused"
        note = "Medical appointment"
      }
      
      attendanceMap[day.toISOString().split('T')[0]] = { status, note }
    }
    
    setCalendarAttendance(attendanceMap)
  }, [])

  return (
    <AppLayout userRole="student">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">My Grades & Attendance</h1>

        <Tabs defaultValue="current" className="space-y-6">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="current">Current Term</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="history">Grade History</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="space-y-8">
            {/* Grades Section */}
            <Card>
              <CardHeader>
                <CardTitle>Current Term Grades</CardTitle>
                <CardDescription>View your grades for the current term</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { subject: "Mathematics", grade: "A", percentage: "95%" },
                    { subject: "Science", grade: "A-", percentage: "92%" },
                    { subject: "History", grade: "B+", percentage: "88%" },
                    { subject: "English", grade: "A", percentage: "94%" },
                    { subject: "Physical Education", grade: "A+", percentage: "98%" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center">
                        <BookOpen className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{item.subject}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{item.grade}</span>
                        <span className="text-xs text-muted-foreground">{item.percentage}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Attendance Summary Cards */}
            <Card>
              <CardHeader>
                <CardTitle>Attendance Overview</CardTitle>
                <CardDescription>Summary of your attendance for the current term</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  <div className="bg-white p-4 rounded-lg border shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium">Present Days</h3>
                      <CheckSquare className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="text-2xl font-bold">{attendanceData.present}</div>
                    <p className="text-xs text-muted-foreground">Out of {attendanceData.total} school days</p>
                  </div>

                  <div className="bg-white p-4 rounded-lg border shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium">Absent Days</h3>
                      <XCircle className="h-4 w-4 text-red-500" />
                    </div>
                    <div className="text-2xl font-bold">{attendanceData.absent}</div>
                    <p className="text-xs text-muted-foreground">Unexcused absences</p>
                  </div>

                  <div className="bg-white p-4 rounded-lg border shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium">Tardy Days</h3>
                      <Clock className="h-4 w-4 text-amber-500" />
                    </div>
                    <div className="text-2xl font-bold">{attendanceData.tardy}</div>
                    <p className="text-xs text-muted-foreground">Late arrivals</p>
                  </div>

                  <div className="bg-white p-4 rounded-lg border shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium">Attendance Rate</h3>
                      <AlertCircle className="h-4 w-4 text-blue-500" />
                    </div>
                    <div className="text-2xl font-bold">{attendanceData.rate}%</div>
                    <p className="text-xs text-muted-foreground">Overall attendance</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Dedicated Attendance Tab */}
          <TabsContent value="attendance">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Attendance Calendar</CardTitle>
                    <CardDescription>View your attendance record for the current term</CardDescription>
                  </div>
                  
                  {/* Legend */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-green-500 mr-1"></div>
                      <span className="text-sm">Present</span>
                    </div>
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-red-500 mr-1"></div>
                      <span className="text-sm">Absent</span>
                    </div>
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-amber-500 mr-1"></div>
                      <span className="text-sm">Tardy</span>
                    </div>
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-blue-500 mr-1"></div>
                      <span className="text-sm">Excused</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Calendar - Left Side */}
                  <div className="w-full lg:basis-[45%] lg:max-w-none">
                    <div className="max-w-md w-full">
                      <h3 className="text-lg font-medium mb-4">{format(new Date(), "MMMM yyyy")}</h3>
                      {/* Calendar wrapper with strict grid reset */}
                      <div className="[&_table]:table-fixed [&_table]:w-full [&_thead_tr]:grid [&_thead_tr]:grid-cols-7 [&_tbody_tr]:grid [&_tbody_tr]:grid-cols-7 [&_th]:tracking-normal [&_th]:leading-none [&_td]:tracking-normal [&_td]:leading-none [&_th]:text-center [&_td]:text-center [&_th]:transform-none [&_td]:transform-none">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          weekStartsOn={0}
                          className="rounded-md border shadow-sm bg-white p-3"
                          modifiers={{
                            present: (date) => {
                              const dateKey = date.toISOString().split('T')[0];
                              return calendarAttendance[dateKey]?.status === 'present';
                            },
                            absent: (date) => {
                              const dateKey = date.toISOString().split('T')[0];
                              return calendarAttendance[dateKey]?.status === 'absent';
                            },
                            tardy: (date) => {
                              const dateKey = date.toISOString().split('T')[0];
                              return calendarAttendance[dateKey]?.status === 'tardy';
                            },
                            excused: (date) => {
                              const dateKey = date.toISOString().split('T')[0];
                              return calendarAttendance[dateKey]?.status === 'excused';
                            },
                            weekend: (date) => {
                              const dateKey = date.toISOString().split('T')[0];
                              return calendarAttendance[dateKey]?.status === 'weekend';
                            }
                          }}
                          modifiersClassNames={{
                            present: "bg-green-100 text-green-800",
                            absent: "bg-red-100 text-red-800",
                            tardy: "bg-amber-100 text-amber-800",
                            excused: "bg-blue-100 text-blue-800",
                            weekend: "bg-gray-100 text-gray-400"
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Selected Day Details - Right Side */}
                  <div className="w-full lg:basis-[55%] lg:flex-grow">
                    {selectedDate && (
                      <div className="bg-white p-6 rounded-lg border shadow-sm">
                        <h3 className="text-xl font-medium mb-4 border-b pb-2">
                          {format(selectedDate, "EEEE, MMMM d, yyyy")}
                        </h3>
                        
                        {(() => {
                          const dateKey = selectedDate.toISOString().split('T')[0];
                          const dayData = calendarAttendance[dateKey];
                          
                          if (!dayData) {
                            return <p className="text-muted-foreground">No attendance data for this day.</p>
                          }
                          
                          if (dayData.status === "weekend") {
                            return <p className="text-muted-foreground">Weekend - No school.</p>
                          }
                          
                          if (dayData.status === "future") {
                            return <p className="text-muted-foreground">No attendance data for this day yet.</p>
                          }
                          
                          return (
                            <div className="space-y-4">
                              <div>
                                <h4 className="text-sm font-medium mb-2">Status</h4>
                                <Badge
                                  variant={
                                    dayData.status === "present" 
                                      ? "default" 
                                      : dayData.status === "excused" 
                                        ? "outline" 
                                        : dayData.status === "tardy"
                                          ? "secondary"
                                          : "destructive"
                                  }
                                  className="px-4 py-1.5 text-sm"
                                >
                                  {dayData.status.charAt(0).toUpperCase() + dayData.status.slice(1)}
                                </Badge>
                              </div>
                              
                              {dayData.note && (
                                <div>
                                  <h4 className="text-sm font-medium mb-2">Note</h4>
                                  <p>{dayData.note}</p>
                                </div>
                              )}
                              
                              <div>
                                <h4 className="text-sm font-medium mb-2">Classes</h4>
                                <div className="space-y-2">
                                  {[
                                    { time: "8:00 AM - 9:30 AM", subject: "Mathematics", status: dayData.status },
                                    { time: "9:45 AM - 11:15 AM", subject: "Science", status: dayData.status },
                                    { time: "11:30 AM - 1:00 PM", subject: "Lunch", status: "present" },
                                    { time: "1:15 PM - 2:45 PM", subject: "English", status: dayData.status },
                                    { time: "3:00 PM - 4:30 PM", subject: "History", status: dayData.status },
                                  ].map((cls, i) => (
                                    <div key={i} className="flex justify-between items-center border-b pb-2">
                                      <div>
                                        <div className="font-medium">{cls.subject}</div>
                                        <div className="text-xs text-muted-foreground">{cls.time}</div>
                                      </div>
                                      <Badge
                                        variant={
                                          cls.status === "present" 
                                            ? "default" 
                                            : cls.status === "excused" 
                                              ? "outline" 
                                              : cls.status === "tardy"
                                                ? "secondary"
                                                : "destructive"
                                        }
                                        className="capitalize"
                                      >
                                        {cls.status}
                                      </Badge>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )
                        })()}
                      </div>
                    )}
                    
                    {!selectedDate && (
                      <div className="bg-white p-6 rounded-lg border shadow-sm flex items-center justify-center h-full">
                        <div className="text-center text-muted-foreground">
                          <CalendarIcon className="h-8 w-8 mx-auto mb-2" />
                          <p>Select a date to view attendance details</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Recent Attendance History */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Attendance History</CardTitle>
                <CardDescription>Your last 10 days of attendance</CardDescription>
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
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                  <CardTitle>Grade History</CardTitle>
                  <CardDescription>View your grades from previous terms</CardDescription>
                </div>
                <div className="mt-4 sm:mt-0">
                  <Select value={selectedTerm} onValueChange={setSelectedTerm}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select term" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="spring2023">Spring 2023</SelectItem>
                      <SelectItem value="fall2022">Fall 2022</SelectItem>
                      <SelectItem value="spring2022">Spring 2022</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">{selectedTerm === "spring2023" ? "Spring 2023" : selectedTerm === "fall2022" ? "Fall 2022" : "Spring 2022"} Term</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Subject</TableHead>
                          <TableHead>Grade</TableHead>
                          <TableHead>Percentage</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pastTermsData[selectedTerm as keyof typeof pastTermsData].map((subject, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{subject.subject}</TableCell>
                            <TableCell>{subject.grade}</TableCell>
                            <TableCell>{subject.percentage}</TableCell>
                            <TableCell>
                              <Badge 
                                className={
                                  subject.grade.startsWith("A") 
                                    ? "bg-green-100 text-green-800" 
                                    : subject.grade.startsWith("B") 
                                      ? "bg-blue-100 text-blue-800" 
                                      : subject.grade.startsWith("C") 
                                        ? "bg-yellow-100 text-yellow-800" 
                                        : "bg-red-100 text-red-800"
                                }
                              >
                                {subject.grade.startsWith("A") 
                                  ? "Excellent" 
                                  : subject.grade.startsWith("B") 
                                    ? "Good" 
                                    : subject.grade.startsWith("C") 
                                      ? "Average" 
                                      : "Needs Improvement"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Term Comparison</h3>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={[
                            { name: "Mathematics", spring2022: pastTermsData.spring2022[0].percentage.replace("%", ""), fall2022: pastTermsData.fall2022[0].percentage.replace("%", ""), spring2023: pastTermsData.spring2023[0].percentage.replace("%", "") },
                            { name: "Science", spring2022: pastTermsData.spring2022[1].percentage.replace("%", ""), fall2022: pastTermsData.fall2022[1].percentage.replace("%", ""), spring2023: pastTermsData.spring2023[1].percentage.replace("%", "") },
                            { name: "History", spring2022: pastTermsData.spring2022[2].percentage.replace("%", ""), fall2022: pastTermsData.fall2022[2].percentage.replace("%", ""), spring2023: pastTermsData.spring2023[2].percentage.replace("%", "") },
                            { name: "English", spring2022: pastTermsData.spring2022[3].percentage.replace("%", ""), fall2022: pastTermsData.fall2022[3].percentage.replace("%", ""), spring2023: pastTermsData.spring2023[3].percentage.replace("%", "") },
                            { name: "P.E.", spring2022: pastTermsData.spring2022[4].percentage.replace("%", ""), fall2022: pastTermsData.fall2022[4].percentage.replace("%", ""), spring2023: pastTermsData.spring2023[4].percentage.replace("%", "") },
                          ]}
                          margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis domain={[0, 100]} />
                          <RechartsTooltip />
                          <RechartsLegend verticalAlign="bottom" height={36} />
                          <Bar dataKey="spring2022" name="Spring 2022" fill="#8884d8" />
                          <Bar dataKey="fall2022" name="Fall 2022" fill="#82ca9d" />
                          <Bar dataKey="spring2023" name="Spring 2023" fill="#ffc658" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Grade Progression</CardTitle>
                <CardDescription>Your academic performance over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={gradeProgressionData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="term" />
                      <YAxis domain={[70, 100]} />
                      <RechartsTooltip />
                      <RechartsLegend />
                      <Line type="monotone" dataKey="Mathematics" stroke="#8884d8" strokeWidth={2} />
                      <Line type="monotone" dataKey="Science" stroke="#82ca9d" strokeWidth={2} />
                      <Line type="monotone" dataKey="History" stroke="#ffc658" strokeWidth={2} />
                      <Line type="monotone" dataKey="English" stroke="#ff8042" strokeWidth={2} />
                      <Line type="monotone" dataKey="PE" stroke="#0088fe" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Grade Distribution</CardTitle>
                  <CardDescription>Distribution of your grades by letter</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={gradeDistributionData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {gradeDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                        <RechartsLegend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance vs. Class Average</CardTitle>
                  <CardDescription>How you compare to your peers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={subjectPerformanceData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="subject" />
                        <YAxis domain={[0, 100]} />
                        <RechartsTooltip />
                        <RechartsLegend />
                        <Bar dataKey="score" name="Your Score" fill="#8884d8" />
                        <Bar dataKey="average" name="Class Average" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Performance Insights</CardTitle>
                <CardDescription>Key observations about your academic performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                    <div className="mt-0.5 bg-blue-100 p-1.5 rounded-full">
                      <BarChart2 className="h-5 w-5 text-blue-700" />
                    </div>
                    <div>
                      <h3 className="text-md font-medium text-blue-900">Consistent Improvement</h3>
                      <p className="text-sm text-blue-800">Your grades have shown consistent improvement across all subjects over the past three terms.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                    <div className="mt-0.5 bg-green-100 p-1.5 rounded-full">
                      <BarChart2 className="h-5 w-5 text-green-700" />
                    </div>
                    <div>
                      <h3 className="text-md font-medium text-green-900">Outstanding Performance</h3>
                      <p className="text-sm text-green-800">You are exceeding the class average in all subjects, with the biggest differential in Mathematics (+13%).</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-lg">
                    <div className="mt-0.5 bg-amber-100 p-1.5 rounded-full">
                      <BarChart2 className="h-5 w-5 text-amber-700" />
                    </div>
                    <div>
                      <h3 className="text-md font-medium text-amber-900">Growth Opportunity</h3>
                      <p className="text-sm text-amber-800">While all subjects show improvement, History has the smallest growth rate. Consider additional focus in this area.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}