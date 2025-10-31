"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  ArrowLeft, BarChart, TrendingUp, Users, Stethoscope, 
  Calendar, FileText, Download, Activity, PieChart 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function AnalyticsReports() {
  const router = useRouter()

  const monthlyData = [
    { month: "Jan", farmers: 2, vets: 3, appointments: 8 },
    { month: "Feb", farmers: 1, vets: 2, appointments: 12 },
    { month: "Mar", farmers: 2, vets: 4, appointments: 15 },
    { month: "Apr", farmers: 1, vets: 2, appointments: 18 },
    { month: "May", farmers: 2, vets: 3, appointments: 22 },
    { month: "Jun", farmers: 0, vets: 2, appointments: 25 },
  ]

  const districtStats = [
    { name: "Kigali", farmers: 2, vets: 5, appointments: 45 },
    { name: "Nyagatare", farmers: 4, vets: 6, appointments: 38 },
    { name: "Gatsibo", farmers: 2, vets: 5, appointments: 27 },
  ]

  const topVets = [
    { name: "Dr. Paul Nkusi", animalPatients: 32, rating: 4.9 },
    { name: "Dr. Sarah Mukamana", animalPatients: 24, rating: 4.8 },
    { name: "Dr. Grace Uwera", animalPatients: 18, rating: 4.7 },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-orange-600 flex items-center justify-center">
                  <BarChart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
                  <p className="text-gray-600">Platform statistics and insights</p>
                </div>
              </div>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <Badge className="bg-blue-200 text-blue-800">+12%</Badge>
              </div>
              <p className="text-sm text-gray-600 mb-1">Total Farmers</p>
              <p className="text-3xl font-bold text-blue-600">8</p>
              <p className="text-xs text-gray-500 mt-2">↑ 2 this month</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-green-600 flex items-center justify-center">
                  <Stethoscope className="w-6 h-6 text-white" />
                </div>
                <Badge className="bg-green-200 text-green-800">+8%</Badge>
              </div>
              <p className="text-sm text-gray-600 mb-1">Total Vets</p>
              <p className="text-3xl font-bold text-green-600">16</p>
              <p className="text-xs text-gray-500 mt-2">↑ 3 this month</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <Badge className="bg-purple-200 text-purple-800">+15%</Badge>
              </div>
              <p className="text-sm text-gray-600 mb-1">Appointments</p>
              <p className="text-3xl font-bold text-purple-600">110</p>
              <p className="text-xs text-gray-500 mt-2">↑ 25 this month</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-orange-600 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <Badge className="bg-orange-200 text-orange-800">+10%</Badge>
              </div>
              <p className="text-sm text-gray-600 mb-1">Reports</p>
              <p className="text-3xl font-bold text-orange-600">85</p>
              <p className="text-xs text-gray-500 mt-2">↑ 12 this month</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts & Data */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Monthly Growth */}
          <Card className="lg:col-span-2 border-0 shadow-lg">
            <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-white">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                Monthly Growth
              </CardTitle>
              <CardDescription>Platform growth over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {monthlyData.map((data, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-16 text-sm font-medium text-gray-600">{data.month}</div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                          <div 
                            className="h-full bg-blue-600 rounded-full transition-all" 
                            style={{ width: `${(data.farmers / 4) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600 w-20">
                          {data.farmers} Farmers
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                          <div 
                            className="h-full bg-green-600 rounded-full transition-all" 
                            style={{ width: `${(data.vets / 4) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600 w-20">
                          {data.vets} Vets
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                          <div 
                            className="h-full bg-purple-600 rounded-full transition-all" 
                            style={{ width: `${(data.appointments / 30) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600 w-20">
                          {data.appointments} Appts
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Performers */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="border-b bg-gradient-to-r from-yellow-50 to-orange-50">
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-orange-600" />
                Top Veterinarians
              </CardTitle>
              <CardDescription>Most active this month</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {topVets.map((vet, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                        index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-400'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{vet.name}</p>
                        <p className="text-xs text-gray-600">{vet.animalPatients} Animal Patients</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-yellow-100 text-yellow-700">
                        ⭐ {vet.rating}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* District Statistics */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-white">
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-blue-600" />
              District Statistics
            </CardTitle>
            <CardDescription>Coverage and activity by district</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">District</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Farmers</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Veterinarians</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Total Appointments</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Activity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {districtStats.map((district, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <span className="font-medium text-gray-900">{district.name}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-blue-600" />
                          <span className="font-medium">{district.farmers}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Stethoscope className="w-4 h-4 text-green-600" />
                          <span className="font-medium">{district.vets}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-purple-600" />
                          <span className="font-medium">{district.appointments}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
                            style={{ width: `${(district.appointments / 50) * 100}%` }}
                          ></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}