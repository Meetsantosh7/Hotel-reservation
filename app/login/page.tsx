"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

interface FormData {
  email: string
  password: string
  name?: string
}

interface FormErrors {
  email?: string
  password?: string
  name?: string
  general?: string
}

export default function LoginPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("login")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    name: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})

  const validateForm = (isRegister: boolean) => {
    const newErrors: FormErrors = {}

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    if (isRegister && !formData.name?.trim()) {
      newErrors.name = "Name is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm(false)) {
      setIsLoading(true)

      // Simulate API call
      setTimeout(() => {
        // Check if admin credentials
        if (formData.email === "admin@luxehaven.com" && formData.password === "admin123") {
          // Store user in localStorage
          localStorage.setItem(
            "user",
            JSON.stringify({
              id: "admin-1",
              name: "Admin User",
              email: formData.email,
              role: "admin",
            }),
          )

          setIsLoading(false)
          router.push("/dashboard")
        } else {
          // Check if user exists in localStorage
          const users = JSON.parse(localStorage.getItem("users") || "[]")
          const user = users.find((u: any) => u.email === formData.email)

          if (user && user.password === formData.password) {
            // Store user in localStorage
            localStorage.setItem(
              "user",
              JSON.stringify({
                id: user.id,
                name: user.name,
                email: user.email,
                role: "user",
              }),
            )

            setIsLoading(false)
            router.push("/")
          } else {
            setIsLoading(false)
            setErrors({ general: "Invalid email or password" })
          }
        }
      }, 1500)
    }
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm(true)) {
      setIsLoading(true)

      // Simulate API call
      setTimeout(() => {
        // Check if user already exists
        const users = JSON.parse(localStorage.getItem("users") || "[]")
        const userExists = users.some((u: any) => u.email === formData.email)

        if (userExists) {
          setIsLoading(false)
          setErrors({ email: "Email already in use" })
        } else {
          // Add new user
          const newUser = {
            id: Date.now(),
            name: formData.name,
            email: formData.email,
            password: formData.password,
            role: "user",
          }

          users.push(newUser)
          localStorage.setItem("users", JSON.stringify(users))

          // Auto login
          localStorage.setItem(
            "user",
            JSON.stringify({
              id: newUser.id,
              name: newUser.name,
              email: newUser.email,
              role: "user",
            }),
          )

          setIsLoading(false)
          router.push("/")
        }
      }, 1500)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex flex-1 items-center justify-center bg-gray-50 py-12 dark:bg-gray-900">
        <div className="container px-4">
          <Card className="mx-auto max-w-md">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin}>
                  <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>Enter your credentials to access your account</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {errors.general && (
                      <div className="rounded-md bg-red-50 p-3 text-sm text-red-500 dark:bg-red-900/20 dark:text-red-300">
                        {errors.general}
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <Input
                        id="login-email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={errors.email ? "border-red-500" : ""}
                      />
                      {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="login-password">Password</Label>
                      <div className="relative">
                        <Input
                          id="login-password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={handleInputChange}
                          className={errors.password ? "border-red-500 pr-10" : "pr-10"}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                        </button>
                      </div>
                      {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="remember" className="h-4 w-4 rounded border-gray-300" />
                        <Label htmlFor="remember" className="text-sm font-normal">
                          Remember me
                        </Label>
                      </div>
                      <Link href="#" className="text-sm text-amber-600 hover:underline dark:text-amber-500">
                        Forgot password?
                      </Link>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700" disabled={isLoading}>
                      {isLoading ? "Logging in..." : "Login"}
                    </Button>
                  </CardFooter>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister}>
                  <CardHeader>
                    <CardTitle>Create an Account</CardTitle>
                    <CardDescription>Register to book rooms and manage your reservations</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-name">Full Name</Label>
                      <Input
                        id="register-name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={errors.name ? "border-red-500" : ""}
                      />
                      {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email</Label>
                      <Input
                        id="register-email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={errors.email ? "border-red-500" : ""}
                      />
                      {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-password">Password</Label>
                      <div className="relative">
                        <Input
                          id="register-password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={handleInputChange}
                          className={errors.password ? "border-red-500 pr-10" : "pr-10"}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                        </button>
                      </div>
                      {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                    </div>

                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="terms" className="h-4 w-4 rounded border-gray-300" />
                      <Label htmlFor="terms" className="text-sm font-normal">
                        I agree to the{" "}
                        <Link href="#" className="text-amber-600 hover:underline dark:text-amber-500">
                          terms and conditions
                        </Link>
                      </Label>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700" disabled={isLoading}>
                      {isLoading ? "Creating account..." : "Register"}
                    </Button>
                  </CardFooter>
                </form>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
