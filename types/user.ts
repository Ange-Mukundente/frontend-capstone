export interface User {
  id: number
  email: string
  name: string
  role: "farmer" | "veterinarian" | "admin"
  phone: string
  createdAt: string
  updatedAt: string
}

export interface Farmer extends User {
  role: "farmer"
  district: string
  sector: string
  cell: string
}

export interface Veterinarian extends User {
  role: "veterinarian"
  licenseNumber: string
  specialization: string
  district: string
  sector: string
  yearsOfExperience: number
  rating: number
  availability: "available" | "busy" | "offline"
  bio?: string
  services: string[]
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  name: string
  role: "farmer" | "veterinarian"
  phone: string
  district: string
  sector: string
  cell?: string
  licenseNumber?: string
  specialization?: string
}
