"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "farmer" as "farmer" | "veterinarian",
    district: "",
    sector: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.password || !formData.phone || !formData.district || !formData.sector) {
      toast({
        title: "Registration failed",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    // Save registration data (in real app, this would be API call to backend)
    const registeredUsers = localStorage.getItem("registeredUsers")
    const users = registeredUsers ? JSON.parse(registeredUsers) : []
    
    // Check if email already exists
    if (users.find((u: any) => u.email === formData.email)) {
      toast({
        title: "Registration failed",
        description: "Email already exists. Please sign in.",
        variant: "destructive",
      })
      return
    }

    // Add new user to registered users
    users.push({
      id: Date.now(),
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      phone: formData.phone,
      district: formData.district,
      sector: formData.sector
    })
    
    localStorage.setItem("registeredUsers", JSON.stringify(users))

    toast({
      title: "Registration successful!",
      description: `Welcome, ${formData.name}! Please sign in to continue.`,
    })

    // Redirect to login page
    setTimeout(() => {
      router.push("/auth/login")
    }, 1500)
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
          <CardContent className="space-y-4">
            
            {/* Role Selection */}
            <div className="space-y-2">
              <Label htmlFor="role">I am a</Label>
              <Select value={formData.role} onValueChange={(value: "farmer" | "veterinarian") => setFormData({ ...formData, role: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="farmer">Farmer</SelectItem>
                  <SelectItem value="veterinarian">Veterinarian</SelectItem>
                </SelectContent>
              </Select>
            </div>

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
              <Select value={formData.district} onValueChange={(value) => setFormData({ ...formData, district: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select district..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Nyagatare">Nyagatare</SelectItem>
                  <SelectItem value="Gatsibo">Gatsibo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sector */}
            <div className="space-y-2">
              <Label htmlFor="sector">Sector</Label>
              <Input
                id="sector"
                type="text"
                placeholder="e.g., Nyagatare Sector"
                value={formData.sector}
                onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                required
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <Button 
              onClick={handleSubmit}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Create Account
            </Button>
            <p className="text-sm text-center text-gray-600">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-green-600 hover:underline font-medium">
                Sign in
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