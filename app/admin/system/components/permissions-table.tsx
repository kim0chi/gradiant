"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"

// Sample permissions data
const permissionsData = [
  { id: 1, name: "View Dashboard", description: "Access to view the dashboard" },
  { id: 2, name: "Manage Users", description: "Create, edit, and delete users" },
  { id: 3, name: "View Reports", description: "Access to view reports" },
  { id: 4, name: "Export Data", description: "Export data from the system" },
  { id: 5, name: "System Settings", description: "Modify system settings" },
  { id: 6, name: "Manage Classes", description: "Create, edit, and delete classes" },
  { id: 7, name: "Grade Management", description: "Manage student grades" },
  { id: 8, name: "Attendance Tracking", description: "Track student attendance" },
]

// Sample roles
const roles = [
  { id: 1, name: "Admin" },
  { id: 2, name: "Teacher" },
  { id: 3, name: "Student" },
]

// Sample role permissions mapping
const initialRolePermissions = {
  1: [1, 2, 3, 4, 5, 6, 7, 8], // Admin has all permissions
  2: [1, 3, 6, 7, 8], // Teacher permissions
  3: [1, 3], // Student permissions
}

export function PermissionsTable() {
  const [rolePermissions, setRolePermissions] = useState(initialRolePermissions)

  const handlePermissionChange = (roleId: number, permissionId: number) => {
    setRolePermissions((prev) => {
      const newPermissions = { ...prev }

      if (newPermissions[roleId].includes(permissionId)) {
        // Remove permission
        newPermissions[roleId] = newPermissions[roleId].filter((id) => id !== permissionId)
      } else {
        // Add permission
        newPermissions[roleId] = [...newPermissions[roleId], permissionId]
      }

      return newPermissions
    })
  }

  const savePermissions = () => {
    // In a real app, you would save this to your backend
    console.log("Saving permissions:", rolePermissions)
    toast({
      title: "Permissions updated",
      description: "Role permissions have been updated successfully.",
    })
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Permission</TableHead>
              <TableHead className="w-[300px]">Description</TableHead>
              {roles.map((role) => (
                <TableHead key={role.id} className="text-center">
                  {role.name}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {permissionsData.map((permission) => (
              <TableRow key={permission.id}>
                <TableCell className="font-medium">{permission.name}</TableCell>
                <TableCell>{permission.description}</TableCell>
                {roles.map((role) => (
                  <TableCell key={role.id} className="text-center">
                    <Checkbox
                      checked={rolePermissions[role.id]?.includes(permission.id)}
                      onCheckedChange={() => handlePermissionChange(role.id, permission.id)}
                      aria-label={`${role.name} permission for ${permission.name}`}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-end">
        <Button onClick={savePermissions}>Save Changes</Button>
      </div>
    </div>
  )
}
