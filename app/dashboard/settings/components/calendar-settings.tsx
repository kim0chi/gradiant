"use client"

import { useSettings } from "@/contexts/settings-context"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

export function CalendarSettings() {
  const { settings, updateSettings } = useSettings()

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="defaultCalendarView">Default View</Label>
        <Select
          value={settings.defaultCalendarView || "month"}
          onValueChange={(value) => updateSettings({ defaultCalendarView: value })}
        >
          <SelectTrigger id="defaultCalendarView">
            <SelectValue placeholder="Select default view" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">Month</SelectItem>
            <SelectItem value="week">Week</SelectItem>
            <SelectItem value="day">Day</SelectItem>
            <SelectItem value="agenda">Agenda</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="startOfWeek">Start of Week</Label>
        <Select
          value={settings.startOfWeek || "sunday"}
          onValueChange={(value) => updateSettings({ startOfWeek: value })}
        >
          <SelectTrigger id="startOfWeek">
            <SelectValue placeholder="Select start of week" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sunday">Sunday</SelectItem>
            <SelectItem value="monday">Monday</SelectItem>
            <SelectItem value="saturday">Saturday</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="showWeekends">Show Weekends</Label>
          <div className="text-sm text-muted-foreground">Display weekend days in calendar views</div>
        </div>
        <Switch
          id="showWeekends"
          checked={settings.showWeekends !== false}
          onCheckedChange={(checked) => updateSettings({ showWeekends: checked })}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="showEventDetails">Show Event Details</Label>
          <div className="text-sm text-muted-foreground">Display detailed information for events in calendar</div>
        </div>
        <Switch
          id="showEventDetails"
          checked={settings.showEventDetails !== false}
          onCheckedChange={(checked) => updateSettings({ showEventDetails: checked })}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="enableEventReminders">Enable Event Reminders</Label>
          <div className="text-sm text-muted-foreground">Receive reminders for upcoming calendar events</div>
        </div>
        <Switch
          id="enableEventReminders"
          checked={settings.enableEventReminders !== false}
          onCheckedChange={(checked) => updateSettings({ enableEventReminders: checked })}
        />
      </div>
    </div>
  )
}
