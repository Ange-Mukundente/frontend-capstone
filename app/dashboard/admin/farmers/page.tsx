"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Search, User, Phone, MapPin, Calendar, Edit, Trash2, Eye, Filter } from "lucide-react"
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

interface Farmer {
  id: number
  name: string
  email: string
  phone: string
  district: string
  sector: string
  livestock: number
  joinedDate: string
  status: "active" | "inactive"
}

export default function ManageFarmers() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  // Demo farmers data
  const [farmers, setFarmers] = useState<Farmer[]>([
    {
      id: 1,
      name: "Mary Uwase",
      email: "mary@example.com",
      phone: "+250 788 123 456",
      district: "Kigali",
      sector: "Gasabo",
      livestock: 5,
      joinedDate: "2024-01-15",
      status: "active"
    },
    {
      id: 2,
      name: "John Mugisha",
      email: "john@example.com",
      phone: "+250 788 234 567",
      district: "Nyagatare",
      sector: "Karama",
      livestock: 8,
      joinedDate: "2024-02-20",
      status: "active"
    },
    {
      id: 3,
      name: "Jean Kamanzi",
      email: "jean@example.com",
      phone: "+250 788 345 678",
      district: "Gatsibo",
      sector: "Kiramuruzi",
      livestock: 3,
      joinedDate: "2024-03-10",
      status: "active"
    },
    {
      id: 4,
      name: "Alice Mukasine",
      email: "alice@example.com",
      phone: "+250 788 456 789",
      district: "Kigali",
      sector: "Kicukiro",
      livestock: 6,
      joinedDate: "2024-04-05",
      status: "active"
    },
    {
      id: 5,
      name: "Peter Habimana",
      email: "peter@example.com",
      phone: "+250 788 567 890",
      district: "Nyagatare",
      sector: "Rukomo",
      livestock: 4,
      joinedDate: "2024-05-12",
      status: "inactive"
    },
  ])

  const filteredFarmers = farmers.filter(farmer => {
    const matchesSearch = 
      farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.district.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === "all" || farmer.status === filterStatus

    return matchesSearch && matchesStatus
  })

  const handleViewDetails = (farmer: Farmer) => {
    setSelectedFarmer(farmer)
    setShowDetails(true)
  }

  const handleDelete = (farmerId: number) => {
    if (confirm("Are you sure you want to delete this farmer?")) {
      setFarmers(farmers.filter(f => f.id !== farmerId))
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
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
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Manage Farmers</h1>
                <p className="text-gray-600">View and manage all registered farmers</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6">
              <p className="text-sm text-gray-600 mb-1">Total Farmers</p>
              <p className="text-3xl font-bold text-blue-600">{farmers.length}</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-6">
              <p className="text-sm text-gray-600 mb-1">Active Farmers</p>
              <p className="text-3xl font-bold text-green-600">{farmers.filter(f => f.status === "active").length}</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-6">
              <p className="text-sm text-gray-600 mb-1">Total Livestock</p>
              <p className="text-3xl font-bold text-purple-600">{farmers.reduce((sum, f) => sum + f.livestock, 0)}</p>
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
                    placeholder="Search by name, email, or district..."
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

        {/* Farmers Table */}
        <Card className="shadow-lg border-0">
          <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-white">
            <CardTitle>Farmers List</CardTitle>
            <CardDescription>
              Showing {filteredFarmers.length} of {farmers.length} farmers
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Farmer</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Livestock</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredFarmers.map((farmer) => (
                    <tr key={farmer.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{farmer.name}</p>
                          <p className="text-sm text-gray-500">{farmer.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="w-4 h-4" />
                          {farmer.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <div>
                            <p>{farmer.district}</p>
                            <p className="text-xs text-gray-500">{farmer.sector}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-900">{farmer.livestock}</span>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={
                          farmer.status === "active" 
                            ? "bg-green-100 text-green-700" 
                            : "bg-gray-100 text-gray-700"
                        }>
                          {farmer.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleViewDetails(farmer)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(farmer.id)}
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
              <DialogTitle>Farmer Details</DialogTitle>
            </DialogHeader>
            {selectedFarmer && (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Full Name</p>
                    <p className="font-semibold">{selectedFarmer.name}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Email</p>
                    <p className="font-semibold">{selectedFarmer.email}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Phone</p>
                    <p className="font-semibold">{selectedFarmer.phone}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">District</p>
                    <p className="font-semibold">{selectedFarmer.district}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Sector</p>
                    <p className="font-semibold">{selectedFarmer.sector}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Livestock Count</p>
                    <p className="font-semibold">{selectedFarmer.livestock}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Joined Date</p>
                    <p className="font-semibold">{formatDate(selectedFarmer.joinedDate)}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Status</p>
                    <Badge className={
                      selectedFarmer.status === "active" 
                        ? "bg-green-100 text-green-700" 
                        : "bg-gray-100 text-gray-700"
                    }>
                      {selectedFarmer.status}
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