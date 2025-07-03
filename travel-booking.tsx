"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Globe, User, HelpCircle, Menu, X, ArrowLeftRight, Plus, Luggage } from "lucide-react"
import AOS from 'aos';

import 'aos/dist/aos.css';

export default function Component() {

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [fromLocation, setFromLocation] = useState("Karachi")
  const [toLocation, setToLocation] = useState("Dubai")

  const swapLocations = () => {
    const temp = fromLocation
    setFromLocation(toLocation)
    setToLocation(temp)
  }

  // Generate scattered letters for background
  const generateScatteredLetters = () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    const positions = []

    for (let i = 0; i < 150; i++) {
      positions.push({
        letter: letters[Math.floor(Math.random() * letters.length)],
        top: Math.random() * 100,
        left: Math.random() * 100,
        opacity: Math.random() * 0.3 + 0.1,
        size: Math.random() * 20 + 10,
      })
    }

    return positions
  }

  const scatteredLetters = generateScatteredLetters()

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-400 via-sky-500 to-sky-600 relative overflow-hidden">
      {/* Scattered Letters Background */}
      <div className="absolute inset-0 pointer-events-none">
        {scatteredLetters.map((item, index) => (
          <div
            key={index}
            className="absolute text-white font-bold select-none"
            style={{
              top: `${item.top}%`,
              left: `${item.left}%`,
              opacity: item.opacity,
              fontSize: `${item.size}px`,
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          >
            {item.letter}
          </div>
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div data-aos="fade-right" data-aos-duration="1000" className="w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">K</span>
                </div>
              </div>
              <span data-aos="fade-right" data-aos-duration="1000" className="ml-2 text-xl font-bold text-gray-900">GOAIRPLANE.COM</span>
            </div>

            {/* Desktop Navigation */}
            <nav data-aos="fade-left" data-aos-duration="1000" className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-900 hover:text-sky-600 px-3 py-2 text-sm font-medium">
                Flights
              </a>
              <a href="#" className="text-gray-700 hover:text-sky-600 px-3 py-2 text-sm font-medium">
                Cars
              </a>
              <a href="#" className="text-gray-700 hover:text-sky-600 px-3 py-2 text-sm font-medium">
                Stays
              </a>
              <a href="#" className="text-gray-700 hover:text-sky-600 px-3 py-2 text-sm font-medium">
                Magazine
              </a>
              <a href="#" className="text-gray-700 hover:text-sky-600 px-3 py-2 text-sm font-medium">
                Travel hacks
              </a>
              <a href="#" className="text-gray-700 hover:text-sky-600 px-3 py-2 text-sm font-medium">
                Deals
              </a>
            </nav>

            {/* Right side */}
            <div data-aos="fade-left" data-aos-duration="1000" className="hidden md:flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-gray-700">
                <Globe className="w-4 h-4 mr-1" />
                USD
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-700">
                <HelpCircle className="w-4 h-4 mr-1" />
                Help & support
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-700">
                <User className="w-4 h-4 mr-1" />
                Sign in
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#" className="block px-3 py-2 text-base font-medium text-gray-900">
                Flights
              </a>
              <a href="#" className="block px-3 py-2 text-base font-medium text-gray-700">
                Cars
              </a>
              <a href="#" className="block px-3 py-2 text-base font-medium text-gray-700">
                Stays
              </a>
              <a href="#" className="block px-3 py-2 text-base font-medium text-gray-700">
                Magazine
              </a>
              <a href="#" className="block px-3 py-2 text-base font-medium text-gray-700">
                Travel hacks
              </a>
              <a href="#" className="block px-3 py-2 text-base font-medium text-gray-700">
                Deals
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
        {/* Hero Text */}
        <div className="text-center mb-12">
          <h1 data-aos="fade-up" data-aos-duration="1000" className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 tracking-wider">
            YOU GOD UWL SUCK KC
          </h1>
          <p data-aos="fade-down" data-aos-duration="1000" className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
            Book cheap flights other sites simply can't find.
          </p>
        </div>

        {/* Search Form */}
        <Card data-aos="fade-up" data-aos-duration="1000" className="max-w-5xl mx-auto shadow-2xl">
          <CardContent className="p-6">
            {/* Trip Options */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <Select defaultValue="return">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="return">Return</SelectItem>
                  <SelectItem value="oneway">One way</SelectItem>
                  <SelectItem value="multicity">Multi-city</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="economy">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="economy">Economy</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="first">First</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="1">
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2" />1 Passenger
                    </div>
                  </SelectItem>
                  <SelectItem value="2">2 Passengers</SelectItem>
                  <SelectItem value="3">3 Passengers</SelectItem>
                  <SelectItem value="4">4+ Passengers</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="0">
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">
                    <div className="flex items-center">
                      <Luggage className="w-4 h-4 mr-2" />0
                    </div>
                  </SelectItem>
                  <SelectItem value="1">1 Bag</SelectItem>
                  <SelectItem value="2">2 Bags</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Location and Date Inputs */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-6">
              {/* From Location */}
              <div className="lg:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                <div className="relative">
                  <Input value={fromLocation} onChange={(e) => setFromLocation(e.target.value)} className="pr-10" />
                  <Badge className="absolute right-2 top-1/2 -translate-y-1/2 bg-sky-500 hover:bg-sky-600">
                    {fromLocation.slice(0, 3).toUpperCase()}
                  </Badge>
                </div>
              </div>

              {/* Swap Button */}
              <div className="lg:col-span-1 flex items-end justify-center pb-2">
                <Button variant="ghost" size="sm" onClick={swapLocations} className="p-2 hover:bg-sky-50">
                  <ArrowLeftRight className="w-4 h-4 text-sky-600" />
                </Button>
              </div>

              {/* To Location */}
              <div className="lg:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                <div className="relative">
                  <Input value={toLocation} onChange={(e) => setToLocation(e.target.value)} className="pr-10" />
                  <Badge className="absolute right-2 top-1/2 -translate-y-1/2 bg-orange-500 hover:bg-orange-600">
                    {toLocation.slice(0, 3).toUpperCase()}
                  </Badge>
                </div>
                <Button variant="link" className="text-sky-600 p-0 h-auto mt-1 text-sm">
                  <Plus className="w-3 h-3 mr-1" />
                  Add more
                </Button>
              </div>

              {/* Departure Date */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Departure</label>
                <Select defaultValue="anytime">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="anytime">Anytime</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="tomorrow">Tomorrow</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Return Date */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Return</label>
                <Select defaultValue="anytime">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="anytime">Anytime</SelectItem>
                    <SelectItem value="week">Next week</SelectItem>
                    <SelectItem value="month">Next month</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Search Button */}
              <div className="lg:col-span-1 flex items-end">
                <Button className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3">Search</Button>
              </div>
            </div>

            {/* Booking.com Integration */}
            <div className="flex items-center space-x-2">
              <Checkbox id="accommodation" defaultChecked />
              <label htmlFor="accommodation" className="text-sm text-gray-700">
                Check accommodation with <span className="text-blue-600 font-semibold">Booking.com</span>
              </label>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
