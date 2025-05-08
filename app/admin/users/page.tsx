"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { AuthenticatedLayout } from "@/components/authenticated-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, UserPlus, Search, Pencil, Trash2, MoreHorizontal, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getUsers, createUser, updateUser, deleteUser, sendPasswordResetEmail } from "@/lib/user-service"
import type { User } from "@/lib/user-service"

// Define the user schema
const userSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  role: z.enum(["admin", "teacher", "student"], {
    required_error: "Please select a role",
  }),
  password: z.string().min(8, "Password must be at least 8 characters").optional(),
})

export default function AdminUsersPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const tabParam = searchParams.get("tab")

  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState(tabParam || "all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isCreatingUser, setIsCreatingUser] = useState(false)
  const [isUpdatingUser, setIsUpdatingUser] = useState(false)
  const { toast } = useToast()

  // Initialize the create user form
  const createForm = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      fullName: "",
      email: "",
      role: "student",
      password: "",
    },
  })

  // Initialize the edit user form
  const editForm = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema.omit({ password: true })),
    defaultValues: {
      fullName: "",
      email: "",
      role: "student",
    },
  })

  // Update URL when tab changes
  useEffect(() => {
    if (activeTab !== "all") {
      router.push(`/admin/users?tab=${activeTab}`, { scroll: false })
    } else {
      router.push("/admin/users", { scroll: false })
    }
  }, [activeTab, router])

  // Set active tab from URL on initial load
  useEffect(() => {
    if (tabParam && ["all", "admin", "teacher", "student"].includes(tabParam)) {
      setActiveTab(tabParam)
    }
  }, [tabParam])

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      const role = activeTab !== "all" ? (activeTab as "admin" | "teacher" | "student") : undefined
      const { data, error } = await getUsers(role)

      if (error) {
        toast({
          title: "Error",
          description: "Failed to load users. Using cached data if available.",
          variant: "destructive",
        })
      }

      if (data) {
        setUsers(data)
        setFilteredUsers(data)
      }

      setLoading(false)
    }

    fetchUsers()
  }, [activeTab, toast])

  // Add this useEffect after the existing fetchUsers useEffect
  useEffect(() => {
    // Safety timeout to prevent infinite loading state
    const loadingTimeout = setTimeout(() => {
      if (loading) {
        setLoading(false)
        console.warn("Loading timeout triggered for user management")
      }
    }, 10000) // 10 seconds timeout

    return () => clearTimeout(loadingTimeout)
  }, [loading])

  // Filter users based on search query
  useEffect(() => {
    let result = users

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (user) =>
          user.full_name?.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.role.toLowerCase().includes(query),
      )
    }

    setFilteredUsers(result)
  }, [users, searchQuery])

  // Handle create user form submission
  const onCreateUser = async (values: z.infer<typeof userSchema>) => {
    setIsCreatingUser(true)

    try {
      // Generate a random password if not provided
      const password = values.password || generateTemporaryPassword()

      const { data, error } = await createUser({
        email: values.email,
        password,
        fullName: values.fullName,
        role: values.role as "admin" | "teacher" | "student",
      })

      if (error) throw error

      if (data) {
        // Update the users list
        setUsers((prev) => [data, ...prev])

        // Reset the form and close the dialog
        createForm.reset()
        setIsCreateDialogOpen(false)

        toast({
          title: "User created",
          description: "User has been created successfully",
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

  // Handle edit user form submission
  const onEditUser = async (values: z.infer<typeof userSchema>) => {
    if (!selectedUser) return

    setIsUpdatingUser(true)

    try {
      const { data, error } = await updateUser(selectedUser.id, {
        fullName: values.fullName,
        email: values.email,
        role: values.role as "admin" | "teacher" | "student",
      })

      if (error) throw error

      if (data) {
        // Update the users list
        setUsers((prev) => prev.map((user) => (user.id === selectedUser.id ? data : user)))

        // Reset the form and close the dialog
        editForm.reset()
        setIsEditDialogOpen(false)
        setSelectedUser(null)

        toast({
          title: "User updated",
          description: "User has been updated successfully",
        })
      }
    } catch (error: any) {
      toast({
        title: "Error updating user",
        description: error.message || "There was an error updating the user",
        variant: "destructive",
      })
    } finally {
      setIsUpdatingUser(false)
    }
  }

  // Handle user deletion
  const handleDeleteUser = async (userId: string, email: string) => {
    if (!confirm(`Are you sure you want to delete ${email}?`)) return

    try {
      const { success, error } = await deleteUser(userId)

      if (error) throw error

      if (success) {
        // Update the users list
        setUsers((prev) => prev.filter((user) => user.id !== userId))

        toast({
          title: "User deleted",
          description: `${email} has been deleted successfully`,
        })
      }
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
      const { success, error } = await sendPasswordResetEmail(email)

      if (error) throw error

      if (success) {
        toast({
          title: "Password reset email sent",
          description: `A password reset email has been sent to ${email}`,
        })
      }
    } catch (error: any) {
      toast({
        title: "Error sending password reset",
        description: error.message || "There was an error sending the password reset email",
        variant: "destructive",
      })
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

  // Handle edit user button click
  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    editForm.reset({
      fullName: user.full_name || "",
      email: user.email,
      role: user.role,
    })
    setIsEditDialogOpen(true)
  }

  // Get initials for avatar
  const getInitials = (name: string | null) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  // Get role badge color
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
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">User Management</h1>
          </div>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </AuthenticatedLayout>
    )
  }

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">User Management</h1>
          <div className="flex gap-2">
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New User</DialogTitle>
                  <DialogDescription>
                    Add a new user to the system. They will receive an email with login instructions.
                  </DialogDescription>
                </DialogHeader>
                <Form {...createForm}>
                  <form onSubmit={createForm.handleSubmit(onCreateUser)} className="space-y-4">
                    <FormField
                      control={createForm.control}
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
                      control={createForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="user@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={createForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Leave blank for random password" type="password" {...field} />
                          </FormControl>
                          <FormDescription>If left blank, a secure random password will be generated.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={createForm.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a role" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="teacher">Teacher</SelectItem>
                              <SelectItem value="student">Student</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            This determines what permissions and access the user will have.
                          </FormDescription>
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
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search users..."
              className="w-full bg-background pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue={activeTab} className="space-y-4" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All Users</TabsTrigger>
            <TabsTrigger value="teacher">Teachers</TabsTrigger>
            <TabsTrigger value="student">Students</TabsTrigger>
            <TabsTrigger value="admin">Admins</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            <Card>
              <CardHeader>
                <CardTitle>
                  {activeTab === "all"
                    ? "All Users"
                    : activeTab === "teacher"
                      ? "Teachers"
                      : activeTab === "student"
                        ? "Students"
                        : "Admins"}
                </CardTitle>
                <CardDescription>
                  {activeTab === "all"
                    ? "Manage all users in the system"
                    : activeTab === "teacher"
                      ? "Manage teacher accounts"
                      : activeTab === "student"
                        ? "Manage student accounts"
                        : "Manage administrator accounts"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredUsers.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow
                          key={user.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => router.push(`/admin/users/${user.id}`)}
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>{getInitials(user.full_name)}</AvatarFallback>
                              </Avatar>
                              <div className="font-medium">{user.full_name || "Unnamed User"}</div>
                            </div>
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getRoleBadgeColor(user.role)}>
                              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleEditUser(user)}>
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleSendPasswordReset(user.email)}>
                                  <Mail className="mr-2 h-4 w-4" />
                                  Reset Password
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-red-600 focus:text-red-600"
                                  onClick={() => handleDeleteUser(user.id, user.email)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="flex items-center justify-center p-12 border-2 border-dashed rounded-lg">
                    <div className="text-center">
                      <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                      <h3 className="mt-4 text-lg font-medium">No users found</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {searchQuery
                          ? "No users match your search criteria"
                          : `No ${activeTab !== "all" ? activeTab : ""} users found in the system`}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user information and role.</DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditUser)} className="space-y-4">
              <FormField
                control={editForm.control}
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
                control={editForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="user@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editForm.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="teacher">Teacher</SelectItem>
                        <SelectItem value="student">Student</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>This determines what permissions and access the user will have.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="submit" disabled={isUpdatingUser}>
                  {isUpdatingUser ? "Updating..." : "Update User"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </AuthenticatedLayout>
  )
}
