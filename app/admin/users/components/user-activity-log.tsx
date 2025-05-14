"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getUserActivityLog } from "@/lib/user-service"
import { formatDistanceToNow } from "date-fns"

type ActivityLogItem = {
  id: string
  userId: string
  action: string
  timestamp: string
  ipAddress: string
  userAgent: string
}

export function UserActivityLog({ userId }: { userId: string }) {
  const [activities, setActivities] = useState<ActivityLogItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchActivityLog() {
      setLoading(true)
      try {
        const { data } = await getUserActivityLog(userId)
        if (data) {
          setActivities(data)
        }
      } catch (error) {
        console.error("Error fetching activity log:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchActivityLog()
  }, [userId])

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>User Agent</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 3 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="h-4 w-24 bg-muted rounded animate-pulse"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-32 bg-muted rounded animate-pulse"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-24 bg-muted rounded animate-pulse"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-40 bg-muted rounded animate-pulse"></div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }

  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg">
        <h3 className="text-lg font-medium">No activity found</h3>
        <p className="text-sm text-muted-foreground mt-1">This user has no recorded activity yet.</p>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Action</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>IP Address</TableHead>
            <TableHead className="hidden md:table-cell">User Agent</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activities.map((activity) => (
            <TableRow key={activity.id}>
              <TableCell className="font-medium">{activity.action}</TableCell>
              <TableCell>{formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}</TableCell>
              <TableCell>{activity.ipAddress}</TableCell>
              <TableCell className="hidden md:table-cell truncate max-w-[200px]">{activity.userAgent}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
