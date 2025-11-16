"use client"

import { WifiOff, RefreshCw, Check, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if we're actually online now
    setIsOnline(navigator.onLine)

    const handleOnline = () => {
      setIsOnline(true)
      // Auto-redirect after 2 seconds
      setTimeout(() => {
        window.location.href = '/dashboard/farmer'
      }, 2000)
    }

    const handleOffline = () => {
      setIsOnline(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const handleGoBack = () => {
    // Go back to previous page
    router.back()
  }

  const handleGoHome = () => {
    // Go to dashboard
    router.push('/dashboard/farmer')
  }

  const handleRetry = () => {
    if (navigator.onLine) {
      window.location.reload()
    } else {
      // Try to go back if offline
      router.back()
    }
  }

  if (isOnline) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Check className="w-10 h-10 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-center text-green-600">Back Online!</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-gray-600">
              Your connection has been restored. Refreshing...
            </p>
            <Button 
              onClick={handleRetry}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Refresh Page
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <div className="flex flex-col items-center">
            <WifiOff className="w-16 h-16 text-red-500 mb-4" />
            <CardTitle className="text-2xl text-center">Page Not Available Offline</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-gray-600">
            This page wasn't cached for offline use. You can still access other cached pages.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">✅ What you can still do:</h3>
            <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
              <li>View your livestock records</li>
              <li>Check the main dashboard</li>
              <li>Browse previously visited pages</li>
            </ul>
          </div>

          <div className="space-y-2">
            <Button 
              onClick={handleGoBack}
              variant="outline"
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
            
            <Button 
              onClick={handleGoHome}
              className="w-full"
            >
              Go to Dashboard
            </Button>

            <Button 
              onClick={handleRetry}
              variant="secondary"
              className="w-full"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Check Connection
            </Button>
          </div>

          <p className="text-xs text-center text-gray-500">
            This page will be available offline once you visit it while online
          </p>
        </CardContent>
      </Card>
    </div>
  )
}