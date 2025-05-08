"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { isDebugMode } from "@/lib/mockAuth"

export function DebugPanel() {
  const [selectedRole, setSelectedRole] = useState<string>("")
  const router = useRouter()

  // Only show in debug mode
  if (!isDebugMode()) {
    return null
  }

  const handleRoleChange = (role: string) => {
    setSelectedRole(role)
  }

  const applyRole = () => {
    if (!selectedRole) return

    // Add the testUser query parameter and reload
    const url = new URL(window.location.href)
    url.searchParams.set("testUser", selectedRole)
    window.location.href = url.toString()
  }

  const clearRole = () => {
    // Remove the testUser query parameter and reload
    const url = new URL(window.location.href)
    url.searchParams.delete("testUser")
    window.location.href = url.toString()
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-80 shadow-lg border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <span className="bg-yellow-500 text-white text-xs px-2 py-0.5 rounded mr-2">DEBUG MODE</span>
            Test User Selector
          </CardTitle>
          <CardDescription className="text-xs">Switch between different user roles for testing</CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <Select value={selectedRole} onValueChange={handleRoleChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="teacher">Teacher</SelectItem>
              <SelectItem value="student">Student</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
        <CardFooter className="flex justify-between pt-0">
          <Button variant="outline" size="sm" onClick={clearRole}>
            Clear
          </Button>
          <Button size="sm" onClick={applyRole} disabled={!selectedRole}>
            Apply Role
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
