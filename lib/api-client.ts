interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

class ApiClient {
  private getAuthToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token")
    }
    return null
  }

  private async request<T>(url: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const token = this.getAuthToken()

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    }

    // Merge existing headers if any
    if (options.headers) {
      const existingHeaders = options.headers as Record<string, string>
      Object.assign(headers, existingHeaders)
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Request failed")
      }

      return data
    } catch (error) {
      console.error("API Error:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  async get<T>(url: string): Promise<ApiResponse<T>> {
    return this.request<T>(url, { method: "GET" })
  }

  async post<T>(url: string, data: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async put<T>(url: string, data: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async delete<T>(url: string): Promise<ApiResponse<T>> {
    return this.request<T>(url, { method: "DELETE" })
  }
}

export const apiClient = new ApiClient()