"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Rooms", path: "/rooms" },
    { name: "Booking", path: "/booking" },
    { name: "Dashboard", path: "/dashboard" },
  ]

  return (
    <nav
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isScrolled 
          ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200 dark:bg-gray-900/95 dark:border-gray-700" 
          : "bg-transparent dark:bg-transparent"
      }`}
    >
      <div className="container flex items-center justify-between px-4 py-4">
        <Link href="/" className="text-2xl font-bold text-amber-600 hover:text-amber-500 transition-colors">
          Crown Plaza Hotel
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center space-x-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`text-sm font-medium transition-colors hover:text-amber-500 ${
                pathname === link.path
                  ? "text-amber-500 font-semibold"
                  : isScrolled
                    ? "text-gray-800 dark:text-gray-200"
                    : theme === "dark"
                      ? "text-white"
                      : "text-orange-600"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Button
            variant="outline"
            size="sm"
            className={`border-2 transition-all duration-200 ${
              isScrolled
                ? "border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white"
                : theme === "dark"
                  ? "border-white text-white hover:bg-white hover:text-gray-900"
                  : "border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white"
            }`}
          >
            <Link href="/login">Login</Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={`transition-colors ${
              isScrolled
                ? "text-gray-800 dark:text-gray-200 hover:text-amber-600"
                : theme === "dark"
                  ? "text-white hover:text-amber-200"
                  : "text-orange-600 hover:text-orange-500"
            }`}
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>

        {/* Mobile Navigation Toggle */}
        <div className="flex items-center md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={`mr-2 transition-colors ${
              isScrolled
                ? "text-gray-800 dark:text-gray-200 hover:text-amber-600"
                : theme === "dark"
                  ? "text-white hover:text-amber-200"
                  : "text-orange-600 hover:text-orange-500"
            }`}
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            <span className="sr-only">Toggle theme</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMenu}
            className={`transition-colors ${
              isScrolled
                ? "text-gray-800 dark:text-gray-200 hover:text-amber-600"
                : theme === "dark"
                  ? "text-white hover:text-amber-200"
                  : "text-orange-600 hover:text-orange-500"
            }`}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="bg-white/95 backdrop-blur-md px-4 py-2 shadow-lg border-t border-gray-200 dark:bg-gray-900/95 dark:border-gray-700 md:hidden">
          <div className="flex flex-col space-y-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`text-sm font-medium transition-colors hover:text-amber-500 ${
                  pathname === link.path 
                    ? "text-amber-500 font-semibold" 
                    : "text-gray-800 dark:text-gray-200"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="w-full border-2 border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white transition-all duration-200"
            >
              <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                Login
              </Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  )
}
