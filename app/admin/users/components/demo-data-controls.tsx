"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, Database, Trash2 } from "lucide-react"
import { loadDemoUsers, clearDemoData } from "@/lib/demo-service"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export function DemoDataControls() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isClearing, setIsClearing] = useState(false)
  const [userCount, setUserCount] = useState<string>("10")
  const [showDialog, setShowDialog] = useState(false)

  const handleLoadDemoData = async () => {
    setIsLoading(true)
    try {
      const count = Number.parseInt(userCount, 10)
      const { success, error, count: createdCount } = await loadDemoUsers(count)

      if (success) {
        toast({
          title: "Demo data loaded",
          description: `Successfully created ${createdCount} demo users.`,
        })
        // Refresh the page to show new data
        window.location.reload()
      } else {
        toast({
          title: "Error loading demo data",
          description: error?.message || "An unknown error occurred",
          variant: "destructive",
        })
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
      toast({
        title: "Error loading demo data",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setShowDialog(false)
    }
  }

  const handleClearDemoData = async () => {
    if (!confirm("Are you sure you want to remove all demo data? This cannot be undone.")) {
      return
    }

    setIsClearing(true)
    try {
      const { success, error } = await clearDemoData()

      if (success) {
        toast({
          title: "Demo data cleared",
          description: "All demo users have been removed.",
        })
        // Refresh the page to show changes
        window.location.reload()
      } else {
        toast({
          title: "Error clearing demo data",
          description: error?.message || "An unknown error occurred",
          variant: "destructive",
        })
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
      toast({
        title: "Error clearing demo data",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsClearing(false)
    }
  }

  return (
    <div className="flex gap-2">
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <Database className="mr-2 h-4 w-4" />
            Load Demo Data
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Load Demo Data</DialogTitle>
            <DialogDescription>
              This will create sample users for demonstration purposes. All demo users will have the password
              &quot;Demo123!&quot;.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="user-count" className="text-right">
                Number of Users
              </Label>
              <Select value={userCount} onValueChange={setUserCount}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select number of users" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 users (Quick)</SelectItem>
                  <SelectItem value="25">25 users</SelectItem>
                  <SelectItem value="50">50 users</SelectItem>
                  <SelectItem value="100">100 users</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleLoadDemoData} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                "Load Demo Data"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Button variant="outline" onClick={handleClearDemoData} disabled={isClearing}>
        {isClearing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Clearing...
          </>
        ) : (
          <>
            <Trash2 className="mr-2 h-4 w-4" />
            Clear Demo Data
          </>
        )}
      </Button>
    </div>
  )
}
