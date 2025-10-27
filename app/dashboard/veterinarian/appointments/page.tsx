"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Calendar, Clock, ArrowLeft, User, MapPin, Phone, CheckCircle, X, AlertCircle, FileText, ChevronLeft, ChevronRight, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const itemsPerPage = 6

  // Load appointments from localStorage
  useEffect(() => {
    try {
      const storedAppointments = localStorage.getItem("appointments")
      if (storedAppointments && storedAppointments !== "undefined") {
        const parsed: Appointment[] = JSON.parse(storedAppointments)
        setAppointments(parsed)
      } else {
        // Sample data for demonstration
        const sampleAppointments: Appointment[] = [
          {
            id: 1,
            farmerName: "Mary Uwase",
            farmerPhone: "+250 788 123 456",
            farmerEmail: "mary@example.com",
            livestockName: "Cow #1",
            livestockType: "Cattle",
            date: "2025-10-28",
            time: "09:00 AM",
            location: "Kigali, Gasabo District",
            status: "pending",
            urgency: "high",
            reason: "Vaccination",
            issue: "FMD vaccination needed urgently"
          },
          {
            id: 2,
            farmerName: "John Mugisha",
            farmerPhone: "+250 788 234 567",
            farmerEmail: "john.mugisha@example.com",
            livestockName: "Goat #1",
            livestockType: "Goat",
            date: "2025-10-28",
            time: "11:00 AM",
            location: "Kigali, Kicukiro District",
            status: "confirmed",
            urgency: "normal",
            reason: "Routine Checkup",
            notes: "Annual health assessment"
          },
          {
            id: 3,
            farmerName: "Jean Kamanzi",
            farmerPhone: "+250 788 345 678",
            farmerEmail: "jean.kamanzi@example.com",
            livestockName: "Sheep #1",
            livestockType: "Sheep",
            date: "2025-10-29",
            time: "02:00 PM",
            location: "Kigali, Nyarugenge District",
            status: "confirmed",
            urgency: "normal",
            reason: "Follow-up",
            issue: "Post-treatment checkup for respiratory infection"
          },
          {
            id: 4,
            farmerName: "Alice Mukasine",
            farmerPhone: "+250 788 456 789",
            farmerEmail: "alice.mukasine@example.com",
            livestockName: "Pig #1",
            livestockType: "Pig",
            date: "2025-10-27",
            time: "10:00 AM",
            location: "Kigali, Gasabo District",
            status: "completed",
            urgency: "normal",
            reason: "Treatment",
            notes: "Skin infection treatment completed successfully"
          },
          {
            id: 5,
            farmerName: "Peter Habimana",
            farmerPhone: "+250 788 567 890",
            farmerEmail: "peter.habimana@example.com",
            livestockName: "Chicken Flock #1",
            livestockType: "Poultry",
            date: "2025-10-26",
            time: "08:00 AM",
            location: "Kigali, Kicukiro District",
            status: "completed",
            urgency: "low",
            reason: "Vaccination",
            issue: "Newcastle disease vaccination for entire flock"
          },
          {
            id: 6,
            farmerName: "Grace Uwera",
            farmerPhone: "+250 788 678 901",
            farmerEmail: "grace.uwera@example.com",
            livestockName: "Cow #3",
            livestockType: "Cattle",
            date: "2025-10-25",
            time: "03:00 PM",
            location: "Kigali, Nyarugenge District",
            status: "cancelled",
            urgency: "normal",
            reason: "Checkup",
            notes: "Farmer requested cancellation due to schedule conflict"
          },
          {
            id: 7,
            farmerName: "Sarah Ingabire",
            farmerPhone: "+250 788 789 012",
            farmerEmail: "sarah.ingabire@example.com",
            livestockName: "Cow #4",
            livestockType: "Cattle",
            date: "2025-10-30",
            time: "09:30 AM",
            location: "Kigali, Gasabo District",
            status: "pending",
            urgency: "high",
            reason: "Emergency",
            issue: "Cow showing signs of illness, needs immediate attention"
          },
          {
            id: 8,
            farmerName: "James Nkusi",
            farmerPhone: "+250 788 890 123",
            farmerEmail: "james.nkusi@example.com",
            livestockName: "Goat #2",
            livestockType: "Goat",
            date: "2025-10-30",
            time: "01:00 PM",
            location: "Kigali, Kicukiro District",
            status: "pending",
            urgency: "normal",
            reason: "Deworming",
            notes: "Routine deworming for small herd"
          }
        ]
        setAppointments(sampleAppointments)
        localStorage.setItem("appointments", JSON.stringify(sampleAppointments))
      }
    } catch (error) {
      console.error("Error loading appointments:", error)
    }
  }, [])

  // Badge helpers
  const getStatusBadge = (status: Appointment["status"]) => {
    switch (status) {
      case "confirmed": return <Badge className="bg-green-500 hover:bg-green-600">Confirmed</Badge>
      case "pending": return <Badge className="bg-yellow-500 hover:bg-yellow-600">Pending</Badge>
      case "completed": return <Badge className="bg-blue-500 hover:bg-blue-600">Completed</Badge>
      case "cancelled": return <Badge className="bg-red-500 hover:bg-red-600">Cancelled</Badge>
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

  // Filtered and paginated appointments
  const filteredAppointments = appointments.filter(apt => {
    const matchesFilter = filter === "all" || apt.status === filter
    const matchesSearch = searchTerm === "" ||
      apt.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.livestockName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.livestockType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.location.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentAppointments = filteredAppointments.slice(startIndex, endIndex)

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
    setSelectedAppointment(appointment)
    setShowDetails(true)
  }

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">

        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/dashboard/veterinarian')} 
            className="mb-4 hover:bg-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> 
            Back to Dashboard
          </Button>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
                <p className="text-gray-600">Manage and track all your veterinary appointments</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <Card className="mb-6 shadow-md border-gray-200">
          <CardHeader className="border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <CardTitle className="text-lg">Filter & Search</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Search */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search by farmer, livestock, or location..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value)
                      setCurrentPage(1)
                    }}
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Status</label>
                <Select value={filter} onValueChange={(value: FilterType) => {
                  setFilter(value)
                  setCurrentPage(1)
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Appointments</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Filters Display */}
            {(searchTerm || filter !== "all") && (
              <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                <span className="text-gray-600 font-medium">Active:</span>
                {searchTerm && (
                  <Badge variant="secondary">Search: "{searchTerm}"</Badge>
                )}
                {filter !== "all" && (
                  <Badge variant="secondary">Status: {filter}</Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchTerm("")
                    setFilter("all")
                    setCurrentPage(1)
                  }}
                  className="h-6 text-xs"
                >
                  Clear all
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="mb-4 text-sm text-gray-600 flex items-center justify-between">
          <span>
            Showing <span className="font-semibold text-gray-900">{startIndex + 1}-{Math.min(endIndex, filteredAppointments.length)}</span> of{" "}
            <span className="font-semibold text-gray-900">{filteredAppointments.length}</span> appointments
          </span>
          {totalPages > 1 && (
            <span className="text-gray-600">
              Page <span className="font-semibold text-gray-900">{currentPage}</span> of{" "}
              <span className="font-semibold text-gray-900">{totalPages}</span>
            </span>
          )}
        </div>

        {/* Appointments Grid - 2 columns */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {currentAppointments.length === 0 ? (
            <Card className="col-span-full shadow-md border-gray-200">
              <CardContent className="py-16 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">No appointments found</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  {filter !== "all" 
                    ? `You don't have any ${filter} appointments` 
                    : "Try adjusting your search criteria"}
                </p>
              </CardContent>
            </Card>
          ) : (
            currentAppointments.map(appointment => (
              <Card 
                key={appointment.id} 
                className={`hover:shadow-xl transition-all duration-200 border-gray-200 bg-white ${
                  appointment.urgency === "high" ? "border-l-4 border-l-red-500" : ""
                }`}
              >
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 truncate">{appointment.farmerName}</h3>
                      <div className="flex flex-wrap items-center gap-2">
                        {getStatusBadge(appointment.status)}
                        {getUrgencyBadge(appointment.urgency)}
                      </div>
                    </div>
                  </div>

                  {/* Livestock Info */}
                  <div className="mb-4 p-3 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border border-green-100">
                    <p className="text-sm font-medium text-gray-900">
                      {appointment.livestockName || appointment.livestockType} ({appointment.livestockType})
                    </p>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-600" />
                      <span className="font-medium text-gray-900">{formatDate(appointment.date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-600" />
                      <span className="text-gray-600">{appointment.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-600" />
                      <span className="text-gray-600">{appointment.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-600" />
                      <span className="text-gray-600">{appointment.farmerPhone}</span>
                    </div>
                  </div>

                  {/* Reason */}
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm">
                      <span className="font-semibold text-gray-700">Reason: </span>
                      <span className="text-gray-600">{appointment.reason}</span>
                    </p>
                    {(appointment.issue || appointment.notes) && (
                      <p className="text-sm mt-1 text-gray-600">
                        {appointment.issue || appointment.notes}
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                    {appointment.status === "pending" && (
                      <>
                        <Button 
                          size="sm" 
                          className="flex-1 bg-green-600 hover:bg-green-700" 
                          onClick={() => handleConfirm(appointment.id)}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Confirm
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1 hover:bg-red-50 hover:border-red-300" 
                          onClick={() => handleCancel(appointment.id)}
                        >
                          <X className="w-4 h-4 mr-1" />
                          Decline
                        </Button>
                      </>
                    )}
                    {appointment.status === "confirmed" && (
                      <>
                        <Button 
                          size="sm" 
                          className="flex-1 bg-blue-600 hover:bg-blue-700" 
                          onClick={() => handleComplete(appointment.id)}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Complete
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1" 
                          onClick={() => handleViewDetails(appointment)}
                        >
                          <FileText className="w-4 h-4 mr-1" />
                          Details
                        </Button>
                        <Button 
                          size="sm" 
                          className="w-full bg-green-600 hover:bg-green-700 mt-2" 
                          onClick={() => router.push(`/dashboard/veterinarian/appointments/report?appointmentId=${appointment.id}`)}
                        >
                          <FileText className="w-4 h-4 mr-1" />
                          Write Report
                        </Button>
                      </>
                    )}
                    {appointment.status === "completed" && (
                      <>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1" 
                          onClick={() => handleViewDetails(appointment)}
                        >
                          <FileText className="w-4 h-4 mr-1" />
                          View Details
                        </Button>
                        <Button 
                          size="sm" 
                          className="flex-1 bg-green-600 hover:bg-green-700" 
                          onClick={() => router.push(`/dashboard/veterinarian/appointments/report?appointmentId=${appointment.id}`)}
                        >
                          <FileText className="w-4 h-4 mr-1" />
                          View/Edit Report
                        </Button>
                      </>
                    )}
                    {appointment.status === "cancelled" && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full" 
                        onClick={() => handleViewDetails(appointment)}
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mb-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            
            <div className="flex gap-1">
              {[...Array(totalPages)].map((_, index) => {
                const page = index + 1
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    className="w-10"
                  >
                    {page}
                  </Button>
                )
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}

        {/* Info Box */}
        {appointments.length > 0 && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="py-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">Appointment Tips</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Confirm appointments at least 24 hours in advance</li>
                    <li>• High priority cases (red border) require immediate attention</li>
                    <li>• Contact farmers if you need to reschedule</li>
                    <li>• Complete visit reports immediately after each appointment</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Details Modal */}
        <Dialog open={showDetails} onOpenChange={setShowDetails}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900">{selectedAppointment?.farmerName}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Appointment Details
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowDetails(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </DialogTitle>
            </DialogHeader>
            
            {selectedAppointment && (
              <div className="mt-4 space-y-4">
                <div className="flex flex-wrap gap-2">
                  {getStatusBadge(selectedAppointment.status)}
                  {getUrgencyBadge(selectedAppointment.urgency)}
                </div>

                <Card>
                  <CardContent className="p-4 space-y-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-1">Livestock</p>
                      <p className="text-sm text-gray-900">
                        {selectedAppointment.livestockName || selectedAppointment.livestockType} ({selectedAppointment.livestockType})
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-1">Date & Time</p>
                      <p className="text-sm text-gray-900">{formatDate(selectedAppointment.date)} at {selectedAppointment.time}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-1">Location</p>
                      <p className="text-sm text-gray-900">{selectedAppointment.location}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-1">Contact</p>
                      <p className="text-sm text-gray-900">{selectedAppointment.farmerPhone}</p>
                      {selectedAppointment.farmerEmail && (
                        <p className="text-sm text-gray-600">{selectedAppointment.farmerEmail}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-1">Reason</p>
                      <p className="text-sm text-gray-900">{selectedAppointment.reason}</p>
                    </div>
                    {(selectedAppointment.issue || selectedAppointment.notes) && (
                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-1">Additional Details</p>
                        <p className="text-sm text-gray-900">{selectedAppointment.issue || selectedAppointment.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </DialogContent>
        </Dialog>

      </div>
    </div>
  )
}