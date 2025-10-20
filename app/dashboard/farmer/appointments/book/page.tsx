"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Calendar, Clock, ArrowLeft, User, Stethoscope, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function BookAppointment() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [livestock, setLivestock] = useState([])
  const [vets, setVets] = useState([])
  const [formData, setFormData] = useState({
    livestockId: "",
    vetId: "",
    date: "",
    time: "",
    reason: "",
    notes: ""
  })

  // Load livestock from localStorage
  useEffect(() => {
    const storedLivestock = localStorage.getItem("livestock")
    if (storedLivestock && storedLivestock !== "undefined") {
      setLivestock(JSON.parse(storedLivestock))
    }
  }, [])

  // Load veterinarians (from localStorage or API)
  useEffect(() => {
    const loadVets = async () => {
      try {
        // TODO: Replace this with actual API call
        // const response = await fetch('/api/veterinarians')
        // const data = await response.json()
        // setVets(data)

        // For now, load from localStorage or use default data
        const storedVets = localStorage.getItem("veterinarians")
        if (storedVets && storedVets !== "undefined") {
          setVets(JSON.parse(storedVets))
        } else {
          // Default vets - will be replaced with API data
          const defaultVets = [
            { 
              id: 1, 
              name: "Dr. Sarah Mukamana", 
              specialty: "Large Animals",
              location: "Kigali District",
              rating: 4.8,
              phone: "+250 788 123 456",
              email: "sarah.m@vetconnect.rw"
            },
            { 
              id: 2, 
              name: "Dr. Paul Nkusi", 
              specialty: "Mixed Practice",
              location: "Gasabo District",
              rating: 4.6,
              phone: "+250 788 234 567",
              email: "paul.n@vetconnect.rw"
            },
            { 
              id: 3, 
              name: "Dr. Grace Uwera", 
              specialty: "Cattle Specialist",
              location: "Kicukiro District",
              rating: 4.9,
              phone: "+250 788 345 678",
              email: "grace.u@vetconnect.rw"
            }
          ]
          setVets(defaultVets)
          localStorage.setItem("veterinarians", JSON.stringify(defaultVets))
        }
      } catch (error) {
        console.error("Error loading veterinarians:", error)
      }
    }

    loadVets()
  }, [])

  const [availableTimes] = useState([
    "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM",
    "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"
  ])

  useEffect(() => {
    const userStr = localStorage.getItem("user")
    if (userStr && userStr !== "undefined") {
      setUser(JSON.parse(userStr))
    } else {
      router.push("/auth/signin")
    }
  }, [router])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = () => {
    if (!formData.livestockId || !formData.vetId || !formData.date || !formData.time || !formData.reason) {
      alert("Please fill in all required fields")
      return
    }

    // Get selected livestock and vet details
    const selectedLivestock = livestock.find(l => l.id === parseInt(formData.livestockId))
    const selectedVet = vets.find(v => v.id === parseInt(formData.vetId))

    if (!selectedLivestock || !selectedVet) {
      alert("Invalid selection")
      return
    }

    // Create appointment object
    const newAppointment = {
      id: Date.now(),
      farmerId: user?.id || 1,
      farmerName: user?.name || "Farmer",
      livestockId: parseInt(formData.livestockId),
      livestockName: selectedLivestock.name,
      livestockType: selectedLivestock.type,
      vetId: parseInt(formData.vetId),
      vetName: selectedVet.name,
      vetSpecialty: selectedVet.specialty,
      vetPhone: selectedVet.phone,
      vetEmail: selectedVet.email,
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

      // TODO: Also send to backend API
      // await fetch('/api/appointments', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(newAppointment)
      // })

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
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Appointment Details</CardTitle>
                <CardDescription>Fill in the information below to book your appointment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Select Livestock */}
                <div>
                  <Label htmlFor="livestockId">Select Livestock *</Label>
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
                      {livestock.map(animal => (
                        <option key={animal.id} value={animal.id}>
                          {animal.name} ({animal.type})
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Select Veterinarian */}
                <div>
                  <Label htmlFor="vetId">Select Veterinarian *</Label>
                  {vets.length === 0 ? (
                    <div className="mt-2 p-4 border rounded-md bg-yellow-50 text-sm">
                      <p className="text-yellow-800">Loading veterinarians...</p>
                    </div>
                  ) : (
                    <select
                      id="vetId"
                      name="vetId"
                      className="w-full px-3 py-2 border rounded-md mt-1"
                      value={formData.vetId}
                      onChange={handleInputChange}
                    >
                      <option value="">Choose veterinarian...</option>
                      {vets.map(vet => (
                        <option key={vet.id} value={vet.id}>
                          {vet.name} - {vet.specialty} ({vet.location})
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Date and Time */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Date *</Label>
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
                    <Label htmlFor="time">Time *</Label>
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
                  <Label htmlFor="reason">Reason for Visit *</Label>
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
            {formData.vetId && vets.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Selected Veterinarian</CardTitle>
                </CardHeader>
                <CardContent>
                  {vets.find(v => v.id === parseInt(formData.vetId)) && (
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">
                            {vets.find(v => v.id === parseInt(formData.vetId)).name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {vets.find(v => v.id === parseInt(formData.vetId)).specialty}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        {vets.find(v => v.id === parseInt(formData.vetId)).location}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-yellow-500">★</span>
                        <span className="font-medium">
                          {vets.find(v => v.id === parseInt(formData.vetId)).rating}
                        </span>
                        <span className="text-gray-600">rating</span>
                      </div>
                    </div>
                  )}
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
                  {formData.livestockId && livestock.length > 0 && (
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