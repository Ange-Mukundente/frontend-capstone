"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Send, Mail, MessageSquare, AlertTriangle, Users, Loader2, CheckCircle, XCircle } from "lucide-react"
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
import { useToast } from "@/hooks/use-toast"

interface Farmer {
  id: number | string
  name: string
  email: string
  phone: string
  district: string
  sector: string
  source?: 'database' | 'hardcoded'
}

interface AlertData {
  title: string
  message: string
  priority: "high" | "medium" | "low"
  type: "vaccination" | "disease" | "weather" | "general"
  sendVia: "both" | "sms" | "email"
  targetAudience: "all" | "district" | "sector" | "individual"
  targetDistrict: string
  targetSector: string
  targetFarmerId: string
}

interface SMSResult {
  farmer: string
  phone: string
  source: string
  status: string
  error?: string
}

export default function AdminSendAlerts() {
  const router = useRouter()
  const { toast } = useToast()
  const [farmers, setFarmers] = useState<Farmer[]>([])
  const [filteredFarmers, setFilteredFarmers] = useState<Farmer[]>([])
  const [selectedFarmers, setSelectedFarmers] = useState<number[]>([])
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [alertData, setAlertData] = useState<AlertData>({
    title: "",
    message: "",
    priority: "medium",
    type: "general",
    sendVia: "sms",
    targetAudience: "all",
    targetDistrict: "",
    targetSector: "",
    targetFarmerId: ""
  })

  // Hardcoded farmers (demo data)
  const hardcodedFarmers: Farmer[] = [
    { id: 1, name: "Mary Uwase", email: "mary.uwase@example.com", phone: "+250 786160692", district: "Nyagatare", sector: "Nyagatare Sector", source: "hardcoded" },
    { id: 2, name: "John Mugisha", email: "john.mugisha@example.com", phone: "+250 786160692", district: "Nyagatare", sector: "Rwimiyaga Sector", source: "hardcoded" },
    { id: 3, name: "Jean Kamanzi", email: "jean.kamanzi@example.com", phone: "+250 786160692", district: "Nyagatare", sector: "Karama Sector", source: "hardcoded" },
    { id: 4, name: "Alice Mukasine", email: "alice.mukasine@example.com", phone: "+250 786160692", district: "Gatsibo", sector: "Gatsibo Sector", source: "hardcoded" },
    { id: 5, name: "Peter Habimana", email: "peter.habimana@example.com", phone: "+250 786160692", district: "Gatsibo", sector: "Kabarore Sector", source: "hardcoded" },
  ]

  // Fetch farmers from API on component mount
  useEffect(() => {
    fetchFarmers()
  }, [])

  const fetchFarmers = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      
      if (!token) {
        // If no token, just use hardcoded farmers
        setFarmers(hardcodedFarmers)
        setFilteredFarmers(hardcodedFarmers)
        setLoading(false)
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
        
        // Merge database farmers with hardcoded farmers
        const dbFarmers: Farmer[] = (data.data || []).map((farmer: any) => ({
          id: farmer._id,
          name: farmer.name,
          email: farmer.email,
          phone: farmer.phone || farmer.phoneNumber,
          district: farmer.district || "Unknown",
          sector: farmer.sector || "Unknown",
          source: 'database' as const
        }))

        const allFarmers = [...hardcodedFarmers, ...dbFarmers]
        setFarmers(allFarmers)
        setFilteredFarmers(allFarmers)
        
        console.log(`📊 Loaded ${hardcodedFarmers.length} hardcoded + ${dbFarmers.length} database farmers`)
      } else {
        // Fallback to hardcoded farmers
        setFarmers(hardcodedFarmers)
        setFilteredFarmers(hardcodedFarmers)
      }
    } catch (error) {
      console.error("Error fetching farmers:", error)
      // Fallback to hardcoded farmers
      setFarmers(hardcodedFarmers)
      setFilteredFarmers(hardcodedFarmers)
    } finally {
      setLoading(false)
    }
  }

  // Filter farmers based on target audience
  useEffect(() => {
    let filtered = [...farmers]

    if (alertData.targetAudience === "district" && alertData.targetDistrict) {
      filtered = farmers.filter(f => f.district === alertData.targetDistrict)
    } else if (alertData.targetAudience === "sector" && alertData.targetSector) {
      filtered = farmers.filter(f => f.sector === alertData.targetSector)
    } else if (alertData.targetAudience === "individual" && alertData.targetFarmerId) {
      filtered = farmers.filter(f => f.id.toString() === alertData.targetFarmerId)
    }

    setFilteredFarmers(filtered)
    setSelectedFarmers(filtered.map(f => typeof f.id === 'string' ? parseInt(f.id) : f.id))
  }, [alertData.targetAudience, alertData.targetDistrict, alertData.targetSector, alertData.targetFarmerId, farmers])

  const handleInputChange = (name: string, value: string) => {
    setAlertData(prev => ({ ...prev, [name]: value }))
  }

  const getUniqueDistricts = () => {
    return [...new Set(farmers.map(f => f.district))]
  }

  const getUniqueSectors = () => {
    if (alertData.targetDistrict) {
      return [...new Set(farmers.filter(f => f.district === alertData.targetDistrict).map(f => f.sector))]
    }
    return [...new Set(farmers.map(f => f.sector))]
  }

  const handleSendAlert = async () => {
    if (!alertData.title || !alertData.message) {
      toast({
        title: "❌ Error",
        description: "Please fill in title and message",
        variant: "destructive"
      })
      return
    }

    if (selectedFarmers.length === 0) {
      toast({
        title: "❌ Error",
        description: "No farmers selected",
        variant: "destructive"
      })
      return
    }

    setSending(true)

    try {
      const token = localStorage.getItem("token")

      if (!token) {
        toast({
          title: "❌ Authentication Required",
          description: "Please login to send alerts",
          variant: "destructive"
        })
        setSending(false)
        return
      }

      // Send broadcast alert via API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/broadcast`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: `${alertData.title}\n\n${alertData.message}`,
          priority: alertData.priority
        })
      })

      const result = await response.json()

      if (result.success) {
        // Save to localStorage for history
        const sentAlert = {
          id: Date.now(),
          title: alertData.title,
          message: alertData.message,
          priority: alertData.priority,
          type: alertData.type,
          sendVia: alertData.sendVia,
          recipients: result.data.totalFarmers,
          successCount: result.data.successCount,
          failureCount: result.data.failureCount,
          date: new Date().toISOString().split('T')[0],
          status: "sent",
          category: alertData.type.charAt(0).toUpperCase() + alertData.type.slice(1),
          results: result.data.results
        }

        const existingAlerts = localStorage.getItem("sentAlerts")
        const alerts = existingAlerts ? JSON.parse(existingAlerts) : []
        alerts.push(sentAlert)
        localStorage.setItem("sentAlerts", JSON.stringify(alerts))

        // Show detailed success message
        toast({
          title: "✅ Alert Sent Successfully!",
          description: (
            <div className="mt-2 space-y-1">
              <p>Total: {result.data.totalFarmers} farmers</p>
              <p className="text-green-600">✅ Success: {result.data.successCount}</p>
              {result.data.failureCount > 0 && (
                <p className="text-red-600">❌ Failed: {result.data.failureCount}</p>
              )}
              <p className="text-xs text-gray-500 mt-2">
                {result.data.breakdown.database} from database, {result.data.breakdown.hardcoded} demo farmers
              </p>
            </div>
          )
        })

        // Reset form
        setAlertData({
          title: "",
          message: "",
          priority: "medium",
          type: "general",
          sendVia: "sms",
          targetAudience: "all",
          targetDistrict: "",
          targetSector: "",
          targetFarmerId: ""
        })

        // Show detailed results in console
        console.log("📊 SMS Broadcast Results:", result.data.results)

      } else {
        toast({
          title: "❌ Error Sending Alert",
          description: result.message || "Failed to send alert. Please try again.",
          variant: "destructive"
        })
      }

    } catch (error: any) {
      console.error("Error sending alert:", error)
      toast({
        title: "❌ Server Error",
        description: error.message || "Failed to connect to server. Please try again.",
        variant: "destructive"
      })
    } finally {
      setSending(false)
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch(priority) {
      case "high":
        return <Badge className="bg-red-500">High Priority</Badge>
      case "medium":
        return <Badge className="bg-yellow-500">Medium Priority</Badge>
      case "low":
        return <Badge className="bg-blue-500">Low Priority</Badge>
      default:
        return <Badge>Normal</Badge>
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading farmers...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="mb-4 hover:bg-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                <Send className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Send Alerts to Farmers</h1>
                <p className="text-gray-600">Send important notifications via SMS to all farmers</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* Alert Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Create Alert</CardTitle>
                <CardDescription>Compose your message to send via SMS</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">

                {/* Alert Type & Priority */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Alert Type</Label>
                    <Select value={alertData.type} onValueChange={(value) => handleInputChange('type', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vaccination">Vaccination</SelectItem>
                        <SelectItem value="disease">Disease Outbreak</SelectItem>
                        <SelectItem value="weather">Weather Warning</SelectItem>
                        <SelectItem value="general">General Information</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="priority">Priority Level</Label>
                    <Select value={alertData.priority} onValueChange={(value: any) => handleInputChange('priority', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High - Urgent</SelectItem>
                        <SelectItem value="medium">Medium - Important</SelectItem>
                        <SelectItem value="low">Low - Informational</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Alert Title */}
                <div>
                  <Label htmlFor="title">Alert Title <span className="text-red-600">*</span></Label>
                  <Input
                    id="title"
                    placeholder="e.g., FMD Vaccination Required"
                    value={alertData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="mt-1"
                  />
                </div>

                {/* Alert Message */}
                <div>
                  <Label htmlFor="message">Alert Message <span className="text-red-600">*</span></Label>
                  <Textarea
                    id="message"
                    placeholder="Write your alert message here..."
                    value={alertData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    rows={5}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {alertData.message.length} characters • SMS will be sent to all farmers
                  </p>
                </div>

                {/* Target Audience */}
                <div className="space-y-4">
                  <Label>Target Audience</Label>
                  <Select value={alertData.targetAudience} onValueChange={(value) => handleInputChange('targetAudience', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Farmers (Recommended)</SelectItem>
                      <SelectItem value="district">Specific District</SelectItem>
                      <SelectItem value="sector">Specific Sector</SelectItem>
                      <SelectItem value="individual">Individual Farmer</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* District Selection */}
                  {alertData.targetAudience === "district" && (
                    <Select value={alertData.targetDistrict} onValueChange={(value) => handleInputChange('targetDistrict', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select district..." />
                      </SelectTrigger>
                      <SelectContent>
                        {getUniqueDistricts().map(district => (
                          <SelectItem key={district} value={district}>{district}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  {/* Sector Selection */}
                  {alertData.targetAudience === "sector" && (
                    <>
                      <Select value={alertData.targetDistrict} onValueChange={(value) => handleInputChange('targetDistrict', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select district first..." />
                        </SelectTrigger>
                        <SelectContent>
                          {getUniqueDistricts().map(district => (
                            <SelectItem key={district} value={district}>{district}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {alertData.targetDistrict && (
                        <Select value={alertData.targetSector} onValueChange={(value) => handleInputChange('targetSector', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select sector..." />
                          </SelectTrigger>
                          <SelectContent>
                            {getUniqueSectors().map(sector => (
                              <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </>
                  )}

                  {/* Individual Farmer Selection */}
                  {alertData.targetAudience === "individual" && (
                    <Select value={alertData.targetFarmerId} onValueChange={(value) => handleInputChange('targetFarmerId', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select farmer..." />
                      </SelectTrigger>
                      <SelectContent>
                        {farmers.map(farmer => (
                          <SelectItem key={farmer.id} value={farmer.id.toString()}>
                            {farmer.name} - {farmer.phone}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                {/* Send Button */}
                <div className="pt-4 border-t">
                  <Button 
                    onClick={handleSendAlert}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    disabled={!alertData.title || !alertData.message || selectedFarmers.length === 0 || sending}
                  >
                    {sending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending SMS...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send SMS Alert to {filteredFarmers.length} Farmer{filteredFarmers.length !== 1 ? 's' : ''}
                      </>
                    )}
                  </Button>
                </div>

              </CardContent>
            </Card>
          </div>

          {/* Preview & Recipients */}
          <div className="space-y-6">
            
            {/* Alert Preview */}
            <Card className="border-purple-200 bg-purple-50">
              <CardHeader>
                <CardTitle className="text-lg">SMS Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {alertData.title ? (
                  <>
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-gray-900">{alertData.title}</h4>
                      {getPriorityBadge(alertData.priority)}
                    </div>
                    <p className="text-sm text-gray-700 bg-white p-3 rounded-lg whitespace-pre-wrap">
                      {`[VetConnect Alert]\n\n${alertData.message || "Your message will appear here..."}\n\n- VetConnect Rwanda`}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Badge variant="outline" className="gap-1">
                        <MessageSquare className="w-3 h-3" /> SMS
                      </Badge>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">
                    Fill in the form to preview your alert
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Recipients List */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Recipients ({filteredFarmers.length})
                </CardTitle>
                {/* <CardDescription>
                  {farmers.filter(f => f.source === 'database').length} from database + {farmers.filter(f => f.source === 'hardcoded').length} demo
                </CardDescription> */}
              </CardHeader>
              <CardContent>
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {filteredFarmers.map(farmer => (
                    <div key={farmer.id} className="p-2 bg-gray-50 rounded-lg text-sm flex items-start justify-between">
                      <div>
                        <p className="font-medium">{farmer.name}</p>
                        <p className="text-xs text-gray-600">{farmer.sector}, {farmer.district}</p>
                        <p className="text-xs text-gray-500">{farmer.phone}</p>
                      </div>
                      {/* {farmer.source && (
                        <Badge variant="outline" className="text-[10px]">
                          {farmer.source === 'database' ? '🔄 DB' : '📝 Demo'}
                        </Badge>
                      )} */}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Info */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold mb-1">Important Notes:</p>
                    <ul className="space-y-1 text-xs">
                      <li>• SMS will be sent via Africa's Talking</li>
                      <li>• Messages are sent immediately</li>
                      <li>• All farmers (DB + hardcoded) will receive alerts</li>
                      <li>• Check console for detailed sending status</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>

      </div>
    </div>
  )
}