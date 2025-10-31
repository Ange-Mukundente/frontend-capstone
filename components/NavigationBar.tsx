"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { 
  Heart, Home, Info, Mail, LogIn, LogOut, Menu, X, User, 
  LayoutDashboard, Users, Stethoscope, Send, BarChart, Bell,
  Calendar, Beef, FileText, Activity, AlertTriangle, Phone, MessageSquare, Clock
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function NavigationBar() {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const userStr = localStorage.getItem("user")
    if (userStr && userStr !== "undefined") {
      setUser(JSON.parse(userStr))
    }
  }, [pathname])

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("user")
      setUser(null)
      router.push("/")
    }
  }

  const getDashboardLink = () => {
    if (user?.role === "farmer") return "/dashboard/farmer"
    if (user?.role === "veterinarian") return "/dashboard/veterinarian"
    if (user?.role === "admin") return "/dashboard/admin"
    return "/"
  }

  const isDashboard = pathname.includes("/dashboard")

  // Role-specific navigation menus
  const getNavigationLinks = () => {
    if (!user || !isDashboard) {
      // Public navigation (landing pages)
      return [
        { name: "Home", href: "/", icon: Home },
        { name: "About", href: "/about", icon: Info },
        { name: "Contact", href: "/contact", icon: Mail },
      ]
    }

    // Admin navigation
    if (user.role === "admin") {
      return [
        { name: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
        { name: "Farmers", href: "/dashboard/admin/farmers", icon: Users },
        { name: "Veterinarians", href: "/dashboard/admin/veterinarians", icon: Stethoscope },
        { name: "Send Alerts", href: "/dashboard/admin/send-alerts", icon: Send },
        { name: "Analytics", href: "/dashboard/admin/reports", icon: BarChart },
        { name: "Alerts History", href: "/dashboard/admin/alerts-history", icon: Bell },
      ]
    }

    // Farmer navigation
    if (user.role === "farmer") {
      return [
        { name: "Dashboard", href: "/dashboard/farmer", icon: LayoutDashboard },
        { name: "My Livestock", href: "/dashboard/farmer/livestock", icon: Beef },
        { name: "Appointments", href: "/dashboard/farmer/appointments", icon: Calendar },
        { name: "Book Appointment", href: "/dashboard/farmer/appointments/book", icon: Calendar },
        { name: "Health Records", href: "/dashboard/farmer/health-records", icon: Activity },
        { name: "Vet Reports", href: "/dashboard/farmer/reports", icon: FileText },
        { name: "Alerts", href: "/dashboard/farmer/alerts", icon: AlertTriangle },
      ]
    }

    // Veterinarian navigation
    if (user.role === "veterinarian" || user.role === "vet") {
      return [
        { name: "Dashboard", href: "/dashboard/veterinarian", icon: LayoutDashboard },
        { name: "Appointments", href: "/dashboard/veterinarian/appointments", icon: Calendar },
        { name: "Animal Patients", href: "/dashboard/veterinarian/patients", icon: Users },
        { name: "Schedule", href: "/dashboard/veterinarian/schedule", icon: Clock },
        { name: "Messages", href: "/dashboard/veterinarian/messages", icon: MessageSquare },
        { name: "Help", href: "/dashboard/veterinarian/help", icon: Bell },
      ]
    }

    return []
  }

  const navLinks = getNavigationLinks()

  const isActive = (href: string) => {
    if (href === "/" || href === "/dashboard/farmer" || href === "/dashboard/veterinarian" || href === "/dashboard/admin") {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  const getRoleBadgeColor = () => {
    if (user?.role === "admin") return "bg-purple-600"
    if (user?.role === "veterinarian" || user?.role === "vet") return "bg-blue-600"
    if (user?.role === "farmer") return "bg-green-600"
    return "bg-gray-600"
  }

  const getRoleDisplayName = () => {
    if (user?.role === "veterinarian" || user?.role === "vet") return "Veterinarian"
    if (user?.role === "admin") return "Admin"
    if (user?.role === "farmer") return "Farmer"
    return user?.role
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link href={user ? getDashboardLink() : "/"} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" fill="white" />
            </div>
            <span className="font-bold text-xl text-gray-900 hidden sm:inline">VetConnect Rwanda</span>
            <span className="font-bold text-lg text-gray-900 sm:hidden">VetConnect</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon
              const active = isActive(link.href)
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                    active
                      ? isDashboard
                        ? `${getRoleBadgeColor()} text-white font-semibold shadow-md`
                        : "text-green-600 bg-green-50 font-semibold"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{link.name}</span>
                </Link>
              )
            })}
          </div>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <>
                {/* User Info */}
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
                  <User className="w-4 h-4 text-gray-600" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">{user.name}</span>
                    <Badge className={`${getRoleBadgeColor()} text-white text-xs px-2 py-0`}>
                      {getRoleDisplayName()}
                    </Badge>
                  </div>
                </div>

                {/* Logout Button */}
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => router.push("/auth/login")}
                  variant="outline"
                  size="sm"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
                <Button
                  onClick={() => router.push("/auth/register")}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-600" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200">
            <div className="space-y-2">
              {/* User Info (Mobile) */}
              {user && (
                <div className="flex items-center gap-2 px-3 py-3 bg-gray-50 rounded-lg mb-3 border border-gray-200">
                  <User className="w-5 h-5 text-gray-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <Badge className={`${getRoleBadgeColor()} text-white text-xs mt-1`}>
                      {getRoleDisplayName()}
                    </Badge>
                  </div>
                </div>
              )}

              {/* Navigation Links */}
              <div className="space-y-1">
                {navLinks.map((link) => {
                  const Icon = link.icon
                  const active = isActive(link.href)
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                        active
                          ? isDashboard
                            ? `${getRoleBadgeColor()} text-white font-semibold shadow-md`
                            : "text-green-600 bg-green-50 font-semibold"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{link.name}</span>
                    </Link>
                  )
                })}
              </div>

              {/* Auth Buttons (Mobile) */}
              <div className="pt-3 border-t border-gray-200 space-y-2">
                {user ? (
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={() => {
                        router.push("/auth/login")
                        setMobileMenuOpen(false)
                      }}
                      variant="outline"
                      className="w-full"
                    >
                      <LogIn className="w-4 h-4 mr-2" />
                      Sign In
                    </Button>
                    <Button
                      onClick={() => {
                        router.push("/auth/register")
                        setMobileMenuOpen(false)
                      }}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      Get Started
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}