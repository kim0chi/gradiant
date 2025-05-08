"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"
import { toast } from "@/components/ui/use-toast"
import { Slider } from "@/components/ui/slider"

const securitySettingsSchema = z.object({
  passwordMinLength: z.number().min(8).max(32),
  passwordRequireUppercase: z.boolean().default(true),
  passwordRequireNumbers: z.boolean().default(true),
  passwordRequireSymbols: z.boolean().default(true),
  passwordExpiryDays: z.number().min(0).max(365),
  maxLoginAttempts: z.number().min(3).max(10),
  sessionTimeout: z.number().min(5).max(1440),
  twoFactorAuth: z.boolean().default(false),
  ipRestriction: z.boolean().default(false),
  allowedIPs: z.string().optional(),
})

type SecuritySettingsValues = z.infer<typeof securitySettingsSchema>

export function SecuritySettings() {
  const [isSaving, setIsSaving] = useState(false)

  // Default values for the form
  const defaultValues: Partial<SecuritySettingsValues> = {
    passwordMinLength: 10,
    passwordRequireUppercase: true,
    passwordRequireNumbers: true,
    passwordRequireSymbols: true,
    passwordExpiryDays: 90,
    maxLoginAttempts: 5,
    sessionTimeout: 60,
    twoFactorAuth: false,
    ipRestriction: false,
    allowedIPs: "",
  }

  const form = useForm<SecuritySettingsValues>({
    resolver: zodResolver(securitySettingsSchema),
    defaultValues,
  })

  function onSubmit(data: SecuritySettingsValues) {
    setIsSaving(true)

    // Simulate API call
    setTimeout(() => {
      console.log(data)
      setIsSaving(false)
      toast({
        title: "Security settings updated",
        description: "Your security settings have been saved successfully.",
      })
    }, 1000)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Password Policy</h3>

          <FormField
            control={form.control}
            name="passwordMinLength"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum Password Length: {field.value}</FormLabel>
                <FormControl>
                  <Slider
                    min={8}
                    max={32}
                    step={1}
                    defaultValue={[field.value]}
                    onValueChange={(value) => field.onChange(value[0])}
                  />
                </FormControl>
                <FormDescription>Minimum number of characters required for passwords.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-4 md:grid-cols-3">
            <FormField
              control={form.control}
              name="passwordRequireUppercase"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Require Uppercase</FormLabel>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="passwordRequireNumbers"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Require Numbers</FormLabel>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="passwordRequireSymbols"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Require Symbols</FormLabel>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="passwordExpiryDays"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password Expiry (Days): {field.value}</FormLabel>
                <FormControl>
                  <Slider
                    min={0}
                    max={365}
                    step={30}
                    defaultValue={[field.value]}
                    onValueChange={(value) => field.onChange(value[0])}
                  />
                </FormControl>
                <FormDescription>Number of days before passwords expire (0 = never expire).</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Login Security</h3>

          <FormField
            control={form.control}
            name="maxLoginAttempts"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Login Attempts: {field.value}</FormLabel>
                <FormControl>
                  <Slider
                    min={3}
                    max={10}
                    step={1}
                    defaultValue={[field.value]}
                    onValueChange={(value) => field.onChange(value[0])}
                  />
                </FormControl>
                <FormDescription>Maximum number of failed login attempts before account lockout.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sessionTimeout"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Session Timeout (Minutes): {field.value}</FormLabel>
                <FormControl>
                  <Slider
                    min={5}
                    max={1440}
                    step={5}
                    defaultValue={[field.value]}
                    onValueChange={(value) => field.onChange(value[0])}
                  />
                </FormControl>
                <FormDescription>Time of inactivity before a user is automatically logged out.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="twoFactorAuth"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Two-Factor Authentication</FormLabel>
                  <FormDescription>Require two-factor authentication for all admin users.</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Access Restrictions</h3>

          <FormField
            control={form.control}
            name="ipRestriction"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">IP Restriction</FormLabel>
                  <FormDescription>Restrict admin access to specific IP addresses.</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          {form.watch("ipRestriction") && (
            <FormField
              control={form.control}
              name="allowedIPs"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Allowed IP Addresses</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter comma-separated IP addresses (e.g., 192.168.1.1, 10.0.0.1)"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormDescription>Only these IP addresses will be allowed to access the admin area.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Security Settings"}
        </Button>
      </form>
    </Form>
  )
}
