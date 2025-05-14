import { AuthenticatedLayout } from "@/components/authenticated-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, GraduationCap, BookOpen, Clock } from "lucide-react"

export default function StudentDashboardPage() {
  return (
    <AuthenticatedLayout>
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">Student Dashboard</h1>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="grades">Grades</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Current GPA</CardTitle>
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3.8</div>
                  <p className="text-xs text-muted-foreground">+0.2 from last semester</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">98%</div>
                  <p className="text-xs text-muted-foreground">Last 30 days</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completed Assignments</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24/25</div>
                  <p className="text-xs text-muted-foreground">96% completion rate</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Upcoming Due Dates</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">Next 7 days</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Recent Grades</CardTitle>
                  <CardDescription>Your most recent assignment scores</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {[
                      { name: "Math Quiz 3", grade: "A", score: "95/100" },
                      { name: "History Essay", grade: "B+", score: "88/100" },
                      { name: "Science Lab Report", grade: "A-", score: "92/100" },
                      { name: "English Presentation", grade: "A", score: "96/100" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between border-b pb-2">
                        <span>{item.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{item.grade}</span>
                          <span className="text-xs text-muted-foreground">{item.score}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Upcoming Assignments</CardTitle>
                  <CardDescription>Tasks due in the next 7 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {[
                      { name: "Math Problem Set", due: "Tomorrow", class: "Algebra II" },
                      { name: "History Research Paper", due: "In 3 days", class: "World History" },
                      { name: "Science Lab", due: "In 5 days", class: "Biology" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between border-b pb-2">
                        <div>
                          <div>{item.name}</div>
                          <div className="text-xs text-muted-foreground">{item.class}</div>
                        </div>
                        <span className="text-sm font-medium">{item.due}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="assignments">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Assignments</CardTitle>
                  <CardDescription>View and manage your assignments</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <select className="rounded-md border border-input bg-background px-3 py-1 text-sm">
                    <option value="all">All Subjects</option>
                    <option value="math">Mathematics</option>
                    <option value="science">Science</option>
                    <option value="english">English</option>
                    <option value="history">History</option>
                  </select>
                  <select className="rounded-md border border-input bg-background px-3 py-1 text-sm">
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="late">Late</option>
                  </select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      id: 1,
                      title: "Math Problem Set #12",
                      subject: "Mathematics",
                      dueDate: "2023-05-15",
                      status: "pending",
                      description: "Complete problems 1-20 in Chapter 8",
                    },
                    {
                      id: 2,
                      title: "Lab Report: Photosynthesis",
                      subject: "Science",
                      dueDate: "2023-05-18",
                      status: "pending",
                      description: "Write a lab report on the photosynthesis experiment",
                    },
                    {
                      id: 3,
                      title: "Essay: Modern Literature",
                      subject: "English",
                      dueDate: "2023-05-10",
                      status: "completed",
                      description: "1500-word essay on a modern author of your choice",
                    },
                    {
                      id: 4,
                      title: "Historical Figure Research",
                      subject: "History",
                      dueDate: "2023-05-08",
                      status: "late",
                      description: "Research presentation on a historical figure",
                    },
                  ].map((assignment) => (
                    <div
                      key={assignment.id}
                      className={`rounded-lg border p-4 ${
                        assignment.status === "completed"
                          ? "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30"
                          : assignment.status === "late"
                            ? "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30"
                            : "border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950/30"
                      }`}
                    >
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h3 className="font-semibold">{assignment.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {assignment.subject} • Due: {new Date(assignment.dueDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              assignment.status === "completed"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                                : assignment.status === "late"
                                  ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                                  : "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100"
                            }`}
                          >
                            {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                          </span>
                          <button className="inline-flex h-8 items-center justify-center rounded-md bg-primary px-3 text-xs text-primary-foreground">
                            {assignment.status === "completed" ? "View Submission" : "Submit"}
                          </button>
                        </div>
                      </div>
                      <p className="mt-2 text-sm">{assignment.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="grades">
            <Card>
              <CardHeader>
                <CardTitle>Grades</CardTitle>
                <CardDescription>View your grades for all classes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Grade Summary */}
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
                      <div className="text-sm font-medium text-muted-foreground">Current GPA</div>
                      <div className="mt-1 text-3xl font-bold">3.8</div>
                    </div>
                    <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
                      <div className="text-sm font-medium text-muted-foreground">Highest Grade</div>
                      <div className="mt-1 text-3xl font-bold">A+</div>
                    </div>
                    <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
                      <div className="text-sm font-medium text-muted-foreground">Lowest Grade</div>
                      <div className="mt-1 text-3xl font-bold">B-</div>
                    </div>
                    <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
                      <div className="text-sm font-medium text-muted-foreground">Semester Progress</div>
                      <div className="mt-1 text-3xl font-bold">75%</div>
                    </div>
                  </div>

                  {/* Grade Table */}
                  <div className="rounded-md border">
                    <div className="flex items-center justify-between bg-muted/50 p-4">
                      <h3 className="text-sm font-semibold">Current Grades by Subject</h3>
                      <select className="rounded-md border border-input bg-background px-3 py-1 text-sm">
                        <option value="semester">Current Semester</option>
                        <option value="quarter1">Quarter 1</option>
                        <option value="quarter2">Quarter 2</option>
                        <option value="quarter3">Quarter 3</option>
                        <option value="quarter4">Quarter 4</option>
                      </select>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b bg-muted/50 text-sm">
                            <th className="px-4 py-3 text-left font-medium">Subject</th>
                            <th className="px-4 py-3 text-left font-medium">Current Grade</th>
                            <th className="px-4 py-3 text-left font-medium">Letter Grade</th>
                            <th className="px-4 py-3 text-left font-medium">Recent Assignments</th>
                            <th className="px-4 py-3 text-left font-medium">Trend</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            {
                              subject: "Mathematics - Algebra II",
                              grade: 94,
                              letter: "A",
                              recent: [96, 92, 94, 95],
                              trend: "up",
                            },
                            {
                              subject: "Science - Biology",
                              grade: 88,
                              letter: "B+",
                              recent: [85, 90, 88, 89],
                              trend: "stable",
                            },
                            {
                              subject: "English Literature",
                              grade: 91,
                              letter: "A-",
                              recent: [88, 89, 92, 95],
                              trend: "up",
                            },
                            {
                              subject: "History - World Studies",
                              grade: 82,
                              letter: "B-",
                              recent: [78, 80, 84, 85],
                              trend: "up",
                            },
                            {
                              subject: "Spanish II",
                              grade: 89,
                              letter: "B+",
                              recent: [92, 89, 87, 88],
                              trend: "down",
                            },
                            {
                              subject: "Physical Education",
                              grade: 95,
                              letter: "A",
                              recent: [95, 95, 95, 95],
                              trend: "stable",
                            },
                          ].map((subject, index) => (
                            <tr key={index} className="border-b">
                              <td className="px-4 py-3 font-medium">{subject.subject}</td>
                              <td className="px-4 py-3">{subject.grade}%</td>
                              <td className="px-4 py-3">{subject.letter}</td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-1">
                                  {subject.recent.map((score, i) => (
                                    <div
                                      key={i}
                                      className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-medium ${
                                        score >= 90
                                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                          : score >= 80
                                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                                            : score >= 70
                                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                                              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                                      }`}
                                    >
                                      {score}
                                    </div>
                                  ))}
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                {subject.trend === "up" ? (
                                  <span className="inline-flex items-center text-green-600 dark:text-green-400">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="16"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="mr-1"
                                    >
                                      <path d="m18 15-6-6-6 6" />
                                    </svg>
                                    Improving
                                  </span>
                                ) : subject.trend === "down" ? (
                                  <span className="inline-flex items-center text-red-600 dark:text-red-400">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="16"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="mr-1"
                                    >
                                      <path d="m6 9 6 6 6-6" />
                                    </svg>
                                    Declining
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center text-blue-600 dark:text-blue-400">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="16"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="mr-1"
                                    >
                                      <path d="M8 12h8" />
                                    </svg>
                                    Stable
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Grade Distribution */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-md border">
                      <div className="bg-muted/50 p-4">
                        <h3 className="text-sm font-semibold">Grade Distribution</h3>
                      </div>
                      <div className="p-4">
                        <div className="flex items-end gap-2 h-[180px]">
                          <div className="flex-1 flex flex-col items-center">
                            <div
                              className="bg-green-500 dark:bg-green-600 w-full rounded-t"
                              style={{ height: "150px" }}
                            ></div>
                            <span className="mt-2 text-xs">A</span>
                          </div>
                          <div className="flex-1 flex flex-col items-center">
                            <div
                              className="bg-green-300 dark:bg-green-500 w-full rounded-t"
                              style={{ height: "90px" }}
                            ></div>
                            <span className="mt-2 text-xs">B</span>
                          </div>
                          <div className="flex-1 flex flex-col items-center">
                            <div
                              className="bg-yellow-300 dark:bg-yellow-500 w-full rounded-t"
                              style={{ height: "30px" }}
                            ></div>
                            <span className="mt-2 text-xs">C</span>
                          </div>
                          <div className="flex-1 flex flex-col items-center">
                            <div
                              className="bg-red-300 dark:bg-red-500 w-full rounded-t"
                              style={{ height: "0px" }}
                            ></div>
                            <span className="mt-2 text-xs">D</span>
                          </div>
                          <div className="flex-1 flex flex-col items-center">
                            <div
                              className="bg-red-500 dark:bg-red-600 w-full rounded-t"
                              style={{ height: "0px" }}
                            ></div>
                            <span className="mt-2 text-xs">F</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-md border">
                      <div className="bg-muted/50 p-4">
                        <h3 className="text-sm font-semibold">Grade History</h3>
                      </div>
                      <div className="p-4">
                        <div className="h-[180px] relative">
                          {/* This is a simplified representation of a line chart */}
                          <div className="absolute inset-0 flex items-end">
                            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                              <polyline
                                points="0,40 20,35 40,30 60,25 80,20 100,15"
                                fill="none"
                                stroke="hsl(var(--primary))"
                                strokeWidth="2"
                              />
                              <path
                                d="M0,40 L20,35 L40,30 L60,25 L80,20 L100,15 V100 H0 Z"
                                fill="hsl(var(--primary))"
                                fillOpacity="0.1"
                              />
                            </svg>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-muted-foreground">
                            <span>Aug</span>
                            <span>Sep</span>
                            <span>Oct</span>
                            <span>Nov</span>
                            <span>Dec</span>
                            <span>Jan</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recently Graded Assignments */}
                  <div className="rounded-md border">
                    <div className="bg-muted/50 p-4">
                      <h3 className="text-sm font-semibold">Recently Graded Assignments</h3>
                    </div>
                    <div className="divide-y">
                      {[
                        {
                          name: "Math Quiz: Quadratic Equations",
                          date: "Jan 12, 2023",
                          grade: "95/100",
                          subject: "Mathematics",
                        },
                        {
                          name: "Lab Report: Cell Division",
                          date: "Jan 10, 2023",
                          grade: "88/100",
                          subject: "Science",
                        },
                        {
                          name: "Essay: Symbolism in Literature",
                          date: "Jan 5, 2023",
                          grade: "92/100",
                          subject: "English",
                        },
                        {
                          name: "Research Project: Industrial Revolution",
                          date: "Dec 20, 2022",
                          grade: "85/100",
                          subject: "History",
                        },
                        { name: "Oral Presentation", date: "Dec 15, 2022", grade: "90/100", subject: "Spanish" },
                      ].map((assignment, index) => (
                        <div key={index} className="flex items-center justify-between p-4">
                          <div>
                            <div className="font-medium">{assignment.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {assignment.subject} • {assignment.date}
                            </div>
                          </div>
                          <div className="font-medium">{assignment.grade}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="attendance">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Attendance</CardTitle>
                  <CardDescription>View your attendance record</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <select className="rounded-md border border-input bg-background px-3 py-1 text-sm">
                    <option value="current">Current Semester</option>
                    <option value="previous">Previous Semester</option>
                    <option value="year">Full Academic Year</option>
                  </select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Attendance Summary */}
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
                      <div className="text-sm font-medium text-muted-foreground">Attendance Rate</div>
                      <div className="mt-1 text-3xl font-bold">98%</div>
                      <div className="text-xs text-muted-foreground mt-1">2% higher than class average</div>
                    </div>
                    <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
                      <div className="text-sm font-medium text-muted-foreground">Present Days</div>
                      <div className="mt-1 text-3xl font-bold">86</div>
                      <div className="text-xs text-muted-foreground mt-1">Out of 88 school days</div>
                    </div>
                    <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
                      <div className="text-sm font-medium text-muted-foreground">Absences</div>
                      <div className="mt-1 text-3xl font-bold">2</div>
                      <div className="text-xs text-muted-foreground mt-1">1 excused, 1 unexcused</div>
                    </div>
                    <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
                      <div className="text-sm font-medium text-muted-foreground">Tardies</div>
                      <div className="mt-1 text-3xl font-bold">3</div>
                      <div className="text-xs text-muted-foreground mt-1">All excused</div>
                    </div>
                  </div>

                  {/* Attendance Calendar */}
                  <div className="rounded-md border">
                    <div className="bg-muted/50 p-4">
                      <h3 className="text-sm font-semibold">Attendance Calendar</h3>
                    </div>
                    <div className="p-4">
                      <div className="grid grid-cols-7 gap-1 text-center">
                        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                          <div key={day} className="text-xs font-medium py-1">
                            {day}
                          </div>
                        ))}
                        {Array.from({ length: 35 }).map((_, i) => {
                          // Generate some sample attendance data
                          const day = i - 2 // Offset to start on the correct day
                          if (day < 0 || day >= 31) return <div key={i} className="h-10 rounded-md"></div>

                          const isWeekend = i % 7 === 5 || i % 7 === 6
                          if (isWeekend)
                            return (
                              <div
                                key={i}
                                className="h-10 rounded-md bg-muted/20 flex items-center justify-center text-xs text-muted-foreground"
                              >
                                {day + 1}
                              </div>
                            )

                          // Random attendance status for demonstration
                          const status =
                            day === 8
                              ? "absent-unexcused"
                              : day === 15
                                ? "absent-excused"
                                : day === 4 || day === 22 || day === 28
                                  ? "tardy"
                                  : "present"

                          return (
                            <div
                              key={i}
                              className={`h-10 rounded-md flex items-center justify-center text-xs ${
                                status === "present"
                                  ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200"
                                  : status === "tardy"
                                    ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200"
                                    : status === "absent-excused"
                                      ? "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200"
                                      : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200"
                              }`}
                            >
                              {day + 1}
                            </div>
                          )
                        })}
                      </div>
                      <div className="flex items-center justify-center mt-4 gap-4 text-xs">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-green-500 dark:bg-green-600 mr-1"></div>
                          <span>Present</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-yellow-500 dark:bg-yellow-600 mr-1"></div>
                          <span>Tardy</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-orange-500 dark:bg-orange-600 mr-1"></div>
                          <span>Excused</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-red-500 dark:bg-red-600 mr-1"></div>
                          <span>Unexcused</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Attendance Analytics */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-md border">
                      <div className="bg-muted/50 p-4">
                        <h3 className="text-sm font-semibold">Attendance Trends</h3>
                      </div>
                      <div className="p-4">
                        <div className="h-[180px] relative">
                          {/* This is a simplified representation of a line chart */}
                          <div className="absolute inset-0 flex items-end">
                            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                              <polyline
                                points="0,10 20,10 40,10 60,20 80,10 100,10"
                                fill="none"
                                stroke="hsl(var(--primary))"
                                strokeWidth="2"
                              />
                              <path
                                d="M0,10 L20,10 L40,10 L60,20 L80,10 L100,10 V100 H0 Z"
                                fill="hsl(var(--primary))"
                                fillOpacity="0.1"
                              />
                            </svg>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-muted-foreground">
                            <span>Aug</span>
                            <span>Sep</span>
                            <span>Oct</span>
                            <span>Nov</span>
                            <span>Dec</span>
                            <span>Jan</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-md border">
                      <div className="bg-muted/50 p-4">
                        <h3 className="text-sm font-semibold">Attendance by Day of Week</h3>
                      </div>
                      <div className="p-4">
                        <div className="flex items-end gap-2 h-[180px]">
                          <div className="flex-1 flex flex-col items-center">
                            <div className="bg-primary w-full rounded-t" style={{ height: "150px" }}></div>
                            <span className="mt-2 text-xs">Mon</span>
                          </div>
                          <div className="flex-1 flex flex-col items-center">
                            <div className="bg-primary w-full rounded-t" style={{ height: "150px" }}></div>
                            <span className="mt-2 text-xs">Tue</span>
                          </div>
                          <div className="flex-1 flex flex-col items-center">
                            <div className="bg-primary w-full rounded-t" style={{ height: "150px" }}></div>
                            <span className="mt-2 text-xs">Wed</span>
                          </div>
                          <div className="flex-1 flex flex-col items-center">
                            <div className="bg-primary w-full rounded-t" style={{ height: "130px" }}></div>
                            <span className="mt-2 text-xs">Thu</span>
                          </div>
                          <div className="flex-1 flex flex-col items-center">
                            <div className="bg-primary w-full rounded-t" style={{ height: "140px" }}></div>
                            <span className="mt-2 text-xs">Fri</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Detailed Attendance Records */}
                  <div className="rounded-md border">
                    <div className="bg-muted/50 p-4">
                      <h3 className="text-sm font-semibold">Attendance Records</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b bg-muted/50 text-sm">
                            <th className="px-4 py-3 text-left font-medium">Date</th>
                            <th className="px-4 py-3 text-left font-medium">Status</th>
                            <th className="px-4 py-3 text-left font-medium">Class Period</th>
                            <th className="px-4 py-3 text-left font-medium">Notes</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            {
                              date: "Jan 15, 2023",
                              status: "Present",
                              period: "All Day",
                              notes: "",
                            },
                            {
                              date: "Jan 14, 2023",
                              status: "Present",
                              period: "All Day",
                              notes: "",
                            },
                            {
                              date: "Jan 13, 2023",
                              status: "Present",
                              period: "All Day",
                              notes: "",
                            },
                            {
                              date: "Jan 12, 2023",
                              status: "Tardy",
                              period: "1st Period",
                              notes: "Arrived 5 minutes late",
                            },
                            {
                              date: "Jan 11, 2023",
                              status: "Present",
                              period: "All Day",
                              notes: "",
                            },
                            {
                              date: "Jan 10, 2023",
                              status: "Present",
                              period: "All Day",
                              notes: "",
                            },
                            {
                              date: "Jan 9, 2023",
                              status: "Absent (Excused)",
                              period: "All Day",
                              notes: "Doctor's appointment",
                            },
                          ].map((record, index) => (
                            <tr key={index} className="border-b">
                              <td className="px-4 py-3 font-medium">{record.date}</td>
                              <td className="px-4 py-3">
                                <span
                                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                    record.status === "Present"
                                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                      : record.status === "Tardy"
                                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                                        : record.status.includes("Excused")
                                          ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
                                          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                                  }`}
                                >
                                  {record.status}
                                </span>
                              </td>
                              <td className="px-4 py-3">{record.period}</td>
                              <td className="px-4 py-3 text-muted-foreground">{record.notes}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AuthenticatedLayout>
  )
}
