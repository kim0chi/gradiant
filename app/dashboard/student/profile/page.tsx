"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { getUser } from "@/lib/mockAuth"

export default function StudentProfilePage() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Get user data
    const userData = getUser()
    setUser(userData)
  }, [])

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Student Profile</h1>

      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-6">
        <Avatar className="h-24 w-24">
          <AvatarFallback className="text-2xl">{user?.name ? getInitials(user.name) : "S"}</AvatarFallback>
        </Avatar>
        <div className="text-center sm:text-left">
          <h2 className="text-xl font-semibold">{user?.name || "Student Name"}</h2>
          <p className="text-muted-foreground">{user?.email || "student@example.com"}</p>
          <p className="text-muted-foreground capitalize">{user?.role || "student"}</p>
          <Button variant="outline" size="sm" className="mt-2">
            Change Avatar
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Your basic information</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Full Name</dt>
                <dd>{user?.name || "Student Name"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Email</dt>
                <dd>{user?.email || "student@example.com"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Student ID</dt>
                <dd>STU-{Math.floor(10000 + Math.random() * 90000)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Grade Level</dt>
                <dd>11th Grade</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Academic Information</CardTitle>
            <CardDescription>Your academic details</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Current GPA</dt>
                <dd>3.8</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Enrolled Classes</dt>
                <dd>6</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Counselor</dt>
                <dd>Ms. Johnson</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Graduation Year</dt>
                <dd>2025</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
