"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Mail, Lock, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      })
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive"
      })
      return false
    }

    return true
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)

    try {
      console.log('═══════════════════════════════════════')
      console.log('🔵 LOGIN ATTEMPT STARTED')
      console.log('📧 Email:', formData.email)
      console.log('🔗 Backend URL:', BACKEND_URL)
      console.log('═══════════════════════════════════════')
      
      const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      })

      console.log('📡 Response Status:', response.status)
      console.log('📡 Response OK:', response.ok)

      const data = await response.json()
      console.log('📦 Full Response Data:', data)

      if (response.ok && data.success) {
        const user = data.data.user
        const token = data.data.token
        const role = user.role
        
        console.log('═══════════════════════════════════════')
        console.log('✅ LOGIN SUCCESSFUL!')
        console.log('👤 User Name:', user.name)
        console.log('👤 User Email:', user.email)
        console.log('🎭 User Role:', role)
        console.log('🎭 Role Type:', typeof role)
        console.log('🔑 Token:', token ? 'Token received ✓' : 'No token ✗')
        console.log('═══════════════════════════════════════')
        
        toast({
          title: "✅ Login Successful!",
          description: `Welcome back, ${user.name}! (Role: ${role})`,
        })

        // Store token and user data
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
        
        console.log('💾 Data saved to localStorage')
        console.log('💾 Stored user:', localStorage.getItem('user'))

        // Determine redirect path based on role (case-insensitive)
        const roleLower = role.toLowerCase().trim()
        let redirectPath = '/dashboard'
        
        console.log('🔍 Checking role for redirect...')
        console.log('🔍 Role (lowercase):', roleLower)
        
        if (roleLower === 'farmer') {
          redirectPath = '/dashboard/farmer'
          console.log('🚜 → Redirecting to FARMER dashboard')
        } else if (roleLower === 'veterinarian' || roleLower === 'vet') {
          redirectPath = '/dashboard/veterinarian'
          console.log('🩺 → Redirecting to VET dashboard')
        } else if (roleLower === 'admin' || roleLower === 'administrator') {
          redirectPath = '/dashboard/admin'
          console.log('👨‍💼 → Redirecting to ADMIN dashboard')
        } else {
          console.log('❓ → Unknown role, redirecting to default dashboard')
          console.log('⚠️ Role received:', role)
        }
        
        console.log('🔀 Final Redirect Path:', redirectPath)
        console.log('═══════════════════════════════════════')
        
        setTimeout(() => {
          console.log('🚀 Executing redirect NOW...')
          router.push(redirectPath)
        }, 1500)
      } else {
        console.log('═══════════════════════════════════════')
        console.error('❌ LOGIN FAILED')
        console.error('Error Message:', data.message)
        console.error('Full Error Data:', data)
        console.log('═══════════════════════════════════════')
        
        toast({
          title: "Login Failed",
          description: data.message || "Invalid credentials. Please try again.",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.log('═══════════════════════════════════════')
      console.error('💥 FATAL ERROR DURING LOGIN')
      console.error('Error Details:', error)
      console.log('═══════════════════════════════════════')
      
      toast({
        title: "Connection Error",
        description: "Failed to connect to server. Please check your backend is running.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/')}
            className="w-fit mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <CardTitle className="text-3xl font-bold text-center">Welcome Back</CardTitle>
          <CardDescription className="text-center">
            Login to your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            
            <div>
              <Label htmlFor="email">Email Address</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="pl-10"
                  disabled={loading}
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="pl-10"
                  disabled={loading}
                  autoComplete="current-password"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="remember" className="ml-2 text-sm cursor-pointer">
                  Remember me
                </Label>
              </div>
              <Link 
                href="/auth/forgot-password" 
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or</span>
              </div>
            </div>

            <p className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link href="/auth/register" className="text-blue-600 hover:underline font-semibold">
                Sign up here
              </Link>
            </p>

            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <p className="text-xs text-green-800 text-center">
                <strong>🌾 Farmers:</strong> Manage livestock health<br/>
                <strong>🩺 Veterinarians:</strong> Provide expert care<br/>
                <strong>👨‍💼 Admins:</strong> Oversee operations
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}