import { offlineStorage } from './offlineStorage'
import { toast } from '@/hooks/use-toast'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'

export async function fetchWithOffline(
  endpoint: string,
  options: RequestInit = {}
) {
  // Check if online
  if (!navigator.onLine) {
    // Save to pending sync queue
    await offlineStorage.saveOfflineData('pendingSync', {
      endpoint,
      method: options.method || 'GET',
      data: options.body ? JSON.parse(options.body as string) : null,
      token: localStorage.getItem('token'),
      timestamp: new Date().toISOString()
    })

    toast({
      title: 'Saved Offline',
      description: 'Your data will be synced when you\'re back online.',
      variant: 'default'
    })

    throw new Error('OFFLINE_MODE')
  }

  // If online, make the request
  try {
    const response = await fetch(`${BACKEND_URL}${endpoint}`, options)
    return response
  } catch (error) {
    // Network error - save for later
    await offlineStorage.saveOfflineData('pendingSync', {
      endpoint,
      method: options.method || 'GET',
      data: options.body ? JSON.parse(options.body as string) : null,
      token: localStorage.getItem('token'),
      timestamp: new Date().toISOString()
    })

    toast({
      title: 'Network Error',
      description: 'Saved for sync when connection is restored.',
      variant: 'destructive'
    })

    throw error
  }
}