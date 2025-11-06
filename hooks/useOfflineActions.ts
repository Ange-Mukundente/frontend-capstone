'use client'

import { useState, useEffect } from 'react'
import { offlineStorage } from '@/lib/offlineStorage'

export function useOfflineActions() {
  const [isOnline, setIsOnline] = useState(true)
  const [pendingCount, setPendingCount] = useState(0)
  const [syncing, setSyncing] = useState(false)

  useEffect(() => {
    // Initialize offline storage
    offlineStorage.init()

    // Check online status
    setIsOnline(navigator.onLine)

    // Update pending count
    const updatePendingCount = async () => {
      const count = await offlineStorage.getPendingCount()
      setPendingCount(count)
    }

    updatePendingCount()

    // Listen for online/offline events
    const handleOnline = () => {
      console.log('🌐 Back online!')
      setIsOnline(true)
      updatePendingCount()
    }

    const handleOffline = () => {
      console.log('📡 Gone offline')
      setIsOnline(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Update pending count periodically
    const interval = setInterval(updatePendingCount, 5000)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      clearInterval(interval)
    }
  }, [])

  // Queue an action for offline sync
  const queueAction = async (
    type: 'add-livestock' | 'update-livestock' | 'delete-livestock' | 'book-appointment' | 'update-appointment' | 'cancel-appointment',
    data: any
  ) => {
    await offlineStorage.saveOfflineData('pendingSync', {
      type,
      data,
      endpoint: '/api/livestock',
      method: type.includes('delete') ? 'DELETE' : type.includes('update') ? 'PUT' : 'POST',
      token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
      timestamp: new Date().toISOString()
    })
    
    const count = await offlineStorage.getPendingCount()
    setPendingCount(count)
  }

  // Manually trigger sync
  const triggerSync = async () => {
    setSyncing(true)
    // Add your sync logic here
    setSyncing(false)
  }

  return {
    isOnline,
    pendingCount,
    syncing,
    queueAction,
    triggerSync,
  }
}