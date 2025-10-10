"use client"

import { useState, useEffect } from "react"
import type { Appointment, CreateAppointmentData, UpdateAppointmentData } from "@/types"
import { apiClient } from "@/lib/api-client"
import API_ENDPOINTS from "@/config/api"

export function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAppointments = async () => {
    setLoading(true)
    const response = await apiClient.get<Appointment[]>(API_ENDPOINTS.APPOINTMENTS)

    if (response.success && response.data) {
      setAppointments(response.data)
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchAppointments()
  }, [])

  const createAppointment = async (data: CreateAppointmentData) => {
    const response = await apiClient.post<Appointment>(API_ENDPOINTS.APPOINTMENTS, data)

    if (response.success && response.data) {
      setAppointments([...appointments, response.data])
    }

    return response
  }

  const updateAppointment = async (id: number, data: UpdateAppointmentData) => {
    const response = await apiClient.put<Appointment>(API_ENDPOINTS.APPOINTMENT_BY_ID(id), data)

    if (response.success && response.data) {
      setAppointments(appointments.map((apt) => (apt.id === id ? response.data! : apt)))
    }

    return response
  }

  const cancelAppointment = async (id: number) => {
    const response = await apiClient.delete(API_ENDPOINTS.APPOINTMENT_BY_ID(id))

    if (response.success) {
      setAppointments(appointments.filter((apt) => apt.id !== id))
    }

    return response
  }

  return {
    appointments,
    loading,
    createAppointment,
    updateAppointment,
    cancelAppointment,
    refetch: fetchAppointments,
  }
}
