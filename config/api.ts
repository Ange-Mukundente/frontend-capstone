const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

export const API_ENDPOINTS = {
  // Auth
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  ME: `${API_BASE_URL}/auth/me`,

  // Appointments
  APPOINTMENTS: `${API_BASE_URL}/appointments`,
  APPOINTMENT_BY_ID: (id: number) => `${API_BASE_URL}/appointments/${id}`,

  // Livestock
  LIVESTOCK: `${API_BASE_URL}/livestock`,
  LIVESTOCK_BY_ID: (id: number) => `${API_BASE_URL}/livestock/${id}`,
  LIVESTOCK_MEDICAL_RECORDS: (id: number) => `${API_BASE_URL}/livestock/${id}/medical-records`,

  // Veterinarians
  VETERINARIANS: `${API_BASE_URL}/veterinarians`,
  VETERINARIAN_BY_ID: (id: number) => `${API_BASE_URL}/veterinarians/${id}`,
  VETERINARIAN_AVAILABILITY: (id: number) => `${API_BASE_URL}/veterinarians/${id}/availability`,
}

export default API_ENDPOINTS
