"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Send, Mail, MessageSquare, AlertTriangle, Users } from "lucide-react"
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
  id: number
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
  sendVia: "both" | "sms" | "email"
  targetAudience: "all" | "district" | "sector" | "individual"
  targetDistrict: string
  targetSector: string
  targetFarmerId: string
}

export default function AdminSendAlerts() {
  const router = useRouter()
  const { toast } = useToast()
  const [farmers, setFarmers] = useState<Farmer[]>([])
  const [filteredFarmers, setFilteredFarmers] = useState<Farmer[]>([])
  const [selectedFarmers, setSelectedFarmers] = useState<number[]>([])
  const [alertData, setAlertData] = useState<AlertData>({
    title: "",
    message: "",
    priority: "medium",
    type: "general",
    sendVia: "both",
    targetAudience: "all",
    targetDistrict: "",
    targetSector: "",
    targetFarmerId: ""
  })

  // Sample farmers data
  useEffect(() => {
    const sampleFarmers: Farmer[] = [
      { id: 1, name: "Mary Uwase", email: "mary.uwase@example.com", phone: "+250 788 123 456", district: "Nyagatare", sector: "Nyagatare Sector" },
      { id: 2, name: "John Mugisha", email: "john.mugisha@example.com", phone: "+250 788 234 567", district: "Nyagatare", sector: "Rwimiyaga Sector" },
      { id: 3, name: "Jean Kamanzi", email: "jean.kamanzi@example.com", phone: "+250 788 345 678", district: "Nyagatare", sector: "Karama Sector" },
      { id: 4, name: "Alice Mukasine", email: "alice.mukasine@example.com", phone: "+250 788 456 789", district: "Gatsibo", sector: "Gatsibo Sector" },
      { id: 5, name: "Peter Habimana", email: "peter.habimana@example.com", phone: "+250 788 567 890", district: "Gatsibo", sector: "Kabarore Sector" },
      { id: 6, name: "Grace Uwera", email: "grace.uwera@example.com", phone: "+250 788 678 901", district: "Gatsibo", sector: "Kiramuruzi Sector" },
      { id: 7, name: "Emmanuel Nkusi", email: "emmanuel.nkusi@example.com", phone: "+250 788 789 012", district: "Nyagatare", sector: "Mimuri Sector" },
      { id: 8, name: "Sarah Ingabire", email: "sarah.ingabire@example.com", phone: "+250 788 890 123", district: "Gatsibo", sector: "Rugarama Sector" },
    ]
    setFarmers(sampleFarmers)
    setFilteredFarmers(sampleFarmers)
  }, [])

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
    setSelectedFarmers(filtered.map(f => f.id))
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

  const handleSendAlert = () => {
    if (!alertData.title || !alertData.message) {
      window.alert("Please fill in title and message")
      return
    }

    if (selectedFarmers.length === 0) {
      window.alert("No farmers selected")
      return
    }

    // Create alert for history
    const sentAlert = {
      id: Date.now(),
      title: alertData.title,
      message: alertData.message,
      priority: alertData.priority,
      type: alertData.type,
      sendVia: alertData.sendVia,
      recipients: selectedFarmers.length,
      date: new Date().toISOString().split('T')[0],
      status: "sent",
      category: alertData.type.charAt(0).toUpperCase() + alertData.type.slice(1)
    }

    // Save to localStorage (alerts history)
    try {
      const existingAlerts = localStorage.getItem("sentAlerts")
      const alerts = existingAlerts ? JSON.parse(existingAlerts) : []
      alerts.push(sentAlert)
      localStorage.setItem("sentAlerts", JSON.stringify(alerts))

      // Also save to farmers' health alerts
      selectedFarmers.forEach(farmerId => {
        const farmer = farmers.find(f => f.id === farmerId)
        if (farmer) {
          const farmerAlert = {
            id: Date.now() + farmerId,
            type: alertData.type,
            message: alertData.message,
            date: new Date().toISOString().split('T')[0],
            priority: alertData.priority,
            title: alertData.title,
            sentVia: alertData.sendVia
          }
          
          // Store in healthAlerts for each farmer
          const farmerAlertsKey = `healthAlerts_${farmer.name}`
          const existingFarmerAlerts = localStorage.getItem(farmerAlertsKey)
          const farmerAlerts = existingFarmerAlerts ? JSON.parse(existingFarmerAlerts) : []
          farmerAlerts.push(farmerAlert)
          localStorage.setItem(farmerAlertsKey, JSON.stringify(farmerAlerts))
        }
      })

      toast({
        title: "✅ Alert Sent Successfully!",
        description: `Sent to ${selectedFarmers.length} farmer${selectedFarmers.length > 1 ? 's' : ''} via ${alertData.sendVia === 'both' ? 'SMS & Email' : alertData.sendVia.toUpperCase()}`
      })

      // Reset form
      setAlertData({
        title: "",
        message: "",
        priority: "medium",
        type: "general",
        sendVia: "both",
        targetAudience: "all",
        targetDistrict: "",
        targetSector: "",
        targetFarmerId: ""
      })

    } catch (error) {
      console.error("Error sending alert:", error)
      window.alert("Error sending alert. Please try again.")
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
                <p className="text-gray-600">Send important notifications via SMS and Email</p>
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
                <CardDescription>Compose your message and select delivery method</CardDescription>
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
                    {alertData.message.length} characters
                  </p>
                </div>

                {/* Delivery Method */}
                <div>
                  <Label>Delivery Method</Label>
                  <div className="grid grid-cols-3 gap-3 mt-2">
                    <button
                      type="button"
                      onClick={() => handleInputChange('sendVia', 'both')}
                      className={`p-3 border rounded-lg transition-all ${
                        alertData.sendVia === 'both'
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-gray-300 hover:border-purple-300'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Send className="w-5 h-5" />
                        <span className="text-sm font-medium">Both</span>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInputChange('sendVia', 'sms')}
                      className={`p-3 border rounded-lg transition-all ${
                        alertData.sendVia === 'sms'
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-gray-300 hover:border-purple-300'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <MessageSquare className="w-5 h-5" />
                        <span className="text-sm font-medium">SMS Only</span>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInputChange('sendVia', 'email')}
                      className={`p-3 border rounded-lg transition-all ${
                        alertData.sendVia === 'email'
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-gray-300 hover:border-purple-300'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Mail className="w-5 h-5" />
                        <span className="text-sm font-medium">Email Only</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Target Audience */}
                <div className="space-y-4">
                  <Label>Target Audience</Label>
                  <Select value={alertData.targetAudience} onValueChange={(value) => handleInputChange('targetAudience', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Farmers</SelectItem>
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
                    disabled={!alertData.title || !alertData.message || selectedFarmers.length === 0}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Alert to {selectedFarmers.length} Farmer{selectedFarmers.length !== 1 ? 's' : ''}
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
                <CardTitle className="text-lg">Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {alertData.title ? (
                  <>
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-gray-900">{alertData.title}</h4>
                      {getPriorityBadge(alertData.priority)}
                    </div>
                    <p className="text-sm text-gray-700 bg-white p-3 rounded-lg">
                      {alertData.message || "Your message will appear here..."}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      {alertData.sendVia === 'both' || alertData.sendVia === 'sms' ? (
                        <Badge variant="outline" className="gap-1">
                          <MessageSquare className="w-3 h-3" /> SMS
                        </Badge>
                      ) : null}
                      {alertData.sendVia === 'both' || alertData.sendVia === 'email' ? (
                        <Badge variant="outline" className="gap-1">
                          <Mail className="w-3 h-3" /> Email
                        </Badge>
                      ) : null}
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
                  Recipients ({selectedFarmers.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {filteredFarmers.map(farmer => (
                    <div key={farmer.id} className="p-2 bg-gray-50 rounded-lg text-sm">
                      <p className="font-medium">{farmer.name}</p>
                      <p className="text-xs text-gray-600">{farmer.sector}, {farmer.district}</p>
                      <p className="text-xs text-gray-500">{farmer.phone}</p>
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
                      <li>• SMS messages will be sent immediately</li>
                      <li>• Email delivery may take a few minutes</li>
                      <li>• High priority alerts are highlighted</li>
                      <li>• Farmers will receive notifications on their dashboard</li>
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