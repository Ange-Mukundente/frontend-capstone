import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import LayoutWrapper from "@/components/LayoutWrapper"
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
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
        <Toaster />
      </body>
    </html>
  )
}