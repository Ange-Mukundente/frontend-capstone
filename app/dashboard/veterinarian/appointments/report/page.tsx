"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, FileText, Stethoscope, Pill, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

interface Appointment {
  id: number
  farmerName: string
  livestockName: string
  livestockType: string
  date: string
  time: string
  reason: string
  status: string
}

interface ReportData {
  diagnosis: string
  symptoms: string
  treatment: string
  medications: string
  prescriptionDosage: string
  followUpDate: string
  followUpRequired: boolean
  pregnancyStatus: string
  generalCondition: string
  weight: string
  temperature: string
  additionalNotes: string
  recommendations: string
}

export default function PostVisitReport() {
  const router = useRouter()
  const { toast } = useToast()
  const [appointmentId, setAppointmentId] = useState<string>("")
  const [appointment, setAppointment] = useState<Appointment | null>(null)
  const [reportData, setReportData] = useState<ReportData>({
    diagnosis: "",
    symptoms: "",
    treatment: "",
    medications: "",
    prescriptionDosage: "",
    followUpDate: "",
    followUpRequired: false,
    pregnancyStatus: "",
    generalCondition: "",
    weight: "",
    temperature: "",
    additionalNotes: "",
    recommendations: ""
  })

  // Load appointment from URL or localStorage
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const id = params.get("appointmentId")
    
    if (id) {
      setAppointmentId(id)
      loadAppointment(id)
    }
  }, [])

  const loadAppointment = (id: string) => {
    try {
      const storedAppointments = localStorage.getItem("appointments")
      if (storedAppointments) {
        const appointments = JSON.parse(storedAppointments)
        const found = appointments.find((apt: Appointment) => apt.id.toString() === id)
        if (found) {
          setAppointment(found)
        }
      }
    } catch (error) {
      console.error("Error loading appointment:", error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setReportData(prev => ({ ...prev, [name]: checked }))
    } else {
      setReportData(prev => ({ ...prev, [name]: value }))
    }
  }

  const getTodayDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  const handleSubmit = () => {
    if (!reportData.diagnosis || !reportData.generalCondition) {
      alert("Please fill in required fields (Diagnosis and General Condition)")
      return
    }

    if (!appointment) {
      alert("No appointment selected")
      return
    }

    // Create report object
    const report = {
      id: Date.now(),
      appointmentId: appointment.id,
      farmerName: appointment.farmerName,
      livestockName: appointment.livestockName,
      livestockType: appointment.livestockType,
      visitDate: appointment.date,
      reportDate: new Date().toISOString(),
      ...reportData,
      vetName: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!).name : "Dr. Veterinarian"
    }

    try {
      // Save report
      const existingReports = localStorage.getItem("vetReports")
      const reports = existingReports ? JSON.parse(existingReports) : []
      reports.push(report)
      localStorage.setItem("vetReports", JSON.stringify(reports))

      // Update appointment status to completed
      const storedAppointments = localStorage.getItem("appointments")
      if (storedAppointments) {
        const appointments = JSON.parse(storedAppointments)
        const updatedAppointments = appointments.map((apt: Appointment) => 
          apt.id === appointment.id ? { ...apt, status: "completed" } : apt
        )
        localStorage.setItem("appointments", JSON.stringify(updatedAppointments))
      }

      toast({ 
        title: "✅ Report Saved Successfully", 
        description: "The farmer can now view this report"
      })

      // Redirect back to appointments
      setTimeout(() => {
        router.push("/dashboard/veterinarian/appointments")
      }, 1500)
    } catch (error) {
      console.error("Error saving report:", error)
      alert("Error saving report. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        
        {/* Header */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="mb-4 hover:bg-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Appointments
          </Button>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Post-Visit Report</h1>
                <p className="text-gray-600">Document your findings and recommendations</p>
              </div>
            </div>
          </div>
        </div>

        {/* Appointment Info */}
        {appointment && (
          <Card className="mb-6 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-lg">Visit Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Farmer</p>
                  <p className="font-semibold text-gray-900">{appointment.farmerName}</p>
                </div>
                <div>
                  <p className="text-gray-600">Livestock</p>
                  <p className="font-semibold text-gray-900">{appointment.livestockName} ({appointment.livestockType})</p>
                </div>
                <div>
                  <p className="text-gray-600">Visit Date</p>
                  <p className="font-semibold text-gray-900">{appointment.date} at {appointment.time}</p>
                </div>
                <div>
                  <p className="text-gray-600">Reason for Visit</p>
                  <p className="font-semibold text-gray-900">{appointment.reason}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Report Form */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Medical Report</CardTitle>
            <CardDescription>Complete all relevant sections for the farmer's records</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">

            {/* General Condition & Vitals */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-blue-600" />
                General Condition & Vitals
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="generalCondition">
                    General Condition <span className="text-red-600">*</span>
                  </Label>
                  <select
                    id="generalCondition"
                    name="generalCondition"
                    className="w-full px-3 py-2 border rounded-md mt-1"
                    value={reportData.generalCondition}
                    onChange={handleInputChange}
                  >
                    <option value="">Select condition...</option>
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Poor">Poor</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    name="weight"
                    type="text"
                    placeholder="e.g., 455"
                    value={reportData.weight}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="temperature">Temperature (°C)</Label>
                  <Input
                    id="temperature"
                    name="temperature"
                    type="text"
                    placeholder="e.g., 38.5"
                    value={reportData.temperature}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                </div>

                {appointment?.reason === "Pregnancy Check" && (
                  <div>
                    <Label htmlFor="pregnancyStatus">Pregnancy Status</Label>
                    <select
                      id="pregnancyStatus"
                      name="pregnancyStatus"
                      className="w-full px-3 py-2 border rounded-md mt-1"
                      value={reportData.pregnancyStatus}
                      onChange={handleInputChange}
                    >
                      <option value="">Select status...</option>
                      <option value="Pregnant">Pregnant</option>
                      <option value="Not Pregnant">Not Pregnant</option>
                      <option value="Uncertain - Recheck Required">Uncertain - Recheck Required</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Symptoms & Diagnosis */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                Symptoms & Diagnosis
              </h3>

              <div>
                <Label htmlFor="symptoms">Observed Symptoms</Label>
                <Textarea
                  id="symptoms"
                  name="symptoms"
                  placeholder="Describe any symptoms observed during examination..."
                  value={reportData.symptoms}
                  onChange={handleInputChange}
                  rows={3}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="diagnosis">
                  Diagnosis <span className="text-red-600">*</span>
                </Label>
                <Textarea
                  id="diagnosis"
                  name="diagnosis"
                  placeholder="Provide your professional diagnosis..."
                  value={reportData.diagnosis}
                  onChange={handleInputChange}
                  rows={3}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Treatment & Medications */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Pill className="w-5 h-5 text-green-600" />
                Treatment & Medications
              </h3>

              <div>
                <Label htmlFor="treatment">Treatment Provided</Label>
                <Textarea
                  id="treatment"
                  name="treatment"
                  placeholder="Describe the treatment administered..."
                  value={reportData.treatment}
                  onChange={handleInputChange}
                  rows={3}
                  className="mt-1"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="medications">Medications Prescribed</Label>
                  <Textarea
                    id="medications"
                    name="medications"
                    placeholder="List all medications (one per line)"
                    value={reportData.medications}
                    onChange={handleInputChange}
                    rows={3}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="prescriptionDosage">Dosage & Instructions</Label>
                  <Textarea
                    id="prescriptionDosage"
                    name="prescriptionDosage"
                    placeholder="Provide dosage and administration instructions"
                    value={reportData.prescriptionDosage}
                    onChange={handleInputChange}
                    rows={3}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Follow-up */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                Follow-up & Recommendations
              </h3>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="followUpRequired"
                  name="followUpRequired"
                  checked={reportData.followUpRequired}
                  onChange={handleInputChange}
                  className="w-4 h-4"
                />
                <Label htmlFor="followUpRequired" className="cursor-pointer">
                  Follow-up visit required
                </Label>
              </div>

              {reportData.followUpRequired && (
                <div>
                  <Label htmlFor="followUpDate">Follow-up Date</Label>
                  <Input
                    id="followUpDate"
                    name="followUpDate"
                    type="date"
                    min={getTodayDate()}
                    value={reportData.followUpDate}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="recommendations">Recommendations for Farmer</Label>
                <Textarea
                  id="recommendations"
                  name="recommendations"
                  placeholder="Provide care instructions and recommendations for the farmer..."
                  value={reportData.recommendations}
                  onChange={handleInputChange}
                  rows={4}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="additionalNotes">Additional Notes</Label>
                <Textarea
                  id="additionalNotes"
                  name="additionalNotes"
                  placeholder="Any other observations or comments..."
                  value={reportData.additionalNotes}
                  onChange={handleInputChange}
                  rows={3}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-6 border-t">
              <Button 
                onClick={handleSubmit}
                className="flex-1 bg-green-600 hover:bg-green-700"
                disabled={!appointment}
              >
                <Save className="w-4 h-4 mr-2" />
                Save Report & Send to Farmer
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
    </div>
  )
}