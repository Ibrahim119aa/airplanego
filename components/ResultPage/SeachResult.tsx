"use client"

import { useState, useMemo } from "react"
import { AnimatePresence } from "framer-motion"
import React from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import {
  Luggage,
  Briefcase,
  ChevronUp,
  ChevronDown,
  Building2,
  Sun,
  Sunset,
  Moon,
  Sunrise,
  LayoutGrid,
  BarChart2,
  Filter,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

const FlightDetailModalComponent = React.lazy(() => import("@/components/Modal/FlightDetailModel"))

type QuantityControlProps = {
  label: string
  icon: any
  count: number
  setCount: (newCount: number) => void
}

type BaggageInfo = {
  cabinBag: string
  checkedBag: string
  personalItem: string
}

type FlightLeg = {
  date: string
  time: string
  airport: string
  duration: string
  totalDuration: string // Total journey time including stops
  type: "Direct" | "1 stop" | "2 stops"
  arrivalTime: string
  arrivalAirport: string
  airline: string
  aircraftType: string
  baggage: BaggageInfo
  stops?: {
    airport: string
    cityName: string // Added city name for better UX
    duration: string
    isOvernight?: boolean
    arrivalTime?: string
    departureTime?: string
  }[]
}

type BookingOption = {
  type: "Standard" | "Flex"
  price: number
  features: string[]
  restrictions: string[]
}

type FlightOption = {
  id: string
  outbound: FlightLeg
  inbound?: FlightLeg
  nightsInDestination?: number
  basePrice: number
  bookingOptions: BookingOption[]
  guaranteeAvailable: boolean
  guaranteeAmount: number
}

type TimeRange = "morning" | "afternoon" | "evening" | "night"

type DateFilterOption = {
  id: string
  label: string
  price: number
}

interface FlightDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function FlightDetailModal({ open, onOpenChange }: FlightDetailModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
        <h2 className="text-lg font-semibold mb-4">Flight Details</h2>
        <p className="text-gray-600 mb-4">Flight details would be displayed here.</p>
        <Button onClick={() => onOpenChange(false)} className="w-full">
          Close
        </Button>
      </div>
    </div>
  )
}

