"use client"

import { useState } from "react"
import { Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import RoomCard from "@/components/room-card"
import { rooms } from "@/data/rooms"

export default function RoomsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [roomType, setRoomType] = useState("all")
  const [priceRange, setPriceRange] = useState("all")

  const filteredRooms = rooms.filter((room) => {
    // Search filter
    const matchesSearch =
      room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.description.toLowerCase().includes(searchTerm.toLowerCase())

    // Room type filter
    const matchesType = roomType === "all" || room.type.toLowerCase() === roomType.toLowerCase()

    // Price range filter
    let matchesPrice = true
    if (priceRange === "0-100") {
      matchesPrice = room.price <= 100
    } else if (priceRange === "100-200") {
      matchesPrice = room.price > 100 && room.price <= 200
    } else if (priceRange === "200-300") {
      matchesPrice = room.price > 200 && room.price <= 300
    } else if (priceRange === "300+") {
      matchesPrice = room.price > 300
    }

    return matchesSearch && matchesType && matchesPrice
  })

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 pt-20">
        {/* Header */}
        <section className="bg-amber-600 py-16 text-white">
          <div className="container px-4 text-center">
            <h1 className="mb-4 text-4xl font-bold sm:text-5xl">Our Rooms</h1>
            <p className="mx-auto max-w-2xl text-lg">
              Discover our selection of luxurious rooms and suites designed for your comfort and relaxation.
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="border-b py-6">
          <div className="container px-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="relative flex-1 md:max-w-md">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search rooms..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-gray-500" />
                  <span className="text-sm font-medium">Filters:</span>
                </div>

                <Select value={roomType} onValueChange={setRoomType}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Room Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="deluxe">Deluxe</SelectItem>
                    <SelectItem value="suite">Suite</SelectItem>
                    <SelectItem value="executive">Executive</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Price Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Prices</SelectItem>
                    <SelectItem value="0-100">$0 - $100</SelectItem>
                    <SelectItem value="100-200">$100 - $200</SelectItem>
                    <SelectItem value="200-300">$200 - $300</SelectItem>
                    <SelectItem value="300+">$300+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </section>

        {/* Room Listings */}
        <section className="py-12">
          <div className="container px-4">
            {filteredRooms.length > 0 ? (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {filteredRooms.map((room) => (
                  <RoomCard key={room.id} room={room} />
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <h3 className="mb-2 text-xl font-semibold">No rooms found</h3>
                <p className="text-gray-500">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
