"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft, AlertTriangle, Bell, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function HealthAlerts() {
  const router = useRouter()

  const healthAlerts = [
    {
      id: 1,
      type: "vaccination",
      message: "Vaccination due for Cow #1 and Cow #2",
      date: "Oct 16, 2025",
      priority: "high",
      status: "active"
    },
    {
      id: 2,
      type: "disease",
      message: "Foot and Mouth Disease alert in your district",
      date: "Oct 14, 2025",
      priority: "medium",
      status: "active"
    },
    {
      id: 3,
      type: "checkup",
      message: "Annual checkup recommended for Goat #3",
      date: "Oct 12, 2025",
      priority: "low",
      status: "active"
    },
    {
      id: 4,
      type: "vaccination",
      message: "Deworming due for all goats",
      date: "Oct 10, 2025",
      priority: "medium",
      status: "active"
    }
  ]

  // ✅ Add type annotation for the parameter
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-red-500 bg-red-50"
      case "medium":
        return "border-orange-500 bg-orange-50"
      case "low":
        return "border-blue-500 bg-blue-50"
      default:
        return "border-gray-500 bg-gray-50"
    }
  }

  // ✅ Add type annotation for the parameter
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-500">High Priority</Badge>
      case "medium":
        return <Badge className="bg-orange-500">Medium Priority</Badge>
      case "low":
        return <Badge className="bg-blue-500">Low Priority</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
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
            <h1 className="text-3xl font-bold">Health Alerts</h1>
            <p className="text-gray-600 mt-2">Important notifications about your livestock</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{healthAlerts.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">High Priority</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {healthAlerts.filter(a => a.priority === "high").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Active Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {healthAlerts.filter(a => a.status === "active").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts List */}
        <div className="space-y-4">
          {healthAlerts.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <CheckCircle className="w-12 h-12 mx-auto text-green-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No active alerts</h3>
                <p className="text-gray-600">All your livestock are in good health!</p>
              </CardContent>
            </Card>
          ) : (
            healthAlerts.map((alert) => (
              <Card key={alert.id} className="hover:shadow-lg transition-shadow">
                <CardContent className={`p-6 border-l-4 ${getPriorityColor(alert.priority)}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                        {alert.priority === "high" ? (
                          <AlertTriangle className="w-5 h-5 text-red-600" />
                        ) : (
                          <Bell className="w-5 h-5 text-orange-600" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge
                            variant={alert.type === "vaccination" ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {alert.type}
                          </Badge>
                          {getPriorityBadge(alert.priority)}
                        </div>
                        <span className="text-xs text-gray-500">{alert.date}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-base font-medium mb-4 ml-13">{alert.message}</p>

                  <div className="flex gap-2 ml-13">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      Take Action
                    </Button>
                    <Button size="sm" variant="outline">
                      Dismiss
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Help Card */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>About Health Alerts</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-600 space-y-2">
            <p>• <strong>High Priority:</strong> Requires immediate attention</p>
            <p>• <strong>Medium Priority:</strong> Should be addressed within a few days</p>
            <p>• <strong>Low Priority:</strong> General reminders and recommendations</p>
            <p className="mt-4 pt-4 border-t">
              If you need help with any alert, contact your veterinarian or call our emergency hotline.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
