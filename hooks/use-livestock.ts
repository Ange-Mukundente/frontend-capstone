"use client"

import { useState, useEffect } from "react"
import type { Livestock, CreateLivestockData, UpdateLivestockData } from "@/types"
import { apiClient } from "@/lib/api-client"
import API_ENDPOINTS from "@/config/api"

export function useLivestock() {
  const [livestock, setLivestock] = useState<Livestock[]>([])
  const [loading, setLoading] = useState(true)

  const fetchLivestock = async () => {
    setLoading(true)
    const response = await apiClient.get<Livestock[]>(API_ENDPOINTS.LIVESTOCK)

    if (response.success && response.data) {
      setLivestock(response.data)
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchLivestock()
  }, [])

  const createLivestock = async (data: CreateLivestockData) => {
    const response = await apiClient.post<Livestock>(API_ENDPOINTS.LIVESTOCK, data)

    if (response.success && response.data) {
      setLivestock([...livestock, response.data])
    }

    return response
  }

  const updateLivestock = async (id: number, data: UpdateLivestockData) => {
    const response = await apiClient.put<Livestock>(API_ENDPOINTS.LIVESTOCK_BY_ID(id), data)

    if (response.success && response.data) {
      setLivestock(livestock.map((animal) => (animal.id === id ? response.data! : animal)))
    }

    return response
  }

  const deleteLivestock = async (id: number) => {
    const response = await apiClient.delete(API_ENDPOINTS.LIVESTOCK_BY_ID(id))

    if (response.success) {
      setLivestock(livestock.filter((animal) => animal.id !== id))
    }

    return response
  }

  return {
    livestock,
    loading,
    createLivestock,
    updateLivestock,
    deleteLivestock,
    refetch: fetchLivestock,
  }
}
