"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Heart,
  Users,
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Menu,
  LogOut,
  User,
  Settings,
  BarChart3,
  Shield,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Mock data - replace with actual API calls
  const totalFarmers = 1248
  const totalVets = 45
  const totalAppointments = 3421
  const activeToday = 87
  const systemHealth = "Excellent"

  const recentUsers = [
    {
      id: 1,
      name: "Jean Baptiste",
      role: "Farmer",
      district: "Nyagatare",
      joinedDate: "Oct 14, 2025",
      status: "active",
    },
    {
      id: 2,
      name: "Dr. Paul Nkusi",
      role: "Veterinarian",
      district: "Gatsibo",
      joinedDate: "Oct 13, 2025",
      status: "active",
    },
    {
      id: 3,
      name: "Marie Uwase",
      role: "Farmer",
      district: "Kayonza",
      joinedDate: "Oct 12, 2025",
      status: "pending",
    },
    {
      id: 4,
      name: "Dr. Grace Mukamana",
      role: "Veterinarian",
      district: "Nyagatare",
      joinedDate: "Oct 11, 2025",
      status: "active",
    },
  ]

  const systemAlerts = [
    {
      id: 1,
      type: "info",
      message: "Database backup completed successfully",
      time: "2 hours ago",
    },
    {
      id: 2,
      type: "warning",
      message: "SMS service usage at 85% of monthly limit",
      time: "5 hours ago",
    },
    {
      id: 3,
      type: "success",
      message: "New veterinarian verification completed",
      time: "1 day ago",
    },
  ]

  const districtStats = [
    { district: "Nyagatare", farmers: 342, vets: 12, appointments: 856 },
    { district: "Gatsibo", farmers: 298, vets: 10, appointments: 723 },
    { district: "Kayonza", farmers: 245, vets: 8, appointments: 612 },
    { district: "Kirehe", farmers: 189, vets: 7, appointments: 487 },
    { district: "Rwamagana", farmers: 174, vets: 8, appointments: 743 },
  ]

  const pendingVerifications = [
    {
      id: 1,
      name: "Dr. Joseph Habimana",
      type: "Veterinarian",
      license: "VET-2025-089",
      submittedDate: "Oct 13, 2025",
    },
    {
      id: 2,
      name: "Dr. Alice Uwera",
      type: "Veterinarian",
      license: "VET-2025-090",
      submittedDate: "Oct 14, 2025",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600">
                  <Heart className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold">VetConnect Rwanda</span>
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="destructive" className="hidden sm:flex">
                <Shield className="h-3 w-3 mr-1" />
                Admin
              </Badge>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Monitor and manage the VetConnect Rwanda platform</p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Farmers</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalFarmers}</div>
              <p className="text-xs text-green-600 mt-1">↑ 12% this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Veterinarians</CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalVets}</div>
              <p className="text-xs text-green-600 mt-1">↑ 3 new this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAppointments}</div>
              <p className="text-xs text-gray-500 mt-1">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Today</CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeToday}</div>
              <p className="text-xs text-gray-500 mt-1">Users online</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">System Health</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{systemHealth}</div>
              <p className="text-xs text-gray-500 mt-1">All systems operational</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* User Management */}
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Recent registrations and user activity</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="recent" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="recent">Recent Users</TabsTrigger>
                    <TabsTrigger value="pending">
                      Pending Verification
                      {pendingVerifications.length > 0 && (
                        <Badge variant="destructive" className="ml-2">
                          {pendingVerifications.length}
                        </Badge>
                      )}
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="recent" className="space-y-4">
                    {recentUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">{user.name}</h4>
                            <Badge variant={user.status === "active" ? "default" : "secondary"}>
                              {user.status}
                            </Badge>
                            <Badge variant="outline">{user.role}</Badge>
                          </div>
                          <p className="text-sm text-gray-600">District: {user.district}</p>
                          <p className="text-sm text-gray-500">Joined: {user.joinedDate}</p>
                        </div>
                        <Button variant="outline" size="sm">
                          View Profile
                        </Button>
                      </div>
                    ))}
                    <Button variant="link" className="w-full text-green-600">
                      View All Users
                    </Button>
                  </TabsContent>

                  <TabsContent value="pending" className="space-y-4">
                    {pendingVerifications.map((verification) => (
                      <div key={verification.id} className="p-4 border rounded-lg bg-yellow-50">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold">{verification.name}</h4>
                              <Badge variant="outline">{verification.type}</Badge>
                            </div>
                            <p className="text-sm text-gray-600">License: {verification.license}</p>
                            <p className="text-sm text-gray-500">Submitted: {verification.submittedDate}</p>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              Approve
                            </Button>
                            <Button size="sm" variant="outline">
                              Review
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* District Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>District Coverage</CardTitle>
                <CardDescription>Platform usage across districts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {districtStats.map((stat, index) => (
                    <div key={index} className="p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{stat.district}</h4>
                        <Badge variant="outline">{stat.appointments} appointments</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Farmers: </span>
                          <span className="font-medium">{stat.farmers}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Vets: </span>
                          <span className="font-medium">{stat.vets}</span>
                        </div>
                      </div>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${(stat.farmers / totalFarmers) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="link" className="w-full mt-4 text-green-600">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  View Detailed Analytics
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full justify-start bg-green-600 hover:bg-green-700">
                  <Users className="mr-2 h-4 w-4" />
                  Manage Users
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="mr-2 h-4 w-4" />
                  System Settings
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Analytics
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Send Alert
                </Button>
              </CardContent>
            </Card>

            {/* System Alerts */}
            <Card>
              <CardHeader>
                <CardTitle>System Alerts</CardTitle>
                <CardDescription>Recent notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {systemAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-3 rounded-lg ${
                        alert.type === "warning"
                          ? "bg-yellow-50 border-l-4 border-yellow-500"
                          : alert.type === "success"
                            ? "bg-green-50 border-l-4 border-green-500"
                            : "bg-blue-50 border-l-4 border-blue-500"
                      }`}
                    >
                      <p className="text-sm font-medium mb-1">{alert.message}</p>
                      <p className="text-xs text-gray-500">{alert.time}</p>
                    </div>
                  ))}
                </div>
                <Button variant="link" className="w-full mt-4 text-green-600">
                  View All Alerts
                </Button>
              </CardContent>
            </Card>

            {/* Platform Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Platform Statistics</CardTitle>
                <CardDescription>This month</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">New Registrations</span>
                  <span className="font-semibold">156</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Appointments</span>
                  <span className="font-semibold">892</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">SMS Sent</span>
                  <span className="font-semibold">3,421</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Avg Response Time</span>
                  <span className="font-semibold text-green-600">1.2 hours</span>
                </div>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Web Platform</span>
                  <Badge className="bg-green-600">Online</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">SMS Service</span>
                  <Badge className="bg-green-600">Online</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Database</span>
                  <Badge className="bg-green-600">Healthy</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">API</span>
                  <Badge className="bg-green-600">Responsive</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}