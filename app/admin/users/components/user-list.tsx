"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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
import { Input } from "@/components/ui/input"
import { MoreHorizontal, Search, UserPlus, Edit, Trash2, Mail, Eye, Bug } from "lucide-react"
import {
  getUsers,
  deleteUser,
  sendPasswordResetEmail,
  createTestUser,
  type User,
  type UserRole,
} from "@/lib/user-service"
import { useToast } from "@/components/ui/use-toast"
import { DemoDataControls } from "./demo-data-controls"

interface UserListProps {
  initialRole?: UserRole
}

export default function UserList({ initialRole }: UserListProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [currentRole] = useState<UserRole | undefined>(initialRole)
  const [error, setError] = useState<string | null>(null)
  const [isCreatingTestUser, setIsCreatingTestUser] = useState(false)

  useEffect(() => {
    loadUsers()
  }, [currentRole])

  const loadUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error } = await getUsers(currentRole)
      if (error) {
        setError(`Error loading users: ${error.message || "Unknown error"}`)
        throw error
      }
      setUsers(data || [])
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      console.error("Error loading users:", error)
      setError(`Failed to load users: ${errorMessage}`)
      toast({
        title: "Error loading users",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedUser) return

    try {
      const { success, error } = await deleteUser(selectedUser.id)
      if (error) throw error

      if (success) {
        setUsers(users.filter((user) => user.id !== selectedUser.id))
        setShowDeleteDialog(false)
        setSelectedUser(null)
        toast({
          title: "User deleted",
          description: `User ${selectedUser.email} has been deleted successfully`,
        })
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
      console.error("Error deleting user:", error)
      toast({
        title: "Error deleting user",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  const handleSendPasswordReset = async (user: User) => {
    try {
      const { success, error } = await sendPasswordResetEmail(user.email)
      if (error) throw error

      if (success) {
        toast({
          title: "Password reset email sent",
          description: `Password reset email sent to ${user.email}`,
        })
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
      console.error("Error sending password reset:", error)
      toast({
        title: "Error sending password reset",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  const handleCreateTestUser = async () => {
    setIsCreatingTestUser(true)
    try {
      const { data, error } = await createTestUser()
      if (error) throw error

      if (data) {
        setUsers([data, ...users])
        toast({
          title: "Test user created",
          description: `Test user created with email: ${data.email}`,
        })
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
      console.error("Error creating test user:", error)
      toast({
        title: "Error creating test user",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsCreatingTestUser(false)
    }
  }

  const filteredUsers = users.filter((user) => {
    if (!searchQuery) return true

    const query = searchQuery.toLowerCase()
    return user.email.toLowerCase().includes(query) || (user.full_name && user.full_name.toLowerCase().includes(query))
  })

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800"
      case "teacher":
        return "bg-blue-100 text-blue-800"
      case "student":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getInitials = (name: string) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((part) => part?.[0] || "")
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const isDebugMode = process.env.NEXT_PUBLIC_DEBUG === "true"

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
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
          <DemoDataControls />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium">Error</h3>
              <div className="mt-2 text-sm">{error}</div>
              <div className="mt-4">
                <Button size="sm" variant="outline" onClick={loadUsers}>
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-md shadow">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    <div className="flex flex-col items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
                      <span>Loading users...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    {searchQuery ? (
                      <div>
                        <p className="text-muted-foreground">No users match your search</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <p className="text-muted-foreground">{`No ${currentRole || ""} users found in the system`}</p>
                        <div className="flex justify-center gap-2">
                          <Button variant="outline" onClick={() => router.push("/admin/users/new")}>
                            <UserPlus className="mr-2 h-4 w-4" />
                            Add User
                          </Button>
                          <DemoDataControls />
                        </div>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          {user.avatar_url ? (
                            <AvatarImage src={user.avatar_url || "/placeholder.svg"} alt={user.full_name || "User"} />
                          ) : (
                            <AvatarFallback>{getInitials(user.full_name || "")}</AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.full_name || "Unnamed User"}</div>
                          {user.is_demo && <div className="text-xs text-muted-foreground">Demo User</div>}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge className={getRoleBadgeColor(user.role)}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => router.push(`/admin/users/${user.id}`)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push(`/admin/users/edit/${user.id}`)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleSendPasswordReset(user)}>
                            <Mail className="mr-2 h-4 w-4" />
                            Send Password Reset
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => {
                              setSelectedUser(user)
                              setShowDeleteDialog(true)
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the user account for{" "}
              <span className="font-semibold">{selectedUser?.email}</span>. This action cannot be undone.
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
    </div>
  )
}
