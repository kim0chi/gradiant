"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon, Check, Info } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function CreateNotificationForm({ onCancel }) {
  const [notificationType, setNotificationType] = useState("immediate")
  const [recipientType, setRecipientType] = useState("all")
  const [selectedTemplate, setSelectedTemplate] = useState("")
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedRecipients, setSelectedRecipients] = useState([])
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    sendEmail: true,
    sendPush: true,
    sendInApp: true
  })

  // Mock data for demonstration
  const templates = [
    { id: "temp-1", name: "System Maintenance" },
    { id: "temp-2", name: "New Grading Period" },
    { id: "temp-3", name: "Welcome Message" },
    { id: "temp-4", name: "Password Reset" }
  ]

  const userGroups = [
    { id: "group-1", name: "All Teachers" },
    { id: "group-2", name: "All Students" },
    { id: "group-3", name: "All Parents" },
    { id: "group-4", name: "All Administrators" },
    { id: "group-5", name: "Math Department" },
    { id: "group-6", name: "Science Department" },
    { id: "group-7", name: "Grade 9 Students" },
    { id: "group-8", name: "Grade 10 Students" }
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleToggleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSelectRecipient = (groupId) => {
    if (selectedRecipients.includes(groupId)) {
      setSelectedRecipients(selectedRecipients.filter(id => id !== groupId))
    } else {
      setSelectedRecipients([...selectedRecipients, groupId])
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would typically send the data to your API
    console.log({
      ...formData,
      notificationType,
      recipientType,
      selectedTemplate,
      scheduledDate: selectedDate,
      recipients: selectedRecipients
    })
    
    // Close the form
    onCancel()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Notification Title</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter notification title"
            required
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <Label htmlFor="template">Use Template (Optional)</Label>
          </div>
          <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
            <SelectTrigger>
              <SelectValue placeholder="Select a template" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {templates.map(template => (
                <SelectItem key={template.id} value={template.id}>{template.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            placeholder="Enter notification message"
            rows={5}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Delivery Method</Label>
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span>Email</span>
              </div>
              <Switch
                checked={formData.sendEmail}
                onCheckedChange={(checked) => handleToggleChange("sendEmail", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span>Push Notification</span>
              </div>
              <Switch
                checked={formData.sendPush}
                onCheckedChange={(checked) => handleToggleChange("sendPush", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span>In-App Notification</span>
              </div>
              <Switch
                checked={formData.sendInApp}
                onCheckedChange={(checked) => handleToggleChange("sendInApp", checked)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Delivery Timing</Label>
          <RadioGroup value={notificationType} onValueChange={setNotificationType} className="flex flex-col space-y-1">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="immediate" id="immediate" />
              <Label htmlFor="immediate" className="cursor-pointer">Send Immediately</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="scheduled" id="scheduled" />
              <Label htmlFor="scheduled" className="cursor-pointer">Schedule for Later</Label>
            </div>
          </RadioGroup>

          {notificationType === "scheduled" && (
            <div className="pt-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label>Recipients</Label>
          <Tabs defaultValue="groups" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="groups">User Groups</TabsTrigger>
              <TabsTrigger value="specific">Specific Users</TabsTrigger>
            </TabsList>
            <TabsContent value="groups" className="space-y-4 pt-4">
              <RadioGroup value={recipientType} onValueChange={setRecipientType} className="flex flex-col space-y-1">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="all-users" />
                  <Label htmlFor="all-users" className="cursor-pointer">All Users</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="selected" id="selected-groups" />
                  <Label htmlFor="selected-groups" className="cursor-pointer">Selected Groups</Label>
                </div>
              </RadioGroup>

              {recipientType === "selected" && (
                <Card className="mt-4">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-2 gap-2">
                      {userGroups.map(group => (
                        <div 
                          key={group.id}
                          className={cn(
                            "flex items-center justify-between p-2 rounded-md cursor-pointer border",
                            selectedRecipients.includes(group.id) 
                              ? "border-primary bg-primary/10" 
                              : "border-input"
                          )}
                          onClick={() => handleSelectRecipient(group.id)}
                        >
                          <span>{group.name}</span>
                          {selectedRecipients.includes(group.id) && (
                            <Check className="h-4 w-4 text-primary" />
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            <TabsContent value="specific" className="space-y-4 pt-4">
              <div className="flex items-center space-x-2">
                <Info className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  User search functionality will be implemented in the next update.
                </span>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {notificationType === "immediate" ? "Send Notification" : "Schedule Notification"}
        </Button>
      </div>
    </form>
  )
}
