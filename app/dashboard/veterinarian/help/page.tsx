"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft, BookOpen, Phone, Mail, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function VetHelp() {
  const router = useRouter()

  const resources = [
    {
      title: "Disease Database",
      description: "Comprehensive database of livestock diseases and treatments",
      icon: <BookOpen className="w-6 h-6 text-blue-600" />
    },
    {
      title: "Treatment Protocols",
      description: "Standard treatment protocols for common conditions",
      icon: <FileText className="w-6 h-6 text-green-600" />
    },
    {
      title: "Drug Reference",
      description: "Complete veterinary drug reference and dosage information",
      icon: <BookOpen className="w-6 h-6 text-purple-600" />
    },
    {
      title: "Emergency Procedures",
      description: "Step-by-step emergency treatment procedures",
      icon: <FileText className="w-6 h-6 text-red-600" />
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Help & Resources</h1>
            <p className="text-gray-600 mt-2">Medical resources and support information</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Medical Resources</CardTitle>
                <CardDescription>Access important veterinary medical information</CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                {resources.map((resource, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                      {resource.icon}
                    </div>
                    <h3 className="font-semibold mb-2">{resource.title}</h3>
                    <p className="text-sm text-gray-600">{resource.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Guide</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Managing Appointments</h4>
                  <p className="text-sm text-gray-600">
                    View, confirm, and complete appointments from your dashboard. You can also cancel appointments if needed.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Patient Records</h4>
                  <p className="text-sm text-gray-600">
                    Access complete medical histories, add treatment notes, and track patient progress over time.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Schedule Management</h4>
                  <p className="text-sm text-gray-600">
                    Set your availability and working hours to manage appointment bookings effectively.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Technical Support</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Support
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="w-4 h-4 mr-2" />
                  Email Support
                </Button>
              </CardContent>
            </Card>

            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-600">Emergency Hotline</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 mb-3">24/7 veterinary emergency support</p>
                <Button 
                  className="w-full bg-red-600 hover:bg-red-700"
                  onClick={() => window.location.href = 'tel:+250788000000'}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  +250 788 000 000
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}