"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { 
  Heart, Calendar, Bell, Users, Activity, Clock, Phone, Menu, 
  LogOut, User, CheckCircle, AlertTriangle, TrendingUp, Stethoscope,
  FileText, MessageSquare
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Navbar from "@/components/NavigationBar"

interface Appointment {
  id: number
  farmerName: string
  livestockName: string
  livestockType: string
  date: string
  time: string
  reason: string
  status: string
  location: string
  farmerPhone: string
  vetName?: string
  vetId?: string | number
}

export default function VeterinarianDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [appointments, setAppointments] = useState<Appointment[]>([])

  // Fetch user data and appointments
  useEffect(() => {
    const fetchUserData = () => {
      try {
        const userStr = localStorage.getItem("user")
        if (!userStr || userStr === "undefined") {
          router.push("/auth/signin")
          return
        }
        const userData = JSON.parse(userStr)
        if (userData.role !== "vet" && userData.role !== "veterinarian") {
          router.push("/dashboard/farmer")
          return
        }
        setUser(userData)

        const storedAppointments = localStorage.getItem("appointments")
        if (storedAppointments && storedAppointments !== "undefined") {
          const allAppointments = JSON.parse(storedAppointments)
          const vetAppointments = allAppointments.filter((apt: Appointment) => 
            apt.vetName === userData.name || apt.vetId === userData.id
          )
          setAppointments(vetAppointments)
        } else {
          const defaultAppointments: Appointment[] = [
            { id: 1, farmerName: "Mary", livestockName: "Cow #3", livestockType: "Cattle", date: "2025-10-21", time: "10:00 AM", reason: "Routine Checkup", status: "confirmed", location: "Kigali District", farmerPhone: "+250786160692" },
            { id: 2, farmerName: "John Doe", livestockName: "Goat #2", livestockType: "Goat", date: "2025-10-21", time: "2:00 PM", reason: "Vaccination", status: "pending", location: "Gasabo District", farmerPhone: "+250788123456" },
            { id: 3, farmerName: "Jane Smith", livestockName: "Cow #5", livestockType: "Cattle", date: "2025-10-22", time: "9:00 AM", reason: "Illness", status: "confirmed", location: "Kicukiro District", farmerPhone: "+250788234567" }
          ]
          setAppointments(defaultAppointments)
        }

        setLoading(false)
      } catch (error) {
        console.error("Error loading user data:", error)
        router.push("/auth/signin")
      }
    }

    fetchUserData()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) return null
  const vetName = user.name || "Dr. Veterinarian"

  // Today's appointments
  const today = new Date().toISOString().split("T")[0]
  const todaysAppointmentsList = appointments
    .filter(apt => apt.date === today || apt.date >= today)
    .sort((a, b) => (a.date === b.date ? a.time.localeCompare(b.time) : a.date.localeCompare(b.date)))
    .slice(0, 5)

  const recentCases = [
    { id: 1, farmerName: "Mary", livestockName: "Cow #1", diagnosis: "FMD Vaccination", date: "Oct 18, 2025", status: "completed" },
    { id: 2, farmerName: "John Doe", livestockName: "Goat #3", diagnosis: "Routine Checkup", date: "Oct 17, 2025", status: "completed" },
    { id: 3, farmerName: "Jane Smith", livestockName: "Cow #7", diagnosis: "Treatment for Fever", date: "Oct 16, 2025", status: "follow-up" }
  ]

  const urgentAlerts = [
    { id: 1, type: "emergency", message: "Emergency call from farmer in Kigali - Cow injury", time: "30 min ago", priority: "high" },
    { id: 2, type: "follow-up", message: "Follow-up needed for Cow #7 treatment", time: "2 hours ago", priority: "medium" }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar/>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {vetName}!</h1>
          <p className="text-gray-600">Here's your schedule and updates for today</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
             {/* Quick Actions */}
        <Card className="rounded-lg shadow mb-6">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks for your practice</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {[
                { label: "Appointments", icon: <Calendar className="w-5 h-5" />, route: "/dashboard/veterinarian/appointments", color: "bg-blue-600 text-white" },
                { label: "Patients", icon: <Users className="w-5 h-5" />, route: "/dashboard/veterinarian/patients", color: "bg-green-600 text-white" },
                { label: "Schedule", icon: <Clock className="w-5 h-5" />, route: "/dashboard/veterinarian/schedule", color: "bg-purple-600 text-white" },
                { label: "Messages", icon: <MessageSquare className="w-5 h-5" />, route: "/dashboard/veterinarian/messages", color: "bg-yellow-500 text-white" }
              ].map((action, idx) => (
                <Button
                  key={idx}
                  className={`flex flex-col items-center justify-center w-24 h-24 rounded-lg shadow hover:shadow-lg transition-all ${action.color}`}
                  onClick={() => router.push(action.route)}
                >
                  {action.icon}
                  <span className="text-xs mt-1">{action.label}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

            {/* Today's Appointments */}
            <Card>
              <CardHeader>
                <CardTitle>Today's Schedule</CardTitle>
                <CardDescription>Your upcoming appointments</CardDescription>
              </CardHeader>
              <CardContent>
                {todaysAppointmentsList.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                    <p className="text-gray-600">No appointments scheduled</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {todaysAppointmentsList.map((appointment) => (
                      <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">{appointment.farmerName}</h4>
                            <Badge variant={appointment.status === "confirmed" ? "default" : "secondary"}>{appointment.status}</Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            <Stethoscope className="inline w-3 h-3 mr-1" />
                            {appointment.livestockName} ({appointment.livestockType})
                          </p>
                          <p className="text-sm text-gray-500">{appointment.date} at {appointment.time} • {appointment.reason}</p>
                        </div>
                        <div className="flex gap-2">
                          {appointment.status === "pending" && (
                            <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => {
                              const updatedAppointments = appointments.map(apt => apt.id === appointment.id ? { ...apt, status: "confirmed" } : apt)
                              setAppointments(updatedAppointments)
                              localStorage.setItem("appointments", JSON.stringify(updatedAppointments))
                            }}>Confirm</Button>
                          )}
                          <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/veterinarian/appointments/${appointment.id}`)}>View Details</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <Button variant="link" className="w-full mt-4 text-blue-600" onClick={() => router.push('/dashboard/veterinarian/appointments')}>
                  View All Appointments
                </Button>
              </CardContent>
            </Card>

            {/* Recent Cases */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Cases</CardTitle>
                <CardDescription>Recently treated patients</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentCases.map((case_item) => (
                    <div key={case_item.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-sm">{case_item.livestockName}</h4>
                          <Badge variant={case_item.status === "completed" ? "default" : "secondary"} className="text-xs">{case_item.status}</Badge>
                        </div>
                        <p className="text-xs text-gray-600">Owner: {case_item.farmerName}</p>
                        <p className="text-xs text-gray-500">{case_item.diagnosis} • {case_item.date}</p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard/veterinarian/patients')}>
                        <FileText className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button variant="link" className="w-full mt-4 text-blue-600" onClick={() => router.push('/dashboard/veterinarian/patients')}>
                  View All Patient Records
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Urgent Alerts */}
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-red-600">
                  Urgent Alerts
                  <Badge variant="destructive">{urgentAlerts.length}</Badge>
                </CardTitle>
                <CardDescription>Important notifications requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {urgentAlerts.map((alert) => (
                    <div key={alert.id} className={`p-3 rounded-lg border-l-4 ${alert.priority === "high" ? "border-red-500 bg-red-50" : "border-orange-500 bg-orange-50"}`}>
                      <div className="flex items-start justify-between mb-1">
                        <Badge variant={alert.type === "emergency" ? "destructive" : "default"} className="text-xs">{alert.type}</Badge>
                        <span className="text-xs text-gray-500">{alert.time}</span>
                      </div>
                      <p className="text-sm font-medium mt-2">{alert.message}</p>
                      <Button size="sm" className="mt-2 w-full" variant="outline">Respond</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Stats */}
            <Card>
              <CardHeader>
                <CardTitle>This Week's Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><Users className="w-4 h-4 text-gray-600" /><span className="text-sm text-gray-600">Patients Treated</span></div>
                  <span className="font-bold text-lg">24</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-gray-600" /><span className="text-sm text-gray-600">Success Rate</span></div>
                  <span className="font-bold text-lg text-green-600">96%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><TrendingUp className="w-4 h-4 text-gray-600" /><span className="text-sm text-gray-600">Response Time</span></div>
                  <span className="font-bold text-lg">18 min</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><Activity className="w-4 h-4 text-gray-600" /><span className="text-sm text-gray-600">Follow-ups</span></div>
                  <span className="font-bold text-lg">8</span>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-600">Emergency Hotline</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 mb-3">Available 24/7 for urgent veterinary cases</p>
                <Button className="w-full bg-red-600 hover:bg-red-700" onClick={() => window.location.href = 'tel:+250788000000'}>
                  <Phone className="w-4 h-4 mr-2" />
                  +250 788 000 000
                </Button>
              </CardContent>
            </Card>

            {/* Support */}
            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {/* <Button variant="outline" className="w-full justify-start" onClick={() => router.push('/dashboard/veterinarian/resources')}>
                  <FileText className="mr-2 h-4 w-4" />
                  Medical Resources
                </Button> */}
                <Button variant="outline" className="w-full justify-start" onClick={() => router.push('/dashboard/veterinarian/help')}>
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