"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import NavigationBar from "@/components/NavigationBar"
import { 
  Users, Stethoscope, Send, FileText, Activity, Calendar, 
  CheckCircle, Clock, MapPin, TrendingUp, AlertTriangle, BarChart
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function AdminDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalFarmers: 8,
    totalVets: 16,
    totalAlerts: 0,
    totalReports: 0,
    pendingAppointments: 2,
    completedAppointments: 5
  })

  useEffect(() => {
    try {
      const userStr = localStorage.getItem("user")
      if (!userStr || userStr === "undefined") {
        router.push("/auth/signin")
        return
      }

      const userData = JSON.parse(userStr)
      if (userData.role !== "admin") {
        router.push("/")
        return
      }

      setUser(userData)

      const sentAlerts = localStorage.getItem("sentAlerts")
      const vetReports = localStorage.getItem("vetReports")
      const appointments = localStorage.getItem("appointments")

      if (sentAlerts && sentAlerts !== "undefined") {
        setStats(prev => ({ ...prev, totalAlerts: JSON.parse(sentAlerts).length }))
      }
      if (vetReports && vetReports !== "undefined") {
        setStats(prev => ({ ...prev, totalReports: JSON.parse(vetReports).length }))
      }
      if (appointments && appointments !== "undefined") {
        const appts = JSON.parse(appointments)
        setStats(prev => ({
          ...prev,
          pendingAppointments: appts.filter((a: any) => a.status === "pending").length,
          completedAppointments: appts.filter((a: any) => a.status === "completed").length
        }))
      }

      setLoading(false)
    } catch (error) {
      console.error("Error loading user data:", error)
      router.push("/auth/signin")
    }
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  const recentAlerts = [
    { id: 1, title: "FMD Vaccination Required", recipients: 8, date: "Oct 25, 2025", priority: "high", status: "sent" },
    { id: 2, title: "Weather Warning - Heavy Rains", recipients: 8, date: "Oct 24, 2025", priority: "medium", status: "sent" },
    { id: 3, title: "Disease Outbreak Alert - Kigali", recipients: 5, date: "Oct 23, 2025", priority: "high", status: "sent" },
  ]

  const recentActivities = [
    { id: 1, action: "New farmer registered", user: "John Mugisha", time: "2 hours ago", icon: Users, color: "text-green-600" },
    { id: 2, action: "Appointment scheduled", user: "Dr. Sarah M.", time: "3 hours ago", icon: Calendar, color: "text-blue-600" },
    { id: 3, action: "Medical report submitted", user: "Dr. Paul N.", time: "5 hours ago", icon: FileText, color: "text-purple-600" },
    { id: 4, action: "Alert sent to farmers", user: "System Admin", time: "1 day ago", icon: Send, color: "text-orange-600" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* ✅ Navigation Bar Component */}
      {/* <NavigationBar /> */}

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}! 👋</h1>
              <p className="text-purple-100">Manage and monitor the VetConnect Rwanda platform</p>
            </div>
            <div className="hidden lg:flex items-center gap-2">
              <Activity className="w-12 h-12 opacity-50" />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard title="Total Farmers" value={stats.totalFarmers} color="blue" icon={Users} />
          <StatCard title="Veterinarians" value={stats.totalVets} color="green" icon={Stethoscope} />
          <StatCard title="Alerts Sent" value={stats.totalAlerts} color="purple" icon={Send} />
          <StatCard title="Medical Reports" value={stats.totalReports} color="orange" icon={FileText} />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Quick Actions */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="border-b bg-gradient-to-r from-purple-50 to-blue-50">
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center">
                    <Activity className="w-4 h-4 text-white" />
                  </div>
                  Quick Actions
                </CardTitle>
                <CardDescription>Manage platform operations</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <button 
                    onClick={() => router.push('/dashboard/admin/send-alerts')}
                    className="group p-6 rounded-xl border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-50 transition-all duration-300 text-left"
                  >
                    <div className="w-12 h-12 rounded-xl bg-purple-100 group-hover:bg-purple-600 flex items-center justify-center mb-4 transition-colors">
                      <Send className="w-6 h-6 text-purple-600 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">Send Alerts</h3>
                    <p className="text-sm text-gray-600">Notify farmers about important updates</p>
                  </button>

                  <button 
                    onClick={() => router.push('/dashboard/admin/farmers')}
                    className="group p-6 rounded-xl border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 text-left"
                  >
                    <div className="w-12 h-12 rounded-xl bg-blue-100 group-hover:bg-blue-600 flex items-center justify-center mb-4 transition-colors">
                      <Users className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">Manage Farmers</h3>
                    <p className="text-sm text-gray-600">View and manage farmer accounts</p>
                  </button>

                  <button 
                    onClick={() => router.push('/dashboard/admin/veterinarians')}
                    className="group p-6 rounded-xl border-2 border-green-200 hover:border-green-400 hover:bg-green-50 transition-all duration-300 text-left"
                  >
                    <div className="w-12 h-12 rounded-xl bg-green-100 group-hover:bg-green-600 flex items-center justify-center mb-4 transition-colors">
                      <Stethoscope className="w-6 h-6 text-green-600 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">Manage Vets</h3>
                    <p className="text-sm text-gray-600">Oversee veterinarian profiles</p>
                  </button>

                  <button 
                    onClick={() => router.push('/dashboard/admin/reports')}
                    className="group p-6 rounded-xl border-2 border-orange-200 hover:border-orange-400 hover:bg-orange-50 transition-all duration-300 text-left"
                  >
                    <div className="w-12 h-12 rounded-xl bg-orange-100 group-hover:bg-orange-600 flex items-center justify-center mb-4 transition-colors">
                      <BarChart className="w-6 h-6 text-orange-600 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">Analytics</h3>
                    <p className="text-sm text-gray-600">View platform statistics</p>
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Alerts */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Alerts</CardTitle>
                    <CardDescription>Latest notifications sent to farmers</CardDescription>
                  </div>
                  <Button 
                    size="sm"
                    onClick={() => router.push('/dashboard/admin/alerts-history')}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {recentAlerts.map(alert => (
                    <div key={alert.id} className="p-4 rounded-xl border bg-gradient-to-r from-gray-50 to-white hover:shadow-md transition-all">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3 flex-1">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            alert.priority === "high" ? "bg-red-100" : "bg-yellow-100"
                          }`}>
                            <AlertTriangle className={`w-5 h-5 ${
                              alert.priority === "high" ? "text-red-600" : "text-yellow-600"
                            }`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 mb-1">{alert.title}</h4>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Users className="w-3 h-3" />
                              <span>{alert.recipients} recipients</span>
                              <span className="text-gray-400">•</span>
                              <span>{alert.date}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge className={
                            alert.priority === "high" 
                              ? "bg-red-100 text-red-700" 
                              : "bg-yellow-100 text-yellow-700"
                          }>
                            {alert.priority}
                          </Badge>
                          <Badge className="bg-green-100 text-green-700">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            {alert.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            
            {/* Appointments Overview */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-purple-50">
              <CardHeader className="border-b border-blue-100">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  Appointments
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-3">
                <div className="p-4 bg-white rounded-xl shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="font-medium">Completed</span>
                    </div>
                    <span className="text-2xl font-bold text-green-600">{stats.completedAppointments}</span>
                  </div>
                  <p className="text-xs text-gray-500 ml-10">This month</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center">
                        <Clock className="w-4 h-4 text-yellow-600" />
                      </div>
                      <span className="font-medium">Pending</span>
                    </div>
                    <span className="text-2xl font-bold text-yellow-600">{stats.pendingAppointments}</span>
                  </div>
                  <p className="text-xs text-gray-500 ml-10">Awaiting confirmation</p>
                </div>
              </CardContent>
            </Card>

            {/* Coverage Areas */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="border-b">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-purple-600" />
                  Coverage Areas
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-3">
                <div className="p-4 rounded-xl bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-100">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">Nyagatare</h4>
                    <Badge className="bg-green-100 text-green-700">Active</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="p-2 bg-white rounded-lg">
                      <p className="text-xs text-gray-600">Farmers</p>
                      <p className="font-bold text-blue-600">4</p>
                    </div>
                    <div className="p-2 bg-white rounded-lg">
                      <p className="text-xs text-gray-600">Vets</p>
                      <p className="font-bold text-green-600">8</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">Gatsibo</h4>
                    <Badge className="bg-green-100 text-green-700">Active</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="p-2 bg-white rounded-lg">
                      <p className="text-xs text-gray-600">Farmers</p>
                      <p className="font-bold text-blue-600">4</p>
                    </div>
                    <div className="p-2 bg-white rounded-lg">
                      <p className="text-xs text-gray-600">Vets</p>
                      <p className="font-bold text-green-600">8</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="border-b">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {recentActivities.map((activity) => {
                    const Icon = activity.icon
                    return (
                      <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className={`w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 ${activity.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                          <p className="text-xs text-gray-600">{activity.user}</p>
                          <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-600 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">System Health</h4>
                    <p className="text-sm text-gray-600 mb-3">All systems operational</p>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="text-gray-600">Database: Online</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="text-gray-600">API: Responsive</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="text-gray-600">Notifications: Active</span>
                      </div>
                    </div>
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

/* ✅ Reusable StatCard Component */
function StatCard({ title, value, color, icon: Icon }: any) {
  const colors: any = {
    blue: { bg: "from-blue-50 to-blue-100", icon: "bg-blue-600", text: "text-blue-600" },
    green: { bg: "from-green-50 to-green-100", icon: "bg-green-600", text: "text-green-600" },
    purple: { bg: "from-purple-50 to-purple-100", icon: "bg-purple-600", text: "text-purple-600" },
    orange: { bg: "from-orange-50 to-orange-100", icon: "bg-orange-600", text: "text-orange-600" },
  }

  return (
    <Card className={`border-0 shadow-lg bg-gradient-to-br ${colors[color].bg} hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl ${colors[color].icon} flex items-center justify-center shadow-lg`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
        <p className="text-sm text-gray-600 font-medium mb-1">{title}</p>
        <p className={`text-3xl font-bold ${colors[color].text}`}>{value}</p>
      </CardContent>
    </Card>
  )
}