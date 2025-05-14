"use client"

import { useSettings } from "@/contexts/settings-context"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function GeneralSettings() {
  const { settings, updateSettings } = useSettings()

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="language">Language</Label>
        <Select value={settings.language} onValueChange={(value) => updateSettings({ language: value as any })}>
          <SelectTrigger id="language">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="english">English</SelectItem>
            <SelectItem value="spanish">Spanish</SelectItem>
            <SelectItem value="french">French</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Time Format</Label>
        <RadioGroup
          value={settings.timeFormat}
          onValueChange={(value) => updateSettings({ timeFormat: value as "12h" | "24h" })}
          className="flex flex-col space-y-1"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="12h" id="12h" />
            <Label htmlFor="12h">12-hour (1:30 PM)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="24h" id="24h" />
            <Label htmlFor="24h">24-hour (13:30)</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="dateFormat">Date Format</Label>
        <Select value={settings.dateFormat} onValueChange={(value) => updateSettings({ dateFormat: value as any })}>
          <SelectTrigger id="dateFormat">
            <SelectValue placeholder="Select date format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
            <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
            <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
