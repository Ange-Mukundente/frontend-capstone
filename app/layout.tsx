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
        <script dangerouslySetInnerHTML={{
          __html: `
            window.alert = function() {};
            window.confirm = function() { return true; };
          `
        }} />
        <script dangerouslySetInnerHTML={{
          __html: `
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js', { 
                  scope: '/',
                  updateViaCache: 'none'
                })
                  .then(function(registration) {
                    console.log('✅ ServiceWorker registered:', registration.scope);
                    
                    registration.addEventListener('updatefound', function() {
                      console.log('🔄 ServiceWorker update found');
                      const newWorker = registration.installing;
                      
                      if (newWorker) {
                        newWorker.addEventListener('statechange', function() {
                          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            console.log('🎉 New ServiceWorker available');
                          }
                          if (newWorker.state === 'activated') {
                            console.log('✅ ServiceWorker activated');
                          }
                        });
                      }
                    });

                    setInterval(function() {
                      registration.update();
                    }, 60000);
                  })
                  .catch(function(error) {
                    console.error('❌ ServiceWorker registration failed:', error);
                  });

                let wasOffline = !navigator.onLine;
                
                window.addEventListener('online', function() {
                  console.log('🌐 Back online!');
                  if (wasOffline) {
                    const event = new CustomEvent('connection-status-changed', { 
                      detail: { online: true } 
                    });
                    window.dispatchEvent(event);
                  }
                  wasOffline = false;
                });
                
                window.addEventListener('offline', function() {
                  console.log('📡 Gone offline');
                  wasOffline = true;
                  const event = new CustomEvent('connection-status-changed', { 
                    detail: { online: false } 
                  });
                  window.dispatchEvent(event);
                });

                if (!navigator.onLine) {
                  console.log('📡 Starting in offline mode');
                }
              });
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