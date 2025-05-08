"use client"

import { useSettings } from "@/contexts/settings-context"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function CalendarSettings() {
  const { settings, updateSettings } = useSettings()

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Default Calendar View</Label>
        <RadioGroup
          value={settings.defaultCalendarView}
          onValueChange={(value) => updateSettings({ defaultCalendarView: value as any })}
          className="flex flex-col space-y-1"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="month" id="month" />
            <Label htmlFor="month">Month View</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="week" id="week" />
            <Label htmlFor="week">Week View</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="day" id="day" />
            <Label htmlFor="day">Day View</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="show-weekends">Show Weekends</Label>
          <div className="text-sm text-muted-foreground">Display weekend days in calendar views</div>
        </div>
        <Switch
          id="show-weekends"
          checked={settings.showWeekends}
          onCheckedChange={(checked) => updateSettings({ showWeekends: checked })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="start-of-week">Start of Week</Label>
        <Select value={settings.startOfWeek} onValueChange={(value) => updateSettings({ startOfWeek: value as any })}>
          <SelectTrigger id="start-of-week">
            <SelectValue placeholder="Select start day of week" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sunday">Sunday</SelectItem>
            <SelectItem value="monday">Monday</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
