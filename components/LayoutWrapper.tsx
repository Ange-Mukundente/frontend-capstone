"use client"

import { usePathname } from "next/navigation"
import NavigationBar from "./NavigationBar"

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  // Pages where we DON'T want the NavigationBar
  const noNavbarPages = [
    "/auth/login",
    "/auth/register",
  ]
  
  const showNavbar = !noNavbarPages.includes(pathname)
  
  return (
    <>
      {showNavbar && <NavigationBar />}
      {children}
    </>
  )
}