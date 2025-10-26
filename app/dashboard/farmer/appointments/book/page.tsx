"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Calendar, Clock, ArrowLeft, User, Stethoscope, MapPin, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import dynamic from 'next/dynamic'

// Dynamically import map component (client-side only)
const VetMap = dynamic(() => import('@/components/VetMap'), { 
  ssr: false,
  loading: () => (
    <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
      <p className="text-gray-500">Loading map...</p>
    </div>
  )
})

interface Livestock {
  id: number
  name: string
  type: string
}

interface Vet {
  id: number
  name: string
  specialty: string
  location: string
  rating: number
  lat: number
  lng: number
  phone: string
  email: string
}

interface FormData {
  livestockId: string
  vetId: string
  date: string
  time: string
  reason: string
  notes: string
}

export default function BookAppointment() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [livestock, setLivestock] = useState<Livestock[]>([])
  const [showMap, setShowMap] = useState(false)
  const [farmerLocation, setFarmerLocation] = useState<[number, number]>([-1.9441, 30.0619]) // Default: Kigali
  const [formData, setFormData] = useState<FormData>({
    livestockId: "",
    vetId: "",
    date: "",
    time: "",
    reason: "",
    notes: ""
  })

  // Veterinarians with coordinates
  const [vets] = useState<Vet[]>([
    { 
      id: 1, 
      name: "Dr. Sarah Mukamana", 
      specialty: "Large Animals", 
      location: "Kigali District", 
      rating: 4.8,
      lat: -1.9355,
      lng: 30.0625,
      phone: "+250788123456",
      email: "sarah.m@vetconnect.rw"
    },
    { 
      id: 2, 
      name: "Dr. Paul Nkusi", 
      specialty: "Mixed Practice", 
      location: "Gasabo District", 
      rating: 4.6,
      lat: -1.9536,
      lng: 30.0906,
      phone: "+250788234567",
      email: "paul.n@vetconnect.rw"
    },
    { 
      id: 3, 
      name: "Dr. Grace Uwera", 
      specialty: "Cattle Specialist", 
      location: "Kicukiro District", 
      rating: 4.9,
      lat: -1.9667,
      lng: 30.1044,
      phone: "+250788345678",
      email: "grace.u@vetconnect.rw"
    }
  ])

  const [availableTimes] = useState([
    "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM",
    "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"
  ])

  // Load livestock from localStorage
  useEffect(() => {
    const storedLivestock = localStorage.getItem("livestock")
    if (storedLivestock && storedLivestock !== "undefined") {
      setLivestock(JSON.parse(storedLivestock))
    }
  }, [])

  useEffect(() => {
    const userStr = localStorage.getItem("user")
    if (userStr && userStr !== "undefined") {
      setUser(JSON.parse(userStr))
    } else {
      router.push("/auth/signin")
    }
  }, [router])

  // Get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFarmerLocation([position.coords.latitude, position.coords.longitude])
        },
        (error) => {
          console.log("Location access denied, using default location")
        }
      )
    }
  }, [])

  // Calculate distance between two points (Haversine formula)
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371 // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLng = (lng2 - lng1) * Math.PI / 180
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  // Get closest veterinarian
  const getClosestVet = () => {
    const vetsWithDistance = vets.map(vet => ({
      ...vet,
      distance: calculateDistance(farmerLocation[0], farmerLocation[1], vet.lat, vet.lng)
    }))
    return vetsWithDistance.sort((a, b) => a.distance - b.distance)[0]
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleVetSelection = (vetId: number) => {
    setFormData(prev => ({ ...prev, vetId: vetId.toString() }))
    setShowMap(false)
  }

  const handleSubmit = () => {
    if (!formData.livestockId || !formData.vetId || !formData.date || !formData.time || !formData.reason) {
      alert("Please fill in all required fields")
      return
    }

    // Get selected vet and livestock details
    const selectedVet = vets.find(v => v.id === parseInt(formData.vetId))
    const selectedLivestock = livestock.find(l => l.id === parseInt(formData.livestockId))

    if (!selectedVet || !selectedLivestock) {
      alert("Invalid selection")
      return
    }

    // Create appointment object
    const newAppointment = {
      id: Date.now(),
      farmerId: user?.id || 1,
      farmerName: user?.name || "Farmer",
      farmerPhone: user?.phone || "+250786160692",
      vetId: selectedVet.id,
      vetName: selectedVet.name,
      vetSpecialty: selectedVet.specialty,
      vetPhone: selectedVet.phone,
      vetEmail: selectedVet.email,
      livestockId: selectedLivestock.id,
      livestockName: selectedLivestock.name,
      livestockType: selectedLivestock.type,
      date: formData.date,
      time: formData.time,
      reason: formData.reason,
      notes: formData.notes,
      status: "pending",
      location: selectedVet.location,
      createdAt: new Date().toISOString()
    }

    // Save to localStorage
    try {
      const existingAppointments = localStorage.getItem("appointments")
      const appointments = existingAppointments && existingAppointments !== "undefined" 
        ? JSON.parse(existingAppointments) 
        : []
      
      appointments.push(newAppointment)
      localStorage.setItem("appointments", JSON.stringify(appointments))

      alert("Appointment booked successfully!")
      router.push("/dashboard/farmer/appointments")
    } catch (error) {
      console.error("Error saving appointment:", error)
      alert("Error booking appointment. Please try again.")
    }
  }

  const getTodayDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  const closestVet = getClosestVet()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Book Appointment</h1>
            <p className="text-gray-600 mt-2">Schedule a veterinary visit for your livestock</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Booking Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Closest Vet Card */}
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <Navigation className="w-5 h-5" />
                  Closest Veterinarian
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{closestVet.name}</h3>
                    <p className="text-sm text-gray-600">{closestVet.specialty}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <Badge className="bg-green-600">
                        {closestVet.distance.toFixed(1)} km away
                      </Badge>
                      <div className="flex items-center gap-1 text-sm">
                        <span className="text-yellow-500">★</span>
                        <span className="font-medium">{closestVet.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button 
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleVetSelection(closestVet.id)}
                    >
                      Select This Vet
                    </Button>
                    <Button 
                      size="sm"
                      variant="outline"
                      onClick={() => setShowMap(!showMap)}
                    >
                      {showMap ? "Hide Map" : "View on Map"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Map Card */}
            {showMap && (
              <Card>
                <CardHeader>
                  <CardTitle>Find Veterinarians Near You</CardTitle>
                  <CardDescription>Click on a marker to select a veterinarian</CardDescription>
                </CardHeader>
                <CardContent>
                  <VetMap 
                    vets={vets}
                    farmerLocation={farmerLocation}
                    onVetSelect={handleVetSelection}
                    selectedVetId={formData.vetId ? parseInt(formData.vetId) : null}
                  />
                </CardContent>
              </Card>
            )}

            {/* Appointment Form */}
            <Card>
              <CardHeader>
                <CardTitle>Appointment Details</CardTitle>
                <CardDescription>Fill in the information below to book your appointment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Select Livestock */}
                <div>
                  <Label htmlFor="livestockId">
                    Select Livestock <span className="text-red-600">*</span>
                  </Label>
                  {livestock.length === 0 ? (
                    <div className="mt-2 p-4 border rounded-md bg-yellow-50 text-sm">
                      <p className="text-yellow-800 mb-2">You don't have any livestock yet.</p>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => router.push('/dashboard/farmer/livestock')}
                      >
                        Add Livestock First
                      </Button>
                    </div>
                  ) : (
                    <select
                      id="livestockId"
                      name="livestockId"
                      className="w-full px-3 py-2 border rounded-md mt-1"
                      value={formData.livestockId}
                      onChange={handleInputChange}
                    >
                      <option value="">Choose livestock...</option>
                      {livestock.map((animal: Livestock) => (
                        <option key={animal.id} value={animal.id}>
                          {animal.name} ({animal.type})
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Select Veterinarian */}
                <div>
                  <Label htmlFor="vetId">
                    Select Veterinarian <span className="text-red-600">*</span>
                  </Label>
                  <select
                    id="vetId"
                    name="vetId"
                    className="w-full px-3 py-2 border rounded-md mt-1"
                    value={formData.vetId}
                    onChange={handleInputChange}
                  >
                    <option value="">Choose veterinarian...</option>
                    {vets.map((vet: Vet) => {
                      const distance = calculateDistance(farmerLocation[0], farmerLocation[1], vet.lat, vet.lng)
                      return (
                        <option key={vet.id} value={vet.id}>
                          {vet.name} - {vet.specialty} ({distance.toFixed(1)}km away)
                        </option>
                      )
                    })}
                  </select>
                </div>

                {/* Date and Time */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">
                      Date <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      min={getTodayDate()}
                      value={formData.date}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="time">
                      Time <span className="text-red-600">*</span>
                    </Label>
                    <select
                      id="time"
                      name="time"
                      className="w-full px-3 py-2 border rounded-md mt-1"
                      value={formData.time}
                      onChange={handleInputChange}
                    >
                      <option value="">Choose time...</option>
                      {availableTimes.map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Reason for Visit */}
                <div>
                  <Label htmlFor="reason">
                    Reason for Visit <span className="text-red-600">*</span>
                  </Label>
                  <select
                    id="reason"
                    name="reason"
                    className="w-full px-3 py-2 border rounded-md mt-1"
                    value={formData.reason}
                    onChange={handleInputChange}
                  >
                    <option value="">Select reason...</option>
                    <option value="routine-checkup">Routine Checkup</option>
                    <option value="vaccination">Vaccination</option>
                    <option value="illness">Illness/Disease</option>
                    <option value="injury">Injury</option>
                    <option value="pregnancy">Pregnancy Check</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Additional Notes */}
                <div>
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    placeholder="Any symptoms or concerns you want to mention..."
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={4}
                    className="mt-1"
                  />
                </div>

                {/* Submit Button */}
                <div className="flex gap-3">
                  <Button 
                    onClick={handleSubmit}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    disabled={livestock.length === 0}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Appointment
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => router.back()}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            {/* Selected Vet Info */}
            {formData.vetId && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Selected Veterinarian</CardTitle>
                </CardHeader>
                <CardContent>
                  {vets.find(v => v.id === parseInt(formData.vetId)) && (() => {
                    const selectedVet = vets.find(v => v.id === parseInt(formData.vetId))!
                    const distance = calculateDistance(farmerLocation[0], farmerLocation[1], selectedVet.lat, selectedVet.lng)
                    return (
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{selectedVet.name}</h3>
                            <p className="text-sm text-gray-600">{selectedVet.specialty}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          {selectedVet.location} ({distance.toFixed(1)} km away)
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-yellow-500">★</span>
                          <span className="font-medium">{selectedVet.rating}</span>
                          <span className="text-gray-600">rating</span>
                        </div>
                      </div>
                    )
                  })()}
                </CardContent>
              </Card>
            )}

            {/* Appointment Summary */}
            {formData.date && formData.time && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Appointment Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-600">Date</p>
                      <p className="font-medium">{formData.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-600">Time</p>
                      <p className="font-medium">{formData.time}</p>
                    </div>
                  </div>
                  {formData.livestockId && (
                    <div className="flex items-center gap-3">
                      <Stethoscope className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-600">Livestock</p>
                        <p className="font-medium">
                          {livestock.find(l => l.id === parseInt(formData.livestockId))?.name}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Important Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Important Information</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2 text-gray-600">
                <p>• Please arrive 10 minutes before your scheduled time</p>
                <p>• Have your livestock ready for examination</p>
                <p>• Bring any previous medical records if available</p>
                <p>• You'll receive a confirmation SMS shortly</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}