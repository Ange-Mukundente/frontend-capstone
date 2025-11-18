"use client"

import { useEffect, useState } from 'react'
import { toast } from '@/hooks/use-toast'

export default function RegisterServiceWorker() {
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null)

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      // Register the service worker
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((reg) => {
          console.log('✅ Service Worker registered:', reg.scope)
          setRegistration(reg)

          // Check for updates
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New service worker available
                  toast({
                    title: 'Update Available',
                    description: 'A new version is available. Reload to update.',
                    action: (
                      <button
                        onClick={() => {
                          newWorker.postMessage({ type: 'SKIP_WAITING' })
                          window.location.reload()
                        }}
                        className="px-3 py-1 bg-white text-black rounded text-sm"
                      >
                        Reload
                      </button>
                    ),
                  })
                }
              })
            }
          })
        })
        .catch((error) => {
          console.error('❌ Service Worker registration failed:', error)
        })

      // Handle controller change (new SW activated)
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('🔄 New Service Worker activated')
      })
    } else {
      console.warn('⚠️ Service Workers not supported in this browser')
    }
  }, [])

  return null // This component doesn't render anything
}