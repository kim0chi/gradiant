"use client"

import { useSettings } from "@/contexts/settings-context"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export function NotificationSettings() {
  const { settings, updateSettings } = useSettings()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="email-notifications">Email Notifications</Label>
          <div className="text-sm text-muted-foreground">Receive email notifications for important updates</div>
        </div>
        <Switch
          id="email-notifications"
          checked={settings.emailNotifications}
          onCheckedChange={(checked) => updateSettings({ emailNotifications: checked })}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="push-notifications">Push Notifications</Label>
          <div className="text-sm text-muted-foreground">Receive push notifications in your browser</div>
        </div>
        <Switch
          id="push-notifications"
          checked={settings.pushNotifications}
          onCheckedChange={(checked) => updateSettings({ pushNotifications: checked })}
        />
      </div>
    </div>
  )
}
