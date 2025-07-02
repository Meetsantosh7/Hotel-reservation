"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { BarChart, Calendar, Hotel, Users, DollarSign, Trash2, Edit, Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import Navbar from "@/components/navbar"
import { rooms } from "@/data/rooms"

interface Booking {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  roomId: string
  checkIn: string
  checkOut: string
  guests: string
  status: string
  createdAt: string
}

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface Room {
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

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [roomsData, setRoomsData] = useState<Room[]>(rooms)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("overview")
  const [editingRoom, setEditingRoom] = useState<Room | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Check if user is logged in and is admin
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)
      setUser(parsedUser)

      if (parsedUser.role !== "admin") {
        router.push("/login")
      }
    } else {
      router.push("/login")
    }

    // Load bookings from localStorage
    const storedBookings = localStorage.getItem("bookings")
    if (storedBookings) {
      setBookings(JSON.parse(storedBookings))
    }

    // Load rooms from localStorage or use default
    const storedRooms = localStorage.getItem("rooms")
    if (storedRooms) {
      setRoomsData(JSON.parse(storedRooms))
    } else {
      // Initialize rooms in localStorage
      localStorage.setItem("rooms", JSON.stringify(rooms))
    }
  }, [router])

  const handleDeleteBooking = (id: number) => {
    const updatedBookings = bookings.filter((booking) => booking.id !== id)
    setBookings(updatedBookings)
    localStorage.setItem("bookings", JSON.stringify(updatedBookings))
  }

  const handleDeleteRoom = (id: number) => {
    const updatedRooms = roomsData.filter((room) => room.id !== id)
    setRoomsData(updatedRooms)
    localStorage.setItem("rooms", JSON.stringify(updatedRooms))
  }

  const handleEditRoom = (room: Room) => {
    setEditingRoom(room)
    setIsDialogOpen(true)
  }

  const handleAddRoom = () => {
    setEditingRoom({
      id: Date.now(),
      name: "",
      type: "standard",
      price: 0,
      image: "/images/standard-double.jpg",
      description: "",
      capacity: 2,
      amenities: [],
      available: true,
      featured: false,
    })
    setIsDialogOpen(true)
  }

  const handleRoomFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingRoom) {
      if (editingRoom.id) {
        // Update existing room
        const updatedRooms = roomsData.map((room) => (room.id === editingRoom.id ? editingRoom : room))
        setRoomsData(updatedRooms)
        localStorage.setItem("rooms", JSON.stringify(updatedRooms))
      } else {
        // Add new room
        const newRooms = [...roomsData, editingRoom]
        setRoomsData(newRooms)
        localStorage.setItem("rooms", JSON.stringify(newRooms))
      }

      setIsDialogOpen(false)
      setEditingRoom(null)
    }
  }

  const handleRoomInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target

    if (editingRoom) {
      if (type === "checkbox") {
        const checkbox = e.target as HTMLInputElement
        setEditingRoom({
          ...editingRoom,
          [name]: checkbox.checked,
        })
      } else if (name === "price") {
        setEditingRoom({
          ...editingRoom,
          [name]: Number.parseFloat(value) || 0,
        })
      } else if (name === "capacity") {
        setEditingRoom({
          ...editingRoom,
          [name]: Number.parseInt(value) || 1,
        })
      } else if (name === "amenities") {
        const amenitiesArray = value.split(",").map((item) => item.trim())
        setEditingRoom({
          ...editingRoom,
          amenities: amenitiesArray,
        })
      } else {
        setEditingRoom({
          ...editingRoom,
          [name]: value,
        })
      }
    }
  }

  const filteredBookings = bookings.filter((booking) => {
    const fullName = `${booking.firstName} ${booking.lastName}`.toLowerCase()
    const email = booking.email.toLowerCase()
    const search = searchTerm.toLowerCase()

    return fullName.includes(search) || email.includes(search)
  })

  const filteredRooms = roomsData.filter((room) => {
    const name = room.name.toLowerCase()
    const type = room.type.toLowerCase()
    const search = searchTerm.toLowerCase()

    return name.includes(search) || type.includes(search)
  })

  // Calculate dashboard stats
  const totalBookings = bookings.length
  const totalRooms = roomsData.length
  const availableRooms = roomsData.filter((room) => room.available).length
  const totalRevenue = bookings.reduce((total, booking) => {
    const room = roomsData.find((r) => r.id.toString() === booking.roomId)
    if (!room) return total

    const checkIn = new Date(booking.checkIn)
    const checkOut = new Date(booking.checkOut)
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))

    return total + room.price * nights
  }, 0)

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 pt-20">
        <div className="container px-4 py-8">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-gray-500 dark:text-gray-400">Manage your hotel bookings, rooms, and customers</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button onClick={() => router.push("/")}>View Website</Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
              <TabsTrigger value="rooms">Rooms</TabsTrigger>
              <TabsTrigger value="customers">Customers</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                    <BarChart className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalBookings}</div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      +{Math.floor(Math.random() * 10) + 1}% from last month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Available Rooms</CardTitle>
                    <Hotel className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {availableRooms}/{totalRooms}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {Math.round((availableRooms / totalRooms) * 100)}% availability rate
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      +{Math.floor(Math.random() * 15) + 5}% from last month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Upcoming Check-ins</CardTitle>
                    <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {bookings.filter((booking) => new Date(booking.checkIn) > new Date()).length}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">For the next 7 days</p>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-8 grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Bookings</CardTitle>
                    <CardDescription>Latest bookings made on the platform</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Guest</TableHead>
                          <TableHead>Room</TableHead>
                          <TableHead>Check-in</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {bookings.slice(0, 5).map((booking) => {
                          const room = roomsData.find((r) => r.id.toString() === booking.roomId)
                          return (
                            <TableRow key={booking.id}>
                              <TableCell className="font-medium">
                                {booking.firstName} {booking.lastName}
                              </TableCell>
                              <TableCell>{room?.name || "Unknown Room"}</TableCell>
                              <TableCell>{format(new Date(booking.checkIn), "MMM dd, yyyy")}</TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className="bg-green-50 text-green-700 hover:bg-green-50 hover:text-green-700 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/20 dark:hover:text-green-400"
                                >
                                  {booking.status}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                        {bookings.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center">
                              No bookings found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Popular Rooms</CardTitle>
                    <CardDescription>Most booked rooms in your hotel</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Room</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {roomsData.slice(0, 5).map((room) => (
                          <TableRow key={room.id}>
                            <TableCell className="font-medium">{room.name}</TableCell>
                            <TableCell>{room.type}</TableCell>
                            <TableCell>${room.price}/night</TableCell>
                            <TableCell>
                              {room.available ? (
                                <Badge
                                  variant="outline"
                                  className="bg-green-50 text-green-700 hover:bg-green-50 hover:text-green-700 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/20 dark:hover:text-green-400"
                                >
                                  Available
                                </Badge>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="bg-red-50 text-red-700 hover:bg-red-50 hover:text-red-700 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                                >
                                  Booked
                                </Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="bookings">
              <div className="mb-6 flex justify-between">
                <h2 className="text-2xl font-bold">All Bookings</h2>
                <Button>Export CSV</Button>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Guest</TableHead>
                      <TableHead>Room</TableHead>
                      <TableHead>Check-in</TableHead>
                      <TableHead>Check-out</TableHead>
                      <TableHead>Guests</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBookings.map((booking) => {
                      const room = roomsData.find((r) => r.id.toString() === booking.roomId)
                      return (
                        <TableRow key={booking.id}>
                          <TableCell className="font-medium">#{booking.id}</TableCell>
                          <TableCell>
                            <div>
                              {booking.firstName} {booking.lastName}
                              <div className="text-sm text-gray-500 dark:text-gray-400">{booking.email}</div>
                            </div>
                          </TableCell>
                          <TableCell>{room?.name || "Unknown Room"}</TableCell>
                          <TableCell>{format(new Date(booking.checkIn), "MMM dd, yyyy")}</TableCell>
                          <TableCell>{format(new Date(booking.checkOut), "MMM dd, yyyy")}</TableCell>
                          <TableCell>{booking.guests}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className="bg-green-50 text-green-700 hover:bg-green-50 hover:text-green-700 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/20 dark:hover:text-green-400"
                            >
                              {booking.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Delete</span>
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Booking</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete this booking? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeleteBooking(booking.id)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                    {filteredBookings.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          <div className="flex flex-col items-center justify-center">
                            <Calendar className="mb-2 h-10 w-10 text-gray-400" />
                            <h3 className="mb-1 text-lg font-medium">No bookings found</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {searchTerm ? "Try adjusting your search" : "Bookings will appear here once created"}
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="rooms">
              <div className="mb-6 flex justify-between">
                <h2 className="text-2xl font-bold">All Rooms</h2>
                <Button onClick={handleAddRoom}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Room
                </Button>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Featured</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRooms.map((room) => (
                      <TableRow key={room.id}>
                        <TableCell className="font-medium">#{room.id}</TableCell>
                        <TableCell>{room.name}</TableCell>
                        <TableCell className="capitalize">{room.type}</TableCell>
                        <TableCell>${room.price}/night</TableCell>
                        <TableCell>{room.capacity} guests</TableCell>
                        <TableCell>
                          {room.available ? (
                            <Badge
                              variant="outline"
                              className="bg-green-50 text-green-700 hover:bg-green-50 hover:text-green-700 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/20 dark:hover:text-green-400"
                            >
                              Available
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="bg-red-50 text-red-700 hover:bg-red-50 hover:text-red-700 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                            >
                              Unavailable
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {room.featured ? (
                            <Badge
                              variant="outline"
                              className="bg-amber-50 text-amber-700 hover:bg-amber-50 hover:text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 dark:hover:bg-amber-900/20 dark:hover:text-amber-400"
                            >
                              Featured
                            </Badge>
                          ) : (
                            <Badge variant="outline">Not Featured</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEditRoom(room)}>
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">Delete</span>
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Room</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this room? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteRoom(room.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredRooms.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          <div className="flex flex-col items-center justify-center">
                            <Hotel className="mb-2 h-10 w-10 text-gray-400" />
                            <h3 className="mb-1 text-lg font-medium">No rooms found</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {searchTerm ? "Try adjusting your search" : "Rooms will appear here once created"}
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{editingRoom?.id ? "Edit Room" : "Add New Room"}</DialogTitle>
                    <DialogDescription>
                      Fill in the details for the room. Click save when you're done.
                    </DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handleRoomFormSubmit} className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Room Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={editingRoom?.name || ""}
                          onChange={handleRoomInputChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="type">Room Type</Label>
                        <select
                          id="type"
                          name="type"
                          value={editingRoom?.type || "standard"}
                          onChange={handleRoomInputChange}
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="standard">Standard</option>
                          <option value="deluxe">Deluxe</option>
                          <option value="suite">Suite</option>
                          <option value="executive">Executive</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="price">Price per Night ($)</Label>
                        <Input
                          id="price"
                          name="price"
                          type="number"
                          min="0"
                          step="0.01"
                          value={editingRoom?.price || ""}
                          onChange={handleRoomInputChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="capacity">Capacity (Guests)</Label>
                        <Input
                          id="capacity"
                          name="capacity"
                          type="number"
                          min="1"
                          value={editingRoom?.capacity || ""}
                          onChange={handleRoomInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <textarea
                        id="description"
                        name="description"
                        value={editingRoom?.description || ""}
                        onChange={handleRoomInputChange}
                        className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="image">Image URL</Label>
                      <Input
                        id="image"
                        name="image"
                        value={editingRoom?.image || ""}
                        onChange={handleRoomInputChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="amenities">Amenities (comma separated)</Label>
                      <Input
                        id="amenities"
                        name="amenities"
                        value={editingRoom?.amenities.join(", ") || ""}
                        onChange={handleRoomInputChange}
                        placeholder="wifi, tv, breakfast, etc."
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="available"
                        name="available"
                        checked={editingRoom?.available || false}
                        onChange={(e) =>
                          setEditingRoom((prev) => (prev ? { ...prev, available: e.target.checked } : null))
                        }
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <Label htmlFor="available" className="font-normal">
                        Available for booking
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="featured"
                        name="featured"
                        checked={editingRoom?.featured || false}
                        onChange={(e) =>
                          setEditingRoom((prev) => (prev ? { ...prev, featured: e.target.checked } : null))
                        }
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <Label htmlFor="featured" className="font-normal">
                        Featured on homepage
                      </Label>
                    </div>

                    <DialogFooter>
                      <Button type="submit">Save Room</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </TabsContent>

            <TabsContent value="customers">
              <div className="mb-6 flex justify-between">
                <h2 className="text-2xl font-bold">All Customers</h2>
                <Button>Export CSV</Button>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Bookings</TableHead>
                      <TableHead>Total Spent</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Group bookings by customer email */}
                    {Array.from(new Set(bookings.map((b) => b.email))).map((email) => {
                      const customerBookings = bookings.filter((b) => b.email === email)
                      const customer = customerBookings[0]
                      const totalSpent = customerBookings.reduce((total, booking) => {
                        const room = roomsData.find((r) => r.id.toString() === booking.roomId)
                        if (!room) return total

                        const checkIn = new Date(booking.checkIn)
                        const checkOut = new Date(booking.checkOut)
                        const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))

                        return total + room.price * nights
                      }, 0)

                      return (
                        <TableRow key={email}>
                          <TableCell className="font-medium">
                            {customer.firstName} {customer.lastName}
                          </TableCell>
                          <TableCell>{email}</TableCell>
                          <TableCell>{customer.phone}</TableCell>
                          <TableCell>{customerBookings.length}</TableCell>
                          <TableCell>${totalSpent.toFixed(2)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="icon">
                                <Users className="h-4 w-4" />
                                <span className="sr-only">View Customer</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                    {bookings.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <div className="flex flex-col items-center justify-center">
                            <Users className="mb-2 h-10 w-10 text-gray-400" />
                            <h3 className="mb-1 text-lg font-medium">No customers found</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Customers will appear here once they make bookings
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
