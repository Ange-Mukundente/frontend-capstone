"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Heart, ArrowLeft, Search, Filter, Calendar, AlertTriangle, CheckCircle, XCircle, User, Phone, Mail, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

interface Recipient {
  userId: string
  name?: string
  email?: string
  phone?: string
}

interface Alert {
  _id: string
  message: string
  recipients: Recipient[]
  sentBy: {
    _id: string
    name: string
    email: string
  }
  alertType: string
  status: string
  successCount: number
  failureCount: number
  failedRecipients?: Array<{
    userId: string
    phone: string
    error: string
  }>
  createdAt: string
  updatedAt: string
}

export default function AlertsHistoryPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [filteredAlerts, setFilteredAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")

  useEffect(() => {
    fetchAlerts()
  }, [])

  const fetchAlerts = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      
      if (!token) {
        toast({
          title: "Authentication required",
          description: "Please log in to view alerts",
          variant: "destructive"
        })
        router.push('/login')
        return
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/alerts`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch alerts')
      }

      const data = await response.json()
      
      if (data.success) {
        setAlerts(data.data)
        setFilteredAlerts(data.data)
      }
    } catch (error: any) {
      console.error('Fetch alerts error:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to fetch alerts",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let filtered = alerts

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        alert =>
          alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
          alert.alertType.toLowerCase().includes(searchTerm.toLowerCase()) ||
          alert.sentBy?.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by type
    if (typeFilter !== "all") {
      filtered = filtered.filter(alert => alert.alertType === typeFilter)
    }

    setFilteredAlerts(filtered)
  }, [searchTerm, typeFilter, alerts])

  const getTypeColor = (type: string) => {
    switch (type) {
      case "broadcast":
        return "bg-blue-100 text-blue-800"
      case "individual":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (successCount: number, failureCount: number) => {
    if (failureCount === 0) {
      return "border-green-500 bg-green-50"
    } else if (successCount > 0) {
      return "border-orange-500 bg-orange-50"
    } else {
      return "border-red-500 bg-red-50"
    }
  }

  const getStatusIcon = (successCount: number, failureCount: number) => {
    if (failureCount === 0) {
      return <CheckCircle className="h-5 w-5 text-green-500" />
    } else if (successCount > 0) {
      return <AlertTriangle className="h-5 w-5 text-orange-500" />
    } else {
      return <XCircle className="h-5 w-5 text-red-500" />
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

  const totalSent = alerts.reduce((sum, alert) => sum + alert.successCount, 0)
  const totalFailed = alerts.reduce((sum, alert) => sum + alert.failureCount, 0)
  const broadcastAlerts = alerts.filter(a => a.alertType === "broadcast").length
  const individualAlerts = alerts.filter(a => a.alertType === "individual").length

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
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Alerts History</h1>
          <p className="text-gray-600">View and manage all sent alerts</p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-4">
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

              {/* Type Filter */}
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="broadcast">Broadcast</SelectItem>
                  <SelectItem value="individual">Individual</SelectItem>
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
                <div className="text-2xl font-bold text-purple-600">{alerts.length}</div>
                <p className="text-sm text-gray-600 mt-1">Total Alerts</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{totalSent}</div>
                <p className="text-sm text-gray-600 mt-1">Successfully Sent</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{broadcastAlerts}</div>
                <p className="text-sm text-gray-600 mt-1">Broadcasts</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{totalFailed}</div>
                <p className="text-sm text-gray-600 mt-1">Failed</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts List */}
        <Card>
          <CardHeader>
            <CardTitle>All Alerts ({filteredAlerts.length})</CardTitle>
            <CardDescription>Complete history of sent alerts</CardDescription>
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
                    key={alert._id}
                    className={`p-4 rounded-lg border-l-4 ${getStatusColor(alert.successCount, alert.failureCount)}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(alert.successCount, alert.failureCount)}
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getTypeColor(alert.alertType)}>
                              {alert.alertType}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {alert.recipients.length} recipients
                            </Badge>
                          </div>
                          <p className="font-medium text-gray-900 mb-1">{alert.message}</p>
                          <p className="text-sm text-gray-600">
                            Sent by: {alert.sentBy?.name || 'Unknown'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mt-3 pt-3 border-t">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="font-medium text-green-600">
                            {alert.successCount} Successful
                          </span>
                        </div>
                        {alert.failureCount > 0 && (
                          <div className="flex items-center gap-2 text-sm">
                            <XCircle className="h-4 w-4 text-red-500" />
                            <span className="font-medium text-red-600">
                              {alert.failureCount} Failed
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <User className="h-4 w-4 text-gray-400" />
                          <span>Status: {alert.status}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span>Sent: {formatDate(alert.createdAt)}</span>
                        </div>
                        {alert.failedRecipients && alert.failedRecipients.length > 0 && (
                          <div className="mt-2">
                            <details className="text-sm">
                              <summary className="cursor-pointer text-red-600 font-medium">
                                View Failed Recipients ({alert.failedRecipients.length})
                              </summary>
                              <div className="mt-2 space-y-1 pl-4">
                                {alert.failedRecipients.map((failed, idx) => (
                                  <div key={idx} className="text-xs text-gray-600">
                                    <Phone className="h-3 w-3 inline mr-1" />
                                    {failed.phone}: {failed.error}
                                  </div>
                                ))}
                              </div>
                            </details>
                          </div>
                        )}
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