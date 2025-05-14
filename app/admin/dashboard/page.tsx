import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  School,
  BookOpen,
  Calendar,
  FileBarChart,
  Server,
  Bell,
  ShieldAlert,
  CheckCircle,
  AlertTriangle,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { AdminMetricsChart } from "../components/admin-metrics-chart"
import { AdminActivityFeed } from "../components/admin-activity-feed"
import { AdminSystemHealth } from "../components/admin-system-health"
import { AdminQuickActions } from "../components/admin-quick-actions"

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Overview of system performance and statistics</p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/reports/export">Export Reports</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/admin/system/settings">System Settings</Link>
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,248</div>
            <div className="flex items-center mt-1">
              <Badge variant="outline" className="text-emerald-500 bg-emerald-50">
                +86
              </Badge>
              <span className="text-xs text-muted-foreground ml-2">from last semester</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">64</div>
            <div className="flex items-center mt-1">
              <Badge variant="outline" className="text-emerald-500 bg-emerald-50">
                +4
              </Badge>
              <span className="text-xs text-muted-foreground ml-2">new hires</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Classes</CardTitle>
            <School className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">86</div>
            <div className="flex items-center mt-1">
              <span className="text-xs text-muted-foreground">Across 12 departments</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98%</div>
            <div className="flex items-center mt-1">
              <Badge variant="outline" className="text-emerald-500 bg-emerald-50">
                Healthy
              </Badge>
              <span className="text-xs text-muted-foreground ml-2">All systems operational</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Content */}
      <div className="grid gap-6 md:grid-cols-7">
        {/* Left Column - 4/7 width */}
        <div className="md:col-span-4 space-y-6">
          {/* Activity Chart */}
          <Card>
            <CardHeader>
              <CardTitle>System Activity</CardTitle>
              <CardDescription>User logins and actions over time</CardDescription>
            </CardHeader>
            <CardContent>
              <AdminMetricsChart />
            </CardContent>
          </Card>

          {/* User Management Overview */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>User Management</CardTitle>
              <CardDescription>Overview of user accounts and status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* User Types */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Students</span>
                      <span className="text-sm text-muted-foreground">1,248</span>
                    </div>
                    <Progress value={78} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>78% Active</span>
                      <span>22% Inactive</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Teachers</span>
                      <span className="text-sm text-muted-foreground">64</span>
                    </div>
                    <Progress value={92} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>92% Active</span>
                      <span>8% Inactive</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Admins</span>
                      <span className="text-sm text-muted-foreground">8</span>
                    </div>
                    <Progress value={100} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>100% Active</span>
                      <span>0% Inactive</span>
                    </div>
                  </div>
                </div>

                {/* Recent User Activity */}
                <div className="pt-4 border-t">
                  <h4 className="text-sm font-medium mb-3">Recent User Registrations</h4>
                  <div className="space-y-3">
                    {[
                      { name: "Emma Thompson", role: "Student", time: "2 hours ago", status: "Pending Approval" },
                      { name: "Michael Chen", role: "Student", time: "3 hours ago", status: "Approved" },
                      { name: "Sarah Johnson", role: "Teacher", time: "1 day ago", status: "Approved" },
                      { name: "David Wilson", role: "Student", time: "1 day ago", status: "Pending Approval" },
                    ].map((user, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                            {user.name.charAt(0)}
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium">{user.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {user.role} • {user.time}
                            </p>
                          </div>
                        </div>
                        <Badge variant={user.status === "Approved" ? "outline" : "secondary"}>{user.status}</Badge>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <Button variant="outline" size="sm" asChild className="w-full">
                      <Link href="/admin/users">View All Users</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - 3/7 width */}
        <div className="md:col-span-3 space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <AdminQuickActions />
            </CardContent>
          </Card>

          {/* System Health */}
          <Card>
            <CardHeader>
              <CardTitle>System Health</CardTitle>
              <CardDescription>Current status of all systems</CardDescription>
            </CardHeader>
            <CardContent>
              <AdminSystemHealth />
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest system events and logs</CardDescription>
            </CardHeader>
            <CardContent>
              <AdminActivityFeed />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Tabs Section */}
      <Tabs defaultValue="overview" className="mt-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>System Overview</CardTitle>
              <CardDescription>Key performance indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Average GPA</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">3.42</div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <FileBarChart className="mr-1 h-3 w-3" />
                      <span>+0.08 from last semester</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Attendance Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">92%</div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="mr-1 h-3 w-3" />
                      <span>School-wide average</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Graduation Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">96%</div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <FileBarChart className="mr-1 h-3 w-3" />
                      <span>+2% from last year</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Active Courses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">42</div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <BookOpen className="mr-1 h-3 w-3" />
                      <span>Current semester</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>System Performance</CardTitle>
              <CardDescription>Server and application metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">CPU Usage</span>
                    <span className="text-sm text-muted-foreground">24%</span>
                  </div>
                  <Progress value={24} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Memory Usage</span>
                    <span className="text-sm text-muted-foreground">42%</span>
                  </div>
                  <Progress value={42} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Database Load</span>
                    <span className="text-sm text-muted-foreground">18%</span>
                  </div>
                  <Progress value={18} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Network Traffic</span>
                    <span className="text-sm text-muted-foreground">36%</span>
                  </div>
                  <Progress value={36} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Overview</CardTitle>
              <CardDescription>System security status and alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center p-3 bg-green-50 rounded-md">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium">Security Status: Secure</p>
                    <p className="text-xs text-muted-foreground">All security systems are functioning properly</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 border rounded-md">
                    <div className="flex items-center">
                      <ShieldAlert className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm font-medium">Failed Login Attempts</span>
                    </div>
                    <p className="text-2xl font-bold mt-2">12</p>
                    <p className="text-xs text-muted-foreground">Last 24 hours</p>
                  </div>

                  <div className="p-3 border rounded-md">
                    <div className="flex items-center">
                      <Bell className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm font-medium">Security Alerts</span>
                    </div>
                    <p className="text-2xl font-bold mt-2">0</p>
                    <p className="text-xs text-muted-foreground">No active alerts</p>
                  </div>
                </div>

                <div className="pt-2">
                  <h4 className="text-sm font-medium mb-3">Recent Security Events</h4>
                  <div className="space-y-3">
                    {[
                      {
                        event: "Password Reset",
                        user: "John Smith",
                        time: "2 hours ago",
                        icon: <CheckCircle className="h-4 w-4 text-green-500" />,
                      },
                      {
                        event: "Failed Login",
                        user: "Unknown IP: 192.168.1.42",
                        time: "6 hours ago",
                        icon: <AlertTriangle className="h-4 w-4 text-amber-500" />,
                      },
                      {
                        event: "Admin Login",
                        user: "System Administrator",
                        time: "1 day ago",
                        icon: <CheckCircle className="h-4 w-4 text-green-500" />,
                      },
                    ].map((event, i) => (
                      <div key={i} className="flex items-start">
                        <div className="mt-0.5 mr-3">{event.icon}</div>
                        <div>
                          <p className="text-sm font-medium">{event.event}</p>
                          <p className="text-xs text-muted-foreground">
                            {event.user} • {event.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>System Notifications</CardTitle>
              <CardDescription>Recent alerts and messages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    title: "System Update Scheduled",
                    message:
                      "A system update is scheduled for Sunday, May 12 at 2:00 AM. Expected downtime: 30 minutes.",
                    time: "1 day ago",
                    priority: "medium",
                    icon: <Bell className="h-4 w-4 text-amber-500" />,
                  },
                  {
                    title: "Database Backup Completed",
                    message: "The daily database backup was completed successfully.",
                    time: "12 hours ago",
                    priority: "low",
                    icon: <CheckCircle className="h-4 w-4 text-green-500" />,
                  },
                  {
                    title: "Storage Space Warning",
                    message: "The system is approaching 80% storage capacity. Consider cleaning up old data.",
                    time: "3 hours ago",
                    priority: "high",
                    icon: <AlertTriangle className="h-4 w-4 text-red-500" />,
                  },
                  {
                    title: "New Feature Deployed",
                    message: "The new attendance tracking feature has been deployed to production.",
                    time: "2 days ago",
                    priority: "low",
                    icon: <CheckCircle className="h-4 w-4 text-green-500" />,
                  },
                ].map((notification, i) => (
                  <div key={i} className="flex items-start p-3 border rounded-md">
                    <div className="mt-0.5 mr-3">{notification.icon}</div>
                    <div>
                      <div className="flex items-center">
                        <p className="text-sm font-medium">{notification.title}</p>
                        <Badge
                          variant="outline"
                          className={`ml-2 ${
                            notification.priority === "high"
                              ? "text-red-500 bg-red-50"
                              : notification.priority === "medium"
                                ? "text-amber-500 bg-amber-50"
                                : "text-green-500 bg-green-50"
                          }`}
                        >
                          {notification.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
