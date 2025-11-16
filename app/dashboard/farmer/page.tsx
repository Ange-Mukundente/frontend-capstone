"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Calendar, Plus, Beef, Activity, AlertTriangle, Phone, FileText, Bell, Loader2, WifiOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'

export default function FarmerDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [livestock, setLivestock] = useState<any[]>([])
  const [appointments, setAppointments] = useState<any[]>([])
  const [appointmentsCount, setAppointmentsCount] = useState(0)
  const [alertsCount, setAlertsCount] = useState(0)
  const [isOffline, setIsOffline] = useState(false)

  // Check online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    setIsOffline(!navigator.onLine)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Fetch all dashboard data from API or localStorage
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token')
        const userStr = localStorage.getItem("user")
        
        if (!userStr || userStr === "undefined") {
          router.push("/auth/login")
          return
        }

        const userData = JSON.parse(userStr)
        setUser(userData)

        // Try to fetch from API if online
        if (navigator.onLine && token) {
          try {
            // Fetch livestock from API
            const livestockResponse = await fetch(`${BACKEND_URL}/api/livestock`, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            })
            
            const livestockData = await livestockResponse.json()
            
            if (livestockResponse.ok && livestockData.success) {
              console.log('✅ Livestock loaded from API:', livestockData.data.length)
              setLivestock(livestockData.data || [])
              // Cache the data
              localStorage.setItem('livestock_cache', JSON.stringify(livestockData.data || []))
            } else {
              throw new Error('Failed to load from API')
            }

            // Fetch appointments from API
            const appointmentsResponse = await fetch(`${BACKEND_URL}/api/appointments`, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            })
            
            const appointmentsData = await appointmentsResponse.json()
            
            if (appointmentsResponse.ok && appointmentsData.success) {
              const allAppointments = appointmentsData.data || []
              console.log('✅ Appointments loaded from API:', allAppointments.length)
              setAppointments(allAppointments)
              // Cache the data
              localStorage.setItem('appointments_cache', JSON.stringify(allAppointments))
              
              // Count upcoming appointments (this week)
              const today = new Date()
              today.setHours(0, 0, 0, 0)
              const weekFromNow = new Date(today)
              weekFromNow.setDate(today.getDate() + 7)

              const upcomingCount = allAppointments.filter((apt: any) => {
                const aptDate = new Date(apt.date)
                aptDate.setHours(0, 0, 0, 0)
                return aptDate >= today && aptDate <= weekFromNow && 
                       ['pending', 'confirmed'].includes(apt.status)
              }).length

              setAppointmentsCount(upcomingCount)
            } else {
              throw new Error('Failed to load from API')
            }

            setAlertsCount(0)
          } catch (apiError) {
            console.log('⚠️ API fetch failed, using cached data')
            loadCachedData()
          }
        } else {
          // Load from cache when offline
          console.log('📱 Offline mode - loading cached data')
          loadCachedData()
        }

        setLoading(false)
      } catch (error) {
        console.error("❌ Error loading dashboard data:", error)
        loadCachedData()
        setLoading(false)
      }
    }

    const loadCachedData = () => {
      // Load livestock from cache
      const cachedLivestock = localStorage.getItem('livestock_cache')
      if (cachedLivestock && cachedLivestock !== 'undefined') {
        try {
          const parsedLivestock = JSON.parse(cachedLivestock)
          setLivestock(parsedLivestock)
          console.log('📦 Loaded cached livestock:', parsedLivestock.length)
        } catch (e) {
          console.error('Failed to parse cached livestock')
          setLivestock([])
        }
      } else {
        // Fallback to old localStorage key
        const oldLivestock = localStorage.getItem('livestock')
        if (oldLivestock && oldLivestock !== 'undefined') {
          try {
            const parsedLivestock = JSON.parse(oldLivestock)
            setLivestock(parsedLivestock)
          } catch (e) {
            setLivestock([])
          }
        }
      }

      // Load appointments from cache
      const cachedAppointments = localStorage.getItem('appointments_cache')
      if (cachedAppointments && cachedAppointments !== 'undefined') {
        try {
          const parsedAppointments = JSON.parse(cachedAppointments)
          setAppointments(parsedAppointments)
          console.log('📦 Loaded cached appointments:', parsedAppointments.length)

          // Count upcoming appointments
          const today = new Date()
          today.setHours(0, 0, 0, 0)
          const weekFromNow = new Date(today)
          weekFromNow.setDate(today.getDate() + 7)

          const upcomingCount = parsedAppointments.filter((apt: any) => {
            const aptDate = new Date(apt.date)
            aptDate.setHours(0, 0, 0, 0)
            return aptDate >= today && aptDate <= weekFromNow && 
                   ['pending', 'confirmed'].includes(apt.status)
          }).length

          setAppointmentsCount(upcomingCount)
        } catch (e) {
          console.error('Failed to parse cached appointments')
          setAppointments([])
        }
      } else {
        // Fallback to old localStorage key
        const oldAppointments = localStorage.getItem('appointments')
        if (oldAppointments && oldAppointments !== 'undefined') {
          try {
            const parsedAppointments = JSON.parse(oldAppointments)
            setAppointments(parsedAppointments)

            const today = new Date()
            today.setHours(0, 0, 0, 0)
            const weekFromNow = new Date(today)
            weekFromNow.setDate(today.getDate() + 7)

            const upcomingCount = parsedAppointments.filter((apt: any) => {
              const aptDate = new Date(apt.date)
              aptDate.setHours(0, 0, 0, 0)
              return aptDate >= today && aptDate <= weekFromNow && 
                     ['pending', 'confirmed'].includes(apt.status)
            }).length

            setAppointmentsCount(upcomingCount)
          } catch (e) {
            setAppointments([])
          }
        }
      }

      setAlertsCount(0)
    }

    fetchDashboardData()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-green-600" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  const farmerName = user.name || "Farmer"

  // Calculate livestock stats from real data
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

  // Get recent appointments (sorted by date, limit 5)
  const recentAppointments = appointments
    .filter(apt => ['pending', 'confirmed'].includes(apt.status))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Offline Banner */}
        {isOffline && (
          <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
            <div className="flex items-center">
              <WifiOff className="w-5 h-5 text-yellow-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-yellow-800">
                  You're currently offline
                </p>
                <p className="text-xs text-yellow-700 mt-1">
                  Viewing cached data. Some features may be limited.
                </p>
              </div>
            </div>
          </div>
        )}

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
              <div className="text-2xl font-bold">{appointmentsCount}</div>
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
              <div className="text-2xl font-bold text-orange-600">{alertsCount}</div>
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
                  <Button 
                    className="w-full justify-start bg-green-600 hover:bg-green-700" 
                    onClick={() => router.push('/dashboard/farmer/appointments/book')}
                    disabled={isOffline}
                  >
                    <Calendar className="mr-2 h-4 w-4" /> Book Appointment
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => router.push('/dashboard/farmer/livestock')}>
                    <Plus className="mr-2 h-4 w-4" /> Add Livestock
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => router.push('/dashboard/farmer/reports')}>
                    <FileText className="mr-2 h-4 w-4" /> Veterinary Reports
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => router.push('/dashboard/farmer/health-records')}>
                    <Activity className="mr-2 h-4 w-4" /> Health Records
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
                {recentAppointments.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">No upcoming appointments</p>
                    <Button 
                      className="bg-green-600 hover:bg-green-700" 
                      onClick={() => router.push('/dashboard/farmer/appointments/book')}
                      disabled={isOffline}
                    >
                      <Calendar className="w-4 h-4 mr-2" /> Book Your First Appointment
                    </Button>
                  </div>
                ) : (
                  <>
                    {recentAppointments.map((apt: any) => (
                      <div key={apt._id || apt.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">{apt.vetName}</h4>
                            <Badge variant={apt.status === "confirmed" ? "default" : "secondary"}>
                              {apt.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            {new Date(apt.date).toLocaleDateString()} at {apt.time}
                          </p>
                          <p className="text-sm text-gray-500">{apt.livestockName}</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/farmer/appointments')}>
                          View Details
                        </Button>
                      </div>
                    ))}
                    <Button variant="link" className="w-full mt-4 text-green-600" onClick={() => router.push('/dashboard/farmer/appointments')}>
                      View All Appointments
                    </Button>
                  </>
                )}
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
                  {alertsCount > 0 && <Badge variant="destructive">{alertsCount}</Badge>}
                </CardTitle>
                <CardDescription>Important notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {alertsCount === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-sm text-gray-600">No health alerts at the moment</p>
                  </div>
                ) : (
                  <Button variant="link" className="w-full text-green-600" onClick={() => router.push('/dashboard/farmer/alerts')}>
                    View All Alerts
                  </Button>
                )}
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