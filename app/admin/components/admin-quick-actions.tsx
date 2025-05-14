"use client"

import { Button } from "@/components/ui/button"
import { UserPlus, FileUp, Bell, Settings, FileBarChart, Download } from "lucide-react"
import Link from "next/link"

export function AdminQuickActions() {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Button variant="outline" className="h-auto flex-col py-4 justify-start items-center" asChild>
        <Link href="/admin/users/new">
          <UserPlus className="h-5 w-5 mb-2" />
          <span className="text-sm">Add User</span>
        </Link>
      </Button>

      <Button variant="outline" className="h-auto flex-col py-4 justify-start items-center" asChild>
        <Link href="/admin/users/import">
          <FileUp className="h-5 w-5 mb-2" />
          <span className="text-sm">Import Users</span>
        </Link>
      </Button>

      <Button variant="outline" className="h-auto flex-col py-4 justify-start items-center" asChild>
        <Link href="/admin/reports">
          <FileBarChart className="h-5 w-5 mb-2" />
          <span className="text-sm">Generate Report</span>
        </Link>
      </Button>

      <Button variant="outline" className="h-auto flex-col py-4 justify-start items-center" asChild>
        <Link href="/admin/notifications/send">
          <Bell className="h-5 w-5 mb-2" />
          <span className="text-sm">Send Notification</span>
        </Link>
      </Button>

      <Button variant="outline" className="h-auto flex-col py-4 justify-start items-center" asChild>
        <Link href="/admin/system/backup">
          <Download className="h-5 w-5 mb-2" />
          <span className="text-sm">Backup Data</span>
        </Link>
      </Button>

      <Button variant="outline" className="h-auto flex-col py-4 justify-start items-center" asChild>
        <Link href="/admin/system/settings">
          <Settings className="h-5 w-5 mb-2" />
          <span className="text-sm">System Settings</span>
        </Link>
      </Button>
    </div>
  )
}
