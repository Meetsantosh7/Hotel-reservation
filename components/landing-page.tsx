"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Star, Wifi, Waves, Utensils, SpadeIcon as Spa } from "lucide-react"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import RoomCard from "@/components/room-card"
import { rooms } from "@/data/rooms"

export default function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const featuredRooms = rooms.filter((room) => room.featured).slice(0, 3)

  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Business Traveler",
      content: "The perfect blend of luxury and comfort. I stay here every time I'm in town for business.",
      rating: 5,
      image: "/images/testimonial-1.jpg",
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Family Vacation",
      content: "Our family had an amazing time. The staff was incredibly accommodating to our children.",
      rating: 5,
      image: "/images/testimonial-2.jpg",
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      role: "Weekend Getaway",
      content: "The spa services were exceptional. I left feeling completely refreshed and rejuvenated.",
      rating: 4,
      image: "/images/testimonial-3.jpg",
    },
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[80vh] w-full bg-gradient-to-r from-black to-gray-800 text-white">
        <div className="absolute inset-0 z-0">
          <Image src="/images/hero.jpg" alt="Luxury Hotel" fill className="object-cover opacity-40" priority />
        </div>
        <div className="container relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
          <h1 className="mb-4 text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">Crown Plaza Hotel</h1>
          <p className="mb-8 max-w-2xl text-lg text-gray-200 sm:text-xl">
            Experience unparalleled luxury and comfort in the heart of the city. Your perfect getaway awaits.
          </p>
          <Button size="lg" className="bg-amber-600 hover:bg-amber-700">
            <Link href="/booking">Book Now</Link>
          </Button>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16">
        <div className="container px-4">
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tight sm:text-4xl">Our Premium Services</h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col items-center rounded-lg p-6 text-center shadow-md transition-all hover:shadow-lg">
              <div className="mb-4 rounded-full bg-amber-100 p-4">
                <Wifi className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">High-Speed WiFi</h3>
              <p className="text-gray-600">
                Stay connected with complimentary high-speed internet throughout the property.
              </p>
            </div>
            <div className="flex flex-col items-center rounded-lg p-6 text-center shadow-md transition-all hover:shadow-lg">
              <div className="mb-4 rounded-full bg-amber-100 p-4">
                <Waves className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Infinity Pool</h3>
              <p className="text-gray-600">Relax in our stunning infinity pool with panoramic city views.</p>
            </div>
            <div className="flex flex-col items-center rounded-lg p-6 text-center shadow-md transition-all hover:shadow-lg">
              <div className="mb-4 rounded-full bg-amber-100 p-4">
                <Spa className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Luxury Spa</h3>
              <p className="text-gray-600">Indulge in rejuvenating treatments at our world-class spa.</p>
            </div>
            <div className="flex flex-col items-center rounded-lg p-6 text-center shadow-md transition-all hover:shadow-lg">
              <div className="mb-4 rounded-full bg-amber-100 p-4">
                <Utensils className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">24/7 Room Service</h3>
              <p className="text-gray-600">Enjoy gourmet meals delivered to your room any time of day or night.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Rooms Section */}
      <section className="bg-gray-50 py-16 dark:bg-gray-900">
        <div className="container px-4">
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tight sm:text-4xl">Featured Rooms</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featuredRooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button variant="outline" className="border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white">
              <Link href="/rooms">View All Rooms</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16">
        <div className="container px-4">
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tight sm:text-4xl">What Our Guests Say</h2>
          <div className="relative mx-auto max-w-4xl">
            <div className="overflow-hidden rounded-xl bg-white p-8 shadow-lg dark:bg-gray-800">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 h-20 w-20 overflow-hidden rounded-full">
                  <Image
                    src={testimonials[currentSlide].image || "/placeholder.svg"}
                    alt={testimonials[currentSlide].name}
                    width={80}
                    height={80}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="mb-4 flex">
                  {[...Array(testimonials[currentSlide].rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <p className="mb-6 text-lg italic text-gray-600 dark:text-gray-300">
                  "{testimonials[currentSlide].content}"
                </p>
                <h3 className="text-xl font-semibold">{testimonials[currentSlide].name}</h3>
                <p className="text-gray-500 dark:text-gray-400">{testimonials[currentSlide].role}</p>
              </div>
            </div>
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow-md hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow-md hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
