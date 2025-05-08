"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Pencil, Trash, Plus } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

// Sample roles data
const initialRoles = [
  {
    id: 1,
    name: "Admin",
    description: "Full system access and control",
    userCount: 5,
  },
  {
    id: 2,
    name: "Teacher",
    description: "Access to classes, grades, and attendance",
    userCount: 42,
  },
  {
    id: 3,
    name: "Student",
    description: "Limited access to view grades and assignments",
    userCount: 358,
  },
  {
    id: 4,
    name: "Parent",
    description: "View child's grades and attendance",
    userCount: 215,
  },
  {
    id: 5,
    name: "School Admin",
    description: "Administrative access for a specific school",
    userCount: 12,
  },
]

export function RolesTable() {
  const [roles, setRoles] = useState(initialRoles)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentRole, setCurrentRole] = useState<any>(null)
  const [newRole, setNewRole] = useState({ name: "", description: "" })

  const handleAddRole = () => {
    if (!newRole.name) {
      toast({
        title: "Error",
        description: "Role name is required",
        variant: "destructive",
      })
      return
    }

    const role = {
      id: roles.length + 1,
      name: newRole.name,
      description: newRole.description,
      userCount: 0,
    }

    setRoles([...roles, role])
    setNewRole({ name: "", description: "" })
    setIsAddDialogOpen(false)

    toast({
      title: "Role added",
      description: `${role.name} role has been added successfully.`,
    })
  }

  const handleEditRole = () => {
    if (!currentRole.name) {
      toast({
        title: "Error",
        description: "Role name is required",
        variant: "destructive",
      })
      return
    }

    setRoles(roles.map((role) => (role.id === currentRole.id ? currentRole : role)))

    setIsEditDialogOpen(false)

    toast({
      title: "Role updated",
      description: `${currentRole.name} role has been updated successfully.`,
    })
  }

  const handleDeleteRole = (id: number) => {
    setRoles(roles.filter((role) => role.id !== id))

    toast({
      title: "Role deleted",
      description: "The role has been deleted successfully.",
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Role
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Role</DialogTitle>
              <DialogDescription>Create a new role with specific permissions.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Role Name</Label>
                <Input
                  id="name"
                  value={newRole.name}
                  onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                  placeholder="Enter role name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newRole.description}
                  onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                  placeholder="Enter role description"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddRole}>Add Role</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Role Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-center">Users</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles.map((role) => (
              <TableRow key={role.id}>
                <TableCell className="font-medium">{role.name}</TableCell>
                <TableCell>{role.description}</TableCell>
                <TableCell className="text-center">{role.userCount}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Dialog
                      open={isEditDialogOpen && currentRole?.id === role.id}
                      onOpenChange={(open) => {
                        setIsEditDialogOpen(open)
                        if (open) setCurrentRole(role)
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button variant="outline" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Role</DialogTitle>
                          <DialogDescription>Update role details and permissions.</DialogDescription>
                        </DialogHeader>
                        {currentRole && (
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <Label htmlFor="edit-name">Role Name</Label>
                              <Input
                                id="edit-name"
                                value={currentRole.name}
                                onChange={(e) => setCurrentRole({ ...currentRole, name: e.target.value })}
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="edit-description">Description</Label>
                              <Input
                                id="edit-description"
                                value={currentRole.description}
                                onChange={(e) => setCurrentRole({ ...currentRole, description: e.target.value })}
                              />
                            </div>
                          </div>
                        )}
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleEditRole}>Save Changes</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDeleteRole(role.id)}
                      disabled={role.userCount > 0}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
