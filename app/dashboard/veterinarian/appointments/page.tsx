"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Calendar, Clock, ArrowLeft, User, MapPin, Phone, CheckCircle, X, AlertCircle, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

interface Appointment {
  id: number
  farmerName: string
  farmerPhone: string
  farmerEmail?: string
  livestockName?: string
  livestockType?: string
  date: string
  time: string
  location: string
  status: "pending" | "confirmed" | "completed" | "cancelled"
  urgency?: "high" | "normal" | "low"
  reason?: string
  issue?: string
  notes?: string
}

type FilterType = "all" | "pending" | "confirmed" | "completed" | "cancelled"

export default function VeterinarianAppointments() {
  const router = useRouter()
  const { toast } = useToast()

  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [filter, setFilter] = useState<FilterType>("all")

  // Load appointments from localStorage
  useEffect(() => {
    try {
      const storedAppointments = localStorage.getItem("appointments")
      if (storedAppointments && storedAppointments !== "undefined") {
        const parsed: Appointment[] = JSON.parse(storedAppointments)
        setAppointments(parsed)
      }
    } catch (error) {
      console.error("Error loading appointments:", error)
    }
  }, [])

  // Badge helpers
  const getStatusBadge = (status: Appointment["status"]) => {
    switch (status) {
      case "confirmed": return <Badge className="bg-green-500">Confirmed</Badge>
      case "pending": return <Badge className="bg-yellow-500">Pending</Badge>
      case "completed": return <Badge className="bg-blue-500">Completed</Badge>
      case "cancelled": return <Badge className="bg-red-500">Cancelled</Badge>
      default: return <Badge>Unknown</Badge>
    }
  }

  const getUrgencyBadge = (urgency?: Appointment["urgency"]) => {
    switch (urgency) {
      case "high": return <Badge variant="destructive">High Priority</Badge>
      case "normal": return <Badge variant="outline">Normal</Badge>
      case "low": return <Badge variant="secondary">Low Priority</Badge>
      default: return null
    }
  }

  // Filtered appointments
  const filteredAppointments = appointments.filter(apt => filter === "all" || apt.status === filter)

  // Handlers
  const handleConfirm = (id: number) => {
    const updatedAppointments: Appointment[] = appointments.map(apt =>
      apt.id === id ? { ...apt, status: "confirmed" } : apt
    )
    setAppointments(updatedAppointments)
    localStorage.setItem("appointments", JSON.stringify(updatedAppointments))
    toast({ title: "✅ Appointment Confirmed", description: "The farmer has been notified" })
  }

  const handleComplete = (id: number) => {
    const updatedAppointments: Appointment[] = appointments.map(apt =>
      apt.id === id ? { ...apt, status: "completed" } : apt
    )
    setAppointments(updatedAppointments)
    localStorage.setItem("appointments", JSON.stringify(updatedAppointments))
    toast({ title: "✅ Appointment Completed", description: "Visit marked as completed successfully" })
  }

  const handleCancel = (id: number) => {
    if (!confirm("Are you sure you want to cancel this appointment?")) return
    const updatedAppointments: Appointment[] = appointments.map(apt =>
      apt.id === id ? { ...apt, status: "cancelled" } : apt
    )
    setAppointments(updatedAppointments)
    localStorage.setItem("appointments", JSON.stringify(updatedAppointments))
    toast({ title: "Appointment Cancelled", description: "The farmer has been notified", variant: "destructive" })
  }

  const handleViewDetails = (appointment: Appointment) => {
    toast({ title: "Appointment Details", description: `Viewing details for ${appointment.farmerName}` })
    // router.push(`/dashboard/veterinarian/appointments/${appointment.id}`)
  }

  // Filter colors
  const filterColors: Record<FilterType, string> = {
    all: "green",
    pending: "yellow",
    confirmed: "green",
    completed: "blue",
    cancelled: "red",
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" onClick={() => router.push('/dashboard/veterinarian')} className="hover:bg-gray-100">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold">My Appointments</h1>
            <p className="text-gray-600 mt-2">Manage all your veterinary appointments</p>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {["Total","Pending","Confirmed","Completed"].map((label, idx) => {
            const count = label === "Total" ? appointments.length : appointments.filter(a => a.status.toLowerCase() === label.toLowerCase()).length
            const color = label === "Pending" ? "yellow" : label === "Confirmed" ? "green" : label === "Completed" ? "blue" : "blue"
            return (
              <Card key={idx}>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className={`text-3xl font-bold text-${color}-600`}>{count}</div>
                    <p className="text-sm text-gray-600 mt-1">{label} Appointments</p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {(["all","pending","confirmed","completed","cancelled"] as FilterType[]).map(f => (
            <Button
              key={f}
              variant={filter === f ? "default" : "outline"}
              onClick={() => setFilter(f)}
              className={filter === f ? `bg-${filterColors[f]}-600 hover:bg-${filterColors[f]}-700` : ""}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)} ({f === "all" ? appointments.length : appointments.filter(a => a.status === f).length})
            </Button>
          ))}
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          {filteredAppointments.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No appointments found</h3>
                <p className="text-gray-600">You don't have any {filter !== "all" ? filter : ""} appointments</p>
              </CardContent>
            </Card>
          ) : (
            filteredAppointments.map(appointment => (
              <Card key={appointment.id} className={`hover:shadow-lg transition-shadow ${appointment.urgency === "high" ? "border-l-4 border-l-red-500" : ""}`}>
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">{appointment.farmerName}</h3>
                        {getStatusBadge(appointment.status)}
                        {getUrgencyBadge(appointment.urgency)}
                      </div>
                      <p className="text-sm text-gray-600">{appointment.livestockName || appointment.livestockType} ({appointment.livestockType})</p>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid md:grid-cols-2 gap-4 mt-2">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm"><Calendar className="w-4 h-4 text-gray-600" /><span className="font-medium">{appointment.date}</span></div>
                      <div className="flex items-center gap-2 text-sm"><Clock className="w-4 h-4 text-gray-600" /><span className="text-gray-600">{appointment.time}</span></div>
                      <div className="flex items-center gap-2 text-sm"><MapPin className="w-4 h-4 text-gray-600" /><span className="text-gray-600">{appointment.location}</span></div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm"><Phone className="w-4 h-4 text-gray-600" /><span className="text-gray-600">{appointment.farmerPhone}</span></div>
                      {appointment.farmerEmail && <div className="flex items-center gap-2 text-sm"><User className="w-4 h-4 text-gray-600" /><span className="text-gray-600">{appointment.farmerEmail}</span></div>}
                      <div className="text-sm"><span className="text-gray-600">Reason: </span><span className="font-medium">{appointment.reason || appointment.issue}</span></div>
                    </div>
                  </div>

                  {/* Notes/Issue */}
                  {(appointment.issue || appointment.notes) && (
                    <div className="p-3 bg-gray-50 rounded-lg mt-2">
                      <p className="text-sm"><span className="font-semibold text-gray-700">Details: </span><span className="text-gray-600">{appointment.issue || appointment.notes}</span></p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 pt-2 border-t mt-2">
                    {appointment.status === "pending" && (
                      <>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleConfirm(appointment.id)}><CheckCircle className="w-4 h-4 mr-2" />Confirm</Button>
                        <Button size="sm" variant="outline" className="hover:bg-red-50 hover:border-red-300" onClick={() => handleCancel(appointment.id)}><X className="w-4 h-4 mr-2" />Decline</Button>
                      </>
                    )}
                    {appointment.status === "confirmed" && (
                      <>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => handleComplete(appointment.id)}><CheckCircle className="w-4 h-4 mr-2" />Mark as Complete</Button>
                        <Button size="sm" variant="outline" onClick={() => handleViewDetails(appointment)}><FileText className="w-4 h-4 mr-2" />View Details</Button>
                        <Button size="sm" variant="outline" className="hover:bg-red-50 hover:border-red-300" onClick={() => handleCancel(appointment.id)}><X className="w-4 h-4 mr-2" />Cancel</Button>
                      </>
                    )}
                    {appointment.status === "completed" && <Button size="sm" variant="outline" onClick={() => handleViewDetails(appointment)}><FileText className="w-4 h-4 mr-2" />View Report</Button>}
                    {appointment.status === "cancelled" && <Button size="sm" variant="outline" onClick={() => handleViewDetails(appointment)}><FileText className="w-4 h-4 mr-2" />View Details</Button>}
                  </div>

                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Info Box */}
        {appointments.length > 0 && (
          <Card className="mt-6 bg-blue-50 border-blue-200">
            <CardContent className="py-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">Appointment Tips</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Confirm appointments at least 24 hours in advance</li>
                    <li>• Contact farmers if you need to reschedule</li>
                    <li>• Complete visit reports immediately after each appointment</li>
                    <li>• High priority cases should be attended to urgently</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  )
}
