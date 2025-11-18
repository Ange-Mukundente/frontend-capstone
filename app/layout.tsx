import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import LayoutWrapper from "@/components/LayoutWrapper"
import OfflineIndicator from "@/components/OfflineIndicator"
import SyncStatusIndicator from "@/components/SyncStatusIndicator"
import 'leaflet/dist/leaflet.css'

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "VetConnect Rwanda - Smart Veterinary Appointment Booking",
  description:
    "Connect with certified veterinarians, manage livestock health records, and receive predictive health alerts. Accessible via web and SMS for farmers across Rwanda.",
  generator: "v0.app",
  manifest: '/manifest.json',
  applicationName: 'VetConnect Rwanda',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'VetConnect Rwanda'
  },
  formatDetection: {
    telephone: false
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/icon-192x192.png',
  }
}

export const viewport: Viewport = {
  themeColor: '#16a34a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        {/* Disable default alerts */}
        <script dangerouslySetInnerHTML={{
          __html: `
            window.alert = function() {};
            window.confirm = function() { return true; };
          `
        }} />
        
        {/* Enhanced Service Worker Registration with Offline Support */}
        <script dangerouslySetInnerHTML={{
          __html: `
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                // Register service worker (next-pwa generates this as sw.js)
                navigator.serviceWorker.register('/sw.js', { 
                  scope: '/',
                  updateViaCache: 'none'
                })
                  .then(function(registration) {
                    console.log('✅ ServiceWorker registered:', registration.scope);
                    
                    // Listen for updates
                    registration.addEventListener('updatefound', function() {
                      console.log('🔄 ServiceWorker update found');
                      const newWorker = registration.installing;
                      
                      if (newWorker) {
                        newWorker.addEventListener('statechange', function() {
                          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            console.log('🎉 New ServiceWorker available - reload to activate');
                            
                            // Auto-reload after 3 seconds if offline features updated
                            setTimeout(function() {
                              console.log('🔄 Auto-reloading to activate new service worker');
                              newWorker.postMessage({ type: 'SKIP_WAITING' });
                              window.location.reload();
                            }, 3000);
                          }
                          if (newWorker.state === 'activated') {
                            console.log('✅ ServiceWorker activated');
                          }
                        });
                      }
                    });

                    // Check for updates every minute
                    setInterval(function() {
                      registration.update();
                    }, 60000);

                    // Cache important farmer pages on first load
                    if (registration.active) {
                      const pagesToCache = [
                        '/dashboard/farmer',
                        '/dashboard/farmer/livestock',
                        '/dashboard/farmer/appointments',
                        '/dashboard/farmer/health-records',
                        '/dashboard/farmer/reports',
                        '/dashboard/farmer/alerts',
                        '/dashboard/farmer/contact-vet',
                        '/dashboard/farmer/help'
                      ];

                      registration.active.postMessage({
                        type: 'CACHE_PAGES',
                        pages: pagesToCache
                      });
                    }
                  })
                  .catch(function(error) {
                    console.error('❌ ServiceWorker registration failed:', error);
                  });

                // Enhanced online/offline detection
                let wasOffline = !navigator.onLine;
                
                window.addEventListener('online', function() {
                  console.log('🌐 Back online!');
                  if (wasOffline) {
                    // Dispatch custom event for components to listen to
                    const event = new CustomEvent('connection-status-changed', { 
                      detail: { online: true } 
                    });
                    window.dispatchEvent(event);
                    
                    // Try to sync pending data
                    if ('sync' in registration) {
                      registration.sync.register('sync-data').catch(function(err) {
                        console.log('Sync registration failed:', err);
                      });
                    }
                  }
                  wasOffline = false;
                });
                
                window.addEventListener('offline', function() {
                  console.log('📡 Gone offline - switching to cached mode');
                  wasOffline = true;
                  const event = new CustomEvent('connection-status-changed', { 
                    detail: { online: false } 
                  });
                  window.dispatchEvent(event);
                });

                // Initial status log
                if (!navigator.onLine) {
                  console.log('📡 Starting in offline mode');
                } else {
                  console.log('🌐 Starting online');
                }
              });
            } else {
              console.warn('⚠️ Service Workers not supported in this browser');
            }
          `
        }} />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <OfflineIndicator />
        <SyncStatusIndicator />
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
        <Toaster />
      </body>
    </html>
  )
}