"use client"
import { useState, useRef, useEffect } from "react"
import { Combobox } from "@headlessui/react"
import { ChevronUpDownIcon } from "@heroicons/react/20/solid"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { User, Calendar, X, ChevronRight, ChevronLeft, ArrowLeftRight, Luggage, Users } from "lucide-react"

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
  const [fromLocation, setFromLocation] = useState<string | null>("Karachi, Pakistan")
  const [toLocation, setToLocation] = useState<string | null>("Dubai, UAE")
  const [showCalender, setShowCalender] = useState<boolean>(false)
  const [startDate, setStartDate] = useState<number | null>(null)
  const [endDate, setEndDate] = useState<number | null>(null)
  const [selectingStart, setSelectingStart] = useState(true)
  const [currentMonth, setCurrentMonth] = useState(6) // July (0-indexed)
  const [currentYear, setCurrentYear] = useState(2025)
  const [selectedDays, setSelectedDays] = useState<number | null>(null)
  const [tripType, setTripType] = useState("return") // Add trip type state

  // New state for passengers and bags
  const [passengerCount, setPassengerCount] = useState("1")
  const [bagCount, setBagCount] = useState("0")
  const [cabinClass, setCabinClass] = useState("economy")

  // Separate query states for from and to locations - Fixed binding issue
  const [fromQuery, setFromQuery] = useState("")
  const [toQuery, setToQuery] = useState("")

  // Ref for calendar container to enable auto-scroll
  const calendarRef = useRef<HTMLDivElement>(null)

  const today = 6

  // Auto-scroll effect when calendar opens
  useEffect(() => {
    if (showCalender && calendarRef.current) {
      // Small delay to ensure the calendar is rendered
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
    // For one-way trips, only show departure date
    if (tripType === "oneway") {
      return startDate ? `${months[currentMonth]} ${startDate}` : ""
    }
    // For return trips, show both dates
    if (startDate && !endDate) return `${months[currentMonth]} ${startDate}`
    if (startDate && endDate) return `${months[currentMonth]} ${startDate} - ${months[currentMonth]} ${endDate}`
    return ""
  }

  const handleDateClick = (day: number) => {
    // For one-way trips, only allow selecting departure date
    if (tripType === "oneway") {
      // If clicking on already selected date, deselect it
      if (day === startDate) {
        setStartDate(null)
      } else {
        setStartDate(day)
      }
      setEndDate(null)
      return
    }

    // For return trips, handle both departure and return dates
    // If clicking on already selected start date, deselect it
    if (day === startDate) {
      setStartDate(endDate) // Move end date to start if it exists
      setEndDate(null)
      setSelectingStart(endDate ? false : true) // If we moved end to start, we're now selecting end
      return
    }

    // If clicking on already selected end date, deselect it
    if (day === endDate) {
      setEndDate(null)
      setSelectingStart(false) // Continue selecting end date
      return
    }

    // If no dates are selected, or we're selecting start
    if (!startDate || selectingStart) {
      setStartDate(day)
      setEndDate(null)
      setSelectingStart(false) // Next click will be for end date
      return
    }

    // If we're selecting end date
    if (!selectingStart) {
      if (day < startDate) {
        // If selected day is before start date, make it the new start date
        setEndDate(startDate) // Current start becomes end
        setStartDate(day) // Selected day becomes start
      } else {
        // Normal case: selected day becomes end date
        setEndDate(day)
        setShowCalender(false) // Close calendar after selecting both dates
      }
      setSelectingStart(true) // Reset for next selection
    }
  }

  // Handle trip type change
  const handleTripTypeChange = (value: string) => {
    setTripType(value)
    // Reset dates when switching trip types
    if (value === "oneway") {
      setEndDate(null)
      setSelectingStart(true)
    }
  }

  // Clear all selected dates
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

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear)
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear)
    const days = []

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-16"></div>)
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const price = pricingData[day as keyof typeof pricingData]
      const isStartDate = day === startDate
      const isEndDate = tripType === "return" && day === endDate
      const inRange = tripType === "return" && startDate && endDate && day > startDate && day < endDate
      const isSelected = isStartDate || isEndDate

      days.push(
        <div
          key={day}
          className={`h-16 flex flex-col items-center justify-center cursor-pointer rounded-lg transition-all duration-200 relative border-2
            ${
              isStartDate
                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-600 shadow-lg transform scale-105"
                : isEndDate
                  ? "bg-gradient-to-r from-green-500 to-green-600 text-white border-green-600 shadow-lg transform scale-105"
                  : inRange
                    ? "bg-gradient-to-r from-blue-50 to-green-50 border-blue-200 text-gray-800"
                    : "hover:bg-gray-50 border-transparent hover:border-gray-200 hover:shadow-md"
            }
          `}
          onClick={() => handleDateClick(day)}
        >
          <span className={`text-sm font-semibold ${isSelected ? "text-white" : "text-gray-900"}`}>{day}</span>
          {price && (
            <span className={`text-xs font-medium ${isSelected ? "text-white" : getPriceColor(price)}`}>${price}</span>
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
  }

  // Updated swap function
  const swapLocations = () => {
    const tempLocation = fromLocation
    const tempQuery = fromQuery
    setFromLocation(toLocation)
    setToLocation(tempLocation)
    setFromQuery(toQuery)
    setToQuery(tempQuery)
  }

  // Helper function to format passenger text
  const getPassengerText = (count: string) => {
    const num = Number.parseInt(count)
    if (num === 1) return "1 Passenger"
    if (num <= 9) return `${num} Passengers`
    return "9+ Passengers"
  }

  // Helper function to format bag text
  const getBagText = (count: string) => {
    const num = Number.parseInt(count)
    if (num === 0) return "No Bags"
    if (num === 1) return "1 Bag"
    return `${num} Bags`
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

  // Filter cities for "From" location - Fixed to use separate queries
  const filteredFromCities =
    fromQuery === "" ? cities : cities.filter((city) => city.toLowerCase().includes(fromQuery.toLowerCase()))

  // Filter cities for "To" location - Fixed to use separate queries
  const filteredToCities =
    toQuery === "" ? cities : cities.filter((city) => city.toLowerCase().includes(toQuery.toLowerCase()))

  return (
    <div className="h-[50rem] bg-gradient-to-br from-[#1479C9] via-[#0B2F5C] to-[#EF3D23] relative overflow-hidden">
      <main className=" relative z-10 max-w-7xl  mx-auto  sm:px-6 lg:px-8 pt-16 pb-24">
        {/* Hero Text */}
        <div className="text-center mb-12">
          <h1
            data-aos="fade-up"
            data-aos-duration="1000"
            className="text-4xl text-shadow-custom md:text-6xl lg:text-7xl font-bold text-[#ffffff] font-poppins mb-4 tracking-wider"
          >
            YOU GOD UWL SUCK KC
          </h1>
          <p
            data-aos="fade-down"
            data-aos-duration="1000"
            className="text-shadow-custom text-xl md:text-2xl text-[#ffffff] font-bold max-w-2xl mx-auto"
          >
            Book cheap flights other sites simply can't find.
          </p>
        </div>

        {/* Search Form */}
        <Card data-aos="zoom-in" data-aos-duration="1000" className=" max-w-4xl relative mx-auto shadow-2xl">
          <CardContent className="p-6">
            {/* Trip Options */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <Select value={tripType} onValueChange={handleTripTypeChange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="return">Return</SelectItem>
                  <SelectItem value="oneway">One way</SelectItem>
                </SelectContent>
              </Select>

              <Select value={cabinClass} onValueChange={setCabinClass}>
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

              {/* Enhanced Passenger Selector */}
              <Select value={passengerCount} onValueChange={setPassengerCount}>
                <SelectTrigger className="w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2 text-blue-600" />1 Passenger
                    </div>
                  </SelectItem>
                  <SelectItem value="2">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2 text-blue-600" />2 Passengers
                    </div>
                  </SelectItem>
                  <SelectItem value="3">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2 text-blue-600" />3 Passengers
                    </div>
                  </SelectItem>
                  <SelectItem value="4">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2 text-blue-600" />4 Passengers
                    </div>
                  </SelectItem>
                  <SelectItem value="5">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2 text-blue-600" />5 Passengers
                    </div>
                  </SelectItem>
                  <SelectItem value="6">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2 text-blue-600" />6 Passengers
                    </div>
                  </SelectItem>
                  <SelectItem value="7">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2 text-blue-600" />7 Passengers
                    </div>
                  </SelectItem>
                  <SelectItem value="8">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2 text-blue-600" />8 Passengers
                    </div>
                  </SelectItem>
                  <SelectItem value="9">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2 text-blue-600" />
                      9+ Passengers
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>

              {/* Enhanced Baggage Selector */}
              <Select value={bagCount} onValueChange={setBagCount}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">
                    <div className="flex items-center">
                      <Luggage className="w-4 h-4 mr-2 text-orange-600" />
                      No Bags
                    </div>
                  </SelectItem>
                  <SelectItem value="1">
                    <div className="flex items-center">
                      <Luggage className="w-4 h-4 mr-2 text-orange-600" />1 Bag
                    </div>
                  </SelectItem>
                  <SelectItem value="2">
                    <div className="flex items-center">
                      <Luggage className="w-4 h-4 mr-2 text-orange-600" />2 Bags
                    </div>
                  </SelectItem>
                  <SelectItem value="3">
                    <div className="flex items-center">
                      <Luggage className="w-4 h-4 mr-2 text-orange-600" />3 Bags
                    </div>
                  </SelectItem>
                  <SelectItem value="4">
                    <div className="flex items-center">
                      <Luggage className="w-4 h-4 mr-2 text-orange-600" />4 Bags
                    </div>
                  </SelectItem>
                  <SelectItem value="5">
                    <div className="flex items-center">
                      <Luggage className="w-4 h-4 mr-2 text-orange-600" />
                      5+ Bags
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Location and Date Inputs */}
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-2 mb-6">
              {/* From Location */}
              <div className="lg:col-span-3">
                <div className="relative">
                  <Combobox
                    value={fromLocation}
                    onChange={(value) => {
                      setFromLocation(value)
                      setFromQuery("") // Clear query when selection is made
                    }}
                  >
                    <div className="relative">
                      {/* Input Box with Green Background for "From" */}
                      <div className="relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-sm border bg-green-50 border-green-200 text-popover-foreground shadow-sm">
                        <Combobox.Input
                          className="w-full placeholder-[#059669] bg-green-50 px-4 py-2 text-sm leading-5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-300"
                          placeholder="From"
                          onChange={(e) => setFromQuery(e.target.value)}
                          displayValue={(city: string) => city}
                        />
                        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-3">
                          <ChevronUpDownIcon className="h-5 w-5 text-green-600" />
                        </Combobox.Button>
                      </div>

                      {/* Dropdown Panel */}
                      <Combobox.Options className="absolute mt-2 w-full z-10 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto text-sm text-gray-900">
                        <div className="px-4 pt-3 pb-1 text-xs font-medium text-gray-500 uppercase">Suggestions</div>
                        {filteredFromCities.map((city) => (
                          <Combobox.Option
                            key={`from-${city}`}
                            value={city}
                            className={({ active }) =>
                              `flex justify-between items-center px-4 py-2 cursor-pointer ${
                                active ? "bg-green-100" : "hover:bg-gray-100"
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
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={swapLocations}
                className="p-2 w-7 h-6  absolute top-[48%] left-[29.3%] z-50 hover:bg-sky-50 rounded-full border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-200"
                title="Swap destinations"
              >
                <ArrowLeftRight className="w-4 h-4 text-[#1479C9]" />
              </Button>

              {/* To Location */}
              <div className="lg:col-span-3">
                <div className="relative">
                  <Combobox
                    value={toLocation}
                    onChange={(value) => {
                      setToLocation(value)
                      setToQuery("") // Clear query when selection is made
                    }}
                  >
                    <div className="relative">
                      {/* Input Box with Orange Background for "To" */}
                      <div className="relative z-10 max-h-96 min-w-[8rem] overflow-hidden rounded-sm border bg-orange-50 border-orange-200 text-popover-foreground shadow-sm">
                        <Combobox.Input
                          className="w-full placeholder-[#ea580c] bg-orange-50 px-4 py-2 text-sm leading-5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-300"
                          placeholder="To"
                          onChange={(e) => setToQuery(e.target.value)}
                          displayValue={(city: string) => city}
                        />
                        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-3">
                          <ChevronUpDownIcon className="h-5 w-5 text-orange-600" />
                        </Combobox.Button>
                      </div>

                      {/* Dropdown Panel */}
                      <Combobox.Options className="absolute mt-2 w-full z-10 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto text-sm text-gray-900">
                        <div className="px-4 pt-3 pb-1 text-xs font-medium text-gray-500 uppercase">Suggestions</div>
                        {filteredToCities.map((city) => (
                          <Combobox.Option
                            key={`to-${city}`}
                            value={city}
                            className={({ active }) =>
                              `flex justify-between items-center px-4 py-2 cursor-pointer ${
                                active ? "bg-orange-100" : "hover:bg-gray-100"
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

              {/* Departure Date */}
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
                        className="relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-sm border bg-popover text-popover-foreground shadow-sm cursor-pointer pl-10"
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
                      className="space-y-4 absolute w-2/3 left-[21.5%] z-20 bg-white border border-gray-200 rounded-lg shadow-xl p-4"
                    >
                      {/* Calendar Header */}
                      <div className="flex items-center justify-between">
                        <Button variant="ghost" size="sm" onClick={() => navigateMonth("prev")}>
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <h3 className="font-semibold text-gray-900 text-lg">
                          {months[currentMonth]} {currentYear}
                        </h3>
                        <Button variant="ghost" size="sm" onClick={() => navigateMonth("next")}>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Days of Week Header */}
                      <div className="grid grid-cols-7 gap-1">
                        {daysOfWeek.map((day) => (
                          <div key={day} className="h-8 flex items-center justify-center">
                            <span className="text-xs font-semibold text-gray-600">{day}</span>
                          </div>
                        ))}
                      </div>

                      {/* Calendar Grid */}
                      <div className="grid grid-cols-7 gap-1">{renderCalendarDays()}</div>

                      {/* Helper text for trip type */}
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

                      {/* Clear dates button */}
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

              {/* Search Button */}
              <div className="lg:col-span-1 flex self-center ">
                <Button className="w-full bg-[#1479C9] hover:bg-sky-600 text-white font-semibold py-3">Search</Button>
              </div>
            </div>

            {/* Booking.com Integration */}
            <div className="flex items-end justify-end space-x-2">
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

export default Banner
