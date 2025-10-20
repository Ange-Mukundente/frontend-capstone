"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { 
  Heart, Calendar, Users, Clock, CheckCircle, AlertCircle, Menu, LogOut, 
  User, MapPin, Phone, Mail, Search, Filter, X, Eye, Check, XCircle,
  TrendingUp, Activity, FileText, Settings
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

export default function VeterinarianDashboard() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Mock vet data
  const vetName = "Dr. Mary Mukamana"
  const vetSpecialization = "Large Animal Veterinarian"
  const vetLicense = "VET-2023-045"

  // Report form
  const [reportForm, setReportForm] = useState({
    diagnosis: "",
    treatment: "",
    prescription: "",
    followUpDate: "",
    notes: "",
  })

  // Appointments state
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      farmerName: "Jean Baptiste",
      farmerPhone: "+250788123456",
      time: "09:30 AM",
      date: "Oct 20, 2025",
      livestock: "Cow #3",
      livestockType: "Cattle",
      issue: "Routine checkup",
      status: "pending",
      location: "Gatsibo District",
      urgency: "normal",
      farmerEmail: "jean@example.com",
    },
    {
      id: 2,
      farmerName: "Marie Uwase",
      farmerPhone: "+250788234567",
      time: "11:00 AM",
      date: "Oct 20, 2025",
      livestock: "Goat #2",
      livestockType: "Goat",
      issue: "Vaccination",
      status: "confirmed",
      location: "Kayonza District",
      urgency: "normal",
      farmerEmail: "marie@example.com",
    },
    {
      id: 3,
      farmerName: "Paul Nkusi",
      farmerPhone: "+250788345678",
      time: "02:00 PM",
      date: "Oct 20, 2025",
      livestock: "Cow #7",
      livestockType: "Cattle",
      issue: "Injury - limping on right leg",
      status: "confirmed",
      location: "Nyagatare District",
      urgency: "high",
      farmerEmail: "paul@example.com",
    },
    {
      id: 4,
      farmerName: "Grace Uwera",
      farmerPhone: "+250788456789",
      time: "04:00 PM",
      date: "Oct 20, 2025",
      livestock: "Cow #5",
      livestockType: "Cattle",
      issue: "Not eating, looks weak",
      status: "confirmed",
      location: "Gatsibo District",
      urgency: "high",
      farmerEmail: "grace@example.com",
    },
  ])

  const [pendingRequests, setPendingRequests] = useState([
    {
      id: 5,
      farmerName: "Alice Mukamana",
      farmerPhone: "+250788567890",
      requestedDate: "Oct 21, 2025",
      requestedTime: "Morning",
      livestock: "Cow #2",
      livestockType: "Cattle",
      issue: "Limping, possible injury",
      urgency: "high",
      location: "Gatsibo District",
    },
    {
      id: 6,
      farmerName: "Joseph Habimana",
      farmerPhone: "+250788678901",
      requestedDate: "Oct 22, 2025",
      requestedTime: "Afternoon",
      livestock: "Goat #3",
      livestockType: "Goat",
      issue: "Routine vaccination needed",
      urgency: "normal",
      location: "Kayonza District",
    },
  ])

  const [completedToday, setCompletedToday] = useState([
    {
      id: 100,
      farmerName: "Emmanuel Nsabimana",
      time: "08:00 AM",
      livestock: "Cow #1",
      issue: "Vaccination completed",
      location: "Nyagatare District",
    },
  ])

  // Calculate stats
  const todayAppointments = appointments.filter(a => a.status === "confirmed" || a.status === "pending").length
  const totalPatients = 48 // This would come from your database
  const pendingRequestsCount = pendingRequests.length
  const completedTodayCount = completedToday.length
  const urgentCases = appointments.filter(a => a.urgency === "high").length

  // Handle appointment actions
  const handleAcceptRequest = (requestId: number) => {
    const request = pendingRequests.find(r => r.id === requestId)
    if (request) {
      const newAppointment = {
        ...request,
        time: request.requestedTime === "Morning" ? "09:00 AM" : "02:00 PM",
        date: request.requestedDate,
        status: "confirmed",
        farmerEmail: "farmer@example.com",
      }
      setAppointments([...appointments, newAppointment])
      setPendingRequests(pendingRequests.filter(r => r.id !== requestId))
      
      toast({
        title: "Request Accepted",
        description: `Appointment scheduled with ${request.farmerName}`,
      })
    }
  }

  const handleDeclineRequest = (requestId: number) => {
    setPendingRequests(pendingRequests.filter(r => r.id !== requestId))
    toast({
      title: "Request Declined",
      description: "The farmer has been notified",
      variant: "destructive",
    })
  }

  const handleStartVisit = (appointmentId: number) => {
    const appointment = appointments.find(a => a.id === appointmentId)
    setSelectedAppointment(appointment)
    setIsDetailsDialogOpen(true)
  }

  const handleCompleteVisit = () => {
    setIsDetailsDialogOpen(false)
    setIsReportDialogOpen(true)
  }

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!reportForm.diagnosis || !reportForm.treatment) {
      toast({
        title: "Missing Information",
        description: "Please fill in diagnosis and treatment",
        variant: "destructive",
      })
      return
    }

    // Move to completed
    setCompletedToday([...completedToday, {
      id: selectedAppointment.id,
      farmerName: selectedAppointment.farmerName,
      time: selectedAppointment.time,
      livestock: selectedAppointment.livestock,
      issue: reportForm.diagnosis,
      location: selectedAppointment.location,
    }])

    setAppointments(appointments.filter(a => a.id !== selectedAppointment.id))

    toast({
      title: "Visit Completed",
      description: "Health report has been submitted successfully",
    })

    setIsReportDialogOpen(false)
    setReportForm({
      diagnosis: "",
      treatment: "",
      prescription: "",
      followUpDate: "",
      notes: "",
    })
  }

  const handleCancelAppointment = (appointmentId: number) => {
    setAppointments(appointments.filter(a => a.id !== appointmentId))
    toast({
      title: "Appointment Cancelled",
      description: "The farmer has been notified",
    })
  }

  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    })
    router.push("/auth/login")
  }

  // Filter appointments
  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.livestock.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = statusFilter === "all" || appointment.status === statusFilter
    return matchesSearch && matchesFilter
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600">
                  <Heart className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold hidden sm:inline">VetConnect Rwanda</span>
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2">
                <User className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium">{vetName}</span>
              </div>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
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
          <h1 className="text-3xl font-bold mb-2">Welcome, {vetName}!</h1>
          <p className="text-gray-600">{vetSpecialization} • License: {vetLicense}</p>
        </div>

        {/* Stats Overview */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Today's Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{todayAppointments}</div>
              <p className="text-xs text-gray-500 mt-1">{completedTodayCount} completed</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pending Requests</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{pendingRequestsCount}</div>
              <p className="text-xs text-gray-500 mt-1">Awaiting response</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Urgent Cases</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{urgentCases}</div>
              <p className="text-xs text-gray-500 mt-1">Need immediate attention</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Patients</CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{totalPatients}</div>
              <p className="text-xs text-gray-500 mt-1">Active livestock</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">This Week</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">18</div>
              <p className="text-xs text-gray-500 mt-1">Completed visits</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Appointments Tabs */}
            <Card>
              <CardHeader>
                <CardTitle>Appointments</CardTitle>
                <CardDescription>Manage your scheduled visits and requests</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="today" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-4">
                    <TabsTrigger value="today">
                      Today ({todayAppointments})
                    </TabsTrigger>
                    <TabsTrigger value="pending">
                      Requests
                      {pendingRequestsCount > 0 && (
                        <Badge variant="destructive" className="ml-2">
                          {pendingRequestsCount}
                        </Badge>
                      )}
                    </TabsTrigger>
                    <TabsTrigger value="completed">
                      Completed ({completedTodayCount})
                    </TabsTrigger>
                  </TabsList>

                  {/* Search and Filter */}
                  <div className="flex gap-2 mb-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search appointments..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[140px]">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <TabsContent value="today" className="space-y-4">
                    {filteredAppointments.length === 0 ? (
                      <div className="text-center py-12">
                        <Calendar className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-600">No appointments scheduled for today</p>
                      </div>
                    ) : (
                      filteredAppointments.map((appointment) => (
                        <div
                          key={appointment.id}
                          className={`p-4 border-2 rounded-lg hover:shadow-md transition-shadow ${
                            appointment.urgency === "high" ? "border-red-200 bg-red-50" : "border-gray-200"
                          }`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-semibold text-lg">{appointment.farmerName}</h4>
                                <Badge variant={appointment.status === "confirmed" ? "default" : "secondary"}>
                                  {appointment.status}
                                </Badge>
                                {appointment.urgency === "high" && (
                                  <Badge variant="destructive">Urgent</Badge>
                                )}
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {appointment.time}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Phone className="h-3 w-3" />
                                  {appointment.farmerPhone}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Activity className="h-3 w-3" />
                                  {appointment.livestock} ({appointment.livestockType})
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {appointment.location}
                                </div>
                              </div>
                              <p className="text-sm text-gray-700 mt-2">
                                <strong>Issue:</strong> {appointment.issue}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleStartVisit(appointment.id)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Start Visit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleCancelAppointment(appointment.id)}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </TabsContent>

                  <TabsContent value="pending" className="space-y-4">
                    {pendingRequests.length === 0 ? (
                      <div className="text-center py-12">
                        <CheckCircle className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-600">No pending requests</p>
                      </div>
                    ) : (
                      pendingRequests.map((request) => (
                        <div
                          key={request.id}
                          className={`p-4 border-2 rounded-lg ${
                            request.urgency === "high" ? "border-orange-200 bg-orange-50" : "border-gray-200 bg-white"
                          }`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-semibold text-lg">{request.farmerName}</h4>
                                <Badge
                                  variant={
                                    request.urgency === "high" ? "destructive" : "default"
                                  }
                                >
                                  {request.urgency} urgency
                                </Badge>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                                <div>Requested: {request.requestedDate}</div>
                                <div>Time: {request.requestedTime}</div>
                                <div>Animal: {request.livestock}</div>
                                <div>Location: {request.location}</div>
                              </div>
                              <p className="text-sm text-gray-700 mt-2">
                                <strong>Issue:</strong> {request.issue}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleAcceptRequest(request.id)}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeclineRequest(request.id)}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Decline
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </TabsContent>

                  <TabsContent value="completed" className="space-y-4">
                    {completedToday.length === 0 ? (
                      <div className="text-center py-12">
                        <Activity className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-600">No completed visits today</p>
                      </div>
                    ) : (
                      completedToday.map((completed) => (
                        <div key={completed.id} className="p-4 border rounded-lg bg-green-50">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <h4 className="font-semibold">{completed.farmerName}</h4>
                              </div>
                              <p className="text-sm text-gray-600">{completed.time} - {completed.livestock}</p>
                              <p className="text-sm text-gray-600">{completed.issue}</p>
                            </div>
                            <Button size="sm" variant="outline">
                              <FileText className="h-4 w-4 mr-1" />
                              View Report
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Availability Status */}
            <Card>
              <CardHeader>
                <CardTitle>Availability Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border-2 border-green-200">
                  <span className="text-sm font-medium">Current Status</span>
                  <Badge className="bg-green-600">Available</Badge>
                </div>
                <Button variant="outline" className="w-full">
                  Update Availability
                </Button>
              </CardContent>
            </Card>

            {/* Coverage Area */}
            <Card>
              <CardHeader>
                <CardTitle>Coverage Area</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <MapPin className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Nyagatare District</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <MapPin className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Gatsibo District</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <MapPin className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Kayonza District</span>
                </div>
                <Button variant="link" className="w-full text-green-600 p-0 h-auto mt-2">
                  Manage Coverage
                </Button>
              </CardContent>
            </Card>

            {/* Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>This Month</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Appointments</span>
                  <span className="font-bold text-lg">67</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Patients Treated</span>
                  <span className="font-bold text-lg">42</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Avg. Rating</span>
                  <span className="font-bold text-lg text-green-600">4.8/5.0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Response Time</span>
                  <span className="font-bold text-lg text-green-600">1.2 hrs</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Contact */}
            <Card>
              <CardHeader>
                <CardTitle>Emergency Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Phone className="mr-2 h-4 w-4" />
                  Call Emergency Line
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="mr-2 h-4 w-4" />
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Appointment Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
            <DialogDescription>Review patient information and complete visit</DialogDescription>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-600">Farmer Name</Label>
                  <p className="font-semibold">{selectedAppointment.farmerName}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Contact</Label>
                  <p className="font-semibold">{selectedAppointment.farmerPhone}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Livestock</Label>
                  <p className="font-semibold">{selectedAppointment.livestock}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Type</Label>
                  <p className="font-semibold">{selectedAppointment.livestockType}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Location</Label>
                  <p className="font-semibold">{selectedAppointment.location}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Time</Label>
                  <p className="font-semibold">{selectedAppointment.time}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Reported Issue</Label>
                <p className="p-3 bg-gray-50 rounded-lg mt-1">{selectedAppointment.issue}</p>
              </div>
              <div className="flex gap-3">
                <Button onClick={handleCompleteVisit} className="flex-1 bg-green-600 hover:bg-green-700">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Complete Visit
                </Button>
                <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Health Report Dialog */}
      <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Submit Health Report</DialogTitle>
            <DialogDescription>
              Document diagnosis, treatment, and recommendations
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitReport} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="diagnosis">Diagnosis *</Label>
              <Textarea
                id="diagnosis"
                placeholder="Describe the diagnosis..."
                value={reportForm.diagnosis}
                onChange={(e) => setReportForm({ ...reportForm, diagnosis: e.target.value })}
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="treatment">Treatment Provided *</Label>
              <Textarea
                id="treatment"
                placeholder="Describe the treatment given..."
                value={reportForm.treatment}
                onChange={(e) => setReportForm({ ...reportForm, treatment: e.target.value })}
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="prescription">Prescription (if any)</Label>
              <Textarea
                id="prescription"
                placeholder="List medications and dosages..."
                value={reportForm.prescription}
                onChange={(e) => setReportForm({ ...reportForm, prescription: e.target.value })}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="followUpDate">Follow-up Date (if needed)</Label>
              <Input
                id="followUpDate"
                type="date"
                value={reportForm.followUpDate}
                onChange={(e) => setReportForm({ ...reportForm, followUpDate: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                placeholder="Any additional observations or recommendations..."
                value={reportForm.notes}
                onChange={(e) => setReportForm({ ...reportForm, notes: e.target.value })}
                rows={3}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
                <FileText className="mr-2 h-4 w-4" />
                Submit Report
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsReportDialogOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}