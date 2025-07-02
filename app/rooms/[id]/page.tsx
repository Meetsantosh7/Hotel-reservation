"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Wifi, Tv, Coffee, Users, Utensils, Waves, Maximize, Thermometer, ShowerHead, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { rooms } from "@/data/rooms"

export default function RoomDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [room, setRoom] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Find room by ID
    const roomId = Number.parseInt(params.id)
    const foundRoom = rooms.find((r) => r.id === roomId)

    if (foundRoom) {
      setRoom(foundRoom)
    }

    setLoading(false)
  }, [params.id])

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 pt-20">
          <div className="container flex items-center justify-center px-4 py-12">
            <div className="text-center">
              <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-amber-600 border-t-transparent"></div>
              <p>Loading room details...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!room) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 pt-20">
          <div className="container px-4 py-12 text-center">
            <h1 className="mb-4 text-2xl font-bold">Room Not Found</h1>
            <p className="mb-8">The room you are looking for does not exist or has been removed.</p>
            <Button onClick={() => router.push("/rooms")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Rooms
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const amenityIcons: Record<string, any> = {
    wifi: { icon: Wifi, label: "Free WiFi" },
    tv: { icon: Tv, label: "Smart TV" },
    breakfast: { icon: Coffee, label: "Breakfast Included" },
    minibar: { icon: Utensils, label: "Mini Bar" },
    balcony: { icon: Maximize, label: "Private Balcony" },
    jacuzzi: { icon: Waves, label: "Jacuzzi" },
    aircon: { icon: Thermometer, label: "Air Conditioning" },
    shower: { icon: ShowerHead, label: "Rain Shower" },
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 pt-20">
        {/* Room Header */}
        <section className="relative h-[50vh] w-full bg-gradient-to-r from-black to-gray-800 text-white">
          <div className="absolute inset-0 z-0">
            <Image
              src={room.image || "/placeholder.svg"}
              alt={room.name}
              fill
              className="object-cover opacity-60"
              priority
            />
          </div>
          <div className="container relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">{room.name}</h1>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Badge className="bg-amber-600 hover:bg-amber-700">
                {room.type.charAt(0).toUpperCase() + room.type.slice(1)}
              </Badge>
              <Badge variant="outline" className="border-white text-white">
                <Users className="mr-1 h-3 w-3" />
                {room.capacity} {room.capacity === 1 ? "Guest" : "Guests"}
              </Badge>
              {room.featured && (
                <Badge variant="outline" className="border-amber-400 text-amber-400">
                  Featured
                </Badge>
              )}
            </div>
          </div>
        </section>

        {/* Room Details */}
        <section className="py-12">
          <div className="container px-4">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="md:col-span-2">
                <div className="mb-8">
                  <h2 className="mb-4 text-2xl font-bold">Room Description</h2>
                  <p className="text-gray-600 dark:text-gray-300">{room.description}</p>
                </div>

                <div className="mb-8">
                  <h2 className="mb-4 text-2xl font-bold">Amenities</h2>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3">
                    {room.amenities.map((amenity: string) => {
                      const amenityInfo = amenityIcons[amenity] || {
                        icon: Coffee,
                        label: amenity.charAt(0).toUpperCase() + amenity.slice(1),
                      }
                      const Icon = amenityInfo.icon

                      return (
                        <div key={amenity} className="flex items-center gap-2">
                          <div className="rounded-full bg-amber-100 p-2 dark:bg-amber-900/20">
                            <Icon className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                          </div>
                          <span>{amenityInfo.label}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <h2 className="mb-4 text-2xl font-bold">Room Policies</h2>
                  <ul className="list-inside list-disc space-y-2 text-gray-600 dark:text-gray-300">
                    <li>Check-in time: 3:00 PM</li>
                    <li>Check-out time: 11:00 AM</li>
                    <li>No smoking</li>
                    <li>No pets allowed</li>
                    <li>Extra bed available upon request (additional charges may apply)</li>
                  </ul>
                </div>
              </div>

              <div>
                <div className="sticky top-24 rounded-lg border bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800">
                  <div className="mb-4 text-center">
                    <div className="mb-2 text-3xl font-bold text-amber-600">₹{room.price.toLocaleString('en-IN')}</div>
                    <p className="text-gray-500 dark:text-gray-400">per night</p>
                  </div>

                  <div className="mb-6 space-y-2 border-b border-t py-4">
                    <div className="flex justify-between">
                      <span>Room Type:</span>
                      <span className="font-medium capitalize">{room.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Max Guests:</span>
                      <span className="font-medium">{room.capacity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Availability:</span>
                      <span className={`font-medium ${room.available ? "text-green-600" : "text-red-600"}`}>
                        {room.available ? "Available" : "Unavailable"}
                      </span>
                    </div>
                  </div>

                  <Button className="mb-3 w-full bg-amber-600 hover:bg-amber-700" disabled={!room.available}>
                    <Link href={`/booking?room=${room.id}`}>Book Now</Link>
                  </Button>

                  <Button variant="outline" className="w-full">
                    <Link href="/rooms">View Other Rooms</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Similar Rooms */}
        <section className="bg-gray-50 py-12 dark:bg-gray-900">
          <div className="container px-4">
            <h2 className="mb-8 text-center text-2xl font-bold">You Might Also Like</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rooms
                .filter((r) => r.id !== room.id && r.type === room.type && r.available)
                .slice(0, 3)
                .map((similarRoom) => (
                  <div
                    key={similarRoom.id}
                    className="group overflow-hidden rounded-lg border bg-white shadow-md transition-all hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
                  >
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image
                        src={similarRoom.image || "/placeholder.svg"}
                        alt={similarRoom.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <h3 className="font-bold">{similarRoom.name}</h3>
                        <div className="text-right">
                          <span className="font-bold text-amber-600">${similarRoom.price}</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">/night</span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        className="mt-2 w-full border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white"
                      >
                        <Link href={`/rooms/${similarRoom.id}`}>View Details</Link>
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
