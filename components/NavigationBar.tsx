"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Heart, Home, Info, Mail, LogIn, LogOut, Menu, X, User } from "lucide-react"
import { Button } from "@/components/ui/button"
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

  const navLinks = [
    { name: "Home", href: "/", icon: Home },
    { name: "About", href: "/about", icon: Info },
    { name: "Contact", href: "/contact", icon: Mail },
  ]

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(href)
  }

  const isDashboard = pathname.includes("/dashboard")

  const getDashboardLink = () => {
    if (user?.role === "farmer") return "/dashboard/farmer"
    if (user?.role === "veterinarian") return "/dashboard/veterinarian"
    if (user?.role === "admin") return "/dashboard/admin"
    return "/"
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
            <span className="font-bold text-xl text-gray-900">VetConnect Rwanda</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive(link.href)
                      ? "text-green-600 bg-green-50 font-semibold"
                      : "text-gray-600 hover:text-green-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.name}
                </Link>
              )
            })}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                {/* User Info */}
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                  <User className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">{user.name}</span>
                  <span className="text-xs text-gray-500 capitalize">
                    ({user.role})
                  </span>
                </div>

                {/* Dashboard Button (if not already on dashboard) */}
                {!isDashboard && (
                  <Button
                    onClick={() => router.push(getDashboardLink())}
                    variant="outline"
                  >
                    Dashboard
                  </Button>
                )}

                {/* Logout Button */}
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => router.push("/auth/signin")}
                  variant="outline"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
                <Button
                  onClick={() => router.push("/auth/signup")}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
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
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="space-y-2">
              {/* User Info (Mobile) */}
              {user && (
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg mb-3">
                  <User className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">{user.name}</span>
                  <span className="text-xs text-gray-500 capitalize">
                    ({user.role})
                  </span>
                </div>
              )}

              {/* Navigation Links */}
              {navLinks.map((link) => {
                const Icon = link.icon
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                      isActive(link.href)
                        ? "text-green-600 bg-green-50 font-semibold"
                        : "text-gray-600 hover:text-green-600 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {link.name}
                  </Link>
                )
              })}

              {/* Dashboard Link (Mobile) */}
              {user && !isDashboard && (
                <button
                  onClick={() => {
                    router.push(getDashboardLink())
                    setMobileMenuOpen(false)
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:text-green-600 hover:bg-gray-50"
                >
                  Dashboard
                </button>
              )}

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
                        router.push("/auth/signin")
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
                        router.push("/auth/signup")
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