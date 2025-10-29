"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Search, Send, AlertTriangle, Users, Calendar, Filter, Eye, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Alert {
  id: number
  title: string
  message: string
  priority: "high" | "medium" | "low"
  recipients: number
  date: string
  status: "sent" | "scheduled" | "failed"
  category: string
}

export default function AlertsHistory() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterPriority, setFilterPriority] = useState("all")
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  // Load alerts from localStorage
  const [alerts, setAlerts] = useState<Alert[]>([])

  useEffect(() => {
    const sentAlerts = localStorage.getItem("sentAlerts")
    if (sentAlerts && sentAlerts !== "undefined") {
      setAlerts(JSON.parse(sentAlerts))
    } else {
      // Demo data
      setAlerts([
        {
          id: 1,
          title: "FMD Vaccination Required",
          message: "Foot and Mouth Disease vaccination campaign starts next week. Please ensure all cattle are vaccinated.",
          priority: "high",
          recipients: 8,
          date: "2025-10-25",
          status: "sent",
          category: "Health"
        },
        {
          id: 2,
          title: "Weather Warning - Heavy Rains",
          message: "Heavy rains expected this weekend. Ensure livestock shelter is secure and drainage is adequate.",
          priority: "medium",
          recipients: 8,
          date: "2025-10-24",
          status: "sent",
          category: "Weather"
        },
        {
          id: 3,
          title: "Disease Outbreak Alert - Kigali",
          message: "Cases of Lumpy Skin Disease reported in Kigali district. Monitor your cattle closely and report any symptoms.",
          priority: "high",
          recipients: 5,
          date: "2025-10-23",
          status: "sent",
          category: "Emergency"
        },
        {
          id: 4,
          title: "Training Workshop Reminder",
          message: "Reminder: Livestock management workshop scheduled for next Tuesday at Nyagatare district office.",
          priority: "low",
          recipients: 8,
          date: "2025-10-22",
          status: "sent",
          category: "Training"
        },
        {
          id: 5,
          title: "Feed Supplement Availability",
          message: "Nutritional supplements now available at veterinary centers. Contact your nearest vet for details.",
          priority: "medium",
          recipients: 8,
          date: "2025-10-20",
          status: "sent",
          category: "Information"
        },
      ])
    }
  }, [])

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = 
      alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.category.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesPriority = filterPriority === "all" || alert.priority === filterPriority

    return matchesSearch && matchesPriority
  })

  const handleViewDetails = (alert: Alert) => {
    setSelectedAlert(alert)
    setShowDetails(true)
  }

  const handleDelete = (alertId: number) => {
    if (confirm("Are you sure you want to delete this alert?")) {
      const updatedAlerts = alerts.filter(a => a.id !== alertId)
      setAlerts(updatedAlerts)
      localStorage.setItem("sentAlerts", JSON.stringify(updatedAlerts))
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-orange-600 flex items-center justify-center">
                  <Send className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Alerts History</h1>
                  <p className="text-gray-600">View all sent alerts and notifications</p>
                </div>
              </div>
              <Button 
                onClick={() => router.push('/dashboard/admin/send-alerts')}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Send className="w-4 h-4 mr-2" />
                Send New Alert
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-4 gap-4 mb-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-6">
              <p className="text-sm text-gray-600 mb-1">Total Alerts</p>
              <p className="text-3xl font-bold text-purple-600">{alerts.length}</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-red-100">
            <CardContent className="p-6">
              <p className="text-sm text-gray-600 mb-1">High Priority</p>
              <p className="text-3xl font-bold text-red-600">{alerts.filter(a => a.priority === "high").length}</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-6">
              <p className="text-sm text-gray-600 mb-1">Successfully Sent</p>
              <p className="text-3xl font-bold text-green-600">{alerts.filter(a => a.status === "sent").length}</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6">
              <p className="text-sm text-gray-600 mb-1">Total Recipients</p>
              <p className="text-3xl font-bold text-blue-600">{alerts.reduce((sum, a) => sum + a.recipients, 0)}</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6 shadow-lg border-0">
          <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-white">
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              Filter & Search
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search alerts by title, message, or category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterPriority === "all" ? "default" : "outline"}
                  onClick={() => setFilterPriority("all")}
                  className="flex-1"
                >
                  All
                </Button>
                <Button
                  variant={filterPriority === "high" ? "default" : "outline"}
                  onClick={() => setFilterPriority("high")}
                  className="flex-1"
                >
                  High
                </Button>
                <Button
                  variant={filterPriority === "medium" ? "default" : "outline"}
                  onClick={() => setFilterPriority("medium")}
                  className="flex-1"
                >
                  Medium
                </Button>
                <Button
                  variant={filterPriority === "low" ? "default" : "outline"}
                  onClick={() => setFilterPriority("low")}
                  className="flex-1"
                >
                  Low
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alerts List */}
        <Card className="shadow-lg border-0">
          <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-white">
            <CardTitle>Alerts History</CardTitle>
            <CardDescription>
              Showing {filteredAlerts.length} of {alerts.length} alerts
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {filteredAlerts.length === 0 ? (
                <div className="text-center py-12">
                  <Send className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-4">No alerts found</p>
                  <Button 
                    onClick={() => router.push('/dashboard/admin/send-alerts')}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    Send Your First Alert
                  </Button>
                </div>
              ) : (
                filteredAlerts.map((alert) => (
                  <div 
                    key={alert.id} 
                    className="p-5 rounded-xl border bg-gradient-to-r from-gray-50 to-white hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          alert.priority === "high" ? "bg-red-100" : 
                          alert.priority === "medium" ? "bg-yellow-100" : "bg-blue-100"
                        }`}>
                          <AlertTriangle className={`w-6 h-6 ${
                            alert.priority === "high" ? "text-red-600" : 
                            alert.priority === "medium" ? "text-yellow-600" : "text-blue-600"
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-gray-900">{alert.title}</h3>
                            <Badge className={
                              alert.priority === "high" ? "bg-red-100 text-red-700" : 
                              alert.priority === "medium" ? "bg-yellow-100 text-yellow-700" : 
                              "bg-blue-100 text-blue-700"
                            }>
                              {alert.priority}
                            </Badge>
                            <Badge className="bg-purple-100 text-purple-700">
                              {alert.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{alert.message}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              <span>{alert.recipients} recipients</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(alert.date)}</span>
                            </div>
                            <Badge className={
                              alert.status === "sent" ? "bg-green-100 text-green-700" : 
                              alert.status === "scheduled" ? "bg-blue-100 text-blue-700" : 
                              "bg-red-100 text-red-700"
                            }>
                              {alert.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleViewDetails(alert)}
                          className="hover:bg-purple-50"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(alert.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Details Modal */}
        <Dialog open={showDetails} onOpenChange={setShowDetails}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Alert Details</DialogTitle>
            </DialogHeader>
            {selectedAlert && (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Alert Title</p>
                  <h3 className="text-xl font-bold text-gray-900">{selectedAlert.title}</h3>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Message</p>
                  <p className="text-gray-900">{selectedAlert.message}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">Priority</p>
                    <Badge className={
                      selectedAlert.priority === "high" ? "bg-red-100 text-red-700" : 
                      selectedAlert.priority === "medium" ? "bg-yellow-100 text-yellow-700" : 
                      "bg-blue-100 text-blue-700"
                    }>
                      {selectedAlert.priority}
                    </Badge>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">Category</p>
                    <Badge className="bg-purple-100 text-purple-700">
                      {selectedAlert.category}
                    </Badge>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">Recipients</p>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-600" />
                      <span className="font-semibold">{selectedAlert.recipients} farmers</span>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">Date Sent</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-600" />
                      <span className="font-semibold">{formatDate(selectedAlert.date)}</span>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg md:col-span-2">
                    <p className="text-sm text-gray-600 mb-2">Status</p>
                    <Badge className={
                      selectedAlert.status === "sent" ? "bg-green-100 text-green-700" : 
                      selectedAlert.status === "scheduled" ? "bg-blue-100 text-blue-700" : 
                      "bg-red-100 text-red-700"
                    }>
                      {selectedAlert.status}
                    </Badge>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}