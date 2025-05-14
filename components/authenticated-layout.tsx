"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { RoleNav } from "@/components/role-nav"
import { getUserRole, clearUser, getUser } from "@/lib/mockAuth"

interface AuthenticatedLayoutProps {
  children: React.ReactNode
}

export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const [role, setRole] = useState<"teacher" | "admin" | "student" | null>(null)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated
    const userRole = getUserRole()
    const userData = getUser()

    if (!userRole) {
      // Redirect to login if not authenticated
      router.push("/login")
      return
    }

    setRole(userRole as "teacher" | "admin" | "student")
    setUser(userData)
    setLoading(false)
  }, [router])

  const handleLogout = () => {
    clearUser()
    router.push("/login")
  }

  if (loading || !role) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <div className="flex min-h-screen bg-background">
      <RoleNav role={role} />

      <div className="flex-1">
        {/* Main content */}
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
