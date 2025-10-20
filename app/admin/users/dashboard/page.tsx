"use client"

import { useState } from "react"
import { AuthenticatedLayout } from "@/components/authenticated-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserPlus, Bug } from "lucide-react"
import { Button } from "@/components/ui/button"
import UserList from "../components/user-list"
import { createTestUser } from "@/lib/user-service"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export default function UserDashboardPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isCreatingTestUser, setIsCreatingTestUser] = useState(false)
  const isDebugMode = process.env.NEXT_PUBLIC_DEBUG === "true"

  const handleCreateTestUser = async () => {
    setIsCreatingTestUser(true)
    try {
      const { data, error } = await createTestUser()
      if (error) throw error

      if (data) {
        toast({
          title: "Test user created",
          description: `Test user created with email: ${data.email}`,
        })
        // Refresh the page to show the new user
        router.refresh()
      }
    } catch (error: unknown) {
      console.error("Error creating test user:", error)
      toast({
        title: "Error creating test user",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsCreatingTestUser(false)
    }
  }

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">User Dashboard</h1>
          <div className="flex gap-2">
            <Button onClick={() => router.push("/admin/users/new")}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add User
            </Button>
            {isDebugMode && (
              <Button variant="outline" onClick={handleCreateTestUser} disabled={isCreatingTestUser}>
                <Bug className="mr-2 h-4 w-4" />
                {isCreatingTestUser ? "Creating..." : "Create Test User"}
              </Button>
            )}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Total Users</CardTitle>
              <CardDescription>All registered users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">-</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Teachers</CardTitle>
              <CardDescription>Teacher accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">-</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Students</CardTitle>
              <CardDescription>Student accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">-</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Users</TabsTrigger>
            <TabsTrigger value="teacher">Teachers</TabsTrigger>
            <TabsTrigger value="student">Students</TabsTrigger>
            <TabsTrigger value="admin">Admins</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>All Users</CardTitle>
                <CardDescription>Manage all users in the system</CardDescription>
              </CardHeader>
              <CardContent>
                <UserList />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="teacher">
            <Card>
              <CardHeader>
                <CardTitle>Teachers</CardTitle>
                <CardDescription>Manage teacher accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <UserList initialRole="teacher" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="student">
            <Card>
              <CardHeader>
                <CardTitle>Students</CardTitle>
                <CardDescription>Manage student accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <UserList initialRole="student" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="admin">
            <Card>
              <CardHeader>
                <CardTitle>Administrators</CardTitle>
                <CardDescription>Manage administrator accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <UserList initialRole="admin" />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AuthenticatedLayout>
  )
}
