"use client"

import { useState, useEffect } from "react"
import type { User, LoginCredentials, RegisterData } from "@/types"
import { authService } from "@/lib/auth"
import { useRouter } from "next/navigation"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const storedUser = authService.getStoredUser()
    setUser(storedUser)
    setLoading(false)
  }, [])

  const login = async (credentials: LoginCredentials) => {
    setLoading(true)
    const response = await authService.login(credentials)

    if (response.success && response.data) {
      setUser(response.data.user)
      router.push(`/dashboard/${response.data.user.role}`)
    }

    setLoading(false)
    return response
  }

  const register = async (data: RegisterData) => {
    setLoading(true)
    const response = await authService.register(data)

    if (response.success && response.data) {
      setUser(response.data.user)
      router.push(`/dashboard/${response.data.user.role}`)
    }

    setLoading(false)
    return response
  }

  const logout = async () => {
    await authService.logout()
    setUser(null)
    router.push("/")
  }

  return {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  }
}
