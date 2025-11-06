import { offlineStorage } from './offlineStorage'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'

export async function syncPendingData() {
  if (!navigator.onLine) {
    console.log('Still offline, skipping sync')
    return
  }

  try {
    const pendingData = await offlineStorage.getOfflineData('pendingSync')

    if (pendingData.length === 0) {
      console.log('No pending data to sync')
      return
    }

    console.log(`Syncing ${pendingData.length} pending items...`)

    for (const item of pendingData) {
      try {
        const response = await fetch(`${BACKEND_URL}${item.endpoint}`, {
          method: item.method,
          headers: {
            'Content-Type': 'application/json',
            ...(item.token && { 'Authorization': `Bearer ${item.token}` })
          },
          body: JSON.stringify(item.data)
        })

        if (response.ok) {
          console.log('Successfully synced:', item)
          // Remove from pending after successful sync
          // You'll need to implement deleteById in offlineStorage
        } else {
          console.error('Failed to sync:', item, response.status)
        }
      } catch (error) {
        console.error('Error syncing item:', error)
      }
    }

    // Clear synced items
    await offlineStorage.clearStore('pendingSync')
    console.log('Sync complete!')
  } catch (error) {
    console.error('Background sync failed:', error)
  }
}

// Auto-sync when back online
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    console.log('Back online! Starting sync...')
    syncPendingData()
  })
}