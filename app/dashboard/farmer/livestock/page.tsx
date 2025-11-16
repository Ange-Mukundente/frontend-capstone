"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, AlertCircle, CheckCircle, ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'

type Livestock = {
  _id?: string
  id?: string
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
  const { toast } = useToast()
  
  const [livestock, setLivestock] = useState<Livestock[]>([])
  const [loading, setLoading] = useState(true)
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

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("All")

  // Fetch livestock from backend
  const fetchLivestock = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      
      if (!token) {
        toast({
          title: "❌ Authentication Error",
          description: "Please login again",
          variant: "destructive"
        })
        router.push('/auth/login')
        return
      }

      const response = await fetch(`${BACKEND_URL}/api/livestock`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setLivestock(data.data || [])
      } else {
        throw new Error(data.message || 'Failed to fetch livestock')
      }
    } catch (error) {
      console.error('Fetch livestock error:', error)
      toast({
        title: "❌ Error",
        description: error instanceof Error ? error.message : "Failed to fetch livestock",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLivestock()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Add livestock to backend
  const handleAddLivestock = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "❌ Validation Error",
        description: "Please enter livestock name",
        variant: "destructive"
      })
      return
    }

    try {
      const token = localStorage.getItem('token')
      
      if (!token) {
        toast({
          title: "❌ Authentication Error",
          description: "Please login again",
          variant: "destructive"
        })
        router.push('/auth/login')
        return
      }

      const response = await fetch(`${BACKEND_URL}/api/livestock`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          lastCheckup: new Date().toISOString()
        })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        toast({
          title: "✅ Livestock Added",
          description: `${formData.name} has been added successfully.`,
        })
        
        setIsAddModalOpen(false)
        resetForm()
        fetchLivestock() // Refresh the list
      } else {
        throw new Error(data.message || 'Failed to add livestock')
      }
    } catch (error) {
      console.error('Add livestock error:', error)
      toast({
        title: "❌ Error",
        description: error instanceof Error ? error.message : "Failed to add livestock",
        variant: "destructive"
      })
    }
  }

  const openUpdateModal = (animal: Livestock) => {
    setSelectedLivestock(animal)
    setFormData({
      name: animal.name,
      type: animal.type,
      breed: animal.breed || "",
      age: animal.age || "",
      weight: animal.weight || "",
      healthStatus: animal.healthStatus,
      notes: animal.notes || ""
    })
    setIsUpdateModalOpen(true)
  }

  // Update livestock in backend
  const handleUpdateLivestock = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "❌ Validation Error",
        description: "Please enter livestock name",
        variant: "destructive"
      })
      return
    }

    if (!selectedLivestock) return

    try {
      const token = localStorage.getItem('token')
      const livestockId = selectedLivestock._id || selectedLivestock.id

      const response = await fetch(`${BACKEND_URL}/api/livestock/${livestockId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok && data.success) {
        toast({
          title: "✅ Livestock Updated",
          description: `${formData.name} has been updated successfully.`,
        })
        
        setIsUpdateModalOpen(false)
        resetForm()
        fetchLivestock() // Refresh the list
      } else {
        throw new Error(data.message || 'Failed to update livestock')
      }
    } catch (error) {
      console.error('Update livestock error:', error)
      toast({
        title: "❌ Error",
        description: error instanceof Error ? error.message : "Failed to update livestock",
        variant: "destructive"
      })
    }
  }

  // Delete livestock from backend
  const handleDeleteLivestock = async (animal: Livestock) => {
    const livestockId = animal._id || animal.id

    try {
      const token = localStorage.getItem('token')

      const response = await fetch(`${BACKEND_URL}/api/livestock/${livestockId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      if (response.ok && data.success) {
        toast({
          title: "✅ Livestock Deleted",
          description: `${animal.name} has been removed.`,
        })
        
        fetchLivestock() // Refresh the list
      } else {
        throw new Error(data.message || 'Failed to delete livestock')
      }
    } catch (error) {
      console.error('Delete livestock error:', error)
      toast({
        title: "❌ Error",
        description: error instanceof Error ? error.message : "Failed to delete livestock",
        variant: "destructive"
      })
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-green-600" />
          <p className="text-gray-600">Loading livestock...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4 mb-4">
          <Button 
            variant="outline"
            onClick={() => router.push('/dashboard/farmer')}
          >
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

        {/* Search and Filter */}
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
            <option value="All">All Status</option>
            <option value="healthy">Healthy</option>
            <option value="sick">Sick</option>
            <option value="under-treatment">Under Treatment</option>
            <option value="recovering">Recovering</option>
          </select>
        </div>

        {/* Table or Empty State */}
        {filteredLivestock.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No livestock found</h3>
              <p className="text-gray-600 mb-4">
                {searchQuery || filterStatus !== "All" 
                  ? "No livestock match your search criteria" 
                  : "Add your first livestock to get started"}
              </p>
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
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Breed</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Weight</TableHead>
                    <TableHead>Health Status</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentAnimals.map((animal) => (
                    <TableRow key={animal._id || animal.id}>
                      <TableCell className="font-medium">{animal.name}</TableCell>
                      <TableCell>{animal.type}</TableCell>
                      <TableCell>{animal.breed || '-'}</TableCell>
                      <TableCell>{animal.age || '-'}</TableCell>
                      <TableCell>{animal.weight || '-'}</TableCell>
                      <TableCell>{getStatusBadge(animal.healthStatus)}</TableCell>
                      <TableCell className="max-w-xs truncate" title={animal.notes}>
                        {animal.notes || "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => openUpdateModal(animal)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-red-600 hover:bg-red-50"
                            onClick={() => handleDeleteLivestock(animal)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6 space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 rounded text-sm ${
                      currentPage === i + 1 
                        ? "bg-green-600 text-white" 
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}

        {/* Add Livestock Modal */}
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Livestock</DialogTitle>
              <DialogDescription>Fill the form to add a new livestock</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label>Name *</Label>
                <Input name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g., Cow #4" />
              </div>
              <div>
                <Label>Type *</Label>
                <select name="type" value={formData.type} onChange={handleInputChange} className="border p-2 w-full rounded">
                  <option value="Cattle">Cattle</option>
                  <option value="Goat">Goat</option>
                  <option value="Sheep">Sheep</option>
                  <option value="Pig">Pig</option>
                  <option value="Chicken">Chicken</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <Label>Breed</Label>
                <Input name="breed" value={formData.breed} onChange={handleInputChange} placeholder="e.g., Friesian" />
              </div>
              <div>
                <Label>Age</Label>
                <Input name="age" value={formData.age} onChange={handleInputChange} placeholder="e.g., 3 years" />
              </div>
              <div>
                <Label>Weight</Label>
                <Input name="weight" value={formData.weight} onChange={handleInputChange} placeholder="e.g., 450kg" />
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
                <Textarea name="notes" value={formData.notes} onChange={handleInputChange} placeholder="Any additional notes..." />
              </div>
              <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                <Button variant="outline" onClick={() => { setIsAddModalOpen(false); resetForm(); }}>Cancel</Button>
                <Button className="bg-green-600 hover:bg-green-700" onClick={handleAddLivestock}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Livestock
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Update Livestock Modal */}
        <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Update Livestock</DialogTitle>
              <DialogDescription>Modify livestock details for {selectedLivestock?.name}</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label>Name *</Label>
                <Input name="name" value={formData.name} onChange={handleInputChange} />
              </div>
              <div>
                <Label>Type *</Label>
                <select name="type" value={formData.type} onChange={handleInputChange} className="border p-2 w-full rounded">
                  <option value="Cattle">Cattle</option>
                  <option value="Goat">Goat</option>
                  <option value="Sheep">Sheep</option>
                  <option value="Pig">Pig</option>
                  <option value="Chicken">Chicken</option>
                  <option value="Other">Other</option>
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
              <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                <Button variant="outline" onClick={() => { setIsUpdateModalOpen(false); resetForm(); }}>Cancel</Button>
                <Button className="bg-green-600 hover:bg-green-700" onClick={handleUpdateLivestock}>
                  <Edit className="w-4 h-4 mr-2" />
                  Update Livestock
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  )
}