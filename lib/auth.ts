import type { User, LoginCredentials, RegisterData } from "@/types"
import { apiClient } from "./api-client"
import API_ENDPOINTS from "@/config/api"

export const authService = {
  async login(credentials: LoginCredentials) {
    const response = await apiClient.post<{ token: string; user: User }>(
      API_ENDPOINTS.LOGIN,
      credentials
    )

    if (response.success && response.data) {
      localStorage.setItem("token", response.data.token)
      localStorage.setItem("user", JSON.stringify(response.data.user))
    }

    return response
  },

  async register(data: RegisterData) {
    const response = await apiClient.post<{ token: string; user: User }>(
      API_ENDPOINTS.REGISTER,
      data
    )

    if (response.success && response.data) {
      localStorage.setItem("token", response.data.token)
      localStorage.setItem("user", JSON.stringify(response.data.user))
    }

    return response
  },

  async logout() {
    await apiClient.post(API_ENDPOINTS.LOGOUT, {})
    localStorage.removeItem("token")
    localStorage.removeItem("user")
  },

  async getCurrentUser() {
    return apiClient.get<User>(API_ENDPOINTS.ME)
  },

  getStoredUser(): User | null {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user")
      if (!userStr || userStr === "undefined") return null

      try {
        return JSON.parse(userStr)
      } catch (error) {
        console.error("Failed to parse user from localStorage:", error)
        localStorage.removeItem("user") // Clean up invalid data
        return null
      }
    }
    return null
  },

  isAuthenticated(): boolean {
    if (typeof window !== "undefined") {
      return !!localStorage.getItem("token")
    }
    return false
  },
}
