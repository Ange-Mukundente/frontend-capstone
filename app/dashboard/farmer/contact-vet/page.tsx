"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Phone, Mail, MapPin, Star, Calendar, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

export default function ContactVet() {
  const router = useRouter()
  const [selectedVet, setSelectedVet] = useState(null)
  const [showMessageForm, setShowMessageForm] = useState(false)
  const [message, setMessage] = useState("")

  const vets = [
    {
      id: 1,
      name: "Dr. Sarah Mukamana",
      specialty: "Large Animals",
      location: "Kigali District",
      phone: "+250 788 123 456",
      email: "sarah.m@vetconnect.rw",
      rating: 4.8,
      reviews: 45,
      experience: "12 years",
      languages: ["Kinyarwanda", "English", "French"],
      availability: "Mon-Fri: 8AM-5PM",
      about: "Specialized in large animal care with extensive experience in cattle health management."
    },
    {
      id: 2,
      name: "Dr. Paul Nkusi",
      specialty: "Mixed Practice",
      location: "Gasabo District",
      phone: "+250 788 234 567",
      email: "paul.n@vetconnect.rw",
      rating: 4.6,
      reviews: 38,
      experience: "8 years",
      languages: ["Kinyarwanda", "English"],
      availability: "Mon-Sat: 9AM-6PM",
      about: "Experienced in treating various livestock species including cattle, goats, and poultry."
    },
    {
      id: 3,
      name: "Dr. Grace Uwera",
      specialty: "Cattle Specialist",
      location: "Kicukiro District",
      phone: "+250 788 345 678",
      email: "grace.u@vetconnect.rw",
      rating: 4.9,
      reviews: 52,
      experience: "15 years",
      languages: ["Kinyarwanda", "English", "Swahili"],
      availability: "Mon-Fri: 7AM-4PM",
      about: "Leading expert in cattle diseases and reproductive health with international training."
    }
  ]

  const handleSendMessage = () => {
    if (!message.trim()) {
      alert("Please enter a message")
      return
    }
    alert(`Message sent to ${selectedVet.name}`)
    setMessage("")
    setShowMessageForm(false)
    setSelectedVet(null)
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
            <h1 className="text-3xl font-bold">Contact Veterinarian</h1>
            <p className="text-gray-600 mt-2">Get in touch with experienced vets in your area</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Vets List */}
          <div className="lg:col-span-2 space-y-4">
            {vets.map(vet => (
              <Card key={vet.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Vet Photo Placeholder */}
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                      {vet.name.split(' ').map(n => n[0]).join('')}
                    </div>

                    {/* Vet Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-semibold">{vet.name}</h3>
                          <p className="text-gray-600">{vet.specialty}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">{vet.rating}</span>
                          <span className="text-sm text-gray-600">({vet.reviews})</span>
                        </div>
                      </div>

                      <p className="text-sm text-gray-700 mb-3">{vet.about}</p>

                      <div className="grid md:grid-cols-2 gap-3 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          {vet.location}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="w-4 h-4" />
                          {vet.phone}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="w-4 h-4" />
                          {vet.email}
                        </div>
                        <div className="text-sm text-gray-600">
                          <strong>Experience:</strong> {vet.experience}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {vet.languages.map((lang, index) => (
                          <Badge key={index} variant="secondary">{lang}</Badge>
                        ))}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Button 
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => {
                            setSelectedVet(vet)
                            setShowMessageForm(true)
                          }}
                        >
                          <MessageCircle className="w-4 h-4 mr-1" />
                          Send Message
                        </Button>
                        <Button 
                          size="sm"
                          variant="outline"
                          onClick={() => window.location.href = `tel:${vet.phone}`}
                        >
                          <Phone className="w-4 h-4 mr-1" />
                          Call Now
                        </Button>
                        <Button 
                          size="sm"
                          variant="outline"
                          onClick={() => router.push(`/dashboard/farmer/appointments/book?vetId=${vet.id}`)}
                        >
                          <Calendar className="w-4 h-4 mr-1" />
                          Book Appointment
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Message Form */}
            {showMessageForm && selectedVet && (
              <Card>
                <CardHeader>
                  <CardTitle>Send Message</CardTitle>
                  <CardDescription>Send a message to {selectedVet.name}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Type your message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={6}
                  />
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={handleSendMessage}
                    >
                      Send
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setShowMessageForm(false)
                        setSelectedVet(null)
                        setMessage("")
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Emergency Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Emergency Contact</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">
                  For urgent veterinary emergencies, call our 24/7 hotline:
                </p>
                <Button 
                  className="w-full bg-red-600 hover:bg-red-700"
                  onClick={() => window.location.href = 'tel:+250788000000'}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  +250 788 000 000
                </Button>
              </CardContent>
            </Card>

            {/* Quick Tips */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Tips</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2 text-gray-600">
                <p>• Check vet availability before calling</p>
                <p>• Have livestock details ready</p>
                <p>• Describe symptoms clearly</p>
                <p>• Mention if it's urgent</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}