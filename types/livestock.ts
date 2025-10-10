export interface Livestock {
  id: number
  farmerId: number
  type: "cattle" | "goat" | "sheep" | "pig" | "chicken" | "other"
  breed: string
  tagNumber: string
  age: number
  gender: "male" | "female"
  healthStatus: "healthy" | "sick" | "recovering" | "critical"
  lastVaccination?: string
  nextVaccination?: string
  medicalHistory: MedicalRecord[]
  createdAt: string
  updatedAt: string
}

export interface MedicalRecord {
  id: number
  livestockId: number
  date: string
  type: "vaccination" | "treatment" | "checkup" | "surgery" | "other"
  description: string
  veterinarianId: number
  veterinarianName: string
  medications?: string[]
  notes?: string
  createdAt: string
}

export interface CreateLivestockData {
  type: Livestock["type"]
  breed: string
  tagNumber: string
  age: number
  gender: Livestock["gender"]
}

export interface UpdateLivestockData {
  age?: number
  healthStatus?: Livestock["healthStatus"]
  lastVaccination?: string
  nextVaccination?: string
}
