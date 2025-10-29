"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Heart, User, Stethoscope, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"

export default function RegisterPage() {
  const router = useRouter()
  const { register, loading } = useAuth()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "farmer" as "farmer" | "veterinarian" | "admin",
    district: "",
    sector: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // For admin, show message
    if (formData.role === "admin") {
      toast({
        title: "Admin Registration",
        description: "Please contact system administrator for admin account creation at admin@vetconnect.rw",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: formData.role,
        district: formData.district,
        sector: formData.sector,
      })

      if (response.success && response.data) {
        toast({
          title: "Registration successful",
          description: `Welcome, ${response.data.user.name}! Please sign in.`,
        })
        router.push("/auth/login")
      } else {
        toast({
          title: "Registration failed",
          description: response.message || "Please check your details",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
              <Heart className="w-7 h-7 text-white" fill="white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">VetConnect Rwanda</span>
          </Link>
          <p className="text-gray-600 mt-2">Smart veterinary care for your livestock</p>
        </div>

        <Card className="shadow-xl border-gray-200">
          <CardHeader>
            <CardTitle className="text-2xl">Create Account</CardTitle>
            <CardDescription>Fill in your details to get started</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {/* Role Selection */}
              <div className="space-y-2">
                <Label htmlFor="role">I am a</Label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: "farmer" })}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.role === "farmer"
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 hover:border-green-300"
                    }`}
                  >
                    <User className={`w-6 h-6 mx-auto mb-2 ${
                      formData.role === "farmer" ? "text-green-600" : "text-gray-400"
                    }`} />
                    <span className={`text-xs font-medium ${
                      formData.role === "farmer" ? "text-green-600" : "text-gray-600"
                    }`}>
                      Farmer
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: "veterinarian" })}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.role === "veterinarian"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <Stethoscope className={`w-6 h-6 mx-auto mb-2 ${
                      formData.role === "veterinarian" ? "text-blue-600" : "text-gray-400"
                    }`} />
                    <span className={`text-xs font-medium ${
                      formData.role === "veterinarian" ? "text-blue-600" : "text-gray-600"
                    }`}>
                      Vet
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: "admin" })}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.role === "admin"
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200 hover:border-purple-300"
                    }`}
                  >
                    <ShieldCheck className={`w-6 h-6 mx-auto mb-2 ${
                      formData.role === "admin" ? "text-purple-600" : "text-gray-400"
                    }`} />
                    <span className={`text-xs font-medium ${
                      formData.role === "admin" ? "text-purple-600" : "text-gray-600"
                    }`}>
                      Admin
                    </span>
                  </button>
                </div>
              </div>

              {/* Admin Notice */}
              {formData.role === "admin" && (
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <p className="text-xs text-purple-900">
                    <strong>Note:</strong> Admin accounts require authorization. Contact admin@vetconnect.rw
                  </p>
                </div>
              )}

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+250 788 123 456"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>

              {/* District */}
              <div className="space-y-2">
                <Label htmlFor="district">District</Label>
                <Input
                  id="district"
                  type="text"
                  placeholder="e.g., Kigali"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  required
                />
              </div>

              {/* Sector */}
              <div className="space-y-2">
                <Label htmlFor="sector">Sector</Label>
                <Input
                  id="sector"
                  type="text"
                  placeholder="e.g., Gasabo"
                  value={formData.sector}
                  onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                  required
                />
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4">
              <Button 
                type="submit" 
                className={`w-full ${
                  formData.role === "admin" ? "bg-purple-600 hover:bg-purple-700" :
                  formData.role === "veterinarian" ? "bg-blue-600 hover:bg-blue-700" :
                  "bg-green-600 hover:bg-green-700"
                }`}
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
              <p className="text-sm text-center text-gray-600">
                Already have an account?{" "}
                <Link href="/auth/login" className={`${
                  formData.role === "admin" ? "text-purple-600" :
                  formData.role === "veterinarian" ? "text-blue-600" :
                  "text-green-600"
                } hover:underline font-medium`}>
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-gray-600 hover:text-green-600">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}