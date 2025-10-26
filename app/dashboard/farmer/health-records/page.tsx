"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Calendar, FileText, Activity, Pill, Filter, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"

interface Livestock {
  id: number
  name: string
}

interface HealthRecord {
  id: number
  livestockId: number
  livestockName: string
  date: string
  type: "vaccination" | "treatment" | "checkup" | string
  title: string
  vetName: string
  notes: string
  medications: string[]
}

export default function HealthRecords() {
  const router = useRouter()
  const [selectedLivestock, setSelectedLivestock] = useState<string>("all")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [livestock, setLivestock] = useState<Livestock[]>([])

  // Load livestock from localStorage
  useEffect(() => {
    const loadLivestock = () => {
      try {
        const storedLivestock = localStorage.getItem("livestock")
        if (storedLivestock && storedLivestock !== "undefined") {
          setLivestock(JSON.parse(storedLivestock))
        } else {
          const defaultLivestock: Livestock[] = [
            { id: 1, name: "Cow #1" },
            { id: 2, name: "Cow #2" },
            { id: 3, name: "Goat #1" }
          ]
          setLivestock(defaultLivestock)
        }
      } catch (error) {
        console.error("Error loading livestock:", error)
        setLivestock([
          { id: 1, name: "Cow #1" },
          { id: 2, name: "Cow #2" },
          { id: 3, name: "Goat #1" }
        ])
      }
    }

    loadLivestock()
  }, [])

  const healthRecords: HealthRecord[] = [
    {
      id: 1,
      livestockId: 1,
      livestockName: "Cow #1",
      date: "2025-10-15",
      type: "vaccination",
      title: "FMD Vaccination",
      vetName: "Dr. Sarah Mukamana",
      notes: "First dose administered. Next dose due in 6 months.",
      medications: ["FMD Vaccine - 2ml"]
    },
    {
      id: 2,
      livestockId: 1,
      livestockName: "Cow #1",
      date: "2025-09-20",
      type: "checkup",
      title: "Routine Health Checkup",
      vetName: "Dr. Paul Nkusi",
      notes: "Animal in good health. Weight: 455kg. Temperature normal.",
      medications: []
    },
    {
      id: 3,
      livestockId: 2,
      livestockName: "Cow #2",
      date: "2025-10-10",
      type: "treatment",
      title: "Treatment for Fever",
      vetName: "Dr. Grace Uwera",
      notes: "Fever detected. Started antibiotic treatment. Follow-up in 3 days.",
      medications: ["Penicillin - 5ml", "Anti-inflammatory - 10ml"]
    },
    {
      id: 4,
      livestockId: 3,
      livestockName: "Goat #1",
      date: "2025-10-05",
      type: "vaccination",
      title: "PPR Vaccination",
      vetName: "Dr. Sarah Mukamana",
      notes: "PPR vaccine administered successfully.",
      medications: ["PPR Vaccine - 1ml"]
    }
  ]

  // Filter records based on all criteria
  const filteredRecords = healthRecords.filter(record => {
    const matchesLivestock = selectedLivestock === "all" || record.livestockId === parseInt(selectedLivestock)
    const matchesType = selectedType === "all" || record.type === selectedType
    const matchesSearch = searchQuery === "" || 
      record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.vetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.notes.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesLivestock && matchesType && matchesSearch
  })

  const getRecordIcon = (type: string) => {
    switch(type) {
      case "vaccination": return <Pill className="w-5 h-5 text-blue-600" />
      case "treatment": return <Activity className="w-5 h-5 text-red-600" />
      case "checkup": return <FileText className="w-5 h-5 text-green-600" />
      default: return <FileText className="w-5 h-5 text-gray-600" />
    }
  }

  const getRecordBadge = (type: string) => {
    switch(type) {
      case "vaccination": return <Badge className="bg-blue-500 hover:bg-blue-600">Vaccination</Badge>
      case "treatment": return <Badge className="bg-red-500 hover:bg-red-600">Treatment</Badge>
      case "checkup": return <Badge className="bg-green-500 hover:bg-green-600">Checkup</Badge>
      default: return <Badge>Other</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Health Records</h1>
            <p className="text-gray-600">Track and manage medical history for your livestock</p>
          </div>
        </div>

        {/* Filters Section */}
        <Card className="mb-6 shadow-md border-gray-200">
          <CardHeader className="border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <CardTitle className="text-lg">Filter Records</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search by title, vet, or notes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Livestock Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Livestock</label>
                <Select value={selectedLivestock} onValueChange={setSelectedLivestock}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select livestock" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Livestock</SelectItem>
                    {livestock.map(animal => (
                      <SelectItem key={animal.id} value={animal.id.toString()}>
                        {animal.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Record Type Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Record Type</label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="vaccination">Vaccination</SelectItem>
                    <SelectItem value="treatment">Treatment</SelectItem>
                    <SelectItem value="checkup">Checkup</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Filters Summary */}
            {(selectedLivestock !== "all" || selectedType !== "all" || searchQuery !== "") && (
              <div className="mt-4 flex items-center gap-2 text-sm">
                <span className="text-gray-600">Active filters:</span>
                {selectedLivestock !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    Livestock: {livestock.find(l => l.id.toString() === selectedLivestock)?.name}
                  </Badge>
                )}
                {selectedType !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    Type: {selectedType}
                  </Badge>
                )}
                {searchQuery !== "" && (
                  <Badge variant="secondary" className="gap-1">
                    Search: "{searchQuery}"
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedLivestock("all")
                    setSelectedType("all")
                    setSearchQuery("")
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
        <div className="mb-4 text-sm text-gray-600">
          Showing <span className="font-semibold text-gray-900">{filteredRecords.length}</span> of{" "}
          <span className="font-semibold text-gray-900">{healthRecords.length}</span> records
        </div>

        {/* Records List */}
        <div className="space-y-4">
          {filteredRecords.length === 0 ? (
            <Card className="shadow-md border-gray-200">
              <CardContent className="py-16 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">No health records found</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {livestock.length === 0 
                    ? "Add livestock first to start tracking health records"
                    : "No records match your current filters. Try adjusting your search criteria."}
                </p>
                {livestock.length === 0 && (
                  <Button 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => router.push('/dashboard/farmer/livestock')}
                  >
                    Add Livestock First
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredRecords.map(record => (
              <Card key={record.id} className="hover:shadow-xl transition-all duration-200 border-gray-200 bg-white">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center flex-shrink-0 border border-gray-200">
                      {getRecordIcon(record.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold mb-1 text-gray-900">{record.title}</h3>
                          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                            <span className="font-medium text-gray-700">{record.livestockName}</span>
                            <span className="text-gray-400">•</span>
                            <span>{record.vetName}</span>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          {getRecordBadge(record.type)}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(record.date)}</span>
                      </div>

                      <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-lg p-4 mb-4">
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {record.notes}
                        </p>
                      </div>

                      {record.medications.length > 0 && (
                        <div className="border-t border-gray-100 pt-4">
                          <div className="flex items-center gap-2 mb-3">
                            <Pill className="w-4 h-4 text-gray-600" />
                            <h4 className="text-sm font-semibold text-gray-900">Medications Administered</h4>
                          </div>
                          <ul className="space-y-2">
                            {record.medications.map((med, index) => (
                              <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0"></span>
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
            ))
          )}
        </div>
      </div>
    </div>
  )
}