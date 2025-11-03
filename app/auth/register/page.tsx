"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, User, Mail, Phone, Lock, MapPin, Briefcase, Award, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'

export default function SignupPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"farmer" | "veterinarian">("farmer")
  
  const [farmerData, setFarmerData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    district: "",
    sector: ""
  })

  const [vetData, setVetData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    specialty: "",
    licenseNumber: "",
    location: ""
  })

  const districts = ["Nyagatare", "Gatsibo", "Kayonza", "Kirehe", "Rwamagana"]
  const sectors: Record<string, string[]> = {
    "Nyagatare": ["Nyagatare Sector", "Rwimiyaga Sector", "Karama Sector", "Mimuri Sector"],
    "Gatsibo": ["Gatsibo Sector", "Kabarore Sector", "Kiramuruzi Sector", "Rugarama Sector"],
    "Kayonza": ["Kayonza Sector", "Mukarange Sector", "Murundi Sector"],
    "Kirehe": ["Kirehe Sector", "Gahara Sector", "Kigarama Sector"],
    "Rwamagana": ["Rwamagana Sector", "Muhazi Sector", "Kigabiro Sector"]
  }

  const specialties = [
    "Large Animal Medicine",
    "Small Animal Medicine",
    "Livestock Health",
    "Poultry Medicine",
    "General Veterinary Practice",
    "Surgery",
    "Emergency Medicine"
  ]

  const handleFarmerChange = (field: string, value: string) => {
    setFarmerData(prev => ({ ...prev, [field]: value }))
    if (field === "district") {
      setFarmerData(prev => ({ ...prev, sector: "" }))
    }
  }

  const handleVetChange = (field: string, value: string) => {
    setVetData(prev => ({ ...prev, [field]: value }))
  }

  const validateFarmerForm = () => {
    if (!farmerData.name || !farmerData.email || !farmerData.phone || 
        !farmerData.password || !farmerData.district || !farmerData.sector) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return false
    }

    if (farmerData.password !== farmerData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive"
      })
      return false
    }

    if (farmerData.password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive"
      })
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(farmerData.email)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive"
      })
      return false
    }

    return true
  }

  const validateVetForm = () => {
    if (!vetData.name || !vetData.email || !vetData.phone || 
        !vetData.password || !vetData.specialty || !vetData.licenseNumber || !vetData.location) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return false
    }

    if (vetData.password !== vetData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive"
      })
      return false
    }

    if (vetData.password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive"
      })
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(vetData.email)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive"
      })
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const isFarmer = activeTab === "farmer"
    const isValid = isFarmer ? validateFarmerForm() : validateVetForm()
    
    if (!isValid) return

    setLoading(true)

    try {
      const requestBody = isFarmer ? {
        name: farmerData.name,
        email: farmerData.email,
        phone: farmerData.phone,
        password: farmerData.password,
        role: 'farmer',
        district: farmerData.district,
        sector: farmerData.sector
      } : {
        name: vetData.name,
        email: vetData.email,
        phone: vetData.phone,
        password: vetData.password,
        role: 'veterinarian',
        specialty: vetData.specialty,
        licenseNumber: vetData.licenseNumber,
        location: vetData.location
      }

      const response = await fetch(`${BACKEND_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        toast({
          title: "✅ Registration Successful!",
          description: `Your ${isFarmer ? 'farmer' : 'veterinarian'} account has been created.`,
        })

        // Store token and user data
        localStorage.setItem('token', data.data.token)
        localStorage.setItem('user', JSON.stringify(data.data.user))

        // Redirect based on role
        setTimeout(() => {
          router.push(isFarmer ? '/dashboard/farmer' : '/dashboard/veterinarian')
        }, 1500)
      } else {
        toast({
          title: "Registration Failed",
          description: data.message || "Something went wrong. Please try again.",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Registration error:', error)
      toast({
        title: "Error",
        description: "Failed to connect to server. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl shadow-xl">
        <CardHeader className="space-y-1">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/')}
            className="w-fit mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <CardTitle className="text-3xl font-bold text-center">Create Account</CardTitle>
          <CardDescription className="text-center">
            Register as a Farmer or Veterinarian
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "farmer" | "veterinarian")} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="farmer" className="text-base">
                🌾 Farmer
              </TabsTrigger>
              <TabsTrigger value="veterinarian" className="text-base">
                🩺 Veterinarian
              </TabsTrigger>
            </TabsList>

            {/* FARMER FORM */}
            <TabsContent value="farmer">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Personal Information</h3>
                  
                  <div>
                    <Label htmlFor="farmer-name">Full Name <span className="text-red-600">*</span></Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="farmer-name"
                        placeholder="Enter your full name"
                        value={farmerData.name}
                        onChange={(e) => handleFarmerChange('name', e.target.value)}
                        className="pl-10"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="farmer-email">Email <span className="text-red-600">*</span></Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="farmer-email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={farmerData.email}
                        onChange={(e) => handleFarmerChange('email', e.target.value)}
                        className="pl-10"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="farmer-phone">Phone <span className="text-red-600">*</span></Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="farmer-phone"
                        placeholder="+250 788 123 456"
                        value={farmerData.phone}
                        onChange={(e) => handleFarmerChange('phone', e.target.value)}
                        className="pl-10"
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Location</h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>District <span className="text-red-600">*</span></Label>
                      <Select 
                        value={farmerData.district} 
                        onValueChange={(value) => handleFarmerChange('district', value)}
                        disabled={loading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select district" />
                        </SelectTrigger>
                        <SelectContent>
                          {districts.map(district => (
                            <SelectItem key={district} value={district}>{district}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Sector <span className="text-red-600">*</span></Label>
                      <Select 
                        value={farmerData.sector} 
                        onValueChange={(value) => handleFarmerChange('sector', value)}
                        disabled={!farmerData.district || loading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select sector" />
                        </SelectTrigger>
                        <SelectContent>
                          {farmerData.district && sectors[farmerData.district]?.map(sector => (
                            <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Security</h3>
                  
                  <div>
                    <Label htmlFor="farmer-password">Password <span className="text-red-600">*</span></Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="farmer-password"
                        type="password"
                        placeholder="At least 6 characters"
                        value={farmerData.password}
                        onChange={(e) => handleFarmerChange('password', e.target.value)}
                        className="pl-10"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="farmer-confirm">Confirm Password <span className="text-red-600">*</span></Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="farmer-confirm"
                        type="password"
                        placeholder="Re-enter password"
                        value={farmerData.confirmPassword}
                        onChange={(e) => handleFarmerChange('confirmPassword', e.target.value)}
                        className="pl-10"
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    'Create Farmer Account'
                  )}
                </Button>
              </form>
            </TabsContent>

            {/* VETERINARIAN FORM */}
            <TabsContent value="veterinarian">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Personal Information</h3>
                  
                  <div>
                    <Label htmlFor="vet-name">Full Name <span className="text-red-600">*</span></Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="vet-name"
                        placeholder="Dr. John Doe"
                        value={vetData.name}
                        onChange={(e) => handleVetChange('name', e.target.value)}
                        className="pl-10"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="vet-email">Email <span className="text-red-600">*</span></Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="vet-email"
                        type="email"
                        placeholder="dr.john@example.com"
                        value={vetData.email}
                        onChange={(e) => handleVetChange('email', e.target.value)}
                        className="pl-10"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="vet-phone">Phone <span className="text-red-600">*</span></Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="vet-phone"
                        placeholder="+250 788 123 456"
                        value={vetData.phone}
                        onChange={(e) => handleVetChange('phone', e.target.value)}
                        className="pl-10"
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Professional Details</h3>
                  
                  <div>
                    <Label>Specialty <span className="text-red-600">*</span></Label>
                    <Select 
                      value={vetData.specialty} 
                      onValueChange={(value) => handleVetChange('specialty', value)}
                      disabled={loading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select specialty" />
                      </SelectTrigger>
                      <SelectContent>
                        {specialties.map(specialty => (
                          <SelectItem key={specialty} value={specialty}>{specialty}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="license">License Number <span className="text-red-600">*</span></Label>
                    <div className="relative">
                      <Award className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="license"
                        placeholder="VET-RW-12345"
                        value={vetData.licenseNumber}
                        onChange={(e) => handleVetChange('licenseNumber', e.target.value)}
                        className="pl-10"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="location">Practice Location <span className="text-red-600">*</span></Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="location"
                        placeholder="Kigali, Rwanda"
                        value={vetData.location}
                        onChange={(e) => handleVetChange('location', e.target.value)}
                        className="pl-10"
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Security</h3>
                  
                  <div>
                    <Label htmlFor="vet-password">Password <span className="text-red-600">*</span></Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="vet-password"
                        type="password"
                        placeholder="At least 6 characters"
                        value={vetData.password}
                        onChange={(e) => handleVetChange('password', e.target.value)}
                        className="pl-10"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="vet-confirm">Confirm Password <span className="text-red-600">*</span></Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="vet-confirm"
                        type="password"
                        placeholder="Re-enter password"
                        value={vetData.confirmPassword}
                        onChange={(e) => handleVetChange('confirmPassword', e.target.value)}
                        className="pl-10"
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    'Create Veterinarian Account'
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-blue-600 hover:underline font-semibold">
              Login here
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}