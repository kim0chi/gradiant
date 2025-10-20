"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { toast } from "@/components/ui/use-toast"
import { Checkbox } from "@/components/ui/checkbox"

const notificationSettingsSchema = z.object({
  emailNotifications: z.boolean().default(true),
  smsNotifications: z.boolean().default(false),
  pushNotifications: z.boolean().default(true),
  inAppNotifications: z.boolean().default(true),
  emailFrom: z.string().email({
    message: "Please enter a valid email address.",
  }),
  emailFooter: z.string().optional(),
  notifyOnUserRegistration: z.boolean().default(true),
  notifyOnPasswordReset: z.boolean().default(true),
  notifyOnSystemErrors: z.boolean().default(true),
  notifyOnDataBackup: z.boolean().default(true),
  smsApiKey: z.string().optional(),
  smsFromNumber: z.string().optional(),
})

type NotificationSettingsValues = z.infer<typeof notificationSettingsSchema>

export function NotificationSettings() {
  const [isSaving, setIsSaving] = useState(false)

  // Default values for the form
  const defaultValues: Partial<NotificationSettingsValues> = {
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    inAppNotifications: true,
    emailFrom: "notifications@gradiantacademy.edu",
    emailFooter: "This is an automated message from Gradiant Academy. Please do not reply to this email.",
    notifyOnUserRegistration: true,
    notifyOnPasswordReset: true,
    notifyOnSystemErrors: true,
    notifyOnDataBackup: true,
    smsApiKey: "",
    smsFromNumber: "",
  }

  const form = useForm<NotificationSettingsValues>({
    resolver: zodResolver(notificationSettingsSchema),
    defaultValues,
  })

  function onSubmit(data: NotificationSettingsValues) {
    setIsSaving(true)

    // Simulate API call
    setTimeout(() => {
      console.log(data)
      setIsSaving(false)
      toast({
        title: "Notification settings updated",
        description: "Your notification settings have been saved successfully.",
      })
    }, 1000)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Notification Channels</h3>

          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="emailNotifications"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Email Notifications</FormLabel>
                    <FormDescription>Send notifications via email</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="smsNotifications"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>SMS Notifications</FormLabel>
                    <FormDescription>Send notifications via SMS</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pushNotifications"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Push Notifications</FormLabel>
                    <FormDescription>Send browser push notifications</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="inAppNotifications"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>In-App Notifications</FormLabel>
                    <FormDescription>Show notifications within the application</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        {form.watch("emailNotifications") && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Email Settings</h3>

            <FormField
              control={form.control}
              name="emailFrom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>From Email Address</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="notifications@example.com" {...field} />
                  </FormControl>
                  <FormDescription>The email address that will appear in the &quot;From&quot; field.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="emailFooter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Footer</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter text to appear at the bottom of all emails"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormDescription>This text will appear at the bottom of all system emails.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {form.watch("smsNotifications") && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">SMS Settings</h3>

            <FormField
              control={form.control}
              name="smsApiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SMS API Key</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Enter SMS API key" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormDescription>API key for your SMS service provider.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="smsFromNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>From Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="+15551234567" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormDescription>The phone number that SMS messages will appear to be from.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Notification Events</h3>

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="notifyOnUserRegistration"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>User Registration</FormLabel>
                    <FormDescription>Notify administrators when new users register</FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notifyOnPasswordReset"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Password Reset</FormLabel>
                    <FormDescription>Notify administrators when users reset their passwords</FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notifyOnSystemErrors"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>System Errors</FormLabel>
                    <FormDescription>Notify administrators when system errors occur</FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notifyOnDataBackup"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Data Backup</FormLabel>
                    <FormDescription>Notify administrators when data backups are completed</FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Notification Settings"}
        </Button>
      </form>
    </Form>
  )
}
