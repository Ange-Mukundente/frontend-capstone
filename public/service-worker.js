// service-worker.js - Place this in your /public folder

const CACHE_NAME = 'vetconnect-v1'
const OFFLINE_URL = '/offline'

// Pages and assets to cache for offline use
const urlsToCache = [
  '/',
  '/offline',
  '/dashboard/farmer',
  '/dashboard/farmer/livestock',
  '/dashboard/farmer/appointments',
  '/dashboard/farmer/health-records',
  '/dashboard/farmer/reports',
  '/dashboard/farmer/alerts',
  '/dashboard/farmer/contact-vet',
  '/dashboard/farmer/help',
]

// Install event - cache essential pages
self.addEventListener('install', (event) => {
  console.log('✅ Service Worker installing...')
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('📦 Caching pages for offline use')
      return cache.addAll(urlsToCache.map(url => new Request(url, {
        cache: 'reload'
      })))
    }).catch(err => {
      console.error('❌ Cache installation failed:', err)
    })
  )
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('✅ Service Worker activated')
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  self.clients.claim()
})

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return

  // Skip API requests (let them fail naturally for offline handling)
  if (event.request.url.includes('/api/')) {
    return
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone the response
        const responseToCache = response.clone()

        // Cache successful responses
        if (response.status === 200) {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache)
          })
        }

        return response
      })
      .catch(() => {
        // Network failed, try to serve from cache
        return caches.match(event.request).then((response) => {
          if (response) {
            console.log('📦 Serving from cache:', event.request.url)
            return response
          }

          // If the request is for a page (navigation), show offline page
          if (event.request.mode === 'navigate') {
            return caches.match(OFFLINE_URL)
          }

          // Return a generic offline response
          return new Response('Offline - Content not available', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
              'Content-Type': 'text/plain'
            })
          })
        })
      })
  )
})

// Listen for messages from the client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }

  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(event.data.payload)
      })
    )
  }
})