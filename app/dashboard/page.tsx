"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, BookOpen, Calendar, CheckCircle, Users } from "lucide-react"
import { getMockClassesData, getMockStudentsData, getMockTasksData } from "@/lib/mockAuth"
import { createBrowserClient } from "@/lib/supabase/client"

export default function TeacherDashboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [classes, setClasses] = useState<any[]>([])
  const [students, setStudents] = useState<any[]>([])
  const [tasks, setTasks] = useState<any[]>([])
  const [userName, setUserName] = useState<string>("Teacher")

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Use real Supabase data
        const supabase = createBrowserClient()

        // Get user profile
        const { data: userData } = await supabase.auth.getUser()
        if (userData.user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("id", userData.user.id)
            .single()

          if (profile) {
            setUserName(profile.full_name)
          }
        }

        // Get classes
        const { data: classesData, error: classesError } = await supabase
          .from("classes")
          .select("*")
          .eq("teacher_id", userData.user?.id)

        if (classesError) throw classesError
        setClasses(classesData || [])

        // Get students (simplified - in a real app you'd get students for specific classes)
        const { data: studentsData, error: studentsError } = await supabase
          .from("profiles")
          .select("*")
          .eq("role", "student")
          .limit(10)

        if (studentsError) throw studentsError
        setStudents(studentsData || [])

        // Get tasks
        const { data: tasksData, error: tasksError } = await supabase.from("tasks").select("*").limit(10)

        if (tasksError) throw tasksError
        setTasks(tasksData || [])
      } catch (err: any) {
        console.error("Error fetching dashboard data:", err)
        setError(err.message || "Failed to load dashboard data")

        // Fallback to mock data
        setClasses(getMockClassesData())
        setStudents(getMockStudentsData())
        setTasks(getMockTasksData())
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2">Welcome, {userName}</h1>
      <p className="text-muted-foreground mb-8">Here's an overview of your teaching dashboard</p>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Classes</p>
                <h3 className="text-2xl font-bold">{classes.length}</h3>
              </div>
              <div className="p-2 bg-blue-100 rounded-full">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Students</p>
                <h3 className="text-2xl font-bold">{students.length}</h3>
              </div>
              <div className="p-2 bg-green-100 rounded-full">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tasks</p>
                <h3 className="text-2xl font-bold">{tasks.length}</h3>
              </div>
              <div className="p-2 bg-purple-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Upcoming</p>
                <h3 className="text-2xl font-bold">3</h3>
              </div>
              <div className="p-2 bg-amber-100 rounded-full">
                <Calendar className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="classes">
        <TabsList className="mb-4">
          <TabsTrigger value="classes">Classes</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
        </TabsList>

        <TabsContent value="classes">
          <Card>
            <CardHeader>
              <CardTitle>Your Classes</CardTitle>
              <CardDescription>Manage your classes and sections</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p>Loading classes...</p>
              ) : classes.length > 0 ? (
                <div className="grid gap-4">
                  {classes.map((cls) => (
                    <div key={cls.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{cls.name}</h4>
                        <p className="text-sm text-muted-foreground">Period {cls.period}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">25 students</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No classes found. Create your first class to get started.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students">
          <Card>
            <CardHeader>
              <CardTitle>Your Students</CardTitle>
              <CardDescription>View and manage student information</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p>Loading students...</p>
              ) : students.length > 0 ? (
                <div className="grid gap-4">
                  {students.map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{student.full_name}</h4>
                        <p className="text-sm text-muted-foreground">ID: {student.id}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No students found.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks">
          <Card>
            <CardHeader>
              <CardTitle>Tasks & Assignments</CardTitle>
              <CardDescription>Manage homework, quizzes, and exams</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p>Loading tasks...</p>
              ) : tasks.length > 0 ? (
                <div className="grid gap-4">
                  {tasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{task.title}</h4>
                        <p className="text-sm text-muted-foreground">Max Points: {task.max_points}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No tasks found. Create your first assignment to get started.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
