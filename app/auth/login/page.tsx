"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Heart, Mail, Lock, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.email || !formData.password) {
      toast({
        title: "Login failed",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    // Check Admin credentials first
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
    }

    // Check registered users first
    const registeredUsers = localStorage.getItem("registeredUsers")
    if (registeredUsers) {
      const users = JSON.parse(registeredUsers)
      const registeredUser = users.find(
        (u: any) => u.email === formData.email && u.password === formData.password
      )
      
      if (registeredUser) {
        const user = {
          id: registeredUser.id,
          name: registeredUser.name,
          email: registeredUser.email,
          role: registeredUser.role,
          phone: registeredUser.phone,
          district: registeredUser.district,
          sector: registeredUser.sector
        }
        localStorage.setItem("user", JSON.stringify(user))
        
        toast({
          title: "Login successful",
          description: `Welcome back, ${user.name}!`,
        })

        // Redirect based on role
        if (user.role === "farmer") {
          router.push("/dashboard/farmer")
        } else {
          router.push("/dashboard/veterinarian")
        }
        return
      }
    }

    // Fallback to demo accounts
    const demoAccounts = [
      { email: "farmer@example.com", password: "farmer123", role: "farmer", name: "Mary Uwase", id: 1 },
      { email: "vet@example.com", password: "vet123", role: "veterinarian", name: "Dr. Sarah Mukamana", id: 100 },
    ]

    const account = demoAccounts.find(
      acc => acc.email === formData.email && acc.password === formData.password
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
        description: "Invalid email or password",
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
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Link href="/auth/forgot-password" className="text-sm text-green-600 hover:underline">
                Forgot password?
              </Link>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <Button 
              onClick={handleSubmit}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Sign In
            </Button>
            <p className="text-sm text-center text-gray-600">
              Don't have an account?{" "}
              <Link href="/auth/register" className="text-green-600 hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </CardFooter>
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