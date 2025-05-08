"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { Users, UserCog, GraduationCap, School } from "lucide-react"

type UserStatProps = {
  title: string
  value: number
  icon: React.ReactNode
  description: string
  className?: string
}

function UserStat({ title, value, icon, description, className }: UserStatProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

export function UserStats() {
  const [stats, setStats] = useState({
    total: 0,
    teachers: 0,
    students: 0,
    admins: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUserStats() {
      try {
        // Get total users
        const { count: totalCount, error: totalError } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })

        // Get teachers count
        const { count: teachersCount, error: teachersError } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .eq("role", "teacher")

        // Get students count
        const { count: studentsCount, error: studentsError } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .eq("role", "student")

        // Get admins count
        const { count: adminsCount, error: adminsError } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .eq("role", "admin")

        if (totalError || teachersError || studentsError || adminsError) {
          console.error("Error fetching user stats:", {
            totalError,
            teachersError,
            studentsError,
            adminsError,
          })
          return
        }

        setStats({
          total: totalCount || 0,
          teachers: teachersCount || 0,
          students: studentsCount || 0,
          admins: adminsCount || 0,
        })
      } catch (error) {
        console.error("Error fetching user stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserStats()
  }, [])

  if (loading) {
    return (
      <>
        <Card className="animate-pulse">
          <CardHeader className="pb-2">
            <div className="h-4 w-24 bg-muted rounded"></div>
          </CardHeader>
          <CardContent>
            <div className="h-7 w-12 bg-muted rounded mb-1"></div>
            <div className="h-3 w-32 bg-muted rounded"></div>
          </CardContent>
        </Card>
        <Card className="animate-pulse">
          <CardHeader className="pb-2">
            <div className="h-4 w-24 bg-muted rounded"></div>
          </CardHeader>
          <CardContent>
            <div className="h-7 w-12 bg-muted rounded mb-1"></div>
            <div className="h-3 w-32 bg-muted rounded"></div>
          </CardContent>
        </Card>
        <Card className="animate-pulse">
          <CardHeader className="pb-2">
            <div className="h-4 w-24 bg-muted rounded"></div>
          </CardHeader>
          <CardContent>
            <div className="h-7 w-12 bg-muted rounded mb-1"></div>
            <div className="h-3 w-32 bg-muted rounded"></div>
          </CardContent>
        </Card>
        <Card className="animate-pulse">
          <CardHeader className="pb-2">
            <div className="h-4 w-24 bg-muted rounded"></div>
          </CardHeader>
          <CardContent>
            <div className="h-7 w-12 bg-muted rounded mb-1"></div>
            <div className="h-3 w-32 bg-muted rounded"></div>
          </CardContent>
        </Card>
      </>
    )
  }

  return (
    <>
      <UserStat
        title="Total Users"
        value={stats.total}
        icon={<Users className="h-4 w-4 text-muted-foreground" />}
        description="Total registered users"
      />
      <UserStat
        title="Teachers"
        value={stats.teachers}
        icon={<School className="h-4 w-4 text-blue-500" />}
        description="Active teacher accounts"
        className="border-blue-200"
      />
      <UserStat
        title="Students"
        value={stats.students}
        icon={<GraduationCap className="h-4 w-4 text-green-500" />}
        description="Active student accounts"
        className="border-green-200"
      />
      <UserStat
        title="Administrators"
        value={stats.admins}
        icon={<UserCog className="h-4 w-4 text-red-500" />}
        description="System administrators"
        className="border-red-200"
      />
    </>
  )
}
