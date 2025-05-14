"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { CalendarIcon, Clock, MapPin, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { CalendarEvent, CalendarEventType } from "./calendar-view"

interface EventDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (event: Omit<CalendarEvent, "id"> | CalendarEvent) => void
  onDelete?: (eventId: string) => void
  event: CalendarEvent | null
  selectedDate: Date | null
}

export function EventDialog({ isOpen, onClose, onSave, onDelete, event, selectedDate }: EventDialogProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [eventType, setEventType] = useState<CalendarEventType>("event")
  const [allDay, setAllDay] = useState(true)
  const [startTime, setStartTime] = useState("09:00")
  const [endTime, setEndTime] = useState("10:00")
  const [location, setLocation] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [formErrors, setFormErrors] = useState<{
    title?: string
    time?: string
  }>({})

  // Reset form when dialog opens/closes or event changes
  useEffect(() => {
    if (isOpen) {
      if (event) {
        setTitle(event.title)
        setDescription(event.description || "")
        setEventType(event.type)
        setAllDay(event.allDay || true)
        setStartTime(event.startTime || "09:00")
        setEndTime(event.endTime || "10:00")
        setLocation(event.location || "")
      } else {
        // Default values for new event
        setTitle("")
        setDescription("")
        setEventType("event")
        setAllDay(true)
        setStartTime("09:00")
        setEndTime("10:00")
        setLocation("")
      }
      setFormErrors({})
    }
  }, [isOpen, event])

  const validateForm = () => {
    const errors: { title?: string; time?: string } = {}

    if (!title.trim()) {
      errors.title = "Title is required"
    }

    if (!allDay && startTime && endTime) {
      const start = new Date(`2000-01-01T${startTime}`)
      const end = new Date(`2000-01-01T${endTime}`)

      if (end <= start) {
        errors.time = "End time must be after start time"
      }
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSave = () => {
    if (!validateForm() || !selectedDate) return

    const eventData = {
      ...(event ? { id: event.id } : {}),
      title: title.trim(),
      description: description.trim() || undefined,
      date: selectedDate.toISOString(),
      type: eventType,
      allDay,
      ...(allDay ? {} : { startTime, endTime }),
      location: location.trim() || undefined,
    }

    onSave(eventData as any)
  }

  const handleDelete = () => {
    if (event && onDelete) {
      onDelete(event.id)
    }
  }

  const eventTypeOptions = [
    { value: "event", label: "Event" },
    { value: "holiday", label: "Holiday" },
    { value: "exam", label: "Exam" },
  ]

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{event ? "Edit Event" : "Add New Event"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">
                Event Title<span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter event title"
                className={formErrors.title ? "border-destructive" : ""}
              />
              {formErrors.title && <p className="text-xs text-destructive">{formErrors.title}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter event description"
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="event-type">Event Type</Label>
              <Select value={eventType} onValueChange={(value) => setEventType(value as CalendarEventType)}>
                <SelectTrigger id="event-type">
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  {eventTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="location">Location (Optional)</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter location"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="all-day" checked={allDay} onCheckedChange={setAllDay} />
              <Label htmlFor="all-day" className="cursor-pointer">
                All Day Event
              </Label>
            </div>

            {!allDay && (
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="start-time">Start Time</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="start-time"
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className={cn("pl-10", formErrors.time ? "border-destructive" : "")}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="end-time">End Time</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="end-time"
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className={cn("pl-10", formErrors.time ? "border-destructive" : "")}
                    />
                  </div>
                </div>
                {formErrors.time && <p className="text-xs text-destructive col-span-2">{formErrors.time}</p>}
              </div>
            )}

            {selectedDate && (
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <CalendarIcon className="h-4 w-4" />
                <span>Date: {format(selectedDate, "EEEE, MMMM d, yyyy")}</span>
              </div>
            )}
          </div>
          <DialogFooter className="flex justify-between">
            {event && onDelete && (
              <Button
                variant="outline"
                className="text-destructive border-destructive hover:bg-destructive/10"
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            )}
            <div className="flex space-x-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSave}>{event ? "Update" : "Create"} Event</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the event "{event?.title}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}
