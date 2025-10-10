"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Heart, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export default function ForgotPasswordPage() {
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // TODO: Implement password reset API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setIsSubmitted(true)
      toast({
        title: "Reset link sent",
        description: "Check your email for password reset instructions",
      })
    } catch (error) {
      toast({
        title: "Failed to send reset link",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-600">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold">VetConnect Rwanda</span>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Reset Password</CardTitle>
            <CardDescription>
              {isSubmitted
                ? "Check your email for reset instructions"
                : "Enter your email to receive a password reset link"}
            </CardDescription>
          </CardHeader>
          {!isSubmitted ? (
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </Button>
                <Link href="/auth/login" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
                  <ArrowLeft className="h-4 w-4" />
                  Back to sign in
                </Link>
              </CardFooter>
            </form>
          ) : (
            <CardFooter className="flex flex-col gap-4">
              <p className="text-sm text-gray-600 text-center">
                We've sent a password reset link to <strong>{email}</strong>. Please check your inbox and follow the
                instructions.
              </p>
              <Link
                href="/auth/login"
                className="flex items-center justify-center gap-2 text-sm text-green-600 hover:underline"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to sign in
              </Link>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  )
}