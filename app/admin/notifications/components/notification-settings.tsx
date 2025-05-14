"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"

export function NotificationSettings() {
  const [emailSettings, setEmailSettings] = useState({
    enabled: true,
    fromName: "Gradiant Education",
    fromEmail: "notifications@gradiant.edu",
    replyToEmail: "support@gradiant.edu",
    smtpHost: "smtp.example.com",
    smtpPort: "587",
    smtpUsername: "smtp_user",
    smtpPassword: "••••••••••••",
    useTLS: true,
  })

  const [pushSettings, setPushSettings] = useState({
    enabled: true,
    fcmKey: "••••••••••••••••••••••••••••••••••••••••",
    apnsKey: "••••••••••••••••••••••••••••••••••••••••",
    webPushEnabled: true,
  })

  const [generalSettings, setGeneralSettings] = useState({
    defaultDeliveryMethods: {
      email: true,
      push: true,
      inApp: true,
    },
    batchNotifications: true,
    batchInterval: "hourly",
    retentionPeriod: "90",
    allowUserPreferences: true,
  })

  const handleEmailChange = (key, value) => {
    setEmailSettings({
      ...emailSettings,
      [key]: value,
    })
  }

  const handlePushChange = (key, value) => {
    setPushSettings({
      ...pushSettings,
      [key]: value,
    })
  }

  const handleGeneralChange = (key, value) => {
    setGeneralSettings({
      ...generalSettings,
      [key]: value,
    })
  }

  const handleDeliveryMethodChange = (method, value) => {
    setGeneralSettings({
      ...generalSettings,
      defaultDeliveryMethods: {
        ...generalSettings.defaultDeliveryMethods,
        [method]: value,
      },
    })
  }

  return (
    <Tabs defaultValue="general" className="space-y-4">
      <TabsList>
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="email">Email</TabsTrigger>
        <TabsTrigger value="push">Push Notifications</TabsTrigger>
      </TabsList>

      <TabsContent value="general">
        <Card>
          <CardHeader>
            <CardTitle>General Notification Settings</CardTitle>
            <CardDescription>Configure system-wide notification settings and defaults.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Default Delivery Methods</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="default-email">Email</Label>
                  <Switch
                    id="default-email"
                    checked={generalSettings.defaultDeliveryMethods.email}
                    onCheckedChange={(checked) => handleDeliveryMethodChange("email", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="default-push">Push Notifications</Label>
                  <Switch
                    id="default-push"
                    checked={generalSettings.defaultDeliveryMethods.push}
                    onCheckedChange={(checked) => handleDeliveryMethodChange("push", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="default-inapp">In-App Notifications</Label>
                  <Switch
                    id="default-inapp"
                    checked={generalSettings.defaultDeliveryMethods.inApp}
                    onCheckedChange={(checked) => handleDeliveryMethodChange("inApp", checked)}
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Notification Batching</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="batch-notifications">Batch Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Combine multiple notifications into a single delivery
                    </p>
                  </div>
                  <Switch
                    id="batch-notifications"
                    checked={generalSettings.batchNotifications}
                    onCheckedChange={(checked) => handleGeneralChange("batchNotifications", checked)}
                  />
                </div>

                {generalSettings.batchNotifications && (
                  <div className="pt-2">
                    <Label htmlFor="batch-interval">Batch Interval</Label>
                    <Select
                      value={generalSettings.batchInterval}
                      onValueChange={(value) => handleGeneralChange("batchInterval", value)}
                    >
                      <SelectTrigger id="batch-interval">
                        <SelectValue placeholder="Select interval" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Retention & Preferences</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="retention-period">Notification Retention Period (days)</Label>
                  <Input
                    id="retention-period"
                    type="number"
                    value={generalSettings.retentionPeriod}
                    onChange={(e) => handleGeneralChange("retentionPeriod", e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Number of days to keep notifications in the system
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="user-preferences">Allow User Preferences</Label>
                    <p className="text-sm text-muted-foreground">Let users customize their notification preferences</p>
                  </div>
                  <Switch
                    id="user-preferences"
                    checked={generalSettings.allowUserPreferences}
                    onCheckedChange={(checked) => handleGeneralChange("allowUserPreferences", checked)}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button>Save Changes</Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="email">
        <Card>
          <CardHeader>
            <CardTitle>Email Notification Settings</CardTitle>
            <CardDescription>Configure email delivery settings for notifications.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-enabled">Enable Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Turn on/off all email notifications</p>
              </div>
              <Switch
                id="email-enabled"
                checked={emailSettings.enabled}
                onCheckedChange={(checked) => handleEmailChange("enabled", checked)}
              />
            </div>

            {emailSettings.enabled && (
              <>
                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Sender Information</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="from-name">From Name</Label>
                      <Input
                        id="from-name"
                        value={emailSettings.fromName}
                        onChange={(e) => handleEmailChange("fromName", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="from-email">From Email</Label>
                      <Input
                        id="from-email"
                        type="email"
                        value={emailSettings.fromEmail}
                        onChange={(e) => handleEmailChange("fromEmail", e.target.value)}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Label htmlFor="reply-to">Reply-To Email</Label>
                      <Input
                        id="reply-to"
                        type="email"
                        value={emailSettings.replyToEmail}
                        onChange={(e) => handleEmailChange("replyToEmail", e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">SMTP Settings</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="smtp-host">SMTP Host</Label>
                      <Input
                        id="smtp-host"
                        value={emailSettings.smtpHost}
                        onChange={(e) => handleEmailChange("smtpHost", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="smtp-port">SMTP Port</Label>
                      <Input
                        id="smtp-port"
                        value={emailSettings.smtpPort}
                        onChange={(e) => handleEmailChange("smtpPort", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="smtp-username">SMTP Username</Label>
                      <Input
                        id="smtp-username"
                        value={emailSettings.smtpUsername}
                        onChange={(e) => handleEmailChange("smtpUsername", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="smtp-password">SMTP Password</Label>
                      <Input
                        id="smtp-password"
                        type="password"
                        value={emailSettings.smtpPassword}
                        onChange={(e) => handleEmailChange("smtpPassword", e.target.value)}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="use-tls">Use TLS/SSL</Label>
                        <Switch
                          id="use-tls"
                          checked={emailSettings.useTLS}
                          onCheckedChange={(checked) => handleEmailChange("useTLS", checked)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="flex justify-end">
              <Button>Save Changes</Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="push">
        <Card>
          <CardHeader>
            <CardTitle>Push Notification Settings</CardTitle>
            <CardDescription>Configure push notification delivery settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="push-enabled">Enable Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Turn on/off all push notifications</p>
              </div>
              <Switch
                id="push-enabled"
                checked={pushSettings.enabled}
                onCheckedChange={(checked) => handlePushChange("enabled", checked)}
              />
            </div>

            {pushSettings.enabled && (
              <>
                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Service Credentials</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="fcm-key">Firebase Cloud Messaging Key (FCM)</Label>
                      <Input
                        id="fcm-key"
                        type="password"
                        value={pushSettings.fcmKey}
                        onChange={(e) => handlePushChange("fcmKey", e.target.value)}
                      />
                      <p className="text-sm text-muted-foreground mt-1">Used for Android and web push notifications</p>
                    </div>
                    <div>
                      <Label htmlFor="apns-key">Apple Push Notification Service Key (APNS)</Label>
                      <Input
                        id="apns-key"
                        type="password"
                        value={pushSettings.apnsKey}
                        onChange={(e) => handlePushChange("apnsKey", e.target.value)}
                      />
                      <p className="text-sm text-muted-foreground mt-1">Used for iOS push notifications</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="web-push">Enable Web Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Allow push notifications in web browsers</p>
                  </div>
                  <Switch
                    id="web-push"
                    checked={pushSettings.webPushEnabled}
                    onCheckedChange={(checked) => handlePushChange("webPushEnabled", checked)}
                  />
                </div>
              </>
            )}

            <div className="flex justify-end">
              <Button>Save Changes</Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