export default function FlightSearch() {
  const [tripType, setTripType] = useState<"round-trip" | "one-way">("round-trip")
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([])
  const [airlinesExpanded, setAirlinesExpanded] = useState(true)
  const [stopsExpanded, setStopsExpanded] = useState(true)
  const [priceExpanded, setPriceExpanded] = useState(true)
  const [departureTimeExpanded, setDepartureTimeExpanded] = useState(true)
  const [arrivalTimeExpanded, setArrivalTimeExpanded] = useState(true)
  const [durationExpanded, setDurationExpanded] = useState(true)
  const [baggageExpanded, setBaggageExpanded] = useState(true)
  const [selectedStops, setSelectedStops] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [selectedDepartureTimes, setSelectedDepartureTimes] = useState<string[]>([])
  const [selectedArrivalTimes, setSelectedArrivalTimes] = useState<string[]>([])
  const [maxDuration, setMaxDuration] = useState(24)
  const [selectedBaggage, setSelectedBaggage] = useState<string[]>([])
  const [selectedDateFilter, setSelectedDateFilter] = useState("tue-19")
  const [selectedTab, setSelectedTab] = useState("best")
  const [isOpen, setIsOpen] = useState(false)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const availableAirlines = ["Lufthansa", "Air France", "KLM", "British Airways", "Ryanair", "EasyJet"]
  const stopOptions = ["Direct", "1 stop", "2+ stops"]
  const departureTimeOptions = [
    { id: "early-morning", label: "Early morning", time: "00:00 - 06:00", icon: Moon },
    { id: "morning", label: "Morning", time: "06:00 - 12:00", icon: Sunrise },
    { id: "afternoon", label: "Afternoon", time: "12:00 - 18:00", icon: Sun },
    { id: "evening", label: "Evening", time: "18:00 - 00:00", icon: Sunset },
  ]
  const arrivalTimeOptions = [
    { id: "early-morning", label: "Early morning", time: "00:00 - 06:00", icon: Moon },
    { id: "morning", label: "Morning", time: "06:00 - 12:00", icon: Sunrise },
    { id: "afternoon", label: "Afternoon", time: "12:00 - 18:00", icon: Sun },
    { id: "evening", label: "Evening", time: "18:00 - 00:00", icon: Sunset },
  ]
  const baggageOptions = [
    { id: "personal-item", label: "Personal item", icon: Briefcase },
    { id: "carry-on", label: "Carry-on bag", icon: Luggage },
    { id: "checked-bag", label: "Checked bag", icon: Luggage },
  ]

  const dateFilterOptions = [
    { id: "sun-17", label: "Sun 17", price: 234 },
    { id: "mon-18", label: "Mon 18", price: 180 },
    { id: "tue-19", label: "Tue 19", price: 156 },
    { id: "wed-20", label: "Wed 20", price: 203 },
    { id: "thu-21", label: "Thu 21", price: 289 },
    { id: "fri-22", label: "Fri 22", price: 267 },
    { id: "sat-23", label: "Sat 23", price: 245 },
  ]

  const flightOptions = [
    {
      id: 1,
      basePrice: 156,
      outbound: {
        airline: "Lufthansa",
        time: "06:00",
        airport: "FRA",
        arrivalTime: "09:30",
        arrivalAirport: "LHR",
        totalDuration: "8h 30m",
        stops: [{ airport: "CDG", duration: "2h 15m" }],
        date: "Tue, Nov 19",
      },
      inbound:
        tripType === "round-trip"
          ? {
            airline: "Lufthansa",
            time: "14:20",
            airport: "LHR",
            arrivalTime: "19:45",
            arrivalAirport: "FRA",
            totalDuration: "7h 25m",
            stops: [],
            date: "Sun, Nov 24",
          }
          : undefined,
    },
    {
      id: 2,
      basePrice: 203,
      outbound: {
        airline: "Air France",
        time: "08:15",
        airport: "CDG",
        arrivalTime: "10:45",
        arrivalAirport: "LHR",
        totalDuration: "6h 30m",
        stops: [],
        date: "Tue, Nov 19",
      },
      inbound:
        tripType === "round-trip"
          ? {
            airline: "Air France",
            time: "16:30",
            airport: "LHR",
            arrivalTime: "21:15",
            arrivalAirport: "CDG",
            totalDuration: "6h 45m",
            stops: [],
            date: "Sun, Nov 24",
          }
          : undefined,
    },
    {
      id: 3,
      basePrice: 289,
      outbound: {
        airline: "British Airways",
        time: "12:00",
        airport: "LHR",
        arrivalTime: "15:30",
        arrivalAirport: "JFK",
        totalDuration: "8h 30m",
        stops: [],
        date: "Tue, Nov 19",
      },
      inbound:
        tripType === "round-trip"
          ? {
            airline: "British Airways",
            time: "18:45",
            airport: "JFK",
            arrivalTime: "06:15",
            arrivalAirport: "LHR",
            totalDuration: "7h 30m",
            stops: [],
            date: "Sun, Nov 24",
          }
          : undefined,
    },
  ]

  const handleAirlineChange = (airline: string, checked: boolean) => {
    if (checked) {
      setSelectedAirlines([...selectedAirlines, airline])
    } else {
      setSelectedAirlines(selectedAirlines.filter((a) => a !== airline))
    }
  }

  const handleStopChange = (stop: string, checked: boolean) => {
    if (checked) {
      setSelectedStops([...selectedStops, stop])
    } else {
      setSelectedStops(selectedStops.filter((s) => s !== stop))
    }
  }

  const handleDepartureTimeChange = (time: string, checked: boolean) => {
    if (checked) {
      setSelectedDepartureTimes([...selectedDepartureTimes, time])
    } else {
      setSelectedDepartureTimes(selectedDepartureTimes.filter((t) => t !== time))
    }
  }

  const handleArrivalTimeChange = (time: string, checked: boolean) => {
    if (checked) {
      setSelectedArrivalTimes([...selectedArrivalTimes, time])
    } else {
      setSelectedArrivalTimes(selectedArrivalTimes.filter((t) => t !== time))
    }
  }

  const handleBaggageChange = (baggage: string, checked: boolean) => {
    if (checked) {
      setSelectedBaggage([...selectedBaggage, baggage])
    } else {
      setSelectedBaggage(selectedBaggage.filter((b) => b !== baggage))
    }
  }

  const filteredFlights = useMemo(() => {
    return flightOptions.filter((flight) => {
      if (selectedAirlines.length > 0 && !selectedAirlines.includes(flight.outbound.airline)) {
        return false
      }
      if (flight.basePrice < priceRange[0] || flight.basePrice > priceRange[1]) {
        return false
      }
      return true
    })
  }, [selectedAirlines, priceRange])

  const best = useMemo(() => {
    if (filteredFlights.length === 0) return null
    return filteredFlights.reduce((prev, current) => {
      const prevScore = prev.basePrice * 0.6 + Number.parseInt(prev.outbound.totalDuration) * 0.4
      const currentScore = current.basePrice * 0.6 + Number.parseInt(current.outbound.totalDuration) * 0.4
      return prevScore < currentScore ? prev : current
    })
  }, [filteredFlights])

  const cheapest = useMemo(() => {
    if (filteredFlights.length === 0) return null
    return filteredFlights.reduce((prev, current) => (prev.basePrice < current.basePrice ? prev : current))
  }, [filteredFlights])

  const fastest = useMemo(() => {
    if (filteredFlights.length === 0) return null
    return filteredFlights.reduce((prev, current) => {
      const prevDuration = Number.parseInt(prev.outbound.totalDuration)
      const currentDuration = Number.parseInt(current.outbound.totalDuration)
      return prevDuration < currentDuration ? prev : current
    })
  }, [filteredFlights])

  const renderSimplifiedStops = (flight: any) => {
    if (flight.stops.length === 0) {
      return (
        <div className="flex items-center justify-center w-full">
          <div className="flex-1 h-px bg-gray-300"></div>
          <div className="mx-2 text-xs text-gray-500">Direct</div>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>
      )
    }

    return (
      <div className="flex items-center justify-center w-full">
        <div className="flex-1 h-px bg-gray-300"></div>
        <div className="mx-2 text-xs text-gray-500">
          {flight.stops.length} stop{flight.stops.length > 1 ? "s" : ""}
        </div>
        <div className="flex-1 h-px bg-gray-300"></div>
      </div>
    )
  }

  const FilterSidebar = () => (
    <div className="space-y-4">
      <div className="pb-4 border-b border-gray-200">
        <h2 className="text-base font-semibold mb-3">Trip type</h2>
        <RadioGroup
          value={tripType}
          onValueChange={(value: "round-trip" | "one-way") => setTripType(value)}
          className="grid gap-2"
        >
          <Label htmlFor="round-trip" className="flex items-center gap-2 text-sm font-medium cursor-pointer">
            <RadioGroupItem value="round-trip" id="round-trip" />
            Round trip
          </Label>
          <Label htmlFor="one-way" className="flex items-center gap-2 text-sm font-medium cursor-pointer">
            <RadioGroupItem value="one-way" id="one-way" />
            One way
          </Label>
        </RadioGroup>
      </div>

      <div className="pb-4 border-b border-gray-200">
        <div
          className="flex items-center justify-between cursor-pointer py-1"
          onClick={() => setAirlinesExpanded(!airlinesExpanded)}
        >
          <h2 className="text-base font-semibold">Airlines</h2>
          {airlinesExpanded ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </div>
        {airlinesExpanded && (
          <div className="mt-3 space-y-2">
            {availableAirlines.map((airline) => (
              <div key={airline} className="flex items-center gap-2">
                <Checkbox
                  id={`airline-${airline}`}
                  checked={selectedAirlines.includes(airline)}
                  onCheckedChange={(checked) => handleAirlineChange(airline, checked as boolean)}
                />
                <Label
                  htmlFor={`airline-${airline}`}
                  className="flex items-center gap-2 text-sm font-medium cursor-pointer flex-1"
                >
                  <Building2 className="w-4 h-4 text-gray-500" />
                  {airline}
                </Label>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="pb-4 border-b border-gray-200">
        <div
          className="flex items-center justify-between cursor-pointer py-1"
          onClick={() => setStopsExpanded(!stopsExpanded)}
        >
          <h2 className="text-base font-semibold">Stops</h2>
          {stopsExpanded ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </div>
        {stopsExpanded && (
          <div className="mt-3 space-y-2">
            {stopOptions.map((stop) => (
              <div key={stop} className="flex items-center gap-2">
                <Checkbox
                  id={`stop-${stop}`}
                  checked={selectedStops.includes(stop)}
                  onCheckedChange={(checked) => handleStopChange(stop, checked as boolean)}
                />
                <Label htmlFor={`stop-${stop}`} className="text-sm font-medium cursor-pointer flex-1">
                  {stop}
                </Label>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="pb-4 border-b border-gray-200">
        <div
          className="flex items-center justify-between cursor-pointer py-1"
          onClick={() => setDepartureTimeExpanded(!departureTimeExpanded)}
        >
          <h2 className="text-base font-semibold">Departure time</h2>
          {departureTimeExpanded ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </div>
        {departureTimeExpanded && (
          <div className="mt-3 space-y-2">
            {departureTimeOptions.map((option) => (
              <div key={option.id} className="flex items-center gap-2">
                <Checkbox
                  id={`departure-${option.id}`}
                  checked={selectedDepartureTimes.includes(option.id)}
                  onCheckedChange={(checked) => handleDepartureTimeChange(option.id, checked as boolean)}
                />
                <Label
                  htmlFor={`departure-${option.id}`}
                  className="flex items-center gap-2 text-sm font-medium cursor-pointer flex-1"
                >
                  <option.icon className="w-4 h-4 text-gray-500" />
                  <div>
                    <div>{option.label}</div>
                    <div className="text-xs text-gray-500">{option.time}</div>
                  </div>
                </Label>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="pb-4 border-b border-gray-200">
        <div
          className="flex items-center justify-between cursor-pointer py-1"
          onClick={() => setArrivalTimeExpanded(!arrivalTimeExpanded)}
        >
          <h2 className="text-base font-semibold">Arrival time</h2>
          {arrivalTimeExpanded ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </div>
        {arrivalTimeExpanded && (
          <div className="mt-3 space-y-2">
            {arrivalTimeOptions.map((option) => (
              <div key={option.id} className="flex items-center gap-2">
                <Checkbox
                  id={`arrival-${option.id}`}
                  checked={selectedArrivalTimes.includes(option.id)}
                  onCheckedChange={(checked) => handleArrivalTimeChange(option.id, checked as boolean)}
                />
                <Label
                  htmlFor={`arrival-${option.id}`}
                  className="flex items-center gap-2 text-sm font-medium cursor-pointer flex-1"
                >
                  <option.icon className="w-4 h-4 text-gray-500" />
                  <div>
                    <div>{option.label}</div>
                    <div className="text-xs text-gray-500">{option.time}</div>
                  </div>
                </Label>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="pb-4 border-b border-gray-200">
        <div
          className="flex items-center justify-between cursor-pointer py-1"
          onClick={() => setBaggageExpanded(!baggageExpanded)}
        >
          <h2 className="text-base font-semibold">Baggage</h2>
          {baggageExpanded ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </div>
        {baggageExpanded && (
          <div className="mt-3 space-y-2">
            {baggageOptions.map((option) => (
              <div key={option.id} className="flex items-center gap-2">
                <Checkbox
                  id={`baggage-${option.id}`}
                  checked={selectedBaggage.includes(option.id)}
                  onCheckedChange={(checked) => handleBaggageChange(option.id, checked as boolean)}
                />
                <Label
                  htmlFor={`baggage-${option.id}`}
                  className="flex items-center gap-2 text-sm font-medium cursor-pointer flex-1"
                >
                  <option.icon className="w-4 h-4 text-gray-500" />
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50 p-2 sm:p-4 md:p-6 gap-4">
      <div className="hidden lg:block w-[300px] xl:w-[320px] flex-shrink-0">
        <div className="bg-white rounded-lg shadow-sm p-4 h-fit sticky top-4">
          <ScrollArea className="h-[calc(100vh-120px)]">
            <FilterSidebar />
          </ScrollArea>
        </div>
      </div>

      <div className="lg:hidden">
        <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full mb-4 justify-center gap-2 bg-transparent">
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0">
            <SheetHeader className="p-4 border-b">
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-80px)] p-4">
              <FilterSidebar />
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex-1 bg-white rounded-lg shadow-sm p-3 sm:p-4 lg:p-6">
        <div className="mb-4">
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex space-x-2 sm:space-x-3 pb-2">
              {dateFilterOptions.map((option) => (
                <Button
                  key={option.id}
                  variant="outline"
                  className={`flex-shrink-0 flex flex-col items-center justify-center h-auto py-2 px-4 
              sm:px-6 rounded-lg border-2 transition-colors min-w-[100px] sm:min-w-[120px] 
              ${selectedDateFilter === option.id
                      ? "border-primary text-primary bg-primary/5"
                      : "border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  onClick={() => setSelectedDateFilter(option.id)}
                >
                  <span className="font-semibold text-xs sm:text-sm">{option.label}</span>
                  <span className="text-xs font-medium mt-1 ">€{option.price}</span>
                </Button>

              ))}
            </div>
          </ScrollArea>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
          <div className="flex-1"

          />
          <div className="flex items-center gap-2 justify-center sm:justify-end">
            <Button
              variant="ghost"
              className="flex flex-col items-center justify-center h-auto py-2 px-2 sm:px-3 text-gray-600 hover:bg-gray-100 text-xs"
            >
              <LayoutGrid className="w-4 h-4 sm:w-5 sm:h-5 mb-1" />
              <span>Pricing table</span>
            </Button>
            <Button
              variant="ghost"
              className="flex flex-col items-center justify-center h-auto py-2 px-2 sm:px-3 text-gray-600 hover:bg-gray-100 text-xs"
            >
              <BarChart2 className="w-4 h-4 sm:w-5 sm:h-5 mb-1" />
              <span>Price trends</span>
            </Button>
          </div>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full  mb-6">
          <ScrollArea className="w-full whitespace-nowrap">
            <TabsList className="flex justify-start  h-auto p-0 bg-transparent border-b border-gray-200 w-full min-w-max">
              <TabsTrigger
                value="best"
                className="flex flex-col items-start px-3 sm:px-4 py-2 text-left rounded-none border-b-2 border-transparent text-gray-600 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-primary/5 min-w-[80px] sm:min-w-[100px]"
              >
                <span className="font-semibold text-xs sm:text-sm">Best</span>
                <span className="text-xs text-gray-500 truncate max-w-[70px] sm:max-w-none">
                  {best ? `€${best.basePrice} • ${best.outbound.totalDuration}` : "N/A"}
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="cheapest"
                className="flex flex-col items-start px-3 sm:px-4 py-2 text-left rounded-none border-b-2 border-transparent text-gray-600 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-primary/5 min-w-[80px] sm:min-w-[100px]"
              >
                <span className="font-semibold text-xs sm:text-sm">Cheapest</span>
                <span className="text-xs text-gray-500 truncate max-w-[70px] sm:max-w-none">
                  {cheapest ? `€${cheapest.basePrice} • ${cheapest.outbound.totalDuration}` : "N/A"}
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="fastest"
                className="flex flex-col items-start px-3 sm:px-4 py-2 text-left rounded-none border-b-2 border-transparent text-gray-600 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-primary/5 min-w-[80px] sm:min-w-[100px]"
              >
                <span className="font-semibold text-xs sm:text-sm">Fastest</span>
                <span className="text-xs text-gray-500 truncate max-w-[70px] sm:max-w-none">
                  {fastest ? `€${fastest.basePrice} • ${fastest.outbound.totalDuration}` : "N/A"}
                </span>
              </TabsTrigger>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <TabsTrigger
                    value="other-options"
                    className="flex flex-col items-start px-3 sm:px-4 py-2 text-left rounded-none border-b-2 border-transparent text-gray-600 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-primary/5 min-w-[80px] sm:min-w-[100px]"
                  >
                    <span className="font-semibold text-xs sm:text-sm flex items-center gap-1">
                      Other <ChevronDown className="w-3 h-3" />
                    </span>
                    <span className="text-xs text-gray-500">Earliest departure</span>
                  </TabsTrigger>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Earliest departure</DropdownMenuItem>
                  <DropdownMenuItem>Latest departure</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TabsList>
          </ScrollArea>
        </Tabs>

        <ScrollArea className="h-[calc(100vh-200px)] sm:h-[calc(100vh-180px)]">
          <div className="grid gap-3 sm:gap-4">
            {filteredFlights.length > 0 ? (
              filteredFlights.map((option) => (
                <Card
                  key={option.id}
                  className="p-3 sm:p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                        {option.outbound.airline.charAt(0)}
                      </div>
                      <span className="font-semibold text-sm sm:text-base text-gray-800">
                        {option.outbound.airline}
                      </span>
                    </div>
                    <div className="text-left sm:text-right">
                      <span className="text-xl sm:text-2xl font-bold text-primary">€{option.basePrice}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-[1fr_auto_1fr] sm:grid-cols-[auto_1fr_auto] items-center gap-2 mb-2">
                    <div className="text-left sm:text-right">
                      <div className="font-bold text-base sm:text-lg">{option.outbound.time}</div>
                      <div className="text-xs sm:text-sm text-gray-500">{option.outbound.airport}</div>
                    </div>
                    <div className="flex flex-col items-center px-2">
                      <div className="text-xs text-gray-500 mb-1">{option.outbound.totalDuration}</div>
                      {renderSimplifiedStops(option.outbound)}
                    </div>
                    <div className="text-right sm:text-left">
                      <div className="font-bold text-base sm:text-lg">{option.outbound.arrivalTime}</div>
                      <div className="text-xs sm:text-sm text-gray-500">{option.outbound.arrivalAirport}</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 text-center mb-3">{option.outbound.date}</div>

                  {option.inbound && (
                    <>
                      <div className="border-t border-dashed border-gray-200 my-3" />
                      <div className="grid grid-cols-[1fr_auto_1fr] sm:grid-cols-[auto_1fr_auto] items-center gap-2 mb-2">
                        <div className="text-left sm:text-right">
                          <div className="font-bold text-base sm:text-lg">{option.inbound.time}</div>
                          <div className="text-xs sm:text-sm text-gray-500">{option.inbound.airport}</div>
                        </div>
                        <div className="flex flex-col items-center px-2">
                          <div className="text-xs text-gray-500 mb-1">{option.inbound.totalDuration}</div>
                          {renderSimplifiedStops(option.inbound)}
                        </div>
                        <div className="text-right sm:text-left">
                          <div className="font-bold text-base sm:text-lg">{option.inbound.arrivalTime}</div>
                          <div className="text-xs sm:text-sm text-gray-500">{option.inbound.arrivalAirport}</div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 text-center mb-3">{option.inbound.date}</div>
                    </>
                  )}

                  <Button
                    onClick={() => setIsOpen((prev) => !prev)}
                    className="w-full mt-4 bg-primary hover:bg-primary/90 text-white font-semibold py-2 rounded-md"
                  >
                    Select Flight
                  </Button>
                </Card>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No flights found matching your criteria.</p>
                <p className="text-sm mt-2">Try adjusting your filters to see more options.</p>
              </div>
            )}

            <AnimatePresence>
              {isOpen && <FlightDetailModalComponent onOpenChange={setIsOpen} open={isOpen} />}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
