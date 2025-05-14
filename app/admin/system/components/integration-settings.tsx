"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"
import { toast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const integrationSettingsSchema = z.object({
  googleEnabled: z.boolean().default(false),
  googleClientId: z.string().optional(),
  googleClientSecret: z.string().optional(),

  microsoftEnabled: z.boolean().default(false),
  microsoftClientId: z.string().optional(),
  microsoftClientSecret: z.string().optional(),

  canvasEnabled: z.boolean().default(false),
  canvasApiKey: z.string().optional(),
  canvasUrl: z.string().optional(),

  mailchimpEnabled: z.boolean().default(false),
  mailchimpApiKey: z.string().optional(),
  mailchimpListId: z.string().optional(),
})

type IntegrationSettingsValues = z.infer<typeof integrationSettingsSchema>

export function IntegrationSettings() {
  const [isSaving, setIsSaving] = useState(false)

  // Default values for the form
  const defaultValues: Partial<IntegrationSettingsValues> = {
    googleEnabled: false,
    googleClientId: "",
    googleClientSecret: "",

    microsoftEnabled: false,
    microsoftClientId: "",
    microsoftClientSecret: "",

    canvasEnabled: false,
    canvasApiKey: "",
    canvasUrl: "",

    mailchimpEnabled: false,
    mailchimpApiKey: "",
    mailchimpListId: "",
  }

  const form = useForm<IntegrationSettingsValues>({
    resolver: zodResolver(integrationSettingsSchema),
    defaultValues,
  })

  function onSubmit(data: IntegrationSettingsValues) {
    setIsSaving(true)

    // Simulate API call
    setTimeout(() => {
      console.log(data)
      setIsSaving(false)
      toast({
        title: "Integration settings updated",
        description: "Your integration settings have been saved successfully.",
      })
    }, 1000)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Google Integration */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Google Workspace</CardTitle>
                <Badge variant={form.watch("googleEnabled") ? "default" : "outline"}>
                  {form.watch("googleEnabled") ? "Enabled" : "Disabled"}
                </Badge>
              </div>
              <CardDescription>Integrate with Google for authentication and calendar sync</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="googleEnabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <FormLabel>Enable Google Integration</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {form.watch("googleEnabled") && (
                <>
                  <FormField
                    control={form.control}
                    name="googleClientId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client ID</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter Google Client ID" {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="googleClientSecret"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client Secret</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Enter Google Client Secret"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </CardContent>
          </Card>

          {/* Microsoft Integration */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Microsoft 365</CardTitle>
                <Badge variant={form.watch("microsoftEnabled") ? "default" : "outline"}>
                  {form.watch("microsoftEnabled") ? "Enabled" : "Disabled"}
                </Badge>
              </div>
              <CardDescription>Integrate with Microsoft for authentication and Office 365</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="microsoftEnabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <FormLabel>Enable Microsoft Integration</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {form.watch("microsoftEnabled") && (
                <>
                  <FormField
                    control={form.control}
                    name="microsoftClientId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client ID</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter Microsoft Client ID" {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="microsoftClientSecret"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client Secret</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Enter Microsoft Client Secret"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </CardContent>
          </Card>

          {/* Canvas LMS Integration */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Canvas LMS</CardTitle>
                <Badge variant={form.watch("canvasEnabled") ? "default" : "outline"}>
                  {form.watch("canvasEnabled") ? "Enabled" : "Disabled"}
                </Badge>
              </div>
              <CardDescription>Integrate with Canvas Learning Management System</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="canvasEnabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <FormLabel>Enable Canvas Integration</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {form.watch("canvasEnabled") && (
                <>
                  <FormField
                    control={form.control}
                    name="canvasApiKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>API Key</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Enter Canvas API Key"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="canvasUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Canvas URL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://institution.instructure.com"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </CardContent>
          </Card>

          {/* Mailchimp Integration */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Mailchimp</CardTitle>
                <Badge variant={form.watch("mailchimpEnabled") ? "default" : "outline"}>
                  {form.watch("mailchimpEnabled") ? "Enabled" : "Disabled"}
                </Badge>
              </div>
              <CardDescription>Integrate with Mailchimp for email newsletters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="mailchimpEnabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <FormLabel>Enable Mailchimp Integration</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {form.watch("mailchimpEnabled") && (
                <>
                  <FormField
                    control={form.control}
                    name="mailchimpApiKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>API Key</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Enter Mailchimp API Key"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="mailchimpListId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>List ID</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter Mailchimp List ID" {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Integration Settings"}
        </Button>
      </form>
    </Form>
  )
}
