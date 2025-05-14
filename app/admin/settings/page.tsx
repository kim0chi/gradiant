import { AuthenticatedLayout } from "@/components/authenticated-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, Globe, Shield, Database, Bell } from "lucide-react"

export default function AdminSettingsPage() {
  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">System Settings</h1>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="database">Database</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Manage general system settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center p-12 border-2 border-dashed rounded-lg">
                  <div className="text-center">
                    <Globe className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">General Settings</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Configure school name, timezone, language, and other general settings.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage system security settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center p-12 border-2 border-dashed rounded-lg">
                  <div className="text-center">
                    <Shield className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">Security Settings</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Configure password policies, two-factor authentication, and other security settings.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Manage system notification settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center p-12 border-2 border-dashed rounded-lg">
                  <div className="text-center">
                    <Bell className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">Notification Settings</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Configure email templates, notification preferences, and other notification settings.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="database">
            <Card>
              <CardHeader>
                <CardTitle>Database Settings</CardTitle>
                <CardDescription>Manage database settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center p-12 border-2 border-dashed rounded-lg">
                  <div className="text-center">
                    <Database className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">Database Settings</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Configure database backup, maintenance, and other database settings.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations">
            <Card>
              <CardHeader>
                <CardTitle>Integrations</CardTitle>
                <CardDescription>Manage third-party integrations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center p-12 border-2 border-dashed rounded-lg">
                  <div className="text-center">
                    <Settings className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">Integration Settings</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Configure API keys, webhooks, and other integration settings.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AuthenticatedLayout>
  )
}
