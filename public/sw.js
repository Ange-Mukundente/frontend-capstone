// Service Worker for VetConnect - Offline Support
const CACHE_NAME = 'vetconnect-v1'
const API_CACHE_NAME = 'vetconnect-api-v1'

// Critical files to cache for offline functionality
const STATIC_ASSETS = [
  '/',
  '/dashboard/farmer',
  '/dashboard/farmer/livestock',
  '/dashboard/farmer/appointments',
  '/dashboard/farmer/appointments/book',
  '/offline',
  '/manifest.json'
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...')
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache')
      return cache.addAll(STATIC_ASSETS).catch(err => {
        console.error('Failed to cache:', err)
        // Don't fail the install if caching fails
        return Promise.resolve()
      })
    }).then(() => {
      // Force the waiting service worker to become the active service worker
      return self.skipWaiting()
    })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...')
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== API_CACHE_NAME) {
            console.log('Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    }).then(() => {
      // Take control of all pages immediately
      return self.clients.claim()
    })
  )
})

// Fetch event - serve from cache when offline, or fetch from network
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone the response before caching
          const responseToCache = response.clone()
          
          // Cache successful API responses
          if (response.ok) {
            caches.open(API_CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache)
            })
          }
          
          return response
        })
        .catch(() => {
          // If fetch fails, try to return cached response
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              console.log('Serving API from cache:', request.url)
              return cachedResponse
            }
            
            // Return a generic error response
            return new Response(
              JSON.stringify({ 
                success: false, 
                message: 'Offline - no cached data available',
                offline: true 
              }),
              {
                status: 503,
                headers: { 'Content-Type': 'application/json' }
              }
            )
          })
        })
    )
    return
  }

  // Handle navigation requests (HTML pages)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache the page
          const responseToCache = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache)
          })
          return response
        })
        .catch(() => {
          // If offline, try to serve from cache
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              console.log('Serving page from cache:', request.url)
              return cachedResponse
            }
            
            // If no cache, redirect to offline page
            return caches.match('/offline').then((offlinePage) => {
              return offlinePage || new Response('Offline', { status: 503 })
            })
          })
        })
    )
    return
  }

  // Handle all other requests (CSS, JS, images, etc.)
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Serve from cache, but also update cache in background
        fetch(request)
          .then((response) => {
            if (response.ok) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, response.clone())
              })
            }
          })
          .catch(() => {
            // Network fetch failed, but we already have cached version
          })
        
        return cachedResponse
      }

      // Not in cache, fetch from network
      return fetch(request)
        .then((response) => {
          // Cache successful responses
          if (response.ok) {
            const responseToCache = response.clone()
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache)
            })
          }
          return response
        })
        .catch((error) => {
          console.error('Fetch failed:', error)
          
          // For images, return a placeholder
          if (request.destination === 'image') {
            return new Response(
              '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="#ddd"/><text x="50%" y="50%" text-anchor="middle" fill="#999">Offline</text></svg>',
              { headers: { 'Content-Type': 'image/svg+xml' } }
            )
          }
          
          throw error
        })
    })
  )
})

// Handle background sync for queued requests
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag)
  
  if (event.tag === 'sync-appointments') {
    event.waitUntil(syncAppointments())
  }
  
  if (event.tag === 'sync-livestock') {
    event.waitUntil(syncLivestock())
  }
})

// Sync queued appointments when back online
async function syncAppointments() {
  try {
    const cache = await caches.open('pending-requests')
    const requests = await cache.keys()
    
    for (const request of requests) {
      if (request.url.includes('/api/appointments')) {
        try {
          await fetch(request.clone())
          await cache.delete(request)
          console.log('Synced appointment:', request.url)
        } catch (error) {
          console.error('Failed to sync appointment:', error)
        }
      }
    }
  } catch (error) {
    console.error('Sync appointments failed:', error)
  }
}

// Sync queued livestock when back online
async function syncLivestock() {
  try {
    const cache = await caches.open('pending-requests')
    const requests = await cache.keys()
    
    for (const request of requests) {
      if (request.url.includes('/api/livestock')) {
        try {
          await fetch(request.clone())
          await cache.delete(request)
          console.log('Synced livestock:', request.url)
        } catch (error) {
          console.error('Failed to sync livestock:', error)
        }
      }
    }
  } catch (error) {
    console.error('Sync livestock failed:', error)
  }
}

// Handle push notifications
self.addEventListener('push', (event) => {
  console.log('Push notification received:', event)
  
  const options = {
    body: event.data ? event.data.text() : 'New notification from VetConnect',
    icon: '/icon-192x192.png',
    badge: '/icon-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  }
  
  event.waitUntil(
    self.registration.showNotification('VetConnect', options)
  )
})

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event)
  event.notification.close()
  
  event.waitUntil(
    clients.openWindow('/dashboard/farmer')
  )
})