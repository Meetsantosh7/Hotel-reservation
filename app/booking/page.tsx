"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { format } from "date-fns"
import { CalendarIcon, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { rooms } from "@/data/rooms"

interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  roomId: string
  checkIn: Date | undefined
  checkOut: Date | undefined
  guests: string
  specialRequests: string
}

interface FormErrors {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  roomId?: string
  checkIn?: string
  checkOut?: string
  guests?: string
}

export default function BookingPage() {
  const searchParams = useSearchParams()
  const roomParam = searchParams.get("room")

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    roomId: roomParam || "",
    checkIn: undefined,
    checkOut: undefined,
    guests: "1",
    specialRequests: "",
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState(rooms.find((room) => room.id.toString() === roomParam))

  useEffect(() => {
    if (formData.roomId) {
      const room = rooms.find((r) => r.id.toString() === formData.roomId)
      setSelectedRoom(room)
    }
  }, [formData.roomId])

  const validateForm = () => {
    const newErrors: FormErrors = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required"
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    }

    if (!formData.roomId) {
      newErrors.roomId = "Please select a room"
    }

    if (!formData.checkIn) {
      newErrors.checkIn = "Check-in date is required"
    }

    if (!formData.checkOut) {
      newErrors.checkOut = "Check-out date is required"
    } else if (formData.checkIn && formData.checkOut <= formData.checkIn) {
      newErrors.checkOut = "Check-out date must be after check-in date"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleDateChange = (name: string, date: Date | undefined) => {
    setFormData((prev) => ({ ...prev, [name]: date }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      setIsSubmitting(true)

      // Simulate API call
      setTimeout(() => {
        // Save booking to localStorage
        const bookings = JSON.parse(localStorage.getItem("bookings") || "[]")
        const newBooking = {
          id: Date.now(),
          ...formData,
          checkIn: formData.checkIn?.toISOString(),
          checkOut: formData.checkOut?.toISOString(),
          status: "confirmed",
          createdAt: new Date().toISOString(),
        }
        bookings.push(newBooking)
        localStorage.setItem("bookings", JSON.stringify(bookings))

        setIsSubmitting(false)
        setIsSuccess(true)

        // Reset form after 3 seconds
        setTimeout(() => {
          setIsSuccess(false)
          setFormData({
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            roomId: "",
            checkIn: undefined,
            checkOut: undefined,
            guests: "1",
            specialRequests: "",
          })
        }, 3000)
      }, 1500)
    }
  }

  const calculateTotal = () => {
    if (!selectedRoom || !formData.checkIn || !formData.checkOut) return 0

    const checkIn = new Date(formData.checkIn)
    const checkOut = new Date(formData.checkOut)
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))

    return selectedRoom.price * nights
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 pt-20">
        {/* Header */}
        <section className="bg-amber-600 py-16 text-white">
          <div className="container px-4 text-center">
            <h1 className="mb-4 text-4xl font-bold sm:text-5xl">Book Your Stay</h1>
            <p className="mx-auto max-w-2xl text-lg">
              Fill out the form below to reserve your room at Luxe Haven Hotel.
            </p>
          </div>
        </section>

        {/* Booking Form */}
        <section className="py-12">
          <div className="container px-4">
            {isSuccess ? (
              <div className="mx-auto max-w-2xl rounded-lg bg-green-50 p-8 text-center dark:bg-green-900/20">
                <div className="mb-4 flex justify-center">
                  <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/30">
                    <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <h2 className="mb-2 text-2xl font-bold text-green-800 dark:text-green-400">Booking Confirmed!</h2>
                <p className="mb-6 text-green-700 dark:text-green-300">
                  Thank you for your reservation. We've sent a confirmation email with all the details.
                </p>
                <Button onClick={() => setIsSuccess(false)}>Make Another Booking</Button>
              </div>
            ) : (
              <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <form
                    onSubmit={handleSubmit}
                    className="space-y-6 rounded-lg border bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800"
                  >
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className={errors.firstName ? "border-red-500" : ""}
                        />
                        {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className={errors.lastName ? "border-red-500" : ""}
                        />
                        {errors.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
                      </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={errors.email ? "border-red-500" : ""}
                        />
                        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className={errors.phone ? "border-red-500" : ""}
                        />
                        {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="roomId">Room Type</Label>
                      <Select value={formData.roomId} onValueChange={(value) => handleSelectChange("roomId", value)}>
                        <SelectTrigger className={errors.roomId ? "border-red-500" : ""}>
                          <SelectValue placeholder="Select a room" />
                        </SelectTrigger>
                        <SelectContent>
                          {rooms
                            .filter((room) => room.available)
                            .map((room) => (
                              <SelectItem key={room.id} value={room.id.toString()}>
                                {room.name} - ₹{room.price.toLocaleString('en-IN')}/night
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      {errors.roomId && <p className="text-sm text-red-500">{errors.roomId}</p>}
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Check-in Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={`w-full justify-start text-left font-normal ${
                                errors.checkIn ? "border-red-500" : ""
                              }`}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {formData.checkIn ? format(formData.checkIn, "PPP") : <span>Select date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={formData.checkIn}
                              onSelect={(date) => handleDateChange("checkIn", date)}
                              initialFocus
                              disabled={(date) => date < new Date()}
                            />
                          </PopoverContent>
                        </Popover>
                        {errors.checkIn && <p className="text-sm text-red-500">{errors.checkIn}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label>Check-out Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={`w-full justify-start text-left font-normal ${
                                errors.checkOut ? "border-red-500" : ""
                              }`}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {formData.checkOut ? format(formData.checkOut, "PPP") : <span>Select date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={formData.checkOut}
                              onSelect={(date) => handleDateChange("checkOut", date)}
                              initialFocus
                              disabled={(date) =>
                                date < new Date() || (formData.checkIn ? date <= formData.checkIn : false)
                              }
                            />
                          </PopoverContent>
                        </Popover>
                        {errors.checkOut && <p className="text-sm text-red-500">{errors.checkOut}</p>}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="guests">Number of Guests</Label>
                      <Select value={formData.guests} onValueChange={(value) => handleSelectChange("guests", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select number of guests" />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6].map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} {num === 1 ? "Guest" : "Guests"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="specialRequests">Special Requests</Label>
                      <Textarea
                        id="specialRequests"
                        name="specialRequests"
                        value={formData.specialRequests}
                        onChange={handleInputChange}
                        placeholder="Any special requests or requirements?"
                        className="min-h-[100px]"
                      />
                    </div>

                    <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700" disabled={isSubmitting}>
                      {isSubmitting ? "Processing..." : "Complete Booking"}
                    </Button>
                  </form>
                </div>

                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Booking Summary</CardTitle>
                      <CardDescription>Review your reservation details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {selectedRoom ? (
                        <>
                          <div className="rounded-md bg-gray-50 p-4 dark:bg-gray-800">
                            <h3 className="mb-2 font-semibold">{selectedRoom.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{selectedRoom.description}</p>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Room Type:</span>
                              <span className="font-medium">{selectedRoom.type}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Price per night:</span>
                              <span className="font-medium">₹{selectedRoom.price.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Check-in:</span>
                              <span className="font-medium">
                                {formData.checkIn ? format(formData.checkIn, "MMM dd, yyyy") : "Not selected"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Check-out:</span>
                              <span className="font-medium">
                                {formData.checkOut ? format(formData.checkOut, "MMM dd, yyyy") : "Not selected"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Guests:</span>
                              <span className="font-medium">{formData.guests}</span>
                            </div>

                            {formData.checkIn && formData.checkOut && (
                              <div className="flex justify-between">
                                <span>Nights:</span>
                                <span className="font-medium">
                                  {Math.ceil(
                                    (new Date(formData.checkOut).getTime() - new Date(formData.checkIn).getTime()) /
                                      (1000 * 60 * 60 * 24),
                                  )}
                                </span>
                              </div>
                            )}
                          </div>
                        </>
                      ) : (
                        <div className="rounded-md bg-gray-50 p-4 text-center dark:bg-gray-800">
                          <p className="text-gray-500 dark:text-gray-400">Please select a room to see the summary</p>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="flex flex-col border-t pt-6">
                      <div className="mb-4 flex w-full justify-between text-lg font-bold">
                        <span>Total:</span>
                        <span>₹{calculateTotal().toLocaleString('en-IN')}</span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Taxes and fees included. Payment will be collected at the hotel.
                      </p>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
