"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Heart, ArrowLeft, Search, Filter, Calendar, AlertTriangle, CheckCircle, XCircle, User, Phone, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Alert {
  id: string
  farmerId: string
  farmerName: string
  email: string
  phone: string
  type: string
  message: string
  priority: "high" | "medium" | "low"
  status: "active" | "resolved" | "dismissed"
  createdAt: string
  resolvedAt?: string
}

export default function AlertsHistoryPage() {
  const router = useRouter()
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [filteredAlerts, setFilteredAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")

  useEffect(() => {
    // Simulated data - replace with actual API call
    const mockAlerts: Alert[] = [
      {
        id: "1",
        farmerId: "farmer1",
        farmerName: "Jean Mukasa",
        email: "jean@example.com",
        phone: "+250788123456",
        type: "vaccination",
        message: "Vaccination due for Cow #1 and Cow #2",
        priority: "high",
        status: "active",
        createdAt: "2025-10-29T10:00:00Z"
      },
      {
        id: "2",
        farmerId: "farmer2",
        farmerName: "Marie Uwase",
        email: "marie@example.com",
        phone: "+250788234567",
        type: "disease",
        message: "Foot and Mouth Disease alert in district",
        priority: "high",
        status: "resolved",
        createdAt: "2025-10-28T14:30:00Z",
        resolvedAt: "2025-10-29T09:00:00Z"
      },
      {
        id: "3",
        farmerId: "farmer1",
        farmerName: "Jean Mukasa",
        email: "jean@example.com",
        phone: "+250788123456",
        type: "checkup",
        message: "Annual checkup recommended for Goat #3",
        priority: "low",
        status: "dismissed",
        createdAt: "2025-10-27T08:15:00Z"
      }
    ]

    setAlerts(mockAlerts)
    setFilteredAlerts(mockAlerts)
    setLoading(false)
  }, [])

  useEffect(() => {
    let filtered = alerts

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        alert =>
          alert.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
          alert.type.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(alert => alert.status === statusFilter)
    }

    // Filter by priority
    if (priorityFilter !== "all") {
      filtered = filtered.filter(alert => alert.priority === priorityFilter)
    }

    setFilteredAlerts(filtered)
  }, [searchTerm, statusFilter, priorityFilter, alerts])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-red-100 text-red-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      case "dismissed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-red-500 bg-red-50"
      case "medium":
        return "border-orange-500 bg-orange-50"
      case "low":
        return "border-blue-500 bg-blue-50"
      default:
        return "border-gray-500 bg-gray-50"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      case "resolved":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "dismissed":
        return <XCircle className="h-5 w-5 text-gray-500" />
      default:
        return <AlertTriangle className="h-5 w-5" />
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading alerts...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      {/* <header className="bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => router.back()}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-600">
                  <Heart className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold">VetConnect Rwanda</span>
              </Link>
            </div>
          </div>
        </div>
      </header> */}

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Alerts History</h1>
          <p className="text-gray-600">View and manage all system alerts</p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search alerts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="dismissed">Dismissed</SelectItem>
                </SelectContent>
              </Select>

              {/* Priority Filter */}
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{alerts.filter(a => a.status === "active").length}</div>
                <p className="text-sm text-gray-600 mt-1">Active Alerts</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{alerts.filter(a => a.status === "resolved").length}</div>
                <p className="text-sm text-gray-600 mt-1">Resolved</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{alerts.filter(a => a.priority === "high").length}</div>
                <p className="text-sm text-gray-600 mt-1">High Priority</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{alerts.length}</div>
                <p className="text-sm text-gray-600 mt-1">Total Alerts</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts List */}
        <Card>
          <CardHeader>
            <CardTitle>All Alerts ({filteredAlerts.length})</CardTitle>
            <CardDescription>Complete history of system alerts</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredAlerts.length === 0 ? (
              <div className="text-center py-12">
                <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No alerts found matching your filters</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-lg border-l-4 ${getPriorityColor(alert.priority)}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(alert.status)}
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">
                              {alert.type}
                            </Badge>
                            <Badge className={getStatusColor(alert.status)}>
                              {alert.status}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {alert.priority} priority
                            </Badge>
                          </div>
                          <p className="font-medium text-gray-900">{alert.message}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mt-3 pt-3 border-t">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">{alert.farmerName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span>{alert.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span>{alert.phone}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span>Created: {formatDate(alert.createdAt)}</span>
                        </div>
                        {alert.resolvedAt && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>Resolved: {formatDate(alert.resolvedAt)}</span>
                          </div>
                        )}
                        <div className="flex gap-2 mt-2">
                          {alert.status === "active" && (
                            <>
                              <Button size="sm" variant="outline" className="text-green-600">
                                Mark Resolved
                              </Button>
                              <Button size="sm" variant="outline" className="text-gray-600">
                                Dismiss
                              </Button>
                            </>
                          )}
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}