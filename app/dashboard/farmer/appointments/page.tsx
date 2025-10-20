"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Calendar, Clock, ArrowLeft, User, MapPin, Phone, Mail, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Define Appointment type
type AppointmentStatus = "pending" | "confirmed" | "completed" | "cancelled"

interface Appointment {
  id: number
  vetName: string
  vetSpecialty: string
  vetPhone: string
  vetEmail: string
  date: string
  time: string
  livestockName: string
  reason: string
  status: AppointmentStatus
  location: string
  notes?: string
  createdAt?: string
}

export default function AllAppointments() {
  const router = useRouter()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [filter, setFilter] = useState<AppointmentStatus | "all">("all")

  // Load appointments from localStorage
  useEffect(() => {
    const loadAppointments = () => {
      try {
        const storedAppointments = localStorage.getItem("appointments")
        if (storedAppointments && storedAppointments !== "undefined") {
          const parsedAppointments: Appointment[] = JSON.parse(storedAppointments)
          parsedAppointments.sort((a, b) => new Date(b.createdAt || b.date).getTime() - new Date(a.createdAt || a.date).getTime())
          setAppointments(parsedAppointments)
        } else {
          const defaultAppointments: Appointment[] = [
            {
              id: 1,
              vetName: "Dr. Sarah Mukamana",
              vetSpecialty: "Large Animals",
              vetPhone: "+250 788 123 456",
              vetEmail: "sarah.m@vetconnect.rw",
              date: "2025-10-18",
              time: "10:00 AM",
              livestockName: "Cow #3",
              reason: "Routine Checkup",
              status: "confirmed",
              location: "Kigali District",
              notes: "",
              createdAt: new Date().toISOString()
            },
            {
              id: 2,
              vetName: "Dr. Paul Nkusi",
              vetSpecialty: "Mixed Practice",
              vetPhone: "+250 788 234 567",
              vetEmail: "paul.n@vetconnect.rw",
              date: "2025-10-20",
              time: "2:00 PM",
              livestockName: "Goat #5",
              reason: "Vaccination",
              status: "pending",
              location: "Gasabo District",
              notes: "",
              createdAt: new Date().toISOString()
            }
          ]
          setAppointments(defaultAppointments)
          localStorage.setItem("appointments", JSON.stringify(defaultAppointments))
        }
      } catch (error) {
        console.error("Error loading appointments:", error)
      }
    }

    loadAppointments()
  }, [])

  const getStatusBadge = (status: AppointmentStatus) => {
    switch(status) {
      case "confirmed":
        return <Badge className="bg-green-500">Confirmed</Badge>
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>
      case "completed":
        return <Badge className="bg-blue-500">Completed</Badge>
      case "cancelled":
        return <Badge className="bg-red-500">Cancelled</Badge>
    }
  }

  const filteredAppointments = appointments.filter(apt => {
    if (filter === "all") return true
    return apt.status === filter
  })

  const handleCancelAppointment = (id: number) => {
    if (confirm("Are you sure you want to cancel this appointment?")) {
      const updatedAppointments: Appointment[] = appointments.map(apt => 
        apt.id === id ? { ...apt, status: "cancelled" } : apt
      )
      setAppointments(updatedAppointments)
      localStorage.setItem("appointments", JSON.stringify(updatedAppointments))
      alert("Appointment cancelled successfully")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold">My Appointments</h1>
              <p className="text-gray-600 mt-2">View and manage your veterinary appointments</p>
            </div>
          </div>
          <Button 
            className="bg-green-600 hover:bg-green-700"
            onClick={() => router.push('/dashboard/farmer/appointments/book')}
          >
            <Plus className="w-4 h-4 mr-2" />
            Book New Appointment
          </Button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <Button 
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
          >
            All ({appointments.length})
          </Button>
          <Button 
            variant={filter === "confirmed" ? "default" : "outline"}
            onClick={() => setFilter("confirmed")}
          >
            Confirmed ({appointments.filter(a => a.status === "confirmed").length})
          </Button>
          <Button 
            variant={filter === "pending" ? "default" : "outline"}
            onClick={() => setFilter("pending")}
          >
            Pending ({appointments.filter(a => a.status === "pending").length})
          </Button>
          <Button 
            variant={filter === "completed" ? "default" : "outline"}
            onClick={() => setFilter("completed")}
          >
            Completed ({appointments.filter(a => a.status === "completed").length})
          </Button>
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          {filteredAppointments.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No appointments found</h3>
                <p className="text-gray-600 mb-4">You don't have any {filter !== "all" ? filter : ""} appointments</p>
                <Button 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => router.push('/dashboard/farmer/appointments/book')}
                >
                  Book Your First Appointment
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredAppointments.map((appointment) => (
              <Card key={appointment.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Left Side - Appointment Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold">{appointment.vetName}</h3>
                            {getStatusBadge(appointment.status)}
                          </div>
                          <p className="text-sm text-gray-600">{appointment.vetSpecialty}</p>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-gray-600" />
                            <span className="font-medium">{appointment.date}</span>
                            <span className="text-gray-600">at {appointment.time}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <User className="w-4 h-4 text-gray-600" />
                            <span className="text-gray-600">Livestock:</span>
                            <span className="font-medium">{appointment.livestockName}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="w-4 h-4 text-gray-600" />
                            <span className="text-gray-600">{appointment.location}</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="w-4 h-4 text-gray-600" />
                            <span className="text-gray-600">{appointment.vetPhone}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="w-4 h-4 text-gray-600" />
                            <span className="text-gray-600">{appointment.vetEmail}</span>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-600">Reason: </span>
                            <span className="font-medium">{appointment.reason}</span>
                          </div>
                        </div>
                      </div>

                      {appointment.notes && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-700"><strong>Notes:</strong> {appointment.notes}</p>
                        </div>
                      )}
                    </div>

                    {/* Right Side - Actions */}
                    <div className="flex md:flex-col gap-2">
                      {(appointment.status === "pending" || appointment.status === "confirmed") && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex-1 md:flex-none text-red-600 hover:bg-red-50"
                          onClick={() => handleCancelAppointment(appointment.id)}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
