import Image from "next/image"
import Link from "next/link"
import { Wifi, Tv, Coffee, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface RoomProps {
  room: {
    id: number
    name: string
    type: string
    price: number
    image: string
    description: string
    capacity: number
    amenities: string[]
    available: boolean
    featured?: boolean
  }
}

export default function RoomCard({ room }: RoomProps) {
  return (
    <div className="group overflow-hidden rounded-lg border bg-white shadow-md transition-all hover:shadow-lg dark:border-gray-700 dark:bg-gray-800">
      <div className="relative h-64 w-full overflow-hidden">
        <Image
          src={room.image || "/placeholder.svg"}
          alt={room.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {room.featured && <Badge className="absolute right-2 top-2 bg-amber-600 hover:bg-amber-700">Featured</Badge>}
        {!room.available && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <Badge variant="destructive" className="text-lg font-semibold">
              Unavailable
            </Badge>
          </div>
        )}
      </div>
      <div className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-bold">{room.name}</h3>
          <div className="text-right">
            <span className="text-2xl font-bold text-amber-600">₹{room.price.toLocaleString('en-IN')}</span>
            <span className="text-gray-500 dark:text-gray-400">/night</span>
          </div>
        </div>
        <p className="mb-4 text-gray-600 dark:text-gray-300">{room.description}</p>
        <div className="mb-4 flex flex-wrap gap-2">
          <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
            <Users className="h-4 w-4" />
            <span>{room.capacity} Guests</span>
          </div>
          {room.amenities.includes("wifi") && (
            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
              <Wifi className="h-4 w-4" />
              <span>WiFi</span>
            </div>
          )}
          {room.amenities.includes("tv") && (
            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
              <Tv className="h-4 w-4" />
              <span>Smart TV</span>
            </div>
          )}
          {room.amenities.includes("breakfast") && (
            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
              <Coffee className="h-4 w-4" />
              <span>Breakfast</span>
            </div>
          )}
        </div>
        <div className="flex justify-between">
          <Button variant="outline" className="border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white">
            <Link href={`/rooms/${room.id}`}>View Details</Link>
          </Button>
          <Button className="bg-amber-600 hover:bg-amber-700" disabled={!room.available}>
            <Link href={`/booking?room=${room.id}`}>Book Now</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
