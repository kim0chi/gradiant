"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Plus, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { KnowledgeBase } from "./components/knowledge-base"
import { SupportTickets } from "./components/support-tickets"
import { SystemStatus } from "./components/system-status"
import { UserGuides } from "./components/user-guides"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export default function AdminSupportPage() {
  const [searchQuery, setSearchQuery] = useState("")

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
                <BreadcrumbPage>Help & Support</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-3xl font-bold tracking-tight mt-2">Help & Support</h1>
          <p className="text-muted-foreground">Manage support resources, knowledge base, and user assistance.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search help resources..."
              className="pl-8 w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Article
          </Button>
        </div>
      </div>

      <Tabs defaultValue="knowledge-base" className="space-y-4">
        <TabsList>
          <TabsTrigger value="knowledge-base">Knowledge Base</TabsTrigger>
          <TabsTrigger value="support-tickets">Support Tickets</TabsTrigger>
          <TabsTrigger value="user-guides">User Guides</TabsTrigger>
          <TabsTrigger value="system-status">System Status</TabsTrigger>
        </TabsList>
        <TabsContent value="knowledge-base" className="space-y-4">
          <KnowledgeBase searchQuery={searchQuery} />
        </TabsContent>
        <TabsContent value="support-tickets" className="space-y-4">
          <SupportTickets />
        </TabsContent>
        <TabsContent value="user-guides" className="space-y-4">
          <UserGuides searchQuery={searchQuery} />
        </TabsContent>
        <TabsContent value="system-status" className="space-y-4">
          <SystemStatus />
        </TabsContent>
      </Tabs>
    </div>
  )
}
