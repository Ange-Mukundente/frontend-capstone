"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Send, AlertTriangle, Users, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Farmer {
  _id: string
  name: string
  email: string
  phone: string
  district: string
  sector: string
}

interface AlertData {
  title: string
  message: string
  priority: "high" | "medium" | "low"
  type: "vaccination" | "disease" | "weather" | "general"
  targetType: "all" | "individual" | "district" | "sector"
  selectedFarmerId: string
  selectedDistrict: string
  selectedSector: string
}

export default function AdminSendAlerts() {
  const router = useRouter()
  const [farmers, setFarmers] = useState<Farmer[]>([])
  const [filteredFarmers, setFilteredFarmers] = useState<Farmer[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [alertData, setAlertData] = useState<AlertData>({
    title: "",
    message: "",
    priority: "medium",
    type: "general",
    targetType: "all",
    selectedFarmerId: "",
    selectedDistrict: "",
    selectedSector: "",
  })

  useEffect(() => {
    fetchFarmers()
  }, [])

  useEffect(() => {
    filterFarmers()
  }, [alertData.targetType, alertData.selectedDistrict, alertData.selectedSector, alertData.selectedFarmerId, farmers])

  const fetchFarmers = async () => {
    try {
      const token = localStorage.getItem("token")
      
      if (!token) {
        alert("Please login first")
        router.push("/auth/signin")
        return
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/farmers`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })

      if (response.ok) {
        const data = await response.json()
        
        const dbFarmers = data.data.map((farmer: any) => ({
          _id: farmer._id,
          name: farmer.name,
          email: farmer.email,
          phone: farmer.phone || "No phone",
          district: farmer.district || "Unknown",
          sector: farmer.sector || "Unknown",
        }))

        setFarmers(dbFarmers)
        setFilteredFarmers(dbFarmers)
        console.log(` Loaded ${dbFarmers.length} farmers`)
      }
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterFarmers = () => {
    let filtered = [...farmers]

    if (alertData.targetType === "individual") {
      if (alertData.selectedFarmerId) {
        filtered = farmers.filter(f => f._id === alertData.selectedFarmerId)
      } else {
        filtered = []
      }
    } else if (alertData.targetType === "district") {
      if (alertData.selectedDistrict) {
        filtered = farmers.filter(f => f.district === alertData.selectedDistrict)
      } else {
        filtered = []
      }
    } else if (alertData.targetType === "sector") {
      if (alertData.selectedSector) {
        filtered = farmers.filter(f => f.sector === alertData.selectedSector)
      } else {
        filtered = []
      }
    }

    setFilteredFarmers(filtered)
  }

  const getUniqueDistricts = () => {
    return [...new Set(farmers.map(f => f.district))].filter(d => d !== "Unknown")
  }

  const getUniqueSectors = () => {
    if (alertData.selectedDistrict) {
      return [...new Set(farmers.filter(f => f.district === alertData.selectedDistrict).map(f => f.sector))]
    }
    return [...new Set(farmers.map(f => f.sector))].filter(s => s !== "Unknown")
  }

  const handleInputChange = (name: string, value: string) => {
    setAlertData(prev => {
      const updated = { ...prev, [name]: value }
      
      if (name === "targetType") {
        updated.selectedFarmerId = ""
        updated.selectedDistrict = ""
        updated.selectedSector = ""
      }
      
      if (name === "selectedDistrict") {
        updated.selectedSector = ""
      }
      
      return updated
    })
  }

  const handleSendAlert = async () => {
    if (!alertData.title || !alertData.message) {
      alert("Please fill in title and message")
      return
    }

    if (filteredFarmers.length === 0) {
      alert("No farmers selected")
      return
    }

    setSending(true)

    try {
      const token = localStorage.getItem("token")

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/broadcast`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: `${alertData.title}\n\n${alertData.message}`,
          priority: alertData.priority,
          targetType: alertData.targetType,
          selectedFarmerId: alertData.selectedFarmerId,
          selectedDistrict: alertData.selectedDistrict,
          selectedSector: alertData.selectedSector,
        })
      })

      const result = await response.json()

      if (result.success) {
        alert(` Success!\n\nSent to: ${result.data.successCount}/${result.data.totalFarmers} farmers`)

        setAlertData({
          title: "",
          message: "",
          priority: "medium",
          type: "general",
          targetType: "all",
          selectedFarmerId: "",
          selectedDistrict: "",
          selectedSector: "",
        })
      } else {
        alert(` Error: ${result.message}`)
      }
    } catch (error: any) {
      alert(` Error: ${error.message}`)
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-purple-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h1 className="text-3xl font-bold mb-2">Send Alerts to Farmers</h1>
          <p className="text-gray-600">Send SMS notifications to selected farmers</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Create Alert</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">

                {/* Type & Priority */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Alert Type</Label>
                    <Select value={alertData.type} onValueChange={(value) => handleInputChange('type', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="vaccination">Vaccination</SelectItem>
                        <SelectItem value="disease">Disease</SelectItem>
                        <SelectItem value="weather">Weather</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Priority</Label>
                    <Select value={alertData.priority} onValueChange={(value: any) => handleInputChange('priority', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <Label>Title *</Label>
                  <Input
                    placeholder="Alert title"
                    value={alertData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                  />
                </div>

                {/* Message */}
                <div>
                  <Label>Message *</Label>
                  <Textarea
                    placeholder="Your message..."
                    value={alertData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    rows={5}
                  />
                  <p className="text-xs text-gray-500 mt-1">{alertData.message.length} characters</p>
                </div>

                {/* Target */}
                <div className="space-y-4">
                  <Label>Send To *</Label>
                  <Select value={alertData.targetType} onValueChange={(value) => handleInputChange('targetType', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all"> All Farmers ({farmers.length})</SelectItem>
                      <SelectItem value="district"> By District</SelectItem>
                      <SelectItem value="sector"> By Sector</SelectItem>
                      <SelectItem value="individual"> Individual</SelectItem>
                    </SelectContent>
                  </Select>

                  {alertData.targetType === "district" && (
                    <Select value={alertData.selectedDistrict} onValueChange={(value) => handleInputChange('selectedDistrict', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select district..." />
                      </SelectTrigger>
                      <SelectContent>
                        {getUniqueDistricts().map(district => (
                          <SelectItem key={district} value={district}>
                            {district} ({farmers.filter(f => f.district === district).length})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  {alertData.targetType === "sector" && (
                    <Select value={alertData.selectedSector} onValueChange={(value) => handleInputChange('selectedSector', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select sector..." />
                      </SelectTrigger>
                      <SelectContent>
                        {getUniqueSectors().map(sector => (
                          <SelectItem key={sector} value={sector}>
                            {sector} ({farmers.filter(f => f.sector === sector).length})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  {alertData.targetType === "individual" && (
                    <Select value={alertData.selectedFarmerId} onValueChange={(value) => handleInputChange('selectedFarmerId', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select farmer..." />
                      </SelectTrigger>
                      <SelectContent>
                        {farmers.map(farmer => (
                          <SelectItem key={farmer._id} value={farmer._id}>
                            {farmer.name} - {farmer.phone}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                {/* Send Button */}
                <Button 
                  onClick={handleSendAlert}
                  className="w-full"
                  disabled={!alertData.title || !alertData.message || filteredFarmers.length === 0 || sending}
                >
                  {sending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send to {filteredFarmers.length} Farmer{filteredFarmers.length !== 1 ? 's' : ''}
                    </>
                  )}
                </Button>

              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Preview */}
            <Card className="bg-purple-50">
              <CardHeader>
                <CardTitle className="text-lg">Preview</CardTitle>
              </CardHeader>
              <CardContent>
                {alertData.title ? (
                  <p className="text-sm bg-white p-3 rounded whitespace-pre-wrap">
                    {`[VetConnect Alert]\n\n${alertData.message || "..."}\n\n- VetConnect Rwanda`}
                  </p>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">Fill form</p>
                )}
              </CardContent>
            </Card>

            {/* Recipients */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Recipients ({filteredFarmers.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {filteredFarmers.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">No farmers selected</p>
                ) : (
                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {filteredFarmers.slice(0, 5).map(farmer => (
                      <div key={farmer._id} className="p-2 bg-gray-50 rounded text-sm">
                        <p className="font-medium">{farmer.name}</p>
                        <p className="text-xs text-gray-600">{farmer.phone}</p>
                      </div>
                    ))}
                    {filteredFarmers.length > 5 && (
                      <p className="text-xs text-gray-500 text-center pt-2">
                        ... and {filteredFarmers.length - 5} more
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  )
}