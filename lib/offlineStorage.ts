export interface PendingSyncItem {
  id?: number
  endpoint: string
  method: string
  data: any
  token: string | null
  timestamp: string
  type: string
}

export class OfflineStorage {
  private dbName = 'VetConnectDB'
  private version = 1
  private db: IDBDatabase | null = null

  async init(): Promise<void> {
    if (this.db) return // Already initialized

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version)

      request.onerror = () => {
        console.error('❌ IndexedDB error:', request.error)
        reject(request.error)
      }
      
      request.onsuccess = () => {
        this.db = request.result
        console.log('✅ Offline storage initialized')
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // Create stores only if they don't exist
        if (!db.objectStoreNames.contains('pendingSync')) {
          const syncStore = db.createObjectStore('pendingSync', { 
            keyPath: 'id', 
            autoIncrement: true 
          })
          syncStore.createIndex('timestamp', 'timestamp', { unique: false })
        }

        if (!db.objectStoreNames.contains('cachedData')) {
          db.createObjectStore('cachedData', { keyPath: 'key' })
        }
      }
    })
  }

  async saveOfflineData(storeName: string, data: any): Promise<void> {
    try {
      if (!this.db) await this.init()

      return new Promise((resolve, reject) => {
        const transaction = this.db!.transaction([storeName], 'readwrite')
        const store = transaction.objectStore(storeName)
        const request = store.add(data)

        request.onsuccess = () => {
          console.log('✅ Saved offline data')
          resolve()
        }
        request.onerror = () => {
          console.error('❌ Error saving:', request.error)
          reject(request.error)
        }
      })
    } catch (error) {
      console.error('❌ Storage error:', error)
      throw error
    }
  }

  async getOfflineData(storeName: string): Promise<any[]> {
    try {
      if (!this.db) await this.init()

      return new Promise((resolve, reject) => {
        const transaction = this.db!.transaction([storeName], 'readonly')
        const store = transaction.objectStore(storeName)
        const request = store.getAll()

        request.onsuccess = () => resolve(request.result || [])
        request.onerror = () => {
          console.error('❌ Error reading:', request.error)
          reject(request.error)
        }
      })
    } catch (error) {
      console.error('❌ Storage error:', error)
      return []
    }
  }

  async deleteById(storeName: string, id: number): Promise<void> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.delete(id)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async clearStore(storeName: string): Promise<void> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.clear()

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async getPendingCount(): Promise<number> {
    try {
      const pending = await this.getOfflineData('pendingSync')
      return pending.length
    } catch {
      return 0
    }
  }
}

export const offlineStorage = new OfflineStorage()

// Initialize on load
if (typeof window !== 'undefined') {
  offlineStorage.init().catch(err => {
    console.error('Failed to initialize offline storage:', err)
  })
}