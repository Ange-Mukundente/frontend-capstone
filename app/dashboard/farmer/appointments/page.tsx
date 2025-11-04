"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Calendar, ArrowLeft, User, MapPin, Phone, Mail, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
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
        const parsedAppointments = storedAppointments ? JSON.parse(storedAppointments) : []

        if (!Array.isArray(parsedAppointments) || parsedAppointments.length === 0) {
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
        } else {
          parsedAppointments.sort(
            (a: Appointment, b: Appointment) =>
              new Date(b.createdAt || b.date).getTime() -
              new Date(a.createdAt || a.date).getTime()
          )
          setAppointments(parsedAppointments)
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
        {/* Header */}
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
          <Button variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")}>
            All ({appointments.length})
          </Button>
          <Button variant={filter === "confirmed" ? "default" : "outline"} onClick={() => setFilter("confirmed")}>
            Confirmed ({appointments.filter(a => a.status === "confirmed").length})
          </Button>
          <Button variant={filter === "pending" ? "default" : "outline"} onClick={() => setFilter("pending")}>
            Pending ({appointments.filter(a => a.status === "pending").length})
          </Button>
          <Button variant={filter === "completed" ? "default" : "outline"} onClick={() => setFilter("completed")}>
            Completed ({appointments.filter(a => a.status === "completed").length})
          </Button>
        </div>

        {/* Appointments Table */}
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          {filteredAppointments.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No {filter !== "all" ? filter : ""} appointments found
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Vet Name</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Specialty</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Date & Time</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Livestock</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Location</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Contact</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Reason</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Status</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAppointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm font-medium text-gray-900">{apt.vetName}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{apt.vetSpecialty}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{apt.date} at {apt.time}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{apt.livestockName}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{apt.location}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{apt.vetPhone} <br /> {apt.vetEmail}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{apt.reason}</td>
                    <td className="px-4 py-2">{getStatusBadge(apt.status)}</td>
                    <td className="px-4 py-2">
                      {(apt.status === "pending" || apt.status === "confirmed") && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:bg-red-50"
                          onClick={() => handleCancelAppointment(apt.id)}
                        >
                          Cancel
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
