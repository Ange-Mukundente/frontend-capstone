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

type UserRole = "farmer" | "veterinarian" | "admin"

export default function LoginPage() {
  const router = useRouter()
  const { login, loading } = useAuth()
  const { toast } = useToast()
  const [selectedRole, setSelectedRole] = useState<UserRole>("farmer")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Admin Login - Direct authentication
    if (selectedRole === "admin") {
      if (formData.email === "admin@vetconnect.rw" && formData.password === "admin123") {
        const adminUser = {
          id: 999,
          name: "System Admin",
          email: "admin@vetconnect.rw",
          role: "admin",
          phone: "+250 788 000 000"
        }
        localStorage.setItem("user", JSON.stringify(adminUser))
        toast({
          title: "Login successful",
          description: "Welcome back, System Admin!",
        })
        router.push("/dashboard/admin")
        return
      } else {
        toast({
          title: "Login failed",
          description: "Invalid admin credentials",
          variant: "destructive",
        })
        return
      }
    }

    // Regular User Login (Farmer/Vet)
    try {
      const response = await login({
        email: formData.email,
        password: formData.password,
      })

      if (response.success && response.data) {
        toast({
          title: "Login successful",
          description: `Welcome back, ${response.data.user.name}!`,
        })
        // API should handle redirect based on user role
      } else {
        // Fallback to demo accounts
        const demoAccounts = [
          { email: "farmer@example.com", password: "farmer123", role: "farmer", name: "Mary Uwase", id: 1 },
          { email: "vet@example.com", password: "vet123", role: "veterinarian", name: "Dr. Sarah Mukamana", id: 100 },
        ]

        const account = demoAccounts.find(
          acc => acc.email === formData.email && acc.password === formData.password && acc.role === selectedRole
        )

        if (account) {
          const user = {
            id: account.id,
            name: account.name,
            email: account.email,
            role: account.role,
            phone: account.role === "farmer" ? "+250 788 123 456" : "+250 788 111 111"
          }
          localStorage.setItem("user", JSON.stringify(user))
          
          toast({
            title: "Login successful",
            description: `Welcome back, ${user.name}!`,
          })

          // Redirect based on role
          if (account.role === "farmer") {
            router.push("/dashboard/farmer")
          } else {
            router.push("/dashboard/veterinarian")
          }
        } else {
          toast({
            title: "Login failed",
            description: "Invalid credentials for selected role",
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center px-4">
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
            <CardTitle className="text-2xl">Sign In</CardTitle>
            <CardDescription>Select your role and enter your credentials</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {/* Role Selection */}
              <div className="space-y-2">
                <Label>I am a</Label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRole("farmer")}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedRole === "farmer"
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 hover:border-green-300"
                    }`}
                  >
                    <User className={`w-6 h-6 mx-auto mb-2 ${
                      selectedRole === "farmer" ? "text-green-600" : "text-gray-400"
                    }`} />
                    <span className={`text-xs font-medium ${
                      selectedRole === "farmer" ? "text-green-600" : "text-gray-600"
                    }`}>
                      Farmer
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRole("veterinarian")}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedRole === "veterinarian"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <Stethoscope className={`w-6 h-6 mx-auto mb-2 ${
                      selectedRole === "veterinarian" ? "text-blue-600" : "text-gray-400"
                    }`} />
                    <span className={`text-xs font-medium ${
                      selectedRole === "veterinarian" ? "text-blue-600" : "text-gray-600"
                    }`}>
                      Vet
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRole("admin")}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedRole === "admin"
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200 hover:border-purple-300"
                    }`}
                  >
                    <ShieldCheck className={`w-6 h-6 mx-auto mb-2 ${
                      selectedRole === "admin" ? "text-purple-600" : "text-gray-400"
                    }`} />
                    <span className={`text-xs font-medium ${
                      selectedRole === "admin" ? "text-purple-600" : "text-gray-600"
                    }`}>
                      Admin
                    </span>
                  </button>
                </div>
              </div>

              {/* Demo Credentials Info */}
              {selectedRole === "farmer" && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-xs font-semibold text-green-900 mb-1">Demo Farmer Account:</p>
                  <p className="text-xs text-green-800">Email: farmer@example.com</p>
                  <p className="text-xs text-green-800">Password: farmer123</p>
                </div>
              )}

              {selectedRole === "veterinarian" && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs font-semibold text-blue-900 mb-1">Demo Vet Account:</p>
                  <p className="text-xs text-blue-800">Email: vet@example.com</p>
                  <p className="text-xs text-blue-800">Password: vet123</p>
                </div>
              )}

              {selectedRole === "admin" && (
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <p className="text-xs font-semibold text-purple-900 mb-1">Admin Credentials:</p>
                  <p className="text-xs text-purple-800">Email: admin@vetconnect.rw</p>
                  <p className="text-xs text-purple-800">Password: admin123</p>
                </div>
              )}

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
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
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>

              {selectedRole !== "admin" && (
                <div className="flex items-center justify-between">
                  <Link href="/auth/forgot-password" className={`text-sm ${
                    selectedRole === "veterinarian" ? "text-blue-600" : "text-green-600"
                  } hover:underline`}>
                    Forgot password?
                  </Link>
                </div>
              )}
            </CardContent>

            <CardFooter className="flex flex-col gap-4">
              <Button 
                type="submit" 
                className={`w-full ${
                  selectedRole === "admin" ? "bg-purple-600 hover:bg-purple-700" :
                  selectedRole === "veterinarian" ? "bg-blue-600 hover:bg-blue-700" :
                  "bg-green-600 hover:bg-green-700"
                }`}
                disabled={loading && selectedRole !== "admin"}
              >
                {loading && selectedRole !== "admin" ? "Signing in..." : "Sign In"}
              </Button>
              <p className="text-sm text-center text-gray-600">
                Don't have an account?{" "}
                <Link href="/auth/register" className={`${
                  selectedRole === "admin" ? "text-purple-600" :
                  selectedRole === "veterinarian" ? "text-blue-600" :
                  "text-green-600"
                } hover:underline font-medium`}>
                  Sign up
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