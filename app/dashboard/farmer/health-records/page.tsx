"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Calendar, Pill } from "lucide-react"
import { Button } from "@/components/ui/button"
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
    const storedLivestock = localStorage.getItem("livestock")
    if (storedLivestock) {
      setLivestock(JSON.parse(storedLivestock))
    } else {
      setLivestock([
        { id: 1, name: "Cow #1" },
        { id: 2, name: "Cow #2" },
        { id: 3, name: "Goat #1" },
      ])
    }
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

  const filteredRecords = healthRecords.filter(record => {
    const matchesLivestock = selectedLivestock === "all" || record.livestockId === parseInt(selectedLivestock)
    const matchesType = selectedType === "all" || record.type === selectedType
    const matchesSearch = searchQuery === "" ||
      record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.vetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.notes.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesLivestock && matchesType && matchesSearch
  })

  const getRecordBadge = (type: string) => {
    switch(type) {
      case "vaccination": return <Badge className="bg-blue-500">Vaccination</Badge>
      case "treatment": return <Badge className="bg-red-500">Treatment</Badge>
      case "checkup": return <Badge className="bg-green-500">Checkup</Badge>
      default: return <Badge>Other</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-6xl px-4">

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Health Records</h1>
        </div>

        {/* Filters */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Search by title, vet, or notes..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <Select value={selectedLivestock} onValueChange={setSelectedLivestock}>
            <SelectTrigger><SelectValue placeholder="Select livestock" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Livestock</SelectItem>
              {livestock.map(l => <SelectItem key={l.id} value={l.id.toString()}>{l.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="vaccination">Vaccination</SelectItem>
              <SelectItem value="treatment">Treatment</SelectItem>
              <SelectItem value="checkup">Checkup</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          {filteredRecords.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No records found</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Title</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Livestock</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Vet</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Date</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Type</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Notes</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Medications</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRecords.map(record => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-900">{record.title}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{record.livestockName}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{record.vetName}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{formatDate(record.date)}</td>
                    <td className="px-4 py-2">{getRecordBadge(record.type)}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{record.notes}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {record.medications.length > 0 ? record.medications.join(", ") : "-"}
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
