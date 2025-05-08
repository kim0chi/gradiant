"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Plus, Trash2, Mail } from "lucide-react"
import { supabase, getCurrentUser } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import DashboardLayout from "@/components/dashboard-layout"

// Define the form schema with Zod
const newUserSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
})

// Define the user type
type InstitutionalUser = {
  id: string
  email: string
  full_name: string
  role: string
  created_at: string
  password_changed_at: string | null
}

export default function InstitutionalUsersPage() {
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState<InstitutionalUser[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isCreatingUser, setIsCreatingUser] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // Initialize the form
  const form = useForm<z.infer<typeof newUserSchema>>({
    resolver: zodResolver(newUserSchema),
    defaultValues: {
      fullName: "",
      email: "",
    },
  })

  // Fetch institutional users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const user = await getCurrentUser()

        if (!user) {
          router.push("/login")
          return
        }

        // Only admins should access this page
        if (user.role !== "admin") {
          router.push("/dashboard")
          return
        }

        // Fetch institutional users
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("institutional", true)
          .order("created_at", { ascending: false })

        if (error) throw error

        setUsers(data || [])
      } catch (error) {
        console.error("Error fetching users:", error)
        toast({
          title: "Error",
          description: "Failed to load institutional users",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [router, toast])

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof newUserSchema>) => {
    setIsCreatingUser(true)

    try {
      // Generate a random password
      const tempPassword = generateTemporaryPassword()

      // Create the user in Supabase Auth
      const { data, error } = await supabase.auth.admin.createUser({
        email: values.email,
        password: tempPassword,
        email_confirm: true, // Auto-confirm the email
        user_metadata: {
          full_name: values.fullName,
        },
      })

      if (error) throw error

      // Create a profile record
      if (data.user) {
        const { error: profileError } = await supabase.from("profiles").insert({
          id: data.user.id,
          email: values.email,
          full_name: values.fullName,
          role: "teacher", // Institutional users are always teachers
          institutional: true,
          password_changed_at: null, // Will be set when they change their password
        })

        if (profileError) throw profileError

        // Send email with temporary credentials
        await sendWelcomeEmail(values.email, values.fullName, tempPassword)

        // Update the users list
        setUsers((prev) => [
          {
            id: data.user!.id,
            email: values.email,
            full_name: values.fullName,
            role: "teacher",
            created_at: new Date().toISOString(),
            password_changed_at: null,
          },
          ...prev,
        ])

        // Reset the form and close the dialog
        form.reset()
        setIsDialogOpen(false)

        toast({
          title: "User created",
          description: "Institutional user has been created successfully",
        })
      }
    } catch (error: any) {
      toast({
        title: "Error creating user",
        description: error.message || "There was an error creating the user",
        variant: "destructive",
      })
    } finally {
      setIsCreatingUser(false)
    }
  }

  // Generate a temporary password
  const generateTemporaryPassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*"
    let password = ""
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return password
  }

  // Send welcome email with temporary credentials
  const sendWelcomeEmail = async (email: string, name: string, password: string) => {
    // In a real application, you would use an email service
    // For now, we'll just log the credentials
    console.log(`Welcome email to ${name} (${email}):`)
    console.log(`Temporary password: ${password}`)

    // Mock email sending
    return new Promise((resolve) => setTimeout(resolve, 500))
  }

  // Handle user deletion
  const handleDeleteUser = async (userId: string, email: string) => {
    if (!confirm(`Are you sure you want to delete ${email}?`)) return

    try {
      // Delete the user from Supabase Auth
      const { error } = await supabase.auth.admin.deleteUser(userId)

      if (error) throw error

      // Update the users list
      setUsers((prev) => prev.filter((user) => user.id !== userId))

      toast({
        title: "User deleted",
        description: `${email} has been deleted successfully`,
      })
    } catch (error: any) {
      toast({
        title: "Error deleting user",
        description: error.message || "There was an error deleting the user",
        variant: "destructive",
      })
    }
  }

  // Handle sending password reset email
  const handleSendPasswordReset = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) throw error

      toast({
        title: "Password reset email sent",
        description: `A password reset email has been sent to ${email}`,
      })
    } catch (error: any) {
      toast({
        title: "Error sending password reset",
        description: error.message || "There was an error sending the password reset email",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">Institutional Users</h1>
          <p>Loading...</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Institutional Users</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Institutional User</DialogTitle>
                <DialogDescription>
                  Create a new institutional teacher account. The user will receive an email with temporary credentials.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="teacher@school.edu" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <Button type="submit" disabled={isCreatingUser}>
                      {isCreatingUser ? "Creating..." : "Create User"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="active">Active Users</TabsTrigger>
            <TabsTrigger value="pending">Pending Password Change</TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            <Card>
              <CardHeader>
                <CardTitle>Active Institutional Users</CardTitle>
                <CardDescription>
                  These users have completed their account setup and changed their initial password.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users
                      .filter((user) => user.password_changed_at !== null)
                      .map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.full_name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell className="capitalize">{user.role}</TableCell>
                          <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm" onClick={() => handleSendPasswordReset(user.email)}>
                                <Mail className="h-4 w-4 mr-1" />
                                Reset Password
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-500 hover:text-red-700"
                                onClick={() => handleDeleteUser(user.id, user.email)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    {users.filter((user) => user.password_changed_at !== null).length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4">
                          No active institutional users found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>Pending Password Change</CardTitle>
                <CardDescription>
                  These users have not yet changed their initial password and completed their account setup.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users
                      .filter((user) => user.password_changed_at === null)
                      .map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.full_name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell className="capitalize">{user.role}</TableCell>
                          <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm" onClick={() => handleSendPasswordReset(user.email)}>
                                <Mail className="h-4 w-4 mr-1" />
                                Resend Invite
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-500 hover:text-red-700"
                                onClick={() => handleDeleteUser(user.id, user.email)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    {users.filter((user) => user.password_changed_at === null).length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4">
                          No pending institutional users found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
