"use client"

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { WifiOff } from 'lucide-react'

const CACHED_PAGES_KEY = 'vetconnect_cached_pages'

export default function OfflineHandler() {
  const [isOnline, setIsOnline] = useState(true)
  const pathname = usePathname()

  useEffect(() => {
    // Cache current page
    const cachedPages = JSON.parse(localStorage.getItem(CACHED_PAGES_KEY) || '[]')
    if (!cachedPages.includes(pathname)) {
      cachedPages.push(pathname)
      localStorage.setItem(CACHED_PAGES_KEY, JSON.stringify(cachedPages))
    }

    // Monitor online/offline
    const updateStatus = () => {
      setIsOnline(navigator.onLine)
    }

    setIsOnline(navigator.onLine)
    window.addEventListener('online', updateStatus)
    window.addEventListener('offline', updateStatus)

    return () => {
      window.removeEventListener('online', updateStatus)
      window.removeEventListener('offline', updateStatus)
    }
  }, [pathname])

  if (isOnline) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-500 text-white px-4 py-2 flex items-center justify-center gap-2">
      <WifiOff className="w-4 h-4" />
      <span className="font-medium">You're offline - Showing cached data</span>
    </div>
  )
}