import { AuthenticatedLayout } from "@/components/authenticated-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GraduationCap, BookOpen, BarChart2 } from "lucide-react"

export default function StudentGradesPage() {
  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">My Grades</h1>

        <Tabs defaultValue="current" className="space-y-4">
          <TabsList>
            <TabsTrigger value="current">Current Term</TabsTrigger>
            <TabsTrigger value="history">Grade History</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="current">
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
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Grade History</CardTitle>
                <CardDescription>View your grades from previous terms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center p-12 border-2 border-dashed rounded-lg">
                  <div className="text-center">
                    <GraduationCap className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">Grade History</h3>
                    <p className="mt-2 text-sm text-muted-foreground">Your grade history will be displayed here.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Grade Analytics</CardTitle>
                <CardDescription>View insights about your academic performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center p-12 border-2 border-dashed rounded-lg">
                  <div className="text-center">
                    <BarChart2 className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">Performance Analytics</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Your performance analytics will be displayed here.
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
