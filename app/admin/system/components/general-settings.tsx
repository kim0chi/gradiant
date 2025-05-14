"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { toast } from "@/components/ui/use-toast"

const generalSettingsSchema = z.object({
  schoolName: z.string().min(2, {
    message: "School name must be at least 2 characters.",
  }),
  schoolAddress: z.string().min(5, {
    message: "School address must be at least 5 characters.",
  }),
  contactEmail: z.string().email({
    message: "Please enter a valid email address.",
  }),
  contactPhone: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  academicYear: z.string({
    required_error: "Please select an academic year.",
  }),
  maintenanceMode: z.boolean().default(false),
  siteAnnouncement: z.string().optional(),
})

type GeneralSettingsValues = z.infer<typeof generalSettingsSchema>

export function GeneralSettings() {
  const [isSaving, setIsSaving] = useState(false)

  // Default values for the form
  const defaultValues: Partial<GeneralSettingsValues> = {
    schoolName: "Gradiant Academy",
    schoolAddress: "123 Education St, Learning City, 12345",
    contactEmail: "admin@gradiantacademy.edu",
    contactPhone: "(555) 123-4567",
    academicYear: "2023-2024",
    maintenanceMode: false,
    siteAnnouncement: "",
  }

  const form = useForm<GeneralSettingsValues>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues,
  })

  function onSubmit(data: GeneralSettingsValues) {
    setIsSaving(true)

    // Simulate API call
    setTimeout(() => {
      console.log(data)
      setIsSaving(false)
      toast({
        title: "Settings updated",
        description: "Your general settings have been saved successfully.",
      })
    }, 1000)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="schoolName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>School Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter school name" {...field} />
                </FormControl>
                <FormDescription>The official name of your educational institution.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="academicYear"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Academic Year</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select academic year" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="2022-2023">2022-2023</SelectItem>
                    <SelectItem value="2023-2024">2023-2024</SelectItem>
                    <SelectItem value="2024-2025">2024-2025</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>The current academic year for all reports and data.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="schoolAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>School Address</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter school address" {...field} />
              </FormControl>
              <FormDescription>The physical address of your institution.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="contactEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="admin@example.com" {...field} />
                </FormControl>
                <FormDescription>Primary contact email for system notifications.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contactPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Phone</FormLabel>
                <FormControl>
                  <Input placeholder="(555) 123-4567" {...field} />
                </FormControl>
                <FormDescription>Primary contact phone number.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="siteAnnouncement"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Site Announcement</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter an announcement to display on all pages (leave blank for none)"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormDescription>This message will be displayed as a banner on all pages.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="maintenanceMode"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Maintenance Mode</FormLabel>
                <FormDescription>When enabled, only administrators can access the system.</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  )
}
