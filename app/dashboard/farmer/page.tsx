"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Heart, Calendar, Bell, Plus, Beef, Activity, AlertTriangle, Phone, Menu, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function FarmerDashboard() {
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [livestock, setLivestock] = useState<any[]>([])

  

  // Fetch user & livestock data
  useEffect(() => {
    try {
      const userStr = localStorage.getItem("user")
      if (!userStr || userStr === "undefined") {
        router.push("/auth/signin")
        return
      }

      const userData = JSON.parse(userStr)
      setUser(userData)

      const storedLivestock = localStorage.getItem("livestock")
      if (storedLivestock && storedLivestock !== "undefined") {
        setLivestock(JSON.parse(storedLivestock))
      } else {
        const defaultLivestock = [
          { id: 1, name: "Cow #1", type: "Cattle", healthStatus: "healthy" },
          { id: 2, name: "Cow #2", type: "Cattle", healthStatus: "sick" },
          { id: 3, name: "Cow #3", type: "Cattle", healthStatus: "healthy" },
          { id: 4, name: "Cow #4", type: "Cattle", healthStatus: "healthy" },
          { id: 5, name: "Cow #5", type: "Cattle", healthStatus: "healthy" },
          { id: 6, name: "Cow #6", type: "Cattle", healthStatus: "healthy" },
          { id: 7, name: "Cow #7", type: "Cattle", healthStatus: "healthy" },
          { id: 8, name: "Cow #8", type: "Cattle", healthStatus: "healthy" },
          { id: 9, name: "Goat #1", type: "Goat", healthStatus: "healthy" },
          { id: 10, name: "Goat #2", type: "Goat", healthStatus: "healthy" },
          { id: 11, name: "Goat #3", type: "Goat", healthStatus: "healthy" },
          { id: 12, name: "Goat #4", type: "Goat", healthStatus: "healthy" },
        ]
        setLivestock(defaultLivestock)
        localStorage.setItem("livestock", JSON.stringify(defaultLivestock))
      }

      setLoading(false)
    } catch (error) {
      console.error("Error loading user data:", error)
      router.push("/auth/signin")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/auth/signin")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  const farmerName = user.name || "Farmer"

  // Livestock stats
  const livestockStats = livestock.reduce(
    (acc, l) => {
      acc.total++
      acc[l.type] = (acc[l.type] || 0) + 1
      if (l.healthStatus === "healthy") acc.healthy++
      else if (["sick", "under-treatment"].includes(l.healthStatus)) acc.sick++
      return acc
    },
    { total: 0, healthy: 0, sick: 0 } as any
  )

  const livestockSummary = Object.keys(livestockStats)
    .filter(type => type !== "total" && type !== "healthy" && type !== "sick")
    .map(type => {
      const count = livestockStats[type]
      const healthy = livestock.filter(l => l.type === type && l.healthStatus === "healthy").length
      return { type, count, healthy, needsAttention: count - healthy }
    })

  const livestockSummaryText = Object.keys(livestockStats)
    .filter(type => !["total", "healthy", "sick"].includes(type))
    .map(type => `${livestockStats[type]} ${type.toLowerCase()}${livestockStats[type] > 1 ? "s" : ""}`)
    .join(", ") || "No livestock"

  const upcomingAppointments = 2
  const pendingAlerts = 3

  const recentAppointments = [
    { id: 1, vetName: "Dr. Sarah Mukamana", date: "Oct 18, 2025", time: "10:00 AM", livestock: "Cow #3", status: "confirmed" },
    { id: 2, vetName: "Dr. Paul Nkusi", date: "Oct 20, 2025", time: "2:00 PM", livestock: "Goat #5", status: "pending" },
  ]

  const healthAlerts = [
    { id: 1, type: "vaccination", message: "Vaccination due for Cow #1 and Cow #2", date: "Oct 16, 2025", priority: "high" },
    { id: 2, type: "disease", message: "Foot and Mouth Disease alert in your district", date: "Oct 14, 2025", priority: "medium" },
    { id: 3, type: "checkup", message: "Annual checkup recommended for Goat #3", date: "Oct 12, 2025", priority: "low" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                <Menu className="h-5 w-5" />
              </Button>
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600">
                  <Heart className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold">VetConnect Rwanda</span>
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
                {pendingAlerts > 0 && <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>}
              </Button>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
                <span className="text-sm font-medium hidden md:inline">{user.name}</span>
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {farmerName}!</h1>
          <p className="text-gray-600">Here's what's happening with your livestock today</p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
            {/* Total Livestock */}
            <Card onClick={() => router.push('/dashboard/farmer/livestock')} className="cursor-pointer hover:shadow-md transition">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Livestock</CardTitle>
                <Beef className="h-4 w-4 text-gray-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{livestockStats.total}</div>
                <p className="text-xs text-gray-500 mt-1">{livestockSummaryText}</p>
              </CardContent>
            </Card>

            {/* Appointments */}
            <Card onClick={() => router.push('/dashboard/farmer/appointments')} className="cursor-pointer hover:shadow-md transition">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Appointments</CardTitle>
                <Calendar className="h-4 w-4 text-gray-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{upcomingAppointments}</div>
                <p className="text-xs text-gray-500 mt-1">This week</p>
              </CardContent>
            </Card>

            {/* Health Alerts */}
            <Card onClick={() => router.push('/dashboard/farmer/alerts')} className="cursor-pointer hover:shadow-md transition">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Health Alerts</CardTitle>
                <AlertTriangle className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{pendingAlerts}</div>
                <p className="text-xs text-gray-500 mt-1">Needs attention</p>
              </CardContent>
            </Card>

            {/* Health Status */}
            <Card onClick={() => router.push('/dashboard/farmer/health-records')} className="cursor-pointer hover:shadow-md transition">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Health Status</CardTitle>
                <Activity className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {livestockStats.total > 0 ? (livestockStats.sick === 0 ? "Good" : "Fair") : "N/A"}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {livestockStats.total > 0 ? `${livestockStats.healthy} of ${livestockStats.total} healthy` : "No livestock"}
                </p>
              </CardContent>
            </Card>
</div>


        {/* Main & Sidebar */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks to manage your livestock</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-3">
                  <Button className="w-full justify-start bg-green-600 hover:bg-green-700" onClick={() => router.push('/dashboard/farmer/appointments/book')}>
                    <Calendar className="mr-2 h-4 w-4" /> Book Appointment
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => router.push('/dashboard/farmer/livestock')}>
                    <Plus className="mr-2 h-4 w-4" /> Add Livestock
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => router.push('/dashboard/farmer/health-records')}>
                    <Activity className="mr-2 h-4 w-4" /> View Health Records
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => router.push('/dashboard/farmer/contact-vet')}>
                    <Phone className="mr-2 h-4 w-4" /> Contact Vet
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Appointments */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Appointments</CardTitle>
                <CardDescription>Your scheduled veterinary visits</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentAppointments.map(a => (
                  <div key={a.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{a.vetName}</h4>
                        <Badge variant={a.status === "confirmed" ? "default" : "secondary"}>{a.status}</Badge>
                      </div>
                      <p className="text-sm text-gray-600">{a.date} at {a.time}</p>
                      <p className="text-sm text-gray-500">{a.livestock}</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/farmer/appointments')}>
                      View Details
                    </Button>
                  </div>
                ))}
                <Button variant="link" className="w-full mt-4 text-green-600" onClick={() => router.push('/dashboard/farmer/appointments')}>
                  View All Appointments
                </Button>
              </CardContent>
            </Card>

            {/* Livestock Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Livestock Summary</CardTitle>
                <CardDescription>Overview of your animals</CardDescription>
              </CardHeader>
              <CardContent>
                {livestockSummary.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">No livestock added yet</p>
                    <Button className="bg-green-600 hover:bg-green-700" onClick={() => router.push('/dashboard/farmer/livestock')}>
                      <Plus className="w-4 h-4 mr-2" /> Add Your First Livestock
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4">
                      {livestockSummary.map((c, i) => (
                        <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h4 className="font-semibold">{c.type}</h4>
                            <p className="text-sm text-gray-600">Total: {c.count}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-green-600">✓ {c.healthy} Healthy</p>
                            {c.needsAttention > 0 && <p className="text-sm text-orange-600">⚠ {c.needsAttention} Needs attention</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button variant="link" className="w-full mt-4 text-green-600" onClick={() => router.push('/dashboard/farmer/livestock')}>
                      Manage Livestock
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Health Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Health Alerts</span>
                  <Badge variant="destructive">{pendingAlerts}</Badge>
                </CardTitle>
                <CardDescription>Important notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {healthAlerts.map(alert => (
                  <div
                    key={alert.id}
                    className={`p-3 rounded-lg border-l-4 ${alert.priority === "high" ? "border-red-500 bg-red-50" : alert.priority === "medium" ? "border-orange-500 bg-orange-50" : "border-blue-500 bg-blue-50"}`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <Badge variant={alert.type === "vaccination" ? "default" : "secondary"} className="text-xs">{alert.type}</Badge>
                      <span className="text-xs text-gray-500">{alert.date}</span>
                    </div>
                    <p className="text-sm font-medium mt-2">{alert.message}</p>
                  </div>
                ))}
                <Button variant="link" className="w-full mt-4 text-green-600" onClick={() => router.push('/dashboard/farmer/alerts')}>
                  View All Alerts
                </Button>
              </CardContent>
            </Card>

            {/* SMS Access */}
            <Card>
              <CardHeader>
                <CardTitle>SMS Access</CardTitle>
                <CardDescription>Use VetConnect via text message</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm font-medium mb-2">Quick Commands:</p>
                    <ul className="text-xs space-y-1 text-gray-600">
                      <li>• BOOK [animal] - Book appointment</li>
                      <li>• STATUS [animal] - Check health</li>
                      <li>• ALERT - View alerts</li>
                      <li>• HELP - Get assistance</li>
                    </ul>
                  </div>
                  <p className="text-xs text-gray-500">Send SMS to: +250 788 000 000</p>
                </div>
              </CardContent>
            </Card>

             {/* Support */}
            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => window.location.href = 'tel:+250788000000'}
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Emergency Hotline
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => router.push('/dashboard/farmer/help')}
                >
                  <Bell className="mr-2 h-4 w-4" />
                  User Guide
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
