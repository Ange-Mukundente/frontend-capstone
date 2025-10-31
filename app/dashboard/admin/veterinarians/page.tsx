"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Search, Stethoscope, Phone, MapPin, Calendar, Edit, Trash2, Eye, Filter, Award, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Veterinarian {
  id: number
  name: string
  email: string
  phone: string
  district: string
  sector: string
  specialization: string
  animalPatients: number
  joinedDate: string
  status: "active" | "inactive"
  rating: number
}

export default function ManageVeterinarians() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedVet, setSelectedVet] = useState<Veterinarian | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  // Demo veterinarians data
  const [vets, setVets] = useState<Veterinarian[]>([
    {
      id: 1,
      name: "Dr. Sarah Mukamana",
      email: "sarah@vetconnect.rw",
      phone: "+250 788 111 111",
      district: "Kigali",
      sector: "Gasabo",
      specialization: "Large Animals",
      animalPatients: 24,
      joinedDate: "2023-06-15",
      status: "active",
      rating: 4.8
    },
    {
      id: 2,
      name: "Dr. Paul Nkusi",
      email: "paul@vetconnect.rw",
      phone: "+250 788 222 222",
      district: "Nyagatare",
      sector: "Karama",
      specialization: "Cattle Specialist",
      animalPatients: 32,
      joinedDate: "2023-07-20",
      status: "active",
      rating: 4.9
    },
    {
      id: 3,
      name: "Dr. Grace Uwera",
      email: "grace@vetconnect.rw",
      phone: "+250 788 333 333",
      district: "Gatsibo",
      sector: "Kiramuruzi",
      specialization: "General Practice",
      animalPatients: 18,
      joinedDate: "2023-08-10",
      status: "active",
      rating: 4.7
    },
    {
      id: 4,
      name: "Dr. Jean Kamanzi",
      email: "jean@vetconnect.rw",
      phone: "+250 788 444 444",
      district: "Kigali",
      sector: "Kicukiro",
      specialization: "Small Animals",
      animalPatients: 15,
      joinedDate: "2023-09-05",
      status: "active",
      rating: 4.6
    },
    {
      id: 5,
      name: "Dr. Eric Habimana",
      email: "eric@vetconnect.rw",
      phone: "+250 788 555 555",
      district: "Nyagatare",
      sector: "Rukomo",
      specialization: "Poultry Specialist",
      animalPatients: 12,
      joinedDate: "2023-10-12",
      status: "inactive",
      rating: 4.5
    },
  ])

  const filteredVets = vets.filter(vet => {
    const matchesSearch = 
      vet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vet.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vet.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vet.district.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === "all" || vet.status === filterStatus

    return matchesSearch && matchesStatus
  })

  const handleViewDetails = (vet: Veterinarian) => {
    setSelectedVet(vet)
    setShowDetails(true)
  }

  const handleDelete = (vetId: number) => {
    if (confirm("Are you sure you want to delete this veterinarian?")) {
      setVets(vets.filter(v => v.id !== vetId))
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-600 to-blue-600 flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Manage Veterinarians</h1>
                <p className="text-gray-600">View and manage all registered veterinarians</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-4 gap-4 mb-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-6">
              <p className="text-sm text-gray-600 mb-1">Total Vets</p>
              <p className="text-3xl font-bold text-green-600">{vets.length}</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6">
              <p className="text-sm text-gray-600 mb-1">Active Vets</p>
              <p className="text-3xl font-bold text-blue-600">{vets.filter(v => v.status === "active").length}</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-6">
              <p className="text-sm text-gray-600 mb-1">Total Animal Patients</p>
              <p className="text-3xl font-bold text-purple-600">{vets.reduce((sum, v) => sum + v.animalPatients, 0)}</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-yellow-100">
            <CardContent className="p-6">
              <p className="text-sm text-gray-600 mb-1">Avg Rating</p>
              <p className="text-3xl font-bold text-yellow-600">
                {(vets.reduce((sum, v) => sum + v.rating, 0) / vets.length).toFixed(1)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6 shadow-lg border-0">
          <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-white">
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              Filter & Search
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search by name, email, specialization, or district..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterStatus === "all" ? "default" : "outline"}
                  onClick={() => setFilterStatus("all")}
                  className="flex-1"
                >
                  All
                </Button>
                <Button
                  variant={filterStatus === "active" ? "default" : "outline"}
                  onClick={() => setFilterStatus("active")}
                  className="flex-1"
                >
                  Active
                </Button>
                <Button
                  variant={filterStatus === "inactive" ? "default" : "outline"}
                  onClick={() => setFilterStatus("inactive")}
                  className="flex-1"
                >
                  Inactive
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vets Table */}
        <Card className="shadow-lg border-0">
          <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-white">
            <CardTitle>Veterinarians List</CardTitle>
            <CardDescription>
              Showing {filteredVets.length} of {vets.length} veterinarians
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Veterinarian</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Specialization</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Animal Patients</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Rating</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredVets.map((vet) => (
                    <tr key={vet.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{vet.name}</p>
                          <p className="text-sm text-gray-500">{vet.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="w-4 h-4" />
                          {vet.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <div>
                            <p>{vet.district}</p>
                            <p className="text-xs text-gray-500">{vet.sector}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className="bg-blue-100 text-blue-700">
                          {vet.specialization}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-sm font-medium text-gray-900">
                          <Users className="w-4 h-4 text-gray-400" />
                          {vet.animalPatients}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-sm font-medium text-yellow-600">
                          <Award className="w-4 h-4" />
                          {vet.rating}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={
                          vet.status === "active" 
                            ? "bg-green-100 text-green-700" 
                            : "bg-gray-100 text-gray-700"
                        }>
                          {vet.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleViewDetails(vet)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(vet.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Details Modal */}
        <Dialog open={showDetails} onOpenChange={setShowDetails}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Veterinarian Details</DialogTitle>
            </DialogHeader>
            {selectedVet && (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Full Name</p>
                    <p className="font-semibold">{selectedVet.name}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Email</p>
                    <p className="font-semibold">{selectedVet.email}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Phone</p>
                    <p className="font-semibold">{selectedVet.phone}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">District</p>
                    <p className="font-semibold">{selectedVet.district}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Sector</p>
                    <p className="font-semibold">{selectedVet.sector}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Specialization</p>
                    <Badge className="bg-blue-100 text-blue-700">
                      {selectedVet.specialization}
                    </Badge>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Total Animal Patients</p>
                    <p className="font-semibold">{selectedVet.animalPatients}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Rating</p>
                    <div className="flex items-center gap-1">
                      <Award className="w-4 h-4 text-yellow-600" />
                      <span className="font-semibold">{selectedVet.rating}</span>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Joined Date</p>
                    <p className="font-semibold">{formatDate(selectedVet.joinedDate)}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Status</p>
                    <Badge className={
                      selectedVet.status === "active" 
                        ? "bg-green-100 text-green-700" 
                        : "bg-gray-100 text-gray-700"
                    }>
                      {selectedVet.status}
                    </Badge>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}