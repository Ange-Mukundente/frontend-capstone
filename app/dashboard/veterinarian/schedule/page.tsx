"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Calendar, Clock, Plus, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export default function VetSchedule() {
  const router = useRouter()
  const [schedule, setSchedule] = useState({
    monday: { start: "08:00", end: "17:00", available: true },
    tuesday: { start: "08:00", end: "17:00", available: true },
    wednesday: { start: "08:00", end: "17:00", available: true },
    thursday: { start: "08:00", end: "17:00", available: true },
    friday: { start: "08:00", end: "17:00", available: true },
    saturday: { start: "09:00", end: "13:00", available: true },
    sunday: { start: "", end: "", available: false }
  })

  const handleSave = () => {
    localStorage.setItem("vetSchedule", JSON.stringify(schedule))
    alert("Schedule saved successfully!")
  }

  const handleToggleDay = (day) => {
    setSchedule(prev => ({
      ...prev,
      [day]: { ...prev[day], available: !prev[day].available }
    }))
  }

  const handleTimeChange = (day, field, value) => {
    setSchedule(prev => ({
      ...prev,
      [day]: { ...prev[day], [field]: value }
    }))
  }

  const days = [
    { key: "monday", label: "Monday" },
    { key: "tuesday", label: "Tuesday" },
    { key: "wednesday", label: "Wednesday" },
    { key: "thursday", label: "Thursday" },
    { key: "friday", label: "Friday" },
    { key: "saturday", label: "Saturday" },
    { key: "sunday", label: "Sunday" }
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
            <h1 className="text-3xl font-bold">Manage Schedule</h1>
            <p className="text-gray-600 mt-2">Set your availability for appointments</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Schedule Settings */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Schedule</CardTitle>
                <CardDescription>Configure your working hours for each day</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {days.map((day) => (
                  <div key={day.key} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="flex items-center gap-2 w-32">
                      <input
                        type="checkbox"
                        checked={schedule[day.key].available}
                        onChange={() => handleToggleDay(day.key)}
                        className="w-4 h-4"
                      />
                      <label className="font-medium">{day.label}</label>
                    </div>
                    
                    {schedule[day.key].available ? (
                      <div className="flex items-center gap-4 flex-1">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-600" />
                          <Input
                            type="time"
                            value={schedule[day.key].start}
                            onChange={(e) => handleTimeChange(day.key, "start", e.target.value)}
                            className="w-32"
                          />
                        </div>
                        <span className="text-gray-600">to</span>
                        <Input
                          type="time"
                          value={schedule[day.key].end}
                          onChange={(e) => handleTimeChange(day.key, "end", e.target.value)}
                          className="w-32"
                        />
                      </div>
                    ) : (
                      <span className="text-gray-500 italic">Unavailable</span>
                    )}
                  </div>
                ))}

                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 mt-6"
                  onClick={handleSave}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Schedule
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Quick Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Schedule Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Available Days:</span>
                  <span className="font-medium">
                    {Object.values(schedule).filter(s => s.available).length} / 7
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Hours/Week:</span>
                  <span className="font-medium">
                    {Object.values(schedule).reduce((total, day) => {
                      if (!day.available || !day.start || !day.end) return total
                      const start = parseInt(day.start.split(':')[0])
                      const end = parseInt(day.end.split(':')[0])
                      return total + (end - start)
                    }, 0)} hours
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tips</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2 text-gray-600">
                <p>• Set realistic working hours</p>
                <p>• Leave buffer time between appointments</p>
                <p>• Update your schedule regularly</p>
                <p>• Block time for emergencies</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}