"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Search, FileText, Calendar, Pill, Activity, Filter, User, Stethoscope, ChevronLeft, ChevronRight, X } from "lucide-react"
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

export default function VetLivestockRecords() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterCondition, setFilterCondition] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedAnimal, setSelectedAnimal] = useState(null)
  const [showRecords, setShowRecords] = useState(false)
  const itemsPerPage = 4

  const livestock = [
    {
      id: 1,
      name: "Cow #1",
      type: "Cattle",
      breed: "Friesian",
      age: "4 years",
      farmerName: "Mary Uwase",
      lastVisit: "2025-10-18",
      condition: "Healthy",
      weight: "455kg"
    },
    {
      id: 2,
      name: "Cow #2",
      type: "Cattle",
      breed: "Jersey",
      age: "3 years",
      farmerName: "Mary Uwase",
      lastVisit: "2025-10-15",
      condition: "Under Treatment",
      weight: "420kg"
    },
    {
      id: 3,
      name: "Goat #1",
      type: "Goat",
      breed: "Boer",
      age: "2 years",
      farmerName: "John Mugisha",
      lastVisit: "2025-10-17",
      condition: "Healthy",
      weight: "45kg"
    },
    {
      id: 4,
      name: "Sheep #1",
      type: "Sheep",
      breed: "Merino",
      age: "1 year",
      farmerName: "Jean Kamanzi",
      lastVisit: "2025-10-14",
      condition: "Follow-up Required",
      weight: "35kg"
    },
    {
      id: 5,
      name: "Pig #1",
      type: "Pig",
      breed: "Large White",
      age: "1.5 years",
      farmerName: "Alice Mukasine",
      lastVisit: "2025-10-13",
      condition: "Under Treatment",
      weight: "95kg"
    },
    {
      id: 6,
      name: "Chicken Flock #1",
      type: "Poultry",
      breed: "Rhode Island Red",
      age: "6 months",
      farmerName: "Peter Habimana",
      lastVisit: "2025-10-12",
      condition: "Healthy",
      weight: "50 birds"
    }
  ]

  const allRecords = [
    {
      id: 1,
      livestockId: 1,
      date: "2025-10-18",
      type: "vaccination",
      title: "FMD Vaccination",
      vetName: "Dr. Sarah Mukamana",
      notes: "First dose administered. Next dose due in 6 months.",
      medications: ["FMD Vaccine - 2ml"]
    },
    {
      id: 2,
      livestockId: 1,
      date: "2025-09-20",
      type: "checkup",
      title: "Routine Health Checkup",
      vetName: "Dr. Paul Nkusi",
      notes: "Animal in good health. Weight: 455kg. Temperature normal.",
      medications: []
    },
    {
      id: 3,
      livestockId: 1,
      date: "2025-08-15",
      type: "treatment",
      title: "Minor Hoof Trimming",
      vetName: "Dr. Sarah Mukamana",
      notes: "Routine hoof maintenance completed successfully.",
      medications: []
    },
    {
      id: 4,
      livestockId: 1,
      date: "2025-07-10",
      type: "vaccination",
      title: "Brucellosis Vaccination",
      vetName: "Dr. Paul Nkusi",
      notes: "Annual vaccination administered.",
      medications: ["Brucellosis Vaccine - 2ml"]
    },
    {
      id: 5,
      livestockId: 1,
      date: "2025-06-05",
      type: "checkup",
      title: "Pre-breeding Examination",
      vetName: "Dr. Sarah Mukamana",
      notes: "Animal cleared for breeding. All parameters normal.",
      medications: []
    },
    {
      id: 6,
      livestockId: 2,
      date: "2025-10-15",
      type: "treatment",
      title: "Treatment for Fever",
      vetName: "Dr. Grace Uwera",
      notes: "Fever detected. Started antibiotic treatment. Follow-up in 3 days.",
      medications: ["Penicillin - 5ml", "Anti-inflammatory - 10ml"]
    },
    {
      id: 7,
      livestockId: 2,
      date: "2025-10-12",
      type: "checkup",
      title: "Fever Diagnosis",
      vetName: "Dr. Grace Uwera",
      notes: "Temperature elevated at 40.2°C. Started monitoring.",
      medications: []
    },
    {
      id: 8,
      livestockId: 2,
      date: "2025-09-08",
      type: "vaccination",
      title: "Lumpy Skin Disease Vaccine",
      vetName: "Dr. Paul Nkusi",
      notes: "LSD vaccination completed successfully.",
      medications: ["LSD Vaccine - 2ml"]
    },
    {
      id: 9,
      livestockId: 2,
      date: "2025-08-20",
      type: "checkup",
      title: "Routine Health Assessment",
      vetName: "Dr. Sarah Mukamana",
      notes: "General health good. Weight: 415kg.",
      medications: []
    },
    {
      id: 10,
      livestockId: 2,
      date: "2025-07-15",
      type: "treatment",
      title: "Mastitis Treatment",
      vetName: "Dr. Grace Uwera",
      notes: "Mild mastitis in rear left quarter. Treatment completed.",
      medications: ["Antibiotic Intramammary - 10ml", "Anti-inflammatory - 5ml"]
    },
    {
      id: 11,
      livestockId: 3,
      date: "2025-10-17",
      type: "vaccination",
      title: "PPR Vaccination",
      vetName: "Dr. Sarah Mukamana",
      notes: "PPR vaccine administered successfully.",
      medications: ["PPR Vaccine - 1ml"]
    },
    {
      id: 12,
      livestockId: 3,
      date: "2025-09-12",
      type: "checkup",
      title: "Weight Check",
      vetName: "Dr. Paul Nkusi",
      notes: "Good weight gain. Currently at 45kg.",
      medications: []
    },
    {
      id: 13,
      livestockId: 3,
      date: "2025-08-05",
      type: "treatment",
      title: "Deworming",
      vetName: "Dr. Sarah Mukamana",
      notes: "Routine deworming completed.",
      medications: ["Albendazole - 5ml"]
    },
    {
      id: 14,
      livestockId: 4,
      date: "2025-10-14",
      type: "checkup",
      title: "Follow-up Examination",
      vetName: "Dr. Jean Kamanzi",
      notes: "Recovering well from previous treatment. Follow-up needed in 2 weeks.",
      medications: []
    },
    {
      id: 15,
      livestockId: 4,
      date: "2025-10-01",
      type: "treatment",
      title: "Respiratory Infection Treatment",
      vetName: "Dr. Jean Kamanzi",
      notes: "Mild respiratory infection detected. Treatment initiated.",
      medications: ["Oxytetracycline - 3ml", "Vitamin supplement"]
    },
    {
      id: 17,
      livestockId: 5,
      date: "2025-10-13",
      type: "treatment",
      title: "Skin Infection Treatment",
      vetName: "Dr. Grace Uwera",
      notes: "Bacterial skin infection detected. Antibiotic treatment started.",
      medications: ["Penicillin - 5ml", "Topical antiseptic cream"]
    },
    {
      id: 18,
      livestockId: 5,
      date: "2025-09-18",
      type: "checkup",
      title: "Weight Assessment",
      vetName: "Dr. Paul Nkusi",
      notes: "Good weight at 95kg. Health parameters normal.",
      medications: []
    },
    {
      id: 19,
      livestockId: 5,
      date: "2025-08-25",
      type: "vaccination",
      title: "Swine Fever Vaccination",
      vetName: "Dr. Sarah Mukamana",
      notes: "Annual swine fever vaccine administered.",
      medications: ["Swine Fever Vaccine - 2ml"]
    },
    {
      id: 20,
      livestockId: 6,
      date: "2025-10-12",
      type: "checkup",
      title: "Flock Health Inspection",
      vetName: "Dr. Jean Kamanzi",
      notes: "All birds appear healthy. Good egg production rate.",
      medications: []
    },
    {
      id: 21,
      livestockId: 6,
      date: "2025-09-20",
      type: "vaccination",
      title: "Newcastle Disease Vaccination",
      vetName: "Dr. Sarah Mukamana",
      notes: "Newcastle disease vaccine administered to entire flock via drinking water.",
      medications: ["Newcastle Vaccine - 50 doses"]
    },
    {
      id: 22,
      livestockId: 6,
      date: "2025-08-15",
      type: "treatment",
      title: "Deworming Treatment",
      vetName: "Dr. Paul Nkusi",
      notes: "Routine flock deworming completed.",
      medications: ["Piperazine - oral solution"]
    }
  ]

  const filteredLivestock = livestock.filter(animal => {
    const matchesSearch = 
      animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      animal.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      animal.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      animal.breed.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = filterType === "all" || animal.type === filterType
    const matchesCondition = filterCondition === "all" || animal.condition === filterCondition

    return matchesSearch && matchesType && matchesCondition
  })

  // Pagination
  const totalPages = Math.ceil(filteredLivestock.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentLivestock = filteredLivestock.slice(startIndex, endIndex)

  const getRecordsByAnimalId = (animalId) => {
    return allRecords.filter(record => record.livestockId === animalId)
  }

  const getConditionBadge = (condition) => {
    switch(condition) {
      case "Healthy":
        return <Badge className="bg-green-500 hover:bg-green-600">Healthy</Badge>
      case "Under Treatment":
        return <Badge className="bg-orange-500 hover:bg-orange-600">Under Treatment</Badge>
      case "Follow-up Required":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Follow-up Required</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  const getRecordBadge = (type) => {
    switch(type) {
      case "vaccination":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Vaccination</Badge>
      case "treatment":
        return <Badge className="bg-red-500 hover:bg-red-600">Treatment</Badge>
      case "checkup":
        return <Badge className="bg-green-500 hover:bg-green-600">Checkup</Badge>
      default:
        return <Badge>Other</Badge>
    }
  }

  const getRecordIcon = (type) => {
    switch(type) {
      case "vaccination": return <Pill className="w-4 h-4 text-blue-600" />
      case "treatment": return <Activity className="w-4 h-4 text-red-600" />
      case "checkup": return <FileText className="w-4 h-4 text-green-600" />
      default: return <FileText className="w-4 h-4 text-gray-600" />
    }
  }

  const getAnimalTypes = () => {
    const types = [...new Set(livestock.map(animal => animal.type))]
    return types.sort()
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  const handleViewRecords = (animal) => {
    setSelectedAnimal(animal)
    setShowRecords(true)
  }

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="mb-4 hover:bg-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Livestock Records</h1>
                <p className="text-gray-600">Manage and track all livestock under your care</p>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="space-y-2 md:col-span-3">
                <label className="text-sm font-medium text-gray-700">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search by name, farmer, type, or breed..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Animal Type Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Animal Type</label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {getAnimalTypes().map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Condition Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Health Status</label>
                <Select value={filterCondition} onValueChange={setFilterCondition}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Healthy">Healthy</SelectItem>
                    <SelectItem value="Under Treatment">Under Treatment</SelectItem>
                    <SelectItem value="Follow-up Required">Follow-up Required</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Quick Actions */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Quick Actions</label>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    setSearchTerm("")
                    setFilterType("all")
                    setFilterCondition("all")
                    setCurrentPage(1)
                  }}
                >
                  Clear All Filters
                </Button>
              </div>
            </div>

            {/* Active Filters Display */}
            {(searchTerm || filterType !== "all" || filterCondition !== "all") && (
              <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                <span className="text-gray-600 font-medium">Active:</span>
                {searchTerm && (
                  <Badge variant="secondary">Search: "{searchTerm}"</Badge>
                )}
                {filterType !== "all" && (
                  <Badge variant="secondary">Type: {filterType}</Badge>
                )}
                {filterCondition !== "all" && (
                  <Badge variant="secondary">Status: {filterCondition}</Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-4 text-sm text-gray-600 flex items-center justify-between">
          <span>
            Showing <span className="font-semibold text-gray-900">{startIndex + 1}-{Math.min(endIndex, filteredLivestock.length)}</span> of{" "}
            <span className="font-semibold text-gray-900">{filteredLivestock.length}</span> animals
          </span>
          {totalPages > 1 && (
            <span className="text-gray-600">
              Page <span className="font-semibold text-gray-900">{currentPage}</span> of{" "}
              <span className="font-semibold text-gray-900">{totalPages}</span>
            </span>
          )}
        </div>

        {/* Livestock Cards Grid - 2 columns layout */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {currentLivestock.length === 0 ? (
            <Card className="col-span-full shadow-md border-gray-200">
              <CardContent className="py-16 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">No animals found</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Try adjusting your search criteria or filters to find livestock records
                </p>
              </CardContent>
            </Card>
          ) : (
            currentLivestock.map((animal) => {
              const records = getRecordsByAnimalId(animal.id)
              return (
                <Card key={animal.id} className="hover:shadow-xl transition-all duration-200 border-gray-200 bg-white">
                  <CardContent className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">{animal.name}</h3>
                        <p className="text-sm text-gray-600">{animal.type} • {animal.breed}</p>
                        <p className="text-xs text-gray-500 mt-1">{animal.age} • {animal.weight}</p>
                      </div>
                      <div className="flex-shrink-0 ml-2">
                        {getConditionBadge(animal.condition)}
                      </div>
                    </div>

                    {/* Farmer Info */}
                    <div className="mb-4 p-3 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg border border-blue-100">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="w-4 h-4 text-gray-600" />
                        <span className="text-gray-600">Owner:</span>
                        <span className="font-medium text-gray-900">{animal.farmerName}</span>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-2 mb-4 text-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>Last Visit:</span>
                        </div>
                        <span className="font-medium text-gray-900">{formatDate(animal.lastVisit)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-gray-600">
                          <FileText className="w-4 h-4" />
                          <span>Medical Records:</span>
                        </div>
                        <span className="font-medium text-gray-900">{records.length}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-4 border-t border-gray-100">
                      <Button 
                        size="sm" 
                        className="w-full bg-green-600 hover:bg-green-700"
                        onClick={() => handleViewRecords(animal)}
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        View All Records ({records.length})
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
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

        {/* Records Modal */}
        <Dialog open={showRecords} onOpenChange={setShowRecords}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900">{selectedAnimal?.name}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    {selectedAnimal?.type} • {selectedAnimal?.breed} • Owner: {selectedAnimal?.farmerName}
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowRecords(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </DialogTitle>
            </DialogHeader>
            
            <div className="mt-4 space-y-3">
              {selectedAnimal && getRecordsByAnimalId(selectedAnimal.id).map((record) => (
                <Card key={record.id} className="border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center flex-shrink-0 border border-gray-200">
                        {getRecordIcon(record.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-900">{record.title}</h4>
                            <p className="text-sm text-gray-600">{record.vetName}</p>
                          </div>
                          {getRecordBadge(record.type)}
                        </div>
                        
                        <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(record.date)}</span>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-3 mb-3">
                          <p className="text-sm text-gray-700">{record.notes}</p>
                        </div>
                        
                        {record.medications.length > 0 && (
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Pill className="w-3 h-3 text-gray-600" />
                              <h5 className="text-xs font-semibold text-gray-900">Medications</h5>
                            </div>
                            <ul className="space-y-1">
                              {record.medications.map((med, index) => (
                                <li key={index} className="flex items-center gap-2 text-xs text-gray-700">
                                  <span className="w-1 h-1 rounded-full bg-blue-500"></span>
                                  <span>{med}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}