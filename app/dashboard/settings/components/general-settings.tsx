"use client"

import { useSettings } from "@/contexts/settings-context"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

export function GeneralSettings() {
  const { settings, updateSettings } = useSettings()

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="language">Language</Label>
        <Select value={settings.language || "en"} onValueChange={(value) => updateSettings({ language: value })}>
          <SelectTrigger id="language">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="es">Spanish</SelectItem>
            <SelectItem value="fr">French</SelectItem>
            <SelectItem value="de">German</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="dateFormat">Date Format</Label>
        <Select
          value={settings.dateFormat || "MM/DD/YYYY"}
          onValueChange={(value) => updateSettings({ dateFormat: value })}
        >
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

      <div className="space-y-2">
        <Label htmlFor="timeFormat">Time Format</Label>
        <Select value={settings.timeFormat || "12h"} onValueChange={(value) => updateSettings({ timeFormat: value })}>
          <SelectTrigger id="timeFormat">
            <SelectValue placeholder="Select time format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="12h">12-hour (AM/PM)</SelectItem>
            <SelectItem value="24h">24-hour</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="autoSave">Auto-save changes</Label>
          <div className="text-sm text-muted-foreground">Automatically save changes as you make them</div>
        </div>
        <Switch
          id="autoSave"
          checked={settings.autoSave !== false}
          onCheckedChange={(checked) => updateSettings({ autoSave: checked })}
        />
      </div>
    </div>
  )
}
