import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AuditLogTable } from "../components/audit-log-table"
import { SystemErrorsTable } from "../components/system-errors-table"
import { LoginActivityTable } from "../components/login-activity-table"

export default function AuditLogsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Audit Logs</h1>
        <p className="text-muted-foreground">Review system activity and security events</p>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Activity</TabsTrigger>
          <TabsTrigger value="logins">Login Activity</TabsTrigger>
          <TabsTrigger value="errors">System Errors</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All System Activity</CardTitle>
              <CardDescription>Comprehensive log of all system events</CardDescription>
            </CardHeader>
            <CardContent>
              <AuditLogTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logins">
          <Card>
            <CardHeader>
              <CardTitle>Login Activity</CardTitle>
              <CardDescription>Record of user authentication events</CardDescription>
            </CardHeader>
            <CardContent>
              <LoginActivityTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="errors">
          <Card>
            <CardHeader>
              <CardTitle>System Errors</CardTitle>
              <CardDescription>Log of system errors and exceptions</CardDescription>
            </CardHeader>
            <CardContent>
              <SystemErrorsTable />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
