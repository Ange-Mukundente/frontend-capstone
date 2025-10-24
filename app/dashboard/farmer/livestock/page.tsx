"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, Edit, Trash2, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

// --- Define Livestock type ---
type Livestock = {
  id: number
  name: string
  type: string
  breed: string
  age: string
  weight: string
  healthStatus: string
  lastCheckup: string
  notes: string
}

export default function LivestockManagement() {
  const router = useRouter()

  const [livestock, setLivestock] = useState<Livestock[]>([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [selectedLivestock, setSelectedLivestock] = useState<Livestock | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    type: "Cattle",
    breed: "",
    age: "",
    weight: "",
    healthStatus: "healthy",
    notes: ""
  })

  // Pagination and Filter/Search State
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("All")

  // --- Helper to safely parse JSON ---
  const loadFromLocalStorage = <T,>(key: string, defaultValue: T): T => {
    if (typeof window === "undefined") return defaultValue
    try {
      const stored = localStorage.getItem(key)
      if (!stored || stored === "undefined") return defaultValue
      const parsed = JSON.parse(stored)
      return Array.isArray(parsed) ? (parsed as T) : defaultValue
    } catch (err) {
      console.error(`Error parsing ${key} from localStorage`, err)
      return defaultValue
    }
  }

  // --- useEffect to load livestock ---
  useEffect(() => {
    const sampleData: Livestock[] = [
      { id: 1, name: "Cow #1", type: "Cattle", breed: "Friesian", age: "3 years", weight: "450kg", healthStatus: "healthy", lastCheckup: "2025-10-10", notes: "Vaccination up to date" },
      { id: 2, name: "Cow #2", type: "Cattle", breed: "Jersey", age: "2 years", weight: "380kg", healthStatus: "sick", lastCheckup: "2025-10-15", notes: "Showing signs of fever, treatment started" },
      { id: 3, name: "Goat #1", type: "Goat", breed: "Boer", age: "1 year", weight: "45kg", healthStatus: "healthy", lastCheckup: "2025-10-12", notes: "Good condition" }
    ]

    const storedLivestock = loadFromLocalStorage<Livestock[]>("livestock", sampleData)
    setLivestock(storedLivestock)

    if (!localStorage.getItem("livestock")) {
      localStorage.setItem("livestock", JSON.stringify(sampleData))
    }
  }, [])

  const saveLivestock = (updatedLivestock: Livestock[]) => {
    setLivestock(updatedLivestock)
    localStorage.setItem("livestock", JSON.stringify(updatedLivestock))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAddLivestock = () => {
    if (!formData.name.trim()) {
      alert("Please enter livestock name")
      return
    }

    const newLivestock: Livestock = {
      id: Date.now(),
      ...formData,
      lastCheckup: new Date().toISOString().split('T')[0]
    }

    saveLivestock([...livestock, newLivestock])
    setIsAddModalOpen(false)
    resetForm()
    alert("Livestock added successfully!")
  }

  const openUpdateModal = (animal: Livestock) => {
    setSelectedLivestock(animal)
    setFormData({
      name: animal.name,
      type: animal.type,
      breed: animal.breed,
      age: animal.age,
      weight: animal.weight,
      healthStatus: animal.healthStatus,
      notes: animal.notes
    })
    setIsUpdateModalOpen(true)
  }

  const handleUpdateLivestock = () => {
    if (!formData.name.trim()) {
      alert("Please enter livestock name")
      return
    }

    const updatedLivestock = livestock.map(animal =>
      animal.id === selectedLivestock?.id
        ? { ...animal, ...formData, lastCheckup: new Date().toISOString().split('T')[0] }
        : animal
    )
    saveLivestock(updatedLivestock)
    setIsUpdateModalOpen(false)
    resetForm()
    alert("Livestock updated successfully!")
  }

  const handleDeleteLivestock = (id: number) => {
    if (confirm("Are you sure you want to delete this livestock?")) {
      const updatedLivestock = livestock.filter(animal => animal.id !== id)
      saveLivestock(updatedLivestock)
      alert("Livestock deleted successfully!")
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      type: "Cattle",
      breed: "",
      age: "",
      weight: "",
      healthStatus: "healthy",
      notes: ""
    })
    setSelectedLivestock(null)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "healthy":
        return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Healthy</Badge>
      case "sick":
        return <Badge className="bg-red-500"><AlertCircle className="w-3 h-3 mr-1" />Sick</Badge>
      case "under-treatment":
        return <Badge className="bg-orange-500"><AlertCircle className="w-3 h-3 mr-1" />Under Treatment</Badge>
      case "recovering":
        return <Badge className="bg-blue-500">Recovering</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  // --- Filtered Livestock based on search + status ---
  const filteredLivestock = livestock.filter((animal) => {
    const matchesSearch =
      animal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      animal.type.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus =
      filterStatus === "All" || animal.healthStatus === filterStatus.toLowerCase()

    return matchesSearch && matchesStatus
  })

  const indexOfLast = currentPage * itemsPerPage
  const indexOfFirst = indexOfLast - itemsPerPage
  const currentAnimals = filteredLivestock.slice(indexOfFirst, indexOfLast)
  const totalPages = Math.ceil(filteredLivestock.length / itemsPerPage)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">Livestock Management</h1>
            <p className="text-gray-600 mt-2">Manage your livestock and their health status</p>
          </div>
          <Button 
            className="bg-green-600 hover:bg-green-700"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Livestock
          </Button>
        </div>

        {/* --- Search and Filter --- */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
          <Input
            placeholder="Search by name or type..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
            className="flex-1"
          />
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value)
              setCurrentPage(1)
            }}
            className="border px-3 py-2 rounded-md"
          >
            <option value="All">All</option>
            <option value="healthy">Healthy</option>
            <option value="sick">Sick</option>
            <option value="under-treatment">Under Treatment</option>
            <option value="recovering">Recovering</option>
          </select>
        </div>

        {/* --- Cards Grid --- */}
        {filteredLivestock.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No livestock found</h3>
              <p className="text-gray-600 mb-4">Add your first livestock to get started</p>
              <Button 
                className="bg-green-600 hover:bg-green-700"
                onClick={() => setIsAddModalOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Livestock
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentAnimals.map((animal) => (
                <Card key={animal.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{animal.name}</CardTitle>
                        <CardDescription>{animal.type} - {animal.breed}</CardDescription>
                      </div>
                      {getStatusBadge(animal.healthStatus)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Age:</span>
                        <span className="font-medium">{animal.age}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Weight:</span>
                        <span className="font-medium">{animal.weight}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Last Checkup:</span>
                        <span className="font-medium">{animal.lastCheckup}</span>
                      </div>
                      {animal.notes && (
                        <div className="text-sm mt-2 p-2 bg-gray-50 rounded">
                          <p className="text-gray-600 italic">{animal.notes}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => openUpdateModal(animal)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Update
                      </Button>
                      <Button 
                        variant="outline" 
                        className="text-red-600 hover:bg-red-50"
                        onClick={() => handleDeleteLivestock(animal.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* --- Pagination Buttons --- */}
            <div className="flex justify-center mt-6 space-x-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded ${
                    currentPage === i + 1 ? "bg-green-500 text-white" : "bg-gray-200"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </>
        )}

        {/* --- Add Modal --- */}
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Livestock</DialogTitle>
              <DialogDescription>Fill the form to add a new livestock</DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              <div>
                <Label>Name</Label>
                <Input name="name" value={formData.name} onChange={handleInputChange} />
              </div>
              <div>
                <Label>Type</Label>
                <select name="type" value={formData.type} onChange={handleInputChange} className="border p-2 w-full rounded">
                  <option value="Cattle">Cattle</option>
                  <option value="Goat">Goat</option>
                  <option value="Sheep">Sheep</option>
                  <option value="Pig">Pig</option>
                  <option value="Chicken">Chicken</option>
                </select>
              </div>
              <div>
                <Label>Breed</Label>
                <Input name="breed" value={formData.breed} onChange={handleInputChange} />
              </div>
              <div>
                <Label>Age</Label>
                <Input name="age" value={formData.age} onChange={handleInputChange} />
              </div>
              <div>
                <Label>Weight</Label>
                <Input name="weight" value={formData.weight} onChange={handleInputChange} />
              </div>
              <div>
                <Label>Health Status</Label>
                <select name="healthStatus" value={formData.healthStatus} onChange={handleInputChange} className="border p-2 w-full rounded">
                  <option value="healthy">Healthy</option>
                  <option value="sick">Sick</option>
                  <option value="under-treatment">Under Treatment</option>
                  <option value="recovering">Recovering</option>
                </select>
              </div>
              <div>
                <Label>Notes</Label>
                <Textarea name="notes" value={formData.notes} onChange={handleInputChange} />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                <Button className="bg-green-600 hover:bg-green-700" onClick={handleAddLivestock}>Add</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* --- Update Modal --- */}
        <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Livestock</DialogTitle>
              <DialogDescription>Modify livestock details</DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              <div>
                <Label>Name</Label>
                <Input name="name" value={formData.name} onChange={handleInputChange} />
              </div>
              <div>
                <Label>Type</Label>
                <select name="type" value={formData.type} onChange={handleInputChange} className="border p-2 w-full rounded">
                  <option value="Cattle">Cattle</option>
                  <option value="Goat">Goat</option>
                  <option value="Sheep">Sheep</option>
                  <option value="Pig">Pig</option>
                  <option value="Chicken">Chicken</option>
                </select>
              </div>
              <div>
                <Label>Breed</Label>
                <Input name="breed" value={formData.breed} onChange={handleInputChange} />
              </div>
              <div>
                <Label>Age</Label>
                <Input name="age" value={formData.age} onChange={handleInputChange} />
              </div>
              <div>
                <Label>Weight</Label>
                <Input name="weight" value={formData.weight} onChange={handleInputChange} />
              </div>
              <div>
                <Label>Health Status</Label>
                <select name="healthStatus" value={formData.healthStatus} onChange={handleInputChange} className="border p-2 w-full rounded">
                  <option value="healthy">Healthy</option>
                  <option value="sick">Sick</option>
                  <option value="under-treatment">Under Treatment</option>
                  <option value="recovering">Recovering</option>
                </select>
              </div>
              <div>
                <Label>Notes</Label>
                <Textarea name="notes" value={formData.notes} onChange={handleInputChange} />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button onClick={() => setIsUpdateModalOpen(false)}>Cancel</Button>
                <Button className="bg-green-600 hover:bg-green-700" onClick={handleUpdateLivestock}>Update</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  )
}
