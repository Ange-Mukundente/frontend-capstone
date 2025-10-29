"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, FileText, Calendar, User, Stethoscope, Pill, AlertCircle, Download, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Report {
  id: number
  appointmentId: number
  farmerName: string
  livestockName: string
  livestockType: string
  visitDate: string
  reportDate: string
  vetName: string
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

export default function FarmerViewReports() {
  const router = useRouter()
  const [reports, setReports] = useState<Report[]>([])
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterLivestock, setFilterLivestock] = useState("all")

  useEffect(() => {
    loadReports()
  }, [])

  const loadReports = () => {
    try {
      const userStr = localStorage.getItem("user")
      const currentUser = userStr && userStr !== "undefined" ? JSON.parse(userStr) : { name: "Farmer" }
      
      const storedReports = localStorage.getItem("vetReports")
      let allReports: Report[] = []
      
      if (storedReports && storedReports !== "undefined") {
        allReports = JSON.parse(storedReports)
      }
      
      // If no reports exist OR farmer has no reports, create 3 sample reports
      const existingFarmerReports = allReports.filter(report => report.farmerName === currentUser.name)
      
      if (existingFarmerReports.length === 0) {
        const sampleReports = [
          {
            id: Date.now() + 1,
            appointmentId: 1,
            farmerName: currentUser.name,
            livestockName: "Cow #1",
            livestockType: "Cattle",
            visitDate: "2025-10-20",
            reportDate: "2025-10-20T14:30:00",
            vetName: "Dr. Claudine Umutoni",
            diagnosis: "Pregnancy confirmed - approximately 5 months gestation",
            symptoms: "Normal appetite, good body condition",
            treatment: "Prenatal vitamin supplementation started",
            medications: "Vitamin A & D supplement - 10ml\nCalcium supplement - 15ml",
            prescriptionDosage: "Administer vitamins weekly until calving. Calcium supplement twice weekly.",
            followUpDate: "2025-11-15",
            followUpRequired: true,
            pregnancyStatus: "Pregnant - 5 months",
            generalCondition: "Excellent",
            weight: "455kg",
            temperature: "38.5°C",
            additionalNotes: "Expected calving date: Late February 2026. Monitor closely as calving approaches.",
            recommendations: "Provide high-quality feed. Ensure access to clean water. Reduce stress. Schedule calving assistance if needed."
          },
          {
            id: Date.now() + 2,
            appointmentId: 2,
            farmerName: currentUser.name,
            livestockName: "Goat #1",
            livestockType: "Goat",
            visitDate: "2025-10-15",
            reportDate: "2025-10-15T10:15:00",
            vetName: "Dr. Grace Mukamana",
            diagnosis: "Mild parasitic infection (internal parasites)",
            symptoms: "Reduced appetite, slight weight loss, rough coat",
            treatment: "Deworming treatment administered",
            medications: "Albendazole - 5ml oral\nVitamin B complex - 2ml injection",
            prescriptionDosage: "Single dose administered. Repeat in 14 days if symptoms persist.",
            followUpDate: "2025-10-29",
            followUpRequired: true,
            pregnancyStatus: "",
            generalCondition: "Fair",
            weight: "42kg",
            temperature: "39.0°C",
            additionalNotes: "Weight should improve within 2 weeks. Monitor stool consistency.",
            recommendations: "Rotate pasture to prevent reinfection. Provide mineral supplements. Keep housing clean and dry. Monitor weight gain over next 2 weeks."
          },
          {
            id: Date.now() + 3,
            appointmentId: 3,
            farmerName: currentUser.name,
            livestockName: "Cow #2",
            livestockType: "Cattle",
            visitDate: "2025-10-10",
            reportDate: "2025-10-10T09:00:00",
            vetName: "Dr. Emmanuel Nkusi",
            diagnosis: "Mastitis in left rear quarter (bacterial infection)",
            symptoms: "Swollen udder, reduced milk production, elevated temperature, pain on palpation",
            treatment: "Antibiotic treatment initiated, anti-inflammatory administered",
            medications: "Penicillin G - intramammary infusion\nFlunixin meglumine - 10ml IV\nOxytocin - 2ml to aid milk let-down",
            prescriptionDosage: "Intramammary infusion twice daily for 3 days. Anti-inflammatory once daily for 3 days. Discard milk for 5 days.",
            followUpDate: "2025-10-13",
            followUpRequired: true,
            pregnancyStatus: "",
            generalCondition: "Fair",
            weight: "420kg",
            temperature: "39.8°C",
            additionalNotes: "Milk from treated quarter must be discarded for 5 days. Isolate from other lactating animals.",
            recommendations: "Strip affected quarter 3-4 times daily. Apply warm compresses. Improve milking hygiene. Check for improvement in 48 hours. DO NOT sell or consume milk for 5 days after last treatment."
          }
        ]
        
        // Add sample reports to existing reports
        allReports = [...allReports, ...sampleReports]
        localStorage.setItem("vetReports", JSON.stringify(allReports))
        setReports(sampleReports)
      } else {
        setReports(existingFarmerReports)
      }
    } catch (error) {
      console.error("Error loading reports:", error)
    }
  }

  const filteredReports = reports.filter(report => {
    const matchesSearch = searchQuery === "" ||
      report.livestockName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.vetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.diagnosis.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesLivestock = filterLivestock === "all" || 
      report.livestockName === filterLivestock

    return matchesSearch && matchesLivestock
  })

  const uniqueLivestock = Array.from(new Set(reports.map(r => r.livestockName)))

  const handleViewDetails = (report: Report) => {
    setSelectedReport(report)
    setShowDetails(true)
  }

  const getConditionBadge = (condition: string) => {
    switch(condition) {
      case "Excellent":
        return <Badge className="bg-green-600">Excellent</Badge>
      case "Good":
        return <Badge className="bg-green-500">Good</Badge>
      case "Fair":
        return <Badge className="bg-yellow-500">Fair</Badge>
      case "Poor":
        return <Badge className="bg-orange-500">Poor</Badge>
      case "Critical":
        return <Badge className="bg-red-600">Critical</Badge>
      default:
        return <Badge variant="outline">{condition}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  const downloadReport = (report: Report) => {
    const reportText = `
VETERINARY MEDICAL REPORT
========================

VISIT INFORMATION
-----------------
Farmer: ${report.farmerName}
Livestock: ${report.livestockName} (${report.livestockType})
Visit Date: ${formatDate(report.visitDate)}
Report Date: ${formatDate(report.reportDate)}
Veterinarian: ${report.vetName}

GENERAL CONDITION
-----------------
Overall Condition: ${report.generalCondition}
Weight: ${report.weight || 'N/A'}
Temperature: ${report.temperature || 'N/A'}
${report.pregnancyStatus ? `Pregnancy Status: ${report.pregnancyStatus}` : ''}

SYMPTOMS & DIAGNOSIS
--------------------
Symptoms: ${report.symptoms || 'None recorded'}
Diagnosis: ${report.diagnosis}

TREATMENT & MEDICATIONS
-----------------------
Treatment: ${report.treatment || 'None'}
Medications: ${report.medications || 'None prescribed'}
Dosage & Instructions: ${report.prescriptionDosage || 'N/A'}

FOLLOW-UP
---------
Follow-up Required: ${report.followUpRequired ? 'Yes' : 'No'}
${report.followUpDate ? `Follow-up Date: ${formatDate(report.followUpDate)}` : ''}

RECOMMENDATIONS
---------------
${report.recommendations || 'No specific recommendations'}

ADDITIONAL NOTES
----------------
${report.additionalNotes || 'None'}

---
This is an official veterinary medical report.
Generated: ${new Date().toLocaleString()}
    `.trim()

    const blob = new Blob([reportText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Vet_Report_${report.livestockName}_${report.visitDate}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="mb-4 hover:bg-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Veterinary Reports</h1>
                <p className="text-gray-600">View medical reports for your livestock</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6 shadow-md border-gray-200">
          <CardHeader className="border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <CardTitle className="text-lg">Filter Reports</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Search */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search by livestock, vet, or diagnosis..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Livestock Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Livestock</label>
                <Select value={filterLivestock} onValueChange={setFilterLivestock}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select livestock" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Livestock</SelectItem>
                    {uniqueLivestock.map(name => (
                      <SelectItem key={name} value={name}>{name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Filters */}
            {(searchQuery || filterLivestock !== "all") && (
              <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                <span className="text-gray-600 font-medium">Active:</span>
                {searchQuery && (
                  <Badge variant="secondary">Search: "{searchQuery}"</Badge>
                )}
                {filterLivestock !== "all" && (
                  <Badge variant="secondary">Livestock: {filterLivestock}</Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("")
                    setFilterLivestock("all")
                  }}
                  className="h-6 text-xs"
                >
                  Clear all
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="mb-4 text-sm text-gray-600">
          Showing <span className="font-semibold text-gray-900">{filteredReports.length}</span> of{" "}
          <span className="font-semibold text-gray-900">{reports.length}</span> reports
        </div>

        {/* Reports Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredReports.length === 0 ? (
            <Card className="col-span-full shadow-md border-gray-200">
              <CardContent className="py-16 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">No reports found</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  {reports.length === 0 
                    ? "You don't have any veterinary reports yet. Reports will appear here after vet visits."
                    : "Try adjusting your search criteria"}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredReports.map((report) => (
              <Card 
                key={report.id}
                className="hover:shadow-xl transition-all duration-200 border-gray-200 bg-white"
              >
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{report.livestockName}</h3>
                      <p className="text-sm text-gray-600">{report.livestockType}</p>
                    </div>
                    {getConditionBadge(report.generalCondition)}
                  </div>

                  {/* Veterinarian Info */}
                  <div className="mb-4 p-3 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg border border-blue-100">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-gray-600" />
                      <span className="text-gray-600">Veterinarian:</span>
                      <span className="font-medium text-gray-900">{report.vetName}</span>
                    </div>
                  </div>

                  {/* Visit Details */}
                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-600" />
                      <span className="text-gray-600">Visit Date:</span>
                      <span className="font-medium text-gray-900">{formatDate(report.visitDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Stethoscope className="w-4 h-4 text-gray-600" />
                      <span className="text-gray-600">Diagnosis:</span>
                      <span className="font-medium text-gray-900 truncate">{report.diagnosis}</span>
                    </div>
                  </div>

                  {/* Key Findings */}
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Key Findings</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {report.weight && (
                        <div>
                          <span className="text-gray-600">Weight:</span>
                          <span className="ml-1 font-medium">{report.weight} kg</span>
                        </div>
                      )}
                      {report.temperature && (
                        <div>
                          <span className="text-gray-600">Temp:</span>
                          <span className="ml-1 font-medium">{report.temperature}°C</span>
                        </div>
                      )}
                      {report.pregnancyStatus && (
                        <div className="col-span-2">
                          <span className="text-gray-600">Pregnancy:</span>
                          <span className="ml-1 font-medium">{report.pregnancyStatus}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Follow-up Alert */}
                  {report.followUpRequired && (
                    <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm">
                        <p className="font-medium text-yellow-800">Follow-up Required</p>
                        {report.followUpDate && (
                          <p className="text-yellow-700">Scheduled: {formatDate(report.followUpDate)}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-4 border-t border-gray-100">
                    <Button 
                      size="sm" 
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={() => handleViewDetails(report)}
                    >
                      <FileText className="w-4 h-4 mr-1" />
                      View Full Report
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => downloadReport(report)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Detailed Report Modal */}
        <Dialog open={showDetails} onOpenChange={setShowDetails}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-900">
                Medical Report: {selectedReport?.livestockName}
              </DialogTitle>
            </DialogHeader>
            
            {selectedReport && (
              <div className="mt-4 space-y-6">
                
                {/* Visit Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Visit Information</CardTitle>
                  </CardHeader>
                  <CardContent className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Visit Date</p>
                      <p className="font-semibold">{formatDate(selectedReport.visitDate)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Report Date</p>
                      <p className="font-semibold">{formatDate(selectedReport.reportDate)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Veterinarian</p>
                      <p className="font-semibold">{selectedReport.vetName}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">General Condition</p>
                      {getConditionBadge(selectedReport.generalCondition)}
                    </div>
                  </CardContent>
                </Card>

                {/* Vitals */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Stethoscope className="w-5 h-5 text-blue-600" />
                      Vitals & Physical Exam
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    {selectedReport.weight && (
                      <div>
                        <p className="text-gray-600">Weight</p>
                        <p className="font-semibold">{selectedReport.weight} kg</p>
                      </div>
                    )}
                    {selectedReport.temperature && (
                      <div>
                        <p className="text-gray-600">Temperature</p>
                        <p className="font-semibold">{selectedReport.temperature}°C</p>
                      </div>
                    )}
                    {selectedReport.pregnancyStatus && (
                      <div>
                        <p className="text-gray-600">Pregnancy Status</p>
                        <p className="font-semibold">{selectedReport.pregnancyStatus}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Symptoms & Diagnosis */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-orange-600" />
                      Symptoms & Diagnosis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    {selectedReport.symptoms && (
                      <div>
                        <p className="text-gray-600 mb-1">Observed Symptoms</p>
                        <p className="bg-gray-50 p-3 rounded-lg">{selectedReport.symptoms}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-gray-600 mb-1">Diagnosis</p>
                      <p className="bg-blue-50 p-3 rounded-lg font-medium">{selectedReport.diagnosis}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Treatment & Medications */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Pill className="w-5 h-5 text-green-600" />
                      Treatment & Medications
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    {selectedReport.treatment && (
                      <div>
                        <p className="text-gray-600 mb-1">Treatment Provided</p>
                        <p className="bg-gray-50 p-3 rounded-lg">{selectedReport.treatment}</p>
                      </div>
                    )}
                    {selectedReport.medications && (
                      <div>
                        <p className="text-gray-600 mb-1">Medications Prescribed</p>
                        <p className="bg-gray-50 p-3 rounded-lg whitespace-pre-line">{selectedReport.medications}</p>
                      </div>
                    )}
                    {selectedReport.prescriptionDosage && (
                      <div>
                        <p className="text-gray-600 mb-1">Dosage & Instructions</p>
                        <p className="bg-green-50 p-3 rounded-lg">{selectedReport.prescriptionDosage}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Recommendations */}
                {selectedReport.recommendations && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      <p className="bg-blue-50 p-4 rounded-lg">{selectedReport.recommendations}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Follow-up */}
                {selectedReport.followUpRequired && (
                  <Card className="border-yellow-200 bg-yellow-50">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-yellow-600" />
                        Follow-up Required
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      {selectedReport.followUpDate && (
                        <p className="font-semibold">Scheduled for: {formatDate(selectedReport.followUpDate)}</p>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Additional Notes */}
                {selectedReport.additionalNotes && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Additional Notes</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      <p className="bg-gray-50 p-3 rounded-lg">{selectedReport.additionalNotes}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Download Button */}
                <Button 
                  onClick={() => downloadReport(selectedReport)}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Report as Text File
                </Button>

              </div>
            )}
          </DialogContent>
        </Dialog>

      </div>
    </div>
  )
}