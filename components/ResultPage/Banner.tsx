"use client"

import { useState, useRef, useEffect } from "react"
import { Combobox } from "@headlessui/react"
import { ChevronUpDownIcon } from "@heroicons/react/20/solid"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  User,
  Calendar,
  X,
  ChevronRight,
  ChevronLeft,
  ArrowLeftRight,
  Luggage,
  Users,
  Plus,
  Minus,
  Search,
} from "lucide-react"
import { useRouter } from "next/navigation"

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]
const pricingData = {
  1: 219,
  2: 219,
  3: 219,
  4: 215,
  5: 208,
  6: 208,
  7: 219,
  8: 219,
  9: 219,
  10: 215,
  11: 208,
  12: 208,
  13: 208,
  14: 206,
  15: 206,
  16: 207,
  17: 207,
  18: 211,
  19: 211,
  20: 208,
  21: 207,
  22: 207,
  23: 207,
  24: 206,
  25: 211,
  26: 211,
  27: 211,
  28: 207,
  29: 207,
  30: 207,
  31: 207,
}

const Banner = () => {
  const todayDate = new Date()
  todayDate.setHours(0, 0, 0, 0) // Normalize today's date to start of day
  const todayDay = todayDate.getDate()
  const todayMonth = todayDate.getMonth() // 0-indexed
  const todayYear = todayDate.getFullYear()

  const [fromLocation, setFromLocation] = useState<string | null>("Karachi, Pakistan")
  const [toLocation, setToLocation] = useState<string | null>("Dubai, UAE")
  const [showCalender, setShowCalender] = useState<boolean>(false)
  const [startDate, setStartDate] = useState<Date | null>(new Date(todayYear, todayMonth, todayDay)) // Store as Date object
  const [endDate, setEndDate] = useState<Date | null>(null) // Store as Date object
  const [selectingStart, setSelectingStart] = useState(true)
  const [currentMonth, setCurrentMonth] = useState(todayMonth) // Initialize with current month
  const [currentYear, setCurrentYear] = useState(todayYear) // Initialize with current year
  const [tripType, setTripType] = useState("return") // Add trip type state
  const [passengers, setPassengers] = useState({
    adults: 1,
    children: 0,
    infants: 0,
  })
  const [baggage, setBaggage] = useState({
    cabin: 0,
    checked: 0,
  })
  const [cabinClass, setCabinClass] = useState("economy")
  const [fromQuery, setFromQuery] = useState("")
  const [toQuery, setToQuery] = useState("")
  const calendarRef = useRef<HTMLDivElement>(null)
  const n = useRouter()
  const [showMobileForm, setShowMobileForm] = useState(false)

  const handleSearch = () => {
    n.push("/flight")
  }

  useEffect(() => {
    if (showCalender && calendarRef.current) {
      setTimeout(() => {
        calendarRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        })
      }, 100)
    }
  }, [showCalender])

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (month: number, year: number) => {
    const firstDay = new Date(year, month, 1).getDay()
    return firstDay === 0 ? 6 : firstDay - 1 // Convert Sunday (0) to be last (6)
  }

  const formatSelectedDate = () => {
    if (!startDate && !endDate) return ""

    const format = (date: Date) => `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`

    if (tripType === "oneway") {
      return startDate ? format(startDate) : ""
    }

    if (startDate && !endDate) return format(startDate)
    if (startDate && endDate) {
      if (startDate.toDateString() === endDate.toDateString()) {
        return format(startDate)
      }
      return `${format(startDate)} - ${format(endDate)}`
    }
    return ""
  }

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentYear, currentMonth, day)
    clickedDate.setHours(0, 0, 0, 0) // Normalize clicked date

    const isPastDate = clickedDate < todayDate

    if (isPastDate) {
      return // Do not allow selection of past dates
    }

    if (tripType === "oneway") {
      if (startDate && clickedDate.toDateString() === startDate.toDateString()) {
        setStartDate(null)
      } else {
        setStartDate(clickedDate)
        setShowCalender(false)
      }
      setEndDate(null)
      return
    }

    // For return trips
    if (startDate && clickedDate.toDateString() === startDate.toDateString()) {
      setStartDate(null)
      setEndDate(null)
      setSelectingStart(true)
      return
    }

    if (endDate && clickedDate.toDateString() === endDate.toDateString()) {
      setEndDate(null)
      setSelectingStart(false)
      return
    }

    if (!startDate || selectingStart) {
      setStartDate(clickedDate)
      setEndDate(null)
      setSelectingStart(false)
      return
    }

    if (!selectingStart) {
      if (clickedDate < startDate) {
        setEndDate(startDate)
        setStartDate(clickedDate)
      } else {
        setEndDate(clickedDate)
        setShowCalender(false)
      }
      setSelectingStart(true)
    }
  }

  const handleTripTypeChange = (value: string) => {
    setTripType(value)
    if (value === "oneway") {
      setEndDate(null)
      setSelectingStart(true)
    }
  }

  const clearDates = () => {
    setStartDate(null)
    setEndDate(null)
    setSelectingStart(true)
  }

  const getPriceColor = (price: number) => {
    if (price <= 206) return "text-emerald-600"
    if (price <= 208) return "text-blue-600"
    return "text-gray-600"
  }

  const updatePassengers = (type: "adults" | "children" | "infants", action: "increment" | "decrement") => {
    setPassengers((prev) => {
      const newValue = action === "increment" ? prev[type] + 1 : Math.max(0, prev[type] - 1)
      if (type === "adults" && newValue === 0) return prev
      return { ...prev, [type]: newValue }
    })
  }

  const updateBaggage = (type: "cabin" | "checked", action: "increment" | "decrement") => {
    setBaggage((prev) => ({
      ...prev,
      [type]: action === "increment" ? prev[type] + 1 : Math.max(0, prev[type] - 1),
    }))
  }

  const getPassengerSummary = () => {
    const total = passengers.adults + passengers.children + passengers.infants
    if (total === 1) return "1 Passenger"
    return `${total} Passengers`
  }

  const getBagageSummary = () => {
    const total = baggage.cabin + baggage.checked
    if (total === 0) return "No Bags"
    if (total === 1) return "1 Bag"
    return `${total} Bags`
  }

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear)
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear)
    const days = []

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-16"></div>)
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day)
      date.setHours(0, 0, 0, 0) // Normalize date for comparison

      const price = pricingData[day as keyof typeof pricingData]
      const isStartDate = startDate && date.toDateString() === startDate.toDateString()
      const isEndDate = tripType === "return" && endDate && date.toDateString() === endDate.toDateString()
      const inRange = tripType === "return" && startDate && endDate && date > startDate && date < endDate
      const isToday = date.toDateString() === todayDate.toDateString()
      const isPastDate = date < todayDate

      const isSelected = isStartDate || isEndDate

      days.push(
        <div
          key={day}
          className={`h-16 flex flex-col items-center justify-center cursor-pointer rounded-lg transition-all duration-200 relative border-2
            ${isPastDate ? "bg-gray-100 text-gray-400 cursor-not-allowed" : ""}
            ${isStartDate
              ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-600 shadow-lg transform scale-105"
              : isEndDate
                ? "bg-gradient-to-r from-green-500 to-green-600 text-white border-green-600 shadow-lg transform scale-105"
                : inRange
                  ? "bg-gradient-to-r from-blue-50 to-green-50 border-blue-200 text-gray-800"
                  : isPastDate
                    ? "" // No hover effect for past dates
                    : "hover:bg-gray-50 border-transparent hover:border-gray-200 hover:shadow-md"
            }
            ${isToday && !isSelected && !isPastDate ? "border-blue-400 bg-blue-50" : ""}
          `}
          onClick={() => !isPastDate && handleDateClick(day)} // Only allow click if not a past date
        >
          <span
            className={`text-sm font-semibold ${isSelected ? "text-white" : isPastDate ? "text-gray-400" : "text-gray-900"}`}
          >
            {day}
          </span>
          {price && (
            <span
              className={`text-xs font-medium ${isSelected ? "text-white" : isPastDate ? "text-gray-400" : getPriceColor(price)}`}
            >
              ${price}
            </span>
          )}
          {isStartDate && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-[#EF3D23] rounded-full"></div>
            </div>
          )}
          {isEndDate && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-[#1479C9] rounded-full"></div>
            </div>
          )}
        </div>,
      )
    }
    return days
  }

  const navigateMonth = (direction: "prev" | "next") => {
    if (direction === "prev") {
      if (currentYear === todayYear && currentMonth === todayMonth) {
        return // Do not navigate back if already in the current month
      }
      if (currentMonth === 0) {
        setCurrentMonth(11)
        setCurrentYear(currentYear - 1)
      } else {
        setCurrentMonth(currentMonth - 1)
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0)
        setCurrentYear(currentYear + 1)
      } else {
        setCurrentMonth(currentMonth + 1)
      }
    }
    // Do NOT clear startDate or endDate when navigating months.
    // The user is just changing the calendar view.
  }

  const swapLocations = () => {
    const tempLocation = fromLocation
    const tempQuery = fromQuery
    setFromLocation(toLocation)
    setToLocation(tempLocation)
    setFromQuery(toQuery)
    setToQuery(tempQuery)
  }

  const cities = [
    "Karachi, Pakistan",
    "Dubai, UAE",
    "Lahore, Pakistan",
    "Islamabad, Pakistan",
    "London, UK",
    "New York, USA",
    "Toronto, Canada",
    "Sydney, Australia",
  ]

  const filteredFromCities =
    fromQuery === "" ? cities : cities.filter((city) => city.toLowerCase().includes(fromQuery.toLowerCase()))

  const filteredToCities =
    toQuery === "" ? cities : cities.filter((city) => city.toLowerCase().includes(toQuery.toLowerCase()))

  return (
    <div>
      <div className="  relative overflow-hidden">
        <main className=" relative z-10 max-w-8xl    sm:px-6 ">
          <div className="block md:hidden mb-4">
            {!showMobileForm && (
              <Button
                onClick={() => setShowMobileForm(true)}
                className="w-full bg-[#1479C9] hover:bg-sky-600 text-white font-semibold py-4 text-lg rounded-lg shadow-lg"
              >
                <Search className="w-5 h-5 mr-2" />
                Search Flights
              </Button>
            )}
          </div>

          <Card
            data-aos="zoom-in"
            data-aos-duration="1000"
            className={`max-w-8xl relative shadow-2xl transition-all duration-300 ${showMobileForm ? "block" : "hidden md:block"
              }`}
          >
            <CardContent className="p-4 md:p-6">
              <div className="block md:hidden mb-4">
                <Button
                  variant="ghost"
                  onClick={() => setShowMobileForm(false)}
                  className="w-full justify-center text-gray-600"
                >
                  <X className="w-4 h-4 mr-2" />
                  Close
                </Button>
              </div>

              <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-3 sm:gap-4 mb-6">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
                  <Select value={tripType} onValueChange={handleTripTypeChange}>
                    <SelectTrigger className="w-full sm:w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="return">Return</SelectItem>
                      <SelectItem value="oneway">One way</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={cabinClass} onValueChange={setCabinClass}>
                    <SelectTrigger className="w-full sm:w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="economy">Economy</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="first">First</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full sm:w-44 justify-between bg-transparent">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-2 text-blue-600" />
                          {getPassengerSummary()}
                        </div>
                        <ChevronUpDownIcon className="h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-4">
                      <div className="space-y-4">
                        <h4 className="font-medium text-sm text-gray-900">Passengers</h4>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-gray-600" />
                            <div>
                              <div className="text-sm font-medium">Adults</div>
                              <div className="text-xs text-gray-500">Over 11</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 bg-transparent"
                              onClick={() => updatePassengers("adults", "decrement")}
                              disabled={passengers.adults <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm">{passengers.adults}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 bg-transparent"
                              onClick={() => updatePassengers("adults", "increment")}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-gray-600" />
                            <div>
                              <div className="text-sm font-medium">Children</div>
                              <div className="text-xs text-gray-500">2 - 11</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 bg-transparent"
                              onClick={() => updatePassengers("children", "decrement")}
                              disabled={passengers.children <= 0}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm">{passengers.children}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 bg-transparent"
                              onClick={() => updatePassengers("children", "increment")}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-gray-600" />
                            <div>
                              <div className="text-sm font-medium">Infants</div>
                              <div className="text-xs text-gray-500">Under 2</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 bg-transparent"
                              onClick={() => updatePassengers("infants", "decrement")}
                              disabled={passengers.infants <= 0}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm">{passengers.infants}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 bg-transparent"
                              onClick={() => updatePassengers("infants", "increment")}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full sm:w-32 justify-between bg-transparent">
                        <div className="flex items-center">
                          <Luggage className="w-4 h-4 mr-2 text-orange-600" />
                          {getBagageSummary()}
                        </div>
                        <ChevronUpDownIcon className="h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-4">
                      <div className="space-y-4">
                        <h4 className="font-medium text-sm text-gray-900">Bags</h4>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Luggage className="w-4 h-4 text-gray-600" />
                            <div>
                              <div className="text-sm font-medium">Cabin baggage</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 bg-transparent"
                              onClick={() => updateBaggage("cabin", "decrement")}
                              disabled={baggage.cabin <= 0}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm">{baggage.cabin}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 bg-transparent"
                              onClick={() => updateBaggage("cabin", "increment")}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Luggage className="w-4 h-4 text-gray-600" />
                            <div>
                              <div className="text-sm font-medium">Checked baggage</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 bg-transparent"
                              onClick={() => updateBaggage("checked", "decrement")}
                              disabled={baggage.checked <= 0}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm">{baggage.checked}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 bg-transparent"
                              onClick={() => updateBaggage("checked", "increment")}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="flex flex-col lg:grid lg:grid-cols-10 gap-3 lg:gap-2 mb-6">
                <div className="lg:col-span-3 relative">
                  <div className="relative">
                    <Combobox
                      value={fromLocation}
                      onChange={(value) => {
                        setFromLocation(value)
                        setFromQuery("") // Clear query when selection is made
                      }}
                    >
                      <div className="relative">
                        <div className="relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-sm border bg-green-50 border-green-200 text-popover-foreground shadow-sm">
                          <Combobox.Input
                            className="w-full placeholder-[#059669] bg-green-50 px-4 py-3 md:py-2 text-sm leading-5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-300"
                            placeholder="From"
                            onChange={(e) => setFromQuery(e.target.value)}
                            displayValue={(city: string) => city}
                          />
                          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-3">
                            <ChevronUpDownIcon className="h-5 w-5 text-green-600" />
                          </Combobox.Button>
                        </div>
                        <Combobox.Options className="absolute mt-2 w-full z-10 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto text-sm text-gray-900">
                          <div className="px-4 pt-3 pb-1 text-xs font-medium text-gray-500 uppercase">Suggestions</div>
                          {filteredFromCities.map((city) => (
                            <Combobox.Option
                              key={`from-${city}`}
                              value={city}
                              className={({ active }) =>
                                `flex justify-between items-center px-4 py-2 cursor-pointer ${active ? "bg-green-100" : "hover:bg-gray-100"
                                }`
                              }
                            >
                              <span className="truncate">{city}</span>
                              <button className="text-green-600 font-bold text-lg">+</button>
                            </Combobox.Option>
                          ))}
                        </Combobox.Options>
                      </div>
                    </Combobox>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={swapLocations}
                    className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 lg:top-[48%] lg:left-[102%] lg:transform lg:-translate-y-1/2 lg:translate-x-0 p-2 w-8 h-8 z-50 hover:bg-sky-50 rounded-full border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-200"
                    title="Swap destinations"
                  >
                    <ArrowLeftRight className="w-4 h-4 text-[#1479C9] rotate-90 lg:rotate-0" />
                  </Button>
                </div>

                <div className="lg:col-span-3 mt-4 lg:mt-0">
                  <div className="relative">
                    <Combobox
                      value={toLocation}
                      onChange={(value) => {
                        setToLocation(value)
                        setToQuery("") // Clear query when selection is made
                      }}
                    >
                      <div className="relative">
                        <div className="relative z-10 max-h-96 min-w-[8rem] overflow-hidden rounded-sm border bg-orange-50 border-orange-200 text-popover-foreground shadow-sm">
                          <Combobox.Input
                            className="w-full placeholder-[#ea580c] bg-orange-50 px-4 py-3 md:py-2 text-sm leading-5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-300"
                            placeholder="To"
                            onChange={(e) => setToQuery(e.target.value)}
                            displayValue={(city: string) => city}
                          />
                          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-3">
                            <ChevronUpDownIcon className="h-5 w-5 text-orange-600" />
                          </Combobox.Button>
                        </div>
                        <Combobox.Options className="absolute mt-2 w-full z-10 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto text-sm text-gray-900">
                          <div className="px-4 pt-3 pb-1 text-xs font-medium text-gray-500 uppercase">Suggestions</div>
                          {filteredToCities.map((city) => (
                            <Combobox.Option
                              key={`to-${city}`}
                              value={city}
                              className={({ active }) =>
                                `flex justify-between items-center px-4 py-2 cursor-pointer ${active ? "bg-orange-100" : "hover:bg-gray-100"
                                }`
                              }
                            >
                              <span className="truncate">{city}</span>
                              <button className="text-orange-600 font-bold text-lg">+</button>
                            </Combobox.Option>
                          ))}
                        </Combobox.Options>
                      </div>
                    </Combobox>
                  </div>
                </div>

                <div className="lg:col-span-3">
                  <div>
                    <div className="space-y-2">
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                          <Calendar className="h-4 w-4 text-blue-500" />
                        </div>
                        <Input
                          id="departure"
                          value={formatSelectedDate()}
                          readOnly
                          onClick={() => setShowCalender(!showCalender)}
                          placeholder={tripType === "oneway" ? "Departure Date" : "Departure to Arrival"}
                          className="relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-sm border bg-popover text-popover-foreground shadow-sm cursor-pointer pl-10 py-3 md:py-2"
                        />
                        <button
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                          onClick={(e) => {
                            e.stopPropagation()
                            clearDates()
                          }}
                        >
                          <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                        </button>
                      </div>
                    </div>
                    {showCalender && (
                      <div
                        ref={calendarRef}
                        className="space-y-4 absolute w-full md:w-2/3 left-0 md:left-[21.5%] z-20 bg-white border border-gray-200 rounded-lg shadow-xl p-4"
                      >
                        <div className="flex items-center justify-between">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigateMonth("prev")}
                            disabled={currentYear === todayYear && currentMonth === todayMonth} // Disable if it's the current month
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <h3 className="font-semibold text-gray-900 text-lg">
                            {months[currentMonth]} {currentYear}
                          </h3>
                          <Button variant="ghost" size="sm" onClick={() => navigateMonth("next")}>
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                          {daysOfWeek.map((day) => (
                            <div key={day} className="h-8 flex items-center justify-center">
                              <span className="text-xs font-semibold text-gray-600">{day}</span>
                            </div>
                          ))}
                        </div>
                        <div className="grid grid-cols-7 gap-1">{renderCalendarDays()}</div>
                        <div className="text-xs text-gray-500 text-center p-2 bg-gray-50 rounded-md">
                          {tripType === "oneway" ? (
                            "Select your departure date (click again to deselect)"
                          ) : (
                            <div className="space-y-1">
                              <div className="flex items-center justify-center gap-4">
                                <div className="flex items-center gap-1">
                                  <div className="w-3 h-3 bg-[#EF3D23] rounded-full"></div>
                                  <span>Departure</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <div className="w-3 h-3 bg-[#1479C9] rounded-full"></div>
                                  <span>Return</span>
                                </div>
                              </div>
                              <div className="text-center">Click on selected dates to deselect them</div>
                            </div>
                          )}
                        </div>
                        {(startDate || endDate) && (
                          <div className="flex justify-center">
                            <Button variant="outline" size="sm" onClick={clearDates} className="text-xs bg-transparent">
                              Clear All Dates
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="lg:col-span-1 flex self-center w-full lg:w-auto">
                  <Button
                    onClick={handleSearch}
                    className="w-full bg-[#1479C9] hover:bg-sky-600 text-white font-semibold py-4 lg:py-3 text-base lg:text-sm"
                  >
                    <Search className="w-4 h-4 mr-2 lg:hidden" />
                    Search
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-center lg:justify-end space-x-2 mt-4 lg:mt-0">
                <Checkbox id="accommodation" defaultChecked />
                <label htmlFor="accommodation" className="text-sm text-gray-700 text-center lg:text-left">
                  Check accommodation with <span className="text-blue-600 font-semibold">Booking.com</span>
                </label>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}

export default Banner
