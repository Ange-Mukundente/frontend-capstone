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

export default function LivestockManagement() {
  const router = useRouter()
  const [livestock, setLivestock] = useState([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [selectedLivestock, setSelectedLivestock] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    type: "Cattle",
    breed: "",
    age: "",
    weight: "",
    healthStatus: "healthy",
    notes: ""
  })

  // Load livestock from localStorage on component mount
  useEffect(() => {
    const loadLivestock = () => {
      try {
        const storedLivestock = localStorage.getItem("livestock")
        if (storedLivestock && storedLivestock !== "undefined") {
          setLivestock(JSON.parse(storedLivestock))
        } else {
          // Initialize with sample data if empty
          const sampleData = [
            {
              id: 1,
              name: "Cow #1",
              type: "Cattle",
              breed: "Friesian",
              age: "3 years",
              weight: "450kg",
              healthStatus: "healthy",
              lastCheckup: "2025-10-10",
              notes: "Vaccination up to date"
            },
            {
              id: 2,
              name: "Cow #2",
              type: "Cattle",
              breed: "Jersey",
              age: "2 years",
              weight: "380kg",
              healthStatus: "sick",
              lastCheckup: "2025-10-15",
              notes: "Showing signs of fever, treatment started"
            },
            {
              id: 3,
              name: "Goat #1",
              type: "Goat",
              breed: "Boer",
              age: "1 year",
              weight: "45kg",
              healthStatus: "healthy",
              lastCheckup: "2025-10-12",
              notes: "Good condition"
            }
          ]
          setLivestock(sampleData)
          localStorage.setItem("livestock", JSON.stringify(sampleData))
        }
      } catch (error) {
        console.error("Error loading livestock:", error)
      }
    }

    loadLivestock()
  }, [])

  // Save livestock to localStorage whenever it changes
  const saveLivestock = (updatedLivestock) => {
    setLivestock(updatedLivestock)
    localStorage.setItem("livestock", JSON.stringify(updatedLivestock))
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAddLivestock = () => {
    if (!formData.name.trim()) {
      alert("Please enter livestock name")
      return
    }
    
    const newLivestock = {
      id: Date.now(),
      ...formData,
      lastCheckup: new Date().toISOString().split('T')[0]
    }
    const updatedLivestock = [...livestock, newLivestock]
    saveLivestock(updatedLivestock)
    setIsAddModalOpen(false)
    resetForm()
    alert("Livestock added successfully!")
  }

  const openUpdateModal = (animal) => {
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
      animal.id === selectedLivestock.id 
        ? { 
            ...animal, 
            ...formData,
            lastCheckup: new Date().toISOString().split('T')[0]
          }
        : animal
    )
    saveLivestock(updatedLivestock)
    setIsUpdateModalOpen(false)
    resetForm()
    alert("Livestock updated successfully!")
  }

  const handleDeleteLivestock = (id) => {
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

  const getStatusBadge = (status) => {
    switch(status) {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
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

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Livestock</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{livestock.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Healthy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {livestock.filter(a => a.healthStatus === "healthy").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Sick</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {livestock.filter(a => a.healthStatus === "sick").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Under Treatment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {livestock.filter(a => a.healthStatus === "under-treatment").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {livestock.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No livestock yet</h3>
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {livestock.map((animal) => (
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
        )}

        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Livestock</DialogTitle>
              <DialogDescription>
                Enter the details of your new livestock and its current health status
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Livestock Name/ID *</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="e.g., Cow #4"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="type">Type *</Label>
                <select
                  id="type"
                  name="type"
                  className="w-full px-3 py-2 border rounded-md"
                  value={formData.type}
                  onChange={handleInputChange}
                >
                  <option value="Cattle">Cattle</option>
                  <option value="Goat">Goat</option>
                  <option value="Sheep">Sheep</option>
                  <option value="Pig">Pig</option>
                  <option value="Chicken">Chicken</option>
                </select>
              </div>
              <div>
                <Label htmlFor="breed">Breed</Label>
                <Input
                  id="breed"
                  name="breed"
                  placeholder="e.g., Friesian"
                  value={formData.breed}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    name="age"
                    placeholder="e.g., 2 years"
                    value={formData.age}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="weight">Weight</Label>
                  <Input
                    id="weight"
                    name="weight"
                    placeholder="e.g., 400kg"
                    value={formData.weight}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="healthStatus">Health Status *</Label>
                <select
                  id="healthStatus"
                  name="healthStatus"
                  className="w-full px-3 py-2 border rounded-md"
                  value={formData.healthStatus}
                  onChange={handleInputChange}
                >
                  <option value="healthy">Healthy</option>
                  <option value="sick">Sick</option>
                  <option value="under-treatment">Under Treatment</option>
                  <option value="recovering">Recovering</option>
                </select>
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  placeholder="Any additional information..."
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddLivestock} className="flex-1 bg-green-600 hover:bg-green-700">
                  Add Livestock
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsAddModalOpen(false)
                    resetForm()
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Update Livestock Health</DialogTitle>
              <DialogDescription>
                Update the health status and details of {selectedLivestock?.name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="update-name">Livestock Name/ID *</Label>
                <Input
                  id="update-name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="update-type">Type *</Label>
                <select
                  id="update-type"
                  name="type"
                  className="w-full px-3 py-2 border rounded-md"
                  value={formData.type}
                  onChange={handleInputChange}
                >
                  <option value="Cattle">Cattle</option>
                  <option value="Goat">Goat</option>
                  <option value="Sheep">Sheep</option>
                  <option value="Pig">Pig</option>
                  <option value="Chicken">Chicken</option>
                </select>
              </div>
              <div>
                <Label htmlFor="update-breed">Breed</Label>
                <Input
                  id="update-breed"
                  name="breed"
                  value={formData.breed}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="update-age">Age</Label>
                  <Input
                    id="update-age"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="update-weight">Weight</Label>
                  <Input
                    id="update-weight"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="update-healthStatus">Health Status *</Label>
                <select
                  id="update-healthStatus"
                  name="healthStatus"
                  className="w-full px-3 py-2 border rounded-md"
                  value={formData.healthStatus}
                  onChange={handleInputChange}
                >
                  <option value="healthy">Healthy</option>
                  <option value="sick">Sick</option>
                  <option value="under-treatment">Under Treatment</option>
                  <option value="recovering">Recovering</option>
                </select>
              </div>
              <div>
                <Label htmlFor="update-notes">Notes</Label>
                <Textarea
                  id="update-notes"
                  name="notes"
                  placeholder="Any additional information..."
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleUpdateLivestock} className="flex-1 bg-green-600 hover:bg-green-700">
                  Update Livestock
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsUpdateModalOpen(false)
                    resetForm()
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}