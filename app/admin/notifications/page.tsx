"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { NotificationTemplates } from "./components/notification-templates"
import { NotificationHistory } from "./components/notification-history"
import { CreateNotificationForm } from "./components/create-notification-form"
import { NotificationSettings } from "./components/notification-settings"
import { NotificationAnalytics } from "./components/notification-analytics"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export default function AdminNotificationsPage() {
  const [showCreateForm, setShowCreateForm] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin/dashboard">Admin</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Notifications</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-3xl font-bold tracking-tight mt-2">Notification Management</h1>
          <p className="text-muted-foreground">
            Create, manage, and track notifications sent to users across the platform.
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(true)} className="flex items-center gap-1">
          <Plus className="h-4 w-4" />
          New Notification
        </Button>
      </div>

      {showCreateForm ? (
        <Card>
          <CardHeader>
            <CardTitle>Create New Notification</CardTitle>
            <CardDescription>
              Compose a new notification to send to users, classes, or the entire system.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CreateNotificationForm onCancel={() => setShowCreateForm(false)} />
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="history" className="space-y-4">
          <TabsList>
            <TabsTrigger value="history">Notification History</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="history" className="space-y-4">
            <NotificationHistory />
          </TabsContent>
          <TabsContent value="templates" className="space-y-4">
            <NotificationTemplates />
          </TabsContent>
          <TabsContent value="analytics" className="space-y-4">
            <NotificationAnalytics />
          </TabsContent>
          <TabsContent value="settings" className="space-y-4">
            <NotificationSettings />
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
