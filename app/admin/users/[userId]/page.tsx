"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Pencil, Trash2, Mail } from "lucide-react"
import { getUserById, deleteUser, sendPasswordResetEmail } from "@/lib/user-service"
import { useToast } from "@/components/ui/use-toast"
import { AuthenticatedLayout } from "@/components/authenticated-layout"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"

export default function UserDetailsPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = use(params)
  const [user, setUser] = useState<unknown>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const { data, error: fetchError } = await getUserById(userId)

        if (fetchError) {
          setError(fetchError.message)
          toast({
            title: "Error",
            description: "Failed to load user details",
            variant: "destructive",
          })
          return
        }

        if (!data) {
          setError("User not found")
          return
        }

        setUser(data)
      } catch (err: unknown) {
        console.error("Error fetching user details:", err)
        setError(err instanceof Error ? err.message : "An error occurred")
        toast({
          title: "Error",
          description: "Failed to load user details",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchUserDetails()
  }, [userId, toast])

  const handleDelete = async () => {
    try {
      const { success, error } = await deleteUser(userId)

      if (error) throw error

      if (success) {
        toast({
          title: "User deleted",
          description: "User has been deleted successfully",
        })
        router.push("/admin/users")
      }
    } catch (error: unknown) {
      toast({
        title: "Error deleting user",
        description: error instanceof Error ? error.message : "There was an error deleting the user",
        variant: "destructive",
      })
    } finally {
      setShowDeleteDialog(false)
    }
  }

  const handleSendPasswordReset = async () => {
    if (!user) return

    try {
      const { success, error } = await sendPasswordResetEmail(user.email)

      if (error) throw error

      if (success) {
        toast({
          title: "Password reset email sent",
          description: `A password reset email has been sent to ${user.email}`,
        })
      }
    } catch (error: unknown) {
      toast({
        title: "Error sending password reset",
        description: error instanceof Error ? error.message : "There was an error sending the password reset email",
        variant: "destructive",
      })
    }
  }

  const getInitials = (name: string | null) => {
    if (!name) return "U"

    return name
      .split(" ")
      .map((part) => part?.[0] || "")
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "teacher":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "student":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  if (loading) {
    return (
      <AuthenticatedLayout>
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => router.push("/admin/users")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold">User Details</h1>
          </div>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </AuthenticatedLayout>
    )
  }

  if (error || !user) {
    return (
      <AuthenticatedLayout>
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => router.push("/admin/users")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold">User Not Found</h1>
          </div>
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-12">
              <p className="text-lg text-muted-foreground">{error || "User not found"}</p>
              <Button className="mt-4" onClick={() => router.push("/admin/users")}>
                Return to User Management
              </Button>
            </CardContent>
          </Card>
        </div>
      </AuthenticatedLayout>
    )
  }

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/users">Users</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>{user.full_name || user.email}</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => router.push("/admin/users")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold">User Details</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={handleSendPasswordReset}>
              <Mail className="mr-2 h-4 w-4" />
              Send Password Reset
            </Button>
            <Button variant="outline" onClick={() => router.push(`/admin/users/edit/${userId}`)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit User
            </Button>
            <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete User
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>User Profile</CardTitle>
              <CardDescription>Basic information about the user</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarFallback className="text-2xl">{getInitials(user.full_name)}</AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-bold">{user.full_name || "Unnamed User"}</h2>
              <p className="text-muted-foreground mb-2">{user.email}</p>
              <Badge className={`${getRoleBadgeColor(user.role)} mt-2`}>
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </Badge>
              <Separator className="my-4" />
              <div className="w-full text-left space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">User ID:</span>
                  <span className="font-mono text-xs truncate max-w-[150px]" title={user.id}>
                    {user.id}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created:</span>
                  <span>{new Date(user.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Updated:</span>
                  <span>{new Date(user.updated_at).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>User Information</CardTitle>
              <CardDescription>Detailed information and activity</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="details">
                <TabsList className="mb-4">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                  <TabsTrigger value="permissions">Permissions</TabsTrigger>
                </TabsList>
                <TabsContent value="details" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h3 className="font-medium">Contact Information</h3>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Email:</span>
                          <span>{user.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Phone:</span>
                          <span>{user.phone || "Not provided"}</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-medium">Account Status</h3>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Status:</span>
                          <Badge variant="outline" className="bg-green-100 text-green-800">
                            Active
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Email Verified:</span>
                          <span>{user.email_confirmed ? "Yes" : "No"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="activity">
                  <div className="space-y-4">
                    <h3 className="font-medium">Recent Activity</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2 rounded-md hover:bg-muted">
                        <div>
                          <p className="font-medium">Logged in</p>
                          <p className="text-sm text-muted-foreground">From 192.168.1.1</p>
                        </div>
                        <p className="text-sm text-muted-foreground">2 hours ago</p>
                      </div>
                      <div className="flex justify-between items-center p-2 rounded-md hover:bg-muted">
                        <div>
                          <p className="font-medium">Updated profile</p>
                          <p className="text-sm text-muted-foreground">Changed name</p>
                        </div>
                        <p className="text-sm text-muted-foreground">2 days ago</p>
                      </div>
                      <div className="flex justify-between items-center p-2 rounded-md hover:bg-muted">
                        <div>
                          <p className="font-medium">Password reset</p>
                          <p className="text-sm text-muted-foreground">Requested password reset</p>
                        </div>
                        <p className="text-sm text-muted-foreground">1 week ago</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="permissions">
                  <div className="space-y-4">
                    <h3 className="font-medium">Role and Permissions</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span>Role:</span>
                        <Badge className={getRoleBadgeColor(user.role)}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </Badge>
                      </div>
                      <Separator />
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Permissions</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {user.role === "admin" && (
                            <>
                              <div className="flex items-center">
                                <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                                <span>Manage Users</span>
                              </div>
                              <div className="flex items-center">
                                <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                                <span>Manage Classes</span>
                              </div>
                              <div className="flex items-center">
                                <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                                <span>System Settings</span>
                              </div>
                              <div className="flex items-center">
                                <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                                <span>View Reports</span>
                              </div>
                            </>
                          )}
                          {user.role === "teacher" && (
                            <>
                              <div className="flex items-center">
                                <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                                <span>Manage Classes</span>
                              </div>
                              <div className="flex items-center">
                                <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                                <span>Grade Students</span>
                              </div>
                              <div className="flex items-center">
                                <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                                <span>Take Attendance</span>
                              </div>
                              <div className="flex items-center">
                                <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                                <span>Create Assignments</span>
                              </div>
                            </>
                          )}
                          {user.role === "student" && (
                            <>
                              <div className="flex items-center">
                                <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                                <span>View Grades</span>
                              </div>
                              <div className="flex items-center">
                                <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                                <span>Submit Assignments</span>
                              </div>
                              <div className="flex items-center">
                                <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                                <span>View Schedule</span>
                              </div>
                              <div className="flex items-center">
                                <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                                <span>View Attendance</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user account and remove their data from our
              servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AuthenticatedLayout>
  )
}
