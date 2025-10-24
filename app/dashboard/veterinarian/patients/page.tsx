"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Search, FileText, Calendar, Pill, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

export default function VetPatients() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")

  const patients = [
    {
      id: 1,
      livestockName: "Cow #1",
      livestockType: "Cattle",
      breed: "Friesian",
      farmerName: "Mary",
      lastVisit: "2025-10-18",
      condition: "Healthy",
      records: 5
    },
    {
      id: 2,
      livestockName: "Cow #2",
      livestockType: "Cattle",
      breed: "Jersey",
      farmerName: "Mary",
      lastVisit: "2025-10-15",
      condition: "Under Treatment",
      records: 8
    },
    {
      id: 3,
      livestockName: "Goat #1",
      livestockType: "Goat",
      breed: "Boer",
      farmerName: "John Doe",
      lastVisit: "2025-10-17",
      condition: "Healthy",
      records: 3
    },
    {
      id: 4,
      livestockName: "Cow #5",
      livestockType: "Cattle",
      breed: "Holstein",
      farmerName: "Jane Smith",
      lastVisit: "2025-10-16",
      condition: "Follow-up Needed",
      records: 6
    }
  ]

  const filteredPatients = patients.filter(patient =>
    patient.livestockName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.livestockType.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getConditionBadge = (condition) => {
    switch(condition) {
      case "Healthy":
        return <Badge className="bg-green-500">Healthy</Badge>
      case "Under Treatment":
        return <Badge className="bg-orange-500">Under Treatment</Badge>
      case "Follow-up Needed":
        return <Badge className="bg-yellow-500">Follow-up Needed</Badge>
      default:
        return <Badge>Unknown</Badge>
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
          <div className="flex-1">
            <h1 className="text-3xl font-bold">Patient Records</h1>
            <p className="text-gray-600 mt-2">View and manage livestock medical records</p>
          </div>
        </div>

        {/* Search Bar */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search by livestock name, farmer, or type..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Patients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{patients.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Healthy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {patients.filter(p => p.condition === "Healthy").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Under Treatment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {patients.filter(p => p.condition === "Under Treatment").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Follow-ups</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {patients.filter(p => p.condition === "Follow-up Needed").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Patients List */}
        <div className="grid md:grid-cols-2 gap-4">
          {filteredPatients.length === 0 ? (
            <Card className="col-span-2">
              <CardContent className="py-12 text-center">
                <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No patients found</h3>
                <p className="text-gray-600">Try adjusting your search criteria</p>
              </CardContent>
            </Card>
          ) : (
            filteredPatients.map((patient) => (
              <Card key={patient.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-1">{patient.livestockName}</h3>
                      <p className="text-sm text-gray-600">{patient.livestockType} - {patient.breed}</p>
                      <p className="text-sm text-gray-500 mt-1">Owner: {patient.farmerName}</p>
                    </div>
                    {getConditionBadge(patient.condition)}
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-gray-600" />
                      <span className="text-gray-600">Last Visit:</span>
                      <span className="font-medium">{patient.lastVisit}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <FileText className="w-4 h-4 text-gray-600" />
                      <span className="text-gray-600">Medical Records:</span>
                      <span className="font-medium">{patient.records}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <FileText className="w-4 h-4 mr-1" />
                      View Records
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Pill className="w-4 h-4 mr-1" />
                      Add Record
                    </Button>
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