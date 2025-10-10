export interface Appointment {
  id: number
  farmerId: number
  veterinarianId: number
  livestockId: number
  date: string
  time: string
  status: "pending" | "confirmed" | "completed" | "cancelled" | "urgent"
  reason: string
  location: string
  notes?: string
  isEmergency: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateAppointmentData {
  veterinarianId: number
  livestockId: number
  date: string
  time: string
  reason: string
  location: string
  notes?: string
  isEmergency?: boolean
}

export interface UpdateAppointmentData {
  date?: string
  time?: string
  status?: Appointment["status"]
  notes?: string
}
