"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, BookOpen, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { signInWithEmail } from "@/lib/auth-service"
import { createClient } from "@/lib/supabase/client"

export default function StudentLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const {
        user,
        session,
        error: signInError,
      } = await signInWithEmail({
        email,
        password,
      })

      if (signInError) {
        setError(signInError)
        setLoading(false)
        return
      }

      if (!user || !session) {
        setError("Failed to sign in. Please try again.")
        setLoading(false)
        return
      }

      // Verify the user is a student
      const supabase = createClient()
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single()

      if (profileError) {
        setError("Failed to verify user role. Please try again.")
        setLoading(false)
        return
      }

      if (profile.role !== "student") {
        setError("This portal is only for students. Please use the main login page.")
        // Sign out the user since they're not a student
        await supabase.auth.signOut()
        setLoading(false)
        return
      }

      // Redirect to student dashboard
      router.push("/student")
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = async () => {
    setEmail("student@example.com")
    setPassword("password123")
    setLoading(true)
    setError(null)

    // Simulate a delay for demo purposes
    setTimeout(async () => {
      try {
        // Use the mock auth service for demo
        const { getMockUser, setMockUser } = await import("@/lib/mockAuth")

        // Create a mock student user
        setMockUser({
          id: "student-123",
          email: "student@example.com",
          name: "Demo Student",
          role: "student",
        })

        // Redirect to student dashboard
        router.push("/student")
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred")
        setLoading(false)
      }
    }, 1000)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <Button variant="ghost" asChild className="absolute top-4 left-4">
        <Link href="/" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </Button>
      <div className="w-full max-w-md">
        <div className="mb-8">
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-2">
              <BookOpen className="h-8 w-8 text-indigo-600" />
              <h1 className="text-2xl font-bold text-indigo-600">Gradiant</h1>
            </div>
          </div>
        </div>

        <Card className="border-indigo-100 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Student Portal</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your student dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@school.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/auth/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-800">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm text-muted-foreground">
              <span>Don&apos;t have an account? </span>
              <Link href="/auth/register" className="text-indigo-600 hover:text-indigo-800">
                Register
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full border-indigo-200 text-indigo-600 hover:bg-indigo-50"
              onClick={handleDemoLogin}
              disabled={loading}
            >
              Demo Mode
            </Button>
            <div className="text-center text-xs text-muted-foreground mt-4">
              <span>Are you a teacher or administrator? </span>
              <Link href="/login" className="text-indigo-600 hover:text-indigo-800">
                Login here
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
