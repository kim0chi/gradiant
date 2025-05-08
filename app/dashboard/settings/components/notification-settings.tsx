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
          <Label htmlFor="emailNotifications">Email Notifications</Label>
          <div className="text-sm text-muted-foreground">Receive notifications via email</div>
        </div>
        <Switch
          id="emailNotifications"
          checked={settings.emailNotifications !== false}
          onCheckedChange={(checked) => updateSettings({ emailNotifications: checked })}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="pushNotifications">Push Notifications</Label>
          <div className="text-sm text-muted-foreground">Receive push notifications in your browser</div>
        </div>
        <Switch
          id="pushNotifications"
          checked={settings.pushNotifications !== false}
          onCheckedChange={(checked) => updateSettings({ pushNotifications: checked })}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="gradeUpdates">Grade Updates</Label>
          <div className="text-sm text-muted-foreground">Receive notifications when grades are updated</div>
        </div>
        <Switch
          id="gradeUpdates"
          checked={settings.gradeUpdates !== false}
          onCheckedChange={(checked) => updateSettings({ gradeUpdates: checked })}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="calendarReminders">Calendar Reminders</Label>
          <div className="text-sm text-muted-foreground">Receive reminders for upcoming calendar events</div>
        </div>
        <Switch
          id="calendarReminders"
          checked={settings.calendarReminders !== false}
          onCheckedChange={(checked) => updateSettings({ calendarReminders: checked })}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="systemAnnouncements">System Announcements</Label>
          <div className="text-sm text-muted-foreground">
            Receive notifications about system updates and maintenance
          </div>
        </div>
        <Switch
          id="systemAnnouncements"
          checked={settings.systemAnnouncements !== false}
          onCheckedChange={(checked) => updateSettings({ systemAnnouncements: checked })}
        />
      </div>
    </div>
  )
}
