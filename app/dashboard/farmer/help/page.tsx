"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft, BookOpen, Video, MessageCircle, Phone, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function UserGuide() {
  const router = useRouter()

  const guideTopics = [
    {
      id: 1,
      title: "Getting Started",
      description: "Learn how to set up your account and add your first livestock",
      icon: <BookOpen className="w-6 h-6 text-green-600" />,
      sections: [
        "Creating your account",
        "Adding livestock information",
        "Understanding the dashboard",
        "Setting up notifications"
      ]
    },
    {
      id: 2,
      title: "Managing Livestock",
      description: "How to add, update, and track your animals",
      icon: <BookOpen className="w-6 h-6 text-blue-600" />,
      sections: [
        "Adding new livestock",
        "Updating health status",
        "Recording vaccinations",
        "Managing livestock records"
      ]
    },
    {
      id: 3,
      title: "Booking Appointments",
      description: "Schedule veterinary visits for your livestock",
      icon: <BookOpen className="w-6 h-6 text-purple-600" />,
      sections: [
        "Finding a veterinarian",
        "Booking an appointment",
        "Managing appointments",
        "Canceling or rescheduling"
      ]
    },
    {
      id: 4,
      title: "Health Records",
      description: "Access and manage medical history",
      icon: <BookOpen className="w-6 h-6 text-orange-600" />,
      sections: [
        "Viewing health records",
        "Understanding diagnoses",
        "Medication tracking",
        "Vaccination schedules"
      ]
    }
  ]

  const faqs = [
    {
      question: "How do I add new livestock?",
      answer: "Go to 'Manage Livestock' from your dashboard, then click the 'Add Livestock' button. Fill in the required information including name, type, breed, and health status."
    },
    {
      question: "How do I book an appointment?",
      answer: "Click 'Book Appointment' on your dashboard, select the livestock, choose a veterinarian, pick a date and time, and provide the reason for the visit."
    },
    {
      question: "How do I update my livestock's health status?",
      answer: "Go to 'Manage Livestock', find the animal you want to update, click 'Update', then change the health status and add any relevant notes."
    },
    {
      question: "Can I use VetConnect via SMS?",
      answer: "Yes! You can send SMS commands to +250 788 000 000. Use commands like 'BOOK', 'STATUS', 'ALERT', and 'HELP' for quick access."
    },
    {
      question: "What should I do in an emergency?",
      answer: "Call our 24/7 emergency hotline at +250 788 000 000 immediately. Our team will connect you with the nearest available veterinarian."
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
            <h1 className="text-3xl font-bold">Help & User Guide</h1>
            <p className="text-gray-600 mt-2">Everything you need to know about using VetConnect Rwanda</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Guide Topics */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Start Guide</CardTitle>
                <CardDescription>Learn the basics of using VetConnect</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {guideTopics.map((topic) => (
                  <div key={topic.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                        {topic.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">{topic.title}</h3>
                        <p className="text-sm text-gray-600 mb-3">{topic.description}</p>
                        <ul className="space-y-1">
                          {topic.sections.map((section, index) => (
                            <li key={index} className="text-sm text-gray-700">
                              • {section}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* FAQs */}
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>Common questions and answers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="border-b pb-4 last:border-b-0">
                    <h4 className="font-semibold mb-2">{faq.question}</h4>
                    <p className="text-sm text-gray-600">{faq.answer}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Video Tutorials */}
            <Card>
              <CardHeader>
                <CardTitle>Video Tutorials</CardTitle>
                <CardDescription>Watch step-by-step guides</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center mb-3">
                      <Video className="w-8 h-8 text-gray-400" />
                    </div>
                    <h4 className="font-semibold mb-1">Getting Started</h4>
                    <p className="text-sm text-gray-600">5 minutes</p>
                  </div>
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center mb-3">
                      <Video className="w-8 h-8 text-gray-400" />
                    </div>
                    <h4 className="font-semibold mb-1">Managing Livestock</h4>
                    <p className="text-sm text-gray-600">7 minutes</p>
                  </div>
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center mb-3">
                      <Video className="w-8 h-8 text-gray-400" />
                    </div>
                    <h4 className="font-semibold mb-1">Booking Appointments</h4>
                    <p className="text-sm text-gray-600">4 minutes</p>
                  </div>
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center mb-3">
                      <Video className="w-8 h-8 text-gray-400" />
                    </div>
                    <h4 className="font-semibold mb-1">Using SMS Features</h4>
                    <p className="text-sm text-gray-600">3 minutes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Support */}
            <Card>
              <CardHeader>
                <CardTitle>Need More Help?</CardTitle>
                <CardDescription>Contact our support team</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => window.location.href = 'tel:+250788000000'}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call Support
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => window.location.href = 'mailto:support@vetconnect.rw'}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Email Support
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => router.push('/dashboard/farmer/contact-vet')}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contact Vet
                </Button>
              </CardContent>
            </Card>

            {/* Emergency */}
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-red-600">Emergency Contact</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">
                  For urgent veterinary emergencies, call our 24/7 hotline immediately:
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
                <CardTitle>Quick Tips</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2 text-gray-600">
                <p>💡 Keep your livestock records up to date</p>
                <p>💡 Schedule regular checkups</p>
                <p>💡 Respond to health alerts promptly</p>
                <p>💡 Save your vet's contact information</p>
                <p>💡 Enable SMS notifications for updates</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}