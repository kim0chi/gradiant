"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase/client"
import { Upload, Download, AlertCircle, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function UserImportExport() {
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [csvData, setCsvData] = useState("")
  const [isImporting, setIsImporting] = useState(false)
  const [importProgress, setImportProgress] = useState(0)
  const [importResults, setImportResults] = useState<{
    success: number
    failed: number
    errors: string[]
  } | null>(null)
  const { toast } = useToast()

  const handleImport = async () => {
    if (!csvData.trim()) {
      toast({
        title: "Error",
        description: "Please enter CSV data",
        variant: "destructive",
      })
      return
    }

    setIsImporting(true)
    setImportProgress(0)
    setImportResults(null)

    try {
      // Parse CSV data
      const lines = csvData.trim().split("\n")
      const headers = lines[0].split(",").map((header) => header.trim().toLowerCase())

      // Validate headers
      const requiredHeaders = ["email", "name", "role"]
      const missingHeaders = requiredHeaders.filter((header) => !headers.includes(header))

      if (missingHeaders.length > 0) {
        throw new Error(`Missing required headers: ${missingHeaders.join(", ")}`)
      }

      const users = []
      const errors = []
      const successfulUsers = []

      // Process each line
      for (let i = 1; i < lines.length; i++) {
        try {
          const values = lines[i].split(",").map((value) => value.trim())

          if (values.length !== headers.length) {
            errors.push(`Line ${i + 1}: Invalid number of columns`)
            continue
          }

          const user: Record<string, string> = {}
          headers.forEach((header, index) => {
            user[header] = values[index]
          })

          // Validate user data
          if (!user.email || !user.email.includes("@")) {
            errors.push(`Line ${i + 1}: Invalid email address`)
            continue
          }

          if (!user.name) {
            errors.push(`Line ${i + 1}: Name is required`)
            continue
          }

          if (!["admin", "teacher", "student"].includes(user.role.toLowerCase())) {
            errors.push(`Line ${i + 1}: Role must be admin, teacher, or student`)
            continue
          }

          users.push({
            email: user.email,
            fullName: user.name,
            role: user.role.toLowerCase(),
          })
        } catch (error) {
          errors.push(`Line ${i + 1}: ${(error as Error).message}`)
        }

        // Update progress
        setImportProgress(Math.floor(((i + 1) / lines.length) * 50))
      }

      // Create users in Supabase
      for (let i = 0; i < users.length; i++) {
        try {
          const user = users[i]

          // Generate a random password
          const tempPassword = generateTemporaryPassword()

          // Create the user in Supabase Auth
          const { data, error } = await supabase.auth.admin.createUser({
            email: user.email,
            password: tempPassword,
            email_confirm: true,
            user_metadata: {
              full_name: user.fullName,
            },
          })

          if (error) throw error

          // Create a profile record
          if (data.user) {
            const { error: profileError } = await supabase.from("profiles").insert({
              id: data.user.id,
              email: user.email,
              full_name: user.fullName,
              role: user.role,
            })

            if (profileError) throw profileError

            // Send email with temporary credentials (mock)
            await sendWelcomeEmail(user.email, user.fullName, tempPassword)

            successfulUsers.push({
              id: data.user.id,
              email: user.email,
              full_name: user.fullName,
              role: user.role,
              created_at: new Date().toISOString(),
            })
          }
        } catch (error: any) {
          errors.push(`User ${users[i].email}: ${error.message}`)
        }

        // Update progress
        setImportProgress(50 + Math.floor(((i + 1) / users.length) * 50))
      }

      // Set import results
      setImportResults({
        success: successfulUsers.length,
        failed: users.length - successfulUsers.length + errors.length - (users.length - successfulUsers.length),
        errors,
      })

      // Show toast with results
      if (successfulUsers.length > 0) {
        toast({
          title: "Import completed",
          description: `Successfully imported ${successfulUsers.length} users with ${errors.length} errors.`,
        })
      } else {
        toast({
          title: "Import failed",
          description: "No users were imported. Please check the errors and try again.",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      toast({
        title: "Import failed",
        description: error.message || "There was an error importing users",
        variant: "destructive",
      })

      setImportResults({
        success: 0,
        failed: 0,
        errors: [error.message],
      })
    } finally {
      setIsImporting(false)
      setImportProgress(100)
    }
  }

  const handleExportUsers = async (format: "csv" | "json") => {
    try {
      // Fetch all users
      const { data, error } = await supabase
        .from("profiles")
        .select("id, email, full_name, role, created_at")
        .order("created_at", { ascending: false })

      if (error) throw error

      if (!data || data.length === 0) {
        toast({
          title: "No users to export",
          description: "There are no users in the system to export.",
          variant: "destructive",
        })
        return
      }

      let content: string
      let filename: string
      let mimeType: string

      if (format === "csv") {
        // Create CSV content
        const headers = ["ID", "Email", "Full Name", "Role", "Created At"]
        const rows = data.map((user) => [user.id, user.email, user.full_name || "", user.role, user.created_at])

        content = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")
        filename = `users_export_${new Date().toISOString().split("T")[0]}.csv`
        mimeType = "text/csv"
      } else {
        // Create JSON content
        content = JSON.stringify(data, null, 2)
        filename = `users_export_${new Date().toISOString().split("T")[0]}.json`
        mimeType = "application/json"
      }

      // Create download link
      const blob = new Blob([content], { type: mimeType })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Export successful",
        description: `${data.length} users exported to ${format.toUpperCase()} format.`,
      })
    } catch (error: any) {
      toast({
        title: "Export failed",
        description: error.message || "There was an error exporting users",
        variant: "destructive",
      })
    }
  }

  // Generate a temporary password
  const generateTemporaryPassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*"
    let password = ""
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return password
  }

  // Send welcome email with temporary credentials (mock)
  const sendWelcomeEmail = async (email: string, name: string, password: string) => {
    // In a real application, you would use an email service
    console.log(`Welcome email to ${name} (${email}):`)
    console.log(`Temporary password: ${password}`)

    // Mock email sending
    return new Promise((resolve) => setTimeout(resolve, 100))
  }

  const handleClose = () => {
    if (!isImporting) {
      setIsImportDialogOpen(false)
      setCsvData("")
      setImportResults(null)
    }
  }

  return (
    <div className="flex gap-2">
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Bulk Import Users</DialogTitle>
            <DialogDescription>
              Import multiple users at once using CSV format. The first line should contain headers: email, name, role.
            </DialogDescription>
          </DialogHeader>

          {!isImporting && !importResults && (
            <>
              <div className="grid gap-4">
                <div>
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>CSV Format</AlertTitle>
                    <AlertDescription>
                      Use the format: email,name,role
                      <br />
                      Example: john@example.com,John Doe,teacher
                    </AlertDescription>
                  </Alert>
                </div>
                <Textarea
                  placeholder="Paste CSV data here..."
                  value={csvData}
                  onChange={(e) => setCsvData(e.target.value)}
                  className="min-h-[200px]"
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button onClick={handleImport} disabled={!csvData.trim()}>
                  Import Users
                </Button>
              </DialogFooter>
            </>
          )}

          {isImporting && (
            <div className="space-y-4 py-4">
              <p className="text-center">Importing users...</p>
              <Progress value={importProgress} className="w-full" />
            </div>
          )}

          {importResults && (
            <div className="space-y-4">
              <Alert variant={importResults.success > 0 ? "default" : "destructive"}>
                {importResults.success > 0 ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                <AlertTitle>Import Results</AlertTitle>
                <AlertDescription>
                  Successfully imported {importResults.success} users.
                  <br />
                  Failed to import {importResults.failed} users.
                </AlertDescription>
              </Alert>

              {importResults.errors.length > 0 && (
                <div>
                  <h3 className="mb-2 font-medium">Errors:</h3>
                  <div className="max-h-[200px] overflow-y-auto rounded border p-2">
                    <ul className="list-inside list-disc space-y-1">
                      {importResults.errors.map((error, index) => (
                        <li key={index} className="text-sm text-red-600">
                          {error}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              <DialogFooter>
                <Button onClick={handleClose}>Close</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => handleExportUsers("csv")}>Export as CSV</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleExportUsers("json")}>Export as JSON</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
