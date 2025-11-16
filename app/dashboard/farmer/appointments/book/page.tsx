"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Calendar, Clock, ArrowLeft, User, Stethoscope, MapPin, Navigation, Star, Phone, Mail, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

interface Livestock {
  id: number
  name: string
  type: string
}

interface Veterinarian {
  id: number
  name: string
  phone: string
  email: string
  district: string
  sector: string
  specialization: string
  rating: number
  experience: string
  lat: number
  lng: number
  available: boolean
}

interface FormData {
  livestockId: string
  date: string
  time: string
  reason: string
  notes: string
}

export default function BookAppointment() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [livestock, setLivestock] = useState<Livestock[]>([])
  const [step, setStep] = useState(1) // 1 = Select Vet, 2 = Fill Form
  const [selectedVet, setSelectedVet] = useState<Veterinarian | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [formData, setFormData] = useState<FormData>({
    livestockId: "",
    date: "",
    time: "",
    reason: "",
    notes: ""
  })

  // Veterinarians in Nyagatare and Gatsibo Districts (2 vets per sector)
  const veterinarians: Veterinarian[] = [
    // NYAGATARE DISTRICT - Nyagatare Sector
    {
      id: 1,
      name: "Dr. Claudine Umutoni",
      phone: "+250 788 111 111",
      email: "claudine.umutoni@vetconnect.rw",
      district: "Nyagatare",
      sector: "Nyagatare Sector",
      specialization: "Cattle Breeding & Dairy",
      rating: 4.8,
      experience: "11 years",
      lat: -1.2975,
      lng: 30.3247,
      available: true
    },
    {
      id: 2,
      name: "Dr. Emmanuel Nkusi",
      phone: "+250 788 111 222",
      email: "emmanuel.nkusi@vetconnect.rw",
      district: "Nyagatare",
      sector: "Nyagatare Sector",
      specialization: "Large Animals & Poultry",
      rating: 4.7,
      experience: "9 years",
      lat: -1.2985,
      lng: 30.3257,
      available: true
    },
    // NYAGATARE DISTRICT - Rwimiyaga Sector
    {
      id: 3,
      name: "Dr. Grace Mukamana",
      phone: "+250 788 222 111",
      email: "grace.mukamana@vetconnect.rw",
      district: "Nyagatare",
      sector: "Rwimiyaga Sector",
      specialization: "Cattle & Goats",
      rating: 4.6,
      experience: "8 years",
      lat: -1.3156,
      lng: 30.2889,
      available: true
    },
    {
      id: 4,
      name: "Dr. Jean Baptiste Habimana",
      phone: "+250 788 222 222",
      email: "jeanbaptiste.habimana@vetconnect.rw",
      district: "Nyagatare",
      sector: "Rwimiyaga Sector",
      specialization: "General Practice",
      rating: 4.5,
      experience: "7 years",
      lat: -1.3166,
      lng: 30.2899,
      available: true
    },
    // NYAGATARE DISTRICT - Karama Sector
    {
      id: 5,
      name: "Dr. Sarah Ingabire",
      phone: "+250 788 333 111",
      email: "sarah.ingabire@vetconnect.rw",
      district: "Nyagatare",
      sector: "Karama Sector",
      specialization: "Dairy Cattle Specialist",
      rating: 4.9,
      experience: "12 years",
      lat: -1.2547,
      lng: 30.3678,
      available: true
    },
    {
      id: 6,
      name: "Dr. Patrick Mugisha",
      phone: "+250 788 333 222",
      email: "patrick.mugisha@vetconnect.rw",
      district: "Nyagatare",
      sector: "Karama Sector",
      specialization: "Cattle & Sheep",
      rating: 4.7,
      experience: "10 years",
      lat: -1.2557,
      lng: 30.3688,
      available: true
    },
    // NYAGATARE DISTRICT - Mimuri Sector
    {
      id: 7,
      name: "Dr. Alice Uwase",
      phone: "+250 788 444 111",
      email: "alice.uwase@vetconnect.rw",
      district: "Nyagatare",
      sector: "Mimuri Sector",
      specialization: "Mixed Practice",
      rating: 4.6,
      experience: "8 years",
      lat: -1.2234,
      lng: 30.3456,
      available: true
    },
    {
      id: 8,
      name: "Dr. David Niyonzima",
      phone: "+250 788 444 222",
      email: "david.niyonzima@vetconnect.rw",
      district: "Nyagatare",
      sector: "Mimuri Sector",
      specialization: "Cattle & Poultry",
      rating: 4.5,
      experience: "6 years",
      lat: -1.2244,
      lng: 30.3466,
      available: true
    },
    // GATSIBO DISTRICT - Gatsibo Sector
    {
      id: 9,
      name: "Dr. Diane Murekatete",
      phone: "+250 788 555 111",
      email: "diane.murekatete@vetconnect.rw",
      district: "Gatsibo",
      sector: "Gatsibo Sector",
      specialization: "Cattle & Dairy",
      rating: 4.8,
      experience: "10 years",
      lat: -1.5833,
      lng: 30.4167,
      available: true
    },
    {
      id: 10,
      name: "Dr. Eric Kamanzi",
      phone: "+250 788 555 222",
      email: "eric.kamanzi@vetconnect.rw",
      district: "Gatsibo",
      sector: "Gatsibo Sector",
      specialization: "Large Animals",
      rating: 4.7,
      experience: "9 years",
      lat: -1.5843,
      lng: 30.4177,
      available: true
    },
    // GATSIBO DISTRICT - Kabarore Sector
    {
      id: 11,
      name: "Dr. Vestine Uwera",
      phone: "+250 788 666 111",
      email: "vestine.uwera@vetconnect.rw",
      district: "Gatsibo",
      sector: "Kabarore Sector",
      specialization: "Cattle Breeding",
      rating: 4.9,
      experience: "11 years",
      lat: -1.6456,
      lng: 30.4578,
      available: true
    },
    {
      id: 12,
      name: "Dr. Paul Habineza",
      phone: "+250 788 666 222",
      email: "paul.habineza@vetconnect.rw",
      district: "Gatsibo",
      sector: "Kabarore Sector",
      specialization: "Mixed Practice",
      rating: 4.6,
      experience: "8 years",
      lat: -1.6466,
      lng: 30.4588,
      available: true
    },
    // GATSIBO DISTRICT - Kiramuruzi Sector
    {
      id: 13,
      name: "Dr. Josephine Mukamana",
      phone: "+250 788 777 111",
      email: "josephine.mukamana@vetconnect.rw",
      district: "Gatsibo",
      sector: "Kiramuruzi Sector",
      specialization: "Dairy & Poultry",
      rating: 4.7,
      experience: "9 years",
      lat: -1.5234,
      lng: 30.3789,
      available: true
    },
    {
      id: 14,
      name: "Dr. Isaac Nsengimana",
      phone: "+250 788 777 222",
      email: "isaac.nsengimana@vetconnect.rw",
      district: "Gatsibo",
      sector: "Kiramuruzi Sector",
      specialization: "Cattle & Goats",
      rating: 4.5,
      experience: "7 years",
      lat: -1.5244,
      lng: 30.3799,
      available: true
    },
    // GATSIBO DISTRICT - Rugarama Sector
    {
      id: 15,
      name: "Dr. Christine Ingabire",
      phone: "+250 788 888 111",
      email: "christine.ingabire@vetconnect.rw",
      district: "Gatsibo",
      sector: "Rugarama Sector",
      specialization: "General Practice",
      rating: 4.8,
      experience: "10 years",
      lat: -1.6789,
      lng: 30.4234,
      available: true
    },
    {
      id: 16,
      name: "Dr. James Uwizeyimana",
      phone: "+250 788 888 222",
      email: "james.uwizeyimana@vetconnect.rw",
      district: "Gatsibo",
      sector: "Rugarama Sector",
      specialization: "Cattle & Sheep",
      rating: 4.6,
      experience: "8 years",
      lat: -1.6799,
      lng: 30.4244,
      available: true
    }
  ]

  const [availableTimes] = useState([
    "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM",
    "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"
  ])

  // Load livestock and user
  useEffect(() => {
    const storedLivestock = localStorage.getItem("livestock")
    if (storedLivestock && storedLivestock !== "undefined") {
      setLivestock(JSON.parse(storedLivestock))
    }

    const userStr = localStorage.getItem("user")
    if (userStr && userStr !== "undefined") {
      setUser(JSON.parse(userStr))
    }
  }, [])

  const filteredVets = veterinarians.filter(vet =>
    vet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vet.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vet.specialization.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSelectVet = (vet: Veterinarian) => {
    setSelectedVet(vet)
  }

  const handleProceedToForm = () => {
    if (selectedVet) {
      setStep(2)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const getTodayDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  const handleSubmit = () => {
    if (!formData.livestockId || !formData.date || !formData.time || !formData.reason) {
      alert("Please fill in all required fields")
      return
    }

    if (!selectedVet) {
      alert("Please select a veterinarian")
      return
    }

    const selectedLivestock = livestock.find(l => l.id === parseInt(formData.livestockId))

    if (!selectedLivestock) {
      alert("Invalid livestock selection")
      return
    }

    const newAppointment = {
      id: Date.now(),
      farmerId: user?.id || 1,
      farmerName: user?.name || "Farmer",
      farmerPhone: user?.phone || "+250786160692",
      farmerEmail: user?.email,
      vetId: selectedVet.id,
      vetName: selectedVet.name,
      vetPhone: selectedVet.phone,
      vetEmail: selectedVet.email,
      livestockId: selectedLivestock.id,
      livestockName: selectedLivestock.name,
      livestockType: selectedLivestock.type,
      date: formData.date,
      time: formData.time,
      reason: formData.reason,
      issue: formData.notes,
      notes: formData.notes,
      status: "pending",
      urgency: "normal",
      location: selectedVet.sector + ", " + selectedVet.district,
      createdAt: new Date().toISOString()
    }

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        
        {/* Header */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => step === 1 ? router.back() : setStep(1)}
            className="mb-4 hover:bg-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {step === 1 ? "Back to Dashboard" : "Back to Vet Selection"}
          </Button>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Appointment</h1>
            <p className="text-gray-600">
              {step === 1 ? "Step 1: Select a veterinarian closest to your location" : "Step 2: Fill in appointment details"}
            </p>
          </div>
        </div>

        {/* STEP 1: VET SELECTION */}
        {step === 1 && (
          <>
            {/* Search Bar */}
            <Card className="mb-6 shadow-md border-gray-200">
              <CardContent className="pt-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search by name, district, or specialization..."
                    className="pl-11 h-12 text-base"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="grid lg:grid-cols-3 gap-6">
              
              {/* Map Section */}
              <div className="lg:col-span-2">
                <Card className="shadow-lg border-gray-200 overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative h-[600px] bg-white overflow-hidden">
                      {/* Embedded Google Maps-style iframe */}
                      <iframe
                        src="https://www.openstreetmap.org/export/embed.html?bbox=29.8%2C-2.0%2C30.8%2C-1.0&layer=mapnik&marker=-1.5%2C30.3"
                        width="100%"
                        height="600"
                        style={{ border: 0 }}
                        loading="lazy"
                        title="Rwanda Veterinarians Map"
                      ></iframe>
                      
                      {/* Red dot markers overlay */}
                      <div className="absolute inset-0 pointer-events-none">
                        {filteredVets.map((vet) => {
                          // Convert lat/lng to approximate pixel positions
                          // Map bounds: lng 29.8 to 30.8 (left to right), lat -2.0 to -1.0 (top to bottom)
                          const mapWidth = 100; // percentage
                          const mapHeight = 100; // percentage
                          const lonMin = 29.8;
                          const lonMax = 30.8;
                          const latMin = -2.0;
                          const latMax = -1.0;
                          
                          const x = ((vet.lng - lonMin) / (lonMax - lonMin)) * mapWidth;
                          const y = ((latMax - vet.lat) / (latMax - latMin)) * mapHeight;
                          
                          return (
                            <div
                              key={vet.id}
                              className="absolute pointer-events-auto cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-125 group"
                              style={{
                                left: `${x}%`,
                                top: `${y}%`,
                              }}
                              onClick={() => handleSelectVet(vet)}
                            >
                              {/* Red dot */}
                              <div className={`relative ${
                                selectedVet?.id === vet.id ? 'animate-pulse' : ''
                              }`}>
                                <div className={`w-4 h-4 rounded-full shadow-lg ${
                                  selectedVet?.id === vet.id
                                    ? 'bg-green-500 ring-4 ring-green-200'
                                    : 'bg-red-600 ring-2 ring-white'
                                }`} />
                                {/* Tooltip on hover */}
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block whitespace-nowrap z-10">
                                  <div className="bg-gray-900 text-white text-xs rounded px-2 py-1 shadow-lg">
                                    {vet.name}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      
                      {/* Overlay with vet markers */}
                      <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg">
                        <div className="flex items-center gap-2 mb-3">
                          <MapPin className="w-5 h-5 text-green-600" />
                          <h3 className="font-bold text-gray-800">Select Veterinarian Location</h3>
                        </div>
                        <div className="grid grid-cols-4 gap-2 max-h-32 overflow-y-auto">
                          {filteredVets.map((vet) => (
                            <button
                              key={vet.id}
                              onClick={() => handleSelectVet(vet)}
                              className={`p-2 rounded-lg text-xs transition-all ${
                                selectedVet?.id === vet.id
                                  ? 'bg-green-600 text-white shadow-lg scale-105'
                                  : 'bg-gray-100 hover:bg-green-50 text-gray-700 hover:shadow-md'
                              }`}
                            >
                              <MapPin className="w-4 h-4 mx-auto mb-1" />
                              <p className="font-medium truncate">{vet.sector.split(' ')[0]}</p>
                              <p className="text-[10px] opacity-80 truncate">{vet.district}</p>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Veterinarians List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Available Vets ({filteredVets.length})
                  </h2>
                </div>

                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                  {filteredVets.map((vet) => (
                    <Card
                      key={vet.id}
                      className={`cursor-pointer transition-all hover:shadow-lg ${
                        selectedVet?.id === vet.id
                          ? 'border-2 border-green-500 shadow-lg'
                          : 'border-gray-200'
                      }`}
                      onClick={() => handleSelectVet(vet)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 mb-1 truncate">{vet.name}</h3>
                            <div className="flex items-center gap-1 mb-2">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-medium text-gray-700">{vet.rating}</span>
                              <span className="text-xs text-gray-500">({vet.experience})</span>
                            </div>
                          </div>
                          {vet.available && (
                            <Badge className="bg-green-500 text-xs">Available</Badge>
                          )}
                        </div>

                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate">{vet.sector}, {vet.district}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Phone className="w-3 h-3" />
                            <span>{vet.phone}</span>
                          </div>
                          <div className="text-xs text-gray-500 mt-2">
                            <span className="font-medium">Specialization:</span> {vet.specialization}
                          </div>
                        </div>

                        {selectedVet?.id === vet.id && (
                          <Button
                            className="w-full mt-3 bg-green-600 hover:bg-green-700"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleProceedToForm()
                            }}
                          >
                            Continue to Booking
                            <Navigation className="w-4 h-4 ml-2" />
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            {/* Selected Vet Bottom Bar */}
            {selectedVet && (
              <Card className="fixed bottom-6 left-1/2 transform -translate-x-1/2 shadow-2xl border-green-500 border-2 max-w-3xl w-full mx-4 z-50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-gray-900">{selectedVet.name}</h3>
                        <p className="text-sm text-gray-600 truncate">{selectedVet.sector}, {selectedVet.district} • {selectedVet.specialization}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedVet(null)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                      <Button
                        className="bg-green-600 hover:bg-green-700"
                        onClick={handleProceedToForm}
                      >
                        Continue
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* STEP 2: BOOKING FORM */}
        {step === 2 && selectedVet && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Booking Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Appointment Details</CardTitle>
                  <CardDescription>Fill in the information below to complete your booking</CardDescription>
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
                        {livestock.map((animal) => (
                          <option key={animal.id} value={animal.id}>
                            {animal.name} ({animal.type})
                          </option>
                        ))}
                      </select>
                    )}
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
                      <option value="Routine Checkup">Routine Checkup</option>
                      <option value="Vaccination">Vaccination</option>
                      <option value="Illness">Illness/Disease</option>
                      <option value="Injury">Injury</option>
                      <option value="Pregnancy Check">Pregnancy Check</option>
                      <option value="Emergency">Emergency</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Additional Notes */}
                  <div>
                    <Label htmlFor="notes">Additional Notes / Symptoms</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      placeholder="Describe any symptoms, concerns, or additional information..."
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={4}
                      className="mt-1"
                    />
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button 
                      onClick={handleSubmit}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      disabled={livestock.length === 0}
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Confirm Booking
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setStep(1)}
                    >
                      Back
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Selected Vet Info */}
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="text-lg">Selected Veterinarian</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{selectedVet.name}</h3>
                        <p className="text-sm text-gray-600">{selectedVet.specialization}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{selectedVet.rating}</span>
                          <span className="text-xs text-gray-500">({selectedVet.experience})</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-700">
                        <MapPin className="w-4 h-4" />
                        {selectedVet.sector}, {selectedVet.district}
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Phone className="w-4 h-4" />
                        {selectedVet.phone}
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Mail className="w-4 h-4" />
                        {selectedVet.email}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Appointment Summary */}
              {(formData.date || formData.time || formData.livestockId) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Appointment Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {formData.date && (
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="text-sm text-gray-600">Date</p>
                          <p className="font-medium">{formData.date}</p>
                        </div>
                      </div>
                    )}
                    {formData.time && (
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="text-sm text-gray-600">Time</p>
                          <p className="font-medium">{formData.time}</p>
                        </div>
                      </div>
                    )}
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
                  <p>• You'll receive a confirmation notification</p>
                  <p>• The veterinarian will contact you to confirm</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}