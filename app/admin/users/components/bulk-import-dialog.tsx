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
import { Upload, AlertCircle, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

type User = {
  id: string
  email: string
  full_name: string
  role: string
  created_at: string
}

type BulkImportDialogProps = {
  onSuccess: (newUsers: User[]) => void
}

export function BulkImportDialog({ onSuccess }: BulkImportDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
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
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error)
          errors.push(`User ${users[i].email}: ${errorMessage}`)
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

      // Call onSuccess with the new users
      if (successfulUsers.length > 0) {
        onSuccess(successfulUsers)

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
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "There was an error importing users"
      toast({
        title: "Import failed",
        description: errorMessage,
        variant: "destructive",
      })

      setImportResults({
        success: 0,
        failed: 0,
        errors: [errorMessage],
      })
    } finally {
      setIsImporting(false)
      setImportProgress(100)
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
      setIsOpen(false)
      setCsvData("")
      setImportResults(null)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload className="mr-2 h-4 w-4" />
          Bulk Import
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
  )
}
