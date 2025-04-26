import Link from "next/link"
import type { Metadata } from "next"
import { ArrowRight, ArrowLeft } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Forgot Password | Gradiant",
  description: "Reset your Gradiant account password",
}

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-cyan-50 to-blue-50 p-4 dark:from-gray-900 dark:to-gray-800">
      <Link href="/" className="mb-8 flex items-center space-x-2">
        <Image
          src="/gradiant-logo.svg"
          alt="Gradiant"
          width={30}
          height={40}
          priority
        />
        <Image
          src="/gradiant-text.svg"
          alt="Gradiant"
          width={150}
          height={40}
          priority
        />
      </Link>

      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
          <CardDescription>Enter your email address and we'll send you a link to reset your password</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>    
            <Input id="email" type="email" placeholder="m.johnson@school.edu" />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
            Send reset link
            <ArrowRight className="ml-1.5 h-4 w-4" />
          </Button>
          <div className="text-center text-sm">
            <Link href="/login" className="flex items-center justify-center text-primary hover:underline">
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              Back to login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}