import { AuthenticatedLayout } from "@/components/authenticated-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Users, CheckSquare, BarChart2 } from "lucide-react"

export default function GradebookPage() {
  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Gradebook</h1>

        <Tabs defaultValue="grades" className="space-y-4">
          <TabsList>
            <TabsTrigger value="grades">Grades</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="grades">
            <Card>
              <CardHeader>
                <CardTitle>Grade Management</CardTitle>
                <CardDescription>View and manage student grades</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center p-12 border-2 border-dashed rounded-lg">
                  <div className="text-center">
                    <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">Grade Management</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      The grade management interface will be displayed here.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="attendance">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Tracking</CardTitle>
                <CardDescription>Track and manage student attendance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center p-12 border-2 border-dashed rounded-lg">
                  <div className="text-center">
                    <CheckSquare className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">Attendance Tracking</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      The attendance tracking interface will be displayed here.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="students">
            <Card>
              <CardHeader>
                <CardTitle>Student Management</CardTitle>
                <CardDescription>Manage students in your classes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center p-12 border-2 border-dashed rounded-lg">
                  <div className="text-center">
                    <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">Student Management</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      The student management interface will be displayed here.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Grade Analytics</CardTitle>
                <CardDescription>View analytics and insights for your classes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center p-12 border-2 border-dashed rounded-lg">
                  <div className="text-center">
                    <BarChart2 className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">Grade Analytics</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      The grade analytics interface will be displayed here.
                    </p>
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
