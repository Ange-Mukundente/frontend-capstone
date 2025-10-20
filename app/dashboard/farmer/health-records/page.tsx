"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Calendar, FileText, Activity, Pill } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function HealthRecords() {
  const router = useRouter()
  const [selectedLivestock, setSelectedLivestock] = useState("all")
  const [livestock, setLivestock] = useState([])

  // Load livestock from localStorage
  useEffect(() => {
    const loadLivestock = () => {
      try {
        const storedLivestock = localStorage.getItem("livestock")
        if (storedLivestock && storedLivestock !== "undefined") {
          const parsedLivestock = JSON.parse(storedLivestock)
          setLivestock(parsedLivestock)
        } else {
          // Default livestock if none exists
          const defaultLivestock = [
            { id: 1, name: "Cow #1" },
            { id: 2, name: "Cow #2" },
            { id: 3, name: "Goat #1" }
          ]
          setLivestock(defaultLivestock)
        }
      } catch (error) {
        console.error("Error loading livestock:", error)
        // Fallback to default data
        setLivestock([
          { id: 1, name: "Cow #1" },
          { id: 2, name: "Cow #2" },
          { id: 3, name: "Goat #1" }
        ])
      }
    }

    loadLivestock()
  }, [])

  const healthRecords = [
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

  const filteredRecords = selectedLivestock === "all" 
    ? healthRecords 
    : healthRecords.filter(r => r.livestockId === parseInt(selectedLivestock))

  const getRecordIcon = (type) => {
    switch(type) {
      case "vaccination":
        return <Pill className="w-5 h-5 text-blue-600" />
      case "treatment":
        return <Activity className="w-5 h-5 text-red-600" />
      case "checkup":
        return <FileText className="w-5 h-5 text-green-600" />
      default:
        return <FileText className="w-5 h-5 text-gray-600" />
    }
  }

  const getRecordBadge = (type) => {
    switch(type) {
      case "vaccination":
        return <Badge className="bg-blue-500">Vaccination</Badge>
      case "treatment":
        return <Badge className="bg-red-500">Treatment</Badge>
      case "checkup":
        return <Badge className="bg-green-500">Checkup</Badge>
      default:
        return <Badge>Other</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Health Records</h1>
            <p className="text-gray-600 mt-2">View medical history for your livestock</p>
          </div>
        </div>

        {/* Filter by Livestock */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filter by Livestock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedLivestock === "all" ? "default" : "outline"}
                onClick={() => setSelectedLivestock("all")}
              >
                All Livestock
              </Button>
              {livestock.length > 0 ? (
                livestock.map(animal => (
                  <Button
                    key={animal.id}
                    variant={selectedLivestock === animal.id.toString() ? "default" : "outline"}
                    onClick={() => setSelectedLivestock(animal.id.toString())}
                  >
                    {animal.name}
                  </Button>
                ))
              ) : (
                <p className="text-sm text-gray-500 py-2">No livestock found. Add livestock to see filters.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Records List */}
        <div className="space-y-4">
          {filteredRecords.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No health records found</h3>
                <p className="text-gray-600 mb-4">There are no health records for the selected livestock</p>
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
              <Card key={record.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                      {getRecordIcon(record.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold mb-1">{record.title}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span>{record.livestockName}</span>
                            <span>•</span>
                            <span>{record.vetName}</span>
                          </div>
                        </div>
                        {getRecordBadge(record.type)}
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                        <Calendar className="w-4 h-4" />
                        <span>{record.date}</span>
                      </div>

                      <p className="text-sm text-gray-700 mb-3 p-3 bg-gray-50 rounded-lg">
                        {record.notes}
                      </p>

                      {record.medications.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold mb-2">Medications:</h4>
                          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                            {record.medications.map((med, index) => (
                              <li key={index}>{med}</li>
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