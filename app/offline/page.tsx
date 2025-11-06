"use client"

import { WifiOff, RefreshCw, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useEffect, useState } from 'react'

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(false)

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

  const handleRetry = () => {
    if (navigator.onLine) {
      window.location.href = '/dashboard/farmer'
    } else {
      window.location.reload()
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
              Your connection has been restored. Redirecting...
            </p>
            <Button 
              onClick={handleRetry}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Go to Dashboard
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
            <CardTitle className="text-2xl text-center">You're Offline</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-gray-600">
            Don't worry! VetConnect still works with cached data.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">✅ What you can still do:</h3>
            <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
              <li>View your livestock records</li>
              <li>Check existing appointments</li>
              <li>Review health alerts</li>
              <li>Browse previously loaded pages</li>
              <li>Fill out forms (will sync when online)</li>
            </ul>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-900 mb-2">⚠️ Limited features:</h3>
            <ul className="list-disc list-inside text-sm text-yellow-800 space-y-1">
              <li>Cannot book new appointments</li>
              <li>Cannot add new livestock (cached only)</li>
              <li>Real-time updates unavailable</li>
            </ul>
          </div>

          <Button 
            onClick={handleRetry}
            className="w-full"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Check Connection
          </Button>

          <p className="text-xs text-center text-gray-500">
            Changes will sync automatically when you're back online
          </p>
        </CardContent>
      </Card>
    </div>
  )
}