"use client"

import { useState, useMemo } from "react"
import { AnimatePresence } from "framer-motion"
import React from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
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
  Plus,
  Minus,
  Building2,
  Sun,
  Sunset,
  Moon,
  Sunrise,
  LayoutGrid,
  BarChart2,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"

const FlightDetailModal = React.lazy(() => import("@/components/Modal/FlightDetailModel"))

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

const SearchResult = () => {
  const [priceAlertsEnabled, setPriceAlertsEnabled] = useState(false)
  const [cabinBaggage, setCabinBaggage] = useState(0)
  const [checkedBaggage, setCheckedBaggage] = useState(0)
  const [bagsExpanded, setBagsExpanded] = useState(true)
  const [stopsExpanded, setStopsExpanded] = useState(true)
  const [airlinesExpanded, setAirlinesExpanded] = useState(true)
  const [departureTimeExpanded, setDepartureTimeExpanded] = useState(true)
  const [selectedStop, setSelectedStop] = useState("any")
  const [allowOvernight, setAllowOvernight] = useState<boolean | "indeterminate">(false)
  const [selectedTab, setSelectedTab] = useState("best")
  const [tripType, setTripType] = useState<"round-trip" | "one-way">("round-trip")
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([])
  const [selectedTimeRanges, setSelectedTimeRanges] = useState<TimeRange[]>([])
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>("date-option-3")

  const allFlightOptions: FlightOption[] = [
    {
      id: "flight1",
      outbound: {
        date: "Fri, 18 Jul",
        time: "01:40",
        airport: "KHI",
        duration: "2h 15m",
        totalDuration: "2h 15m",
        type: "Direct",
        arrivalTime: "02:55",
        arrivalAirport: "DXB",
        airline: "Emirates",
        aircraftType: "Boeing 777",
        baggage: {
          cabinBag: "7kg included",
          checkedBag: "23kg included",
          personalItem: "Included",
        },
      },
      inbound: {
        date: "Thu, 31 Jul",
        time: "20:30",
        airport: "DXB",
        duration: "2h 15m",
        totalDuration: "2h 15m",
        type: "Direct",
        arrivalTime: "23:45",
        arrivalAirport: "KHI",
        airline: "Emirates",
        aircraftType: "Boeing 777",
        baggage: {
          cabinBag: "7kg included",
          checkedBag: "23kg included",
          personalItem: "Included",
        },
      },
      nightsInDestination: 13,
      basePrice: 294,
      bookingOptions: [
        {
          type: "Standard",
          price: 294,
          features: ["Seat selection", "23kg checked bag", "7kg cabin bag", "Meal included"],
          restrictions: ["No changes", "No refunds"],
        },
        {
          type: "Flex",
          price: 354,
          features: [
            "Free seat selection",
            "23kg checked bag",
            "7kg cabin bag",
            "Meal included",
            "Free changes",
            "Partial refund",
          ],
          restrictions: ["Change fee may apply for same-day changes"],
        },
      ],
      guaranteeAvailable: true,
      guaranteeAmount: 37,
    },
    {
      id: "flight2",
      outbound: {
        date: "Fri, 18 Jul",
        time: "06:30",
        airport: "KHI",
        duration: "4h 15m",
        totalDuration: "5h 45m",
        type: "1 stop",
        arrivalTime: "11:15",
        arrivalAirport: "DXB",
        airline: "Qatar Airways",
        aircraftType: "Airbus A350",
        baggage: {
          cabinBag: "7kg included",
          checkedBag: "20kg included",
          personalItem: "Included",
        },
        stops: [
          {
            airport: "DOH",
            cityName: "Doha",
            duration: "1h 30m",
            isOvernight: false,
            arrivalTime: "08:45",
            departureTime: "10:15",
          },
        ],
      },
      inbound: {
        date: "Thu, 26 Jul",
        time: "15:20",
        airport: "DXB",
        duration: "4h 05m",
        totalDuration: "6h 20m",
        type: "1 stop",
        arrivalTime: "20:40",
        arrivalAirport: "KHI",
        airline: "Qatar Airways",
        aircraftType: "Airbus A350",
        baggage: {
          cabinBag: "7kg included",
          checkedBag: "20kg included",
          personalItem: "Included",
        },
        stops: [
          {
            airport: "DOH",
            cityName: "Doha",
            duration: "2h 15m",
            isOvernight: false,
            arrivalTime: "17:25",
            departureTime: "19:40",
          },
        ],
      },
      nightsInDestination: 8,
      basePrice: 268,
      bookingOptions: [
        {
          type: "Standard",
          price: 268,
          features: ["Seat selection", "20kg checked bag", "7kg cabin bag", "Meal included"],
          restrictions: ["Change fee $50", "No refunds"],
        },
        {
          type: "Flex",
          price: 328,
          features: [
            "Free seat selection",
            "20kg checked bag",
            "7kg cabin bag",
            "Meal included",
            "Free changes",
            "50% refund",
          ],
          restrictions: ["Refund processing fee $25"],
        },
      ],
      guaranteeAvailable: true,
      guaranteeAmount: 32,
    },
    // New flight with 1 stop in Ankara
    {
      id: "flight-ankara",
      outbound: {
        date: "Fri, 18 Jul",
        time: "09:15",
        airport: "KHI",
        duration: "5h 20m",
        totalDuration: "7h 45m",
        type: "1 stop",
        arrivalTime: "15:00",
        arrivalAirport: "DXB",
        airline: "Turkish Airlines",
        aircraftType: "Airbus A330",
        baggage: {
          cabinBag: "8kg included",
          checkedBag: "20kg included",
          personalItem: "Included",
        },
        stops: [
          {
            airport: "ANK",
            cityName: "Ankara",
            duration: "2h 25m",
            isOvernight: false,
            arrivalTime: "12:35",
            departureTime: "15:00",
          },
        ],
      },
      inbound: {
        date: "Thu, 26 Jul",
        time: "16:30",
        airport: "DXB",
        duration: "5h 15m",
        totalDuration: "8h 10m",
        type: "1 stop",
        arrivalTime: "22:40",
        arrivalAirport: "KHI",
        airline: "Turkish Airlines",
        aircraftType: "Airbus A330",
        baggage: {
          cabinBag: "8kg included",
          checkedBag: "20kg included",
          personalItem: "Included",
        },
        stops: [
          {
            airport: "ANK",
            cityName: "Ankara",
            duration: "2h 55m",
            isOvernight: false,
            arrivalTime: "19:45",
            departureTime: "22:40",
          },
        ],
      },
      nightsInDestination: 8,
      basePrice: 255,
      bookingOptions: [
        {
          type: "Standard",
          price: 255,
          features: ["Seat selection", "20kg checked bag", "8kg cabin bag", "Meal included"],
          restrictions: ["Change fee $60", "No refunds"],
        },
        {
          type: "Flex",
          price: 315,
          features: [
            "Free seat selection",
            "20kg checked bag",
            "8kg cabin bag",
            "Meal included",
            "Free changes",
            "Partial refund",
          ],
          restrictions: ["Same-day changes subject to availability"],
        },
      ],
      guaranteeAvailable: true,
      guaranteeAmount: 30,
    },
    {
      id: "flight3",
      outbound: {
        date: "Fri, 18 Jul",
        time: "14:20",
        airport: "KHI",
        duration: "6h 05m",
        totalDuration: "8h 35m",
        type: "2 stops",
        arrivalTime: "21:55",
        arrivalAirport: "DXB",
        airline: "Turkish Airlines",
        aircraftType: "Airbus A330",
        baggage: {
          cabinBag: "8kg included",
          checkedBag: "20kg included",
          personalItem: "Included",
        },
        stops: [
          {
            airport: "ISB",
            cityName: "Islamabad",
            duration: "1h 45m",
            isOvernight: false,
            arrivalTime: "15:30",
            departureTime: "17:15",
          },
          {
            airport: "DOH",
            cityName: "Doha",
            duration: "2h 30m",
            isOvernight: false,
            arrivalTime: "19:25",
            departureTime: "21:55",
          },
        ],
      },
      inbound: {
        date: "Thu, 26 Jul",
        time: "08:45",
        airport: "DXB",
        duration: "6h 25m",
        totalDuration: "9h 15m",
        type: "2 stops",
        arrivalTime: "16:00",
        arrivalAirport: "KHI",
        airline: "Turkish Airlines",
        aircraftType: "Airbus A330",
        baggage: {
          cabinBag: "8kg included",
          checkedBag: "20kg included",
          personalItem: "Included",
        },
        stops: [
          {
            airport: "AUH",
            cityName: "Abu Dhabi",
            duration: "3h 20m",
            isOvernight: false,
            arrivalTime: "11:05",
            departureTime: "14:25",
          },
          {
            airport: "ISB",
            cityName: "Islamabad",
            duration: "1h 50m",
            isOvernight: false,
            arrivalTime: "15:10",
            departureTime: "17:00",
          },
        ],
      },
      nightsInDestination: 8,
      basePrice: 245,
      bookingOptions: [
        {
          type: "Standard",
          price: 245,
          features: ["Basic seat selection", "20kg checked bag", "8kg cabin bag", "Snack included"],
          restrictions: ["Change fee $75", "No refunds"],
        },
        {
          type: "Flex",
          price: 305,
          features: [
            "Free seat selection",
            "20kg checked bag",
            "8kg cabin bag",
            "Meal included",
            "Free changes",
            "Partial refund",
          ],
          restrictions: ["Same-day changes not allowed"],
        },
      ],
      guaranteeAvailable: false,
      guaranteeAmount: 0,
    },
    {
      id: "flight4",
      outbound: {
        date: "Fri, 18 Jul",
        time: "23:30",
        airport: "KHI",
        duration: "3h 40m",
        totalDuration: "12h 25m",
        type: "1 stop",
        arrivalTime: "10:55+1",
        arrivalAirport: "DXB",
        airline: "PIA",
        aircraftType: "Boeing 737",
        baggage: {
          cabinBag: "7kg included",
          checkedBag: "20kg included",
          personalItem: "Included",
        },
        stops: [
          {
            airport: "IST",
            cityName: "Istanbul",
            duration: "8h 45m",
            isOvernight: true,
            arrivalTime: "03:10+1",
            departureTime: "11:55+1",
          },
        ],
      },
      basePrice: 189,
      bookingOptions: [
        {
          type: "Standard",
          price: 189,
          features: ["Basic seat selection", "20kg checked bag", "7kg cabin bag"],
          restrictions: ["Change fee $100", "No refunds"],
        },
        {
          type: "Flex",
          price: 249,
          features: ["Free seat selection", "20kg checked bag", "7kg cabin bag", "Free changes", "25% refund"],
          restrictions: ["Overnight layover required"],
        },
      ],
      guaranteeAvailable: true,
      guaranteeAmount: 25,
    },
  ]

  const dateFilterOptions: DateFilterOption[] = [
    { id: "date-option-1", label: "4 Aug - 29 Aug", price: 1057 },
    { id: "date-option-2", label: "5 Aug - 30 Aug", price: 1175 },
    { id: "date-option-3", label: "6 Aug - 31 Aug", price: 1480 },
    { id: "date-option-4", label: "7 Aug - 1 Sept", price: 1010 },
    { id: "date-option-5", label: "8 Aug - 2 Sept", price: 1009 },
  ]

  const availableAirlines = Array.from(new Set(allFlightOptions.map((flight) => flight.outbound.airline))).sort()

  const getTimeRange = (timeString: string): TimeRange => {
    const hour = Number.parseInt(timeString.split(":")[0])
    if (hour >= 6 && hour < 12) return "morning"
    if (hour >= 12 && hour < 18) return "afternoon"
    if (hour >= 18 && hour < 22) return "evening"
    return "night"
  }

  const timeRanges = [
    { id: "morning", label: "Morning", icon: Sunrise, time: "06:00 - 11:59" },
    { id: "afternoon", label: "Afternoon", icon: Sun, time: "12:00 - 17:59" },
    { id: "evening", label: "Evening", icon: Sunset, time: "18:00 - 21:59" },
    { id: "night", label: "Night", icon: Moon, time: "22:00 - 05:59" },
  ]

  const filteredFlights = useMemo(() => {
    return allFlightOptions
      .filter((flight) => {
        if (tripType === "one-way" && flight.inbound) {
          return false
        }
        if (tripType === "round-trip" && !flight.inbound) {
          return false
        }
        if (selectedAirlines.length > 0) {
          const outboundAirlineMatch = selectedAirlines.includes(flight.outbound.airline)
          const inboundAirlineMatch = !flight.inbound || selectedAirlines.includes(flight.inbound.airline)
          if (!outboundAirlineMatch || !inboundAirlineMatch) {
            return false
          }
        }
        if (selectedTimeRanges.length > 0) {
          const outboundTimeRange = getTimeRange(flight.outbound.time)
          const outboundTimeMatch = selectedTimeRanges.includes(outboundTimeRange)
          const inboundTimeMatch =
            !flight.inbound || (flight.inbound && selectedTimeRanges.includes(getTimeRange(flight.inbound.time)))
          if (!outboundTimeMatch || !inboundTimeMatch) {
            return false
          }
        }
        const checkStops = (leg: FlightLeg) => {
          switch (selectedStop) {
            case "direct":
              return leg.type === "Direct"
            case "1-stop":
              return leg.type === "Direct" || leg.type === "1 stop"
            case "2-stops":
              return leg.type === "Direct" || leg.type === "1 stop" || leg.type === "2 stops"
            default:
              return true
          }
        }
        const checkOvernight = (leg: FlightLeg) => {
          if (allowOvernight === false && leg.stops) {
            return !leg.stops.some((stop) => stop.isOvernight)
          }
          return true
        }
        const outboundValid = checkStops(flight.outbound) && checkOvernight(flight.outbound)
        const inboundValid = !flight.inbound || (checkStops(flight.inbound) && checkOvernight(flight.inbound))
        return outboundValid && inboundValid
      })
      .map((flight) => {
        if (tripType === "one-way") {
          return { ...flight, inbound: undefined, nightsInDestination: undefined }
        }
        return flight
      })
  }, [tripType, selectedAirlines, selectedTimeRanges, selectedStop, allowOvernight, allFlightOptions])

  const handleAirlineChange = (airline: string, checked: boolean) => {
    if (checked) {
      setSelectedAirlines([...selectedAirlines, airline])
    } else {
      setSelectedAirlines(selectedAirlines.filter((a) => a !== airline))
    }
  }

  const [isOpen, setIsOpen] = useState(false)

  const handleTimeRangeChange = (timeRange: TimeRange, checked: boolean) => {
    if (checked) {
      setSelectedTimeRanges([...selectedTimeRanges, timeRange])
    } else {
      setSelectedTimeRanges(selectedTimeRanges.filter((t) => t !== timeRange))
    }
  }

  const QuantityControl: React.FC<QuantityControlProps> = ({ label, icon: Icon, count, setCount }) => (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2">
        <Icon className="w-5 h-5 text-gray-600" />
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="w-7 h-7 rounded-full bg-transparent border-gray-300 hover:bg-gray-100"
          onClick={() => setCount(Math.max(0, count - 1))}
        >
          <Minus className="w-4 h-4" />
        </Button>
        <span className="w-5 text-center text-sm font-medium">{count}</span>
        <Button
          variant="outline"
          size="icon"
          className="w-7 h-7 rounded-full bg-transparent border-gray-300 hover:bg-gray-100"
          onClick={() => setCount(count + 1)}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )

  const getFlightSummary = (flights: FlightOption[]) => {
    if (flights.length === 0) return { best: null, cheapest: null, fastest: null }
    const cheapest = flights.reduce((prev, current) => (prev.basePrice < current.basePrice ? prev : current))
    const fastest = flights.reduce((prev, current) => {
      const prevDuration =
        Number.parseInt(prev.outbound.totalDuration.split("h")[0]) * 60 +
        Number.parseInt(prev.outbound.totalDuration.split("h")[1].replace("m", "")) +
        (prev.inbound
          ? Number.parseInt(prev.inbound.totalDuration.split("h")[0]) * 60 +
          Number.parseInt(prev.inbound.totalDuration.split("h")[1].replace("m", ""))
          : 0)
      const currentDuration =
        Number.parseInt(current.outbound.totalDuration.split("h")[0]) * 60 +
        Number.parseInt(current.outbound.totalDuration.split("h")[1].replace("m", "")) +
        (current.inbound
          ? Number.parseInt(current.inbound.totalDuration.split("h")[0]) * 60 +
          Number.parseInt(current.inbound.totalDuration.split("h")[1].replace("m", ""))
          : 0)
      return prevDuration < currentDuration ? prev : current
    })
    // For "Best", let's pick the cheapest direct flight if available, otherwise the overall cheapest.
    const directFlights = flights.filter(
      (f) => f.outbound.type === "Direct" && (!f.inbound || f.inbound.type === "Direct"),
    )
    const best =
      directFlights.length > 0
        ? directFlights.reduce((prev, current) => (prev.basePrice < current.basePrice ? prev : current))
        : cheapest
    return { best, cheapest, fastest }
  }

  const { best, cheapest, fastest } = useMemo(() => getFlightSummary(filteredFlights), [filteredFlights])

  const renderSimplifiedStops = (leg: FlightLeg) => {
    const numStops = leg.stops?.length || 0
    const stopText = numStops === 0 ? "Direct" : `${numStops} stop${numStops > 1 ? "s" : ""}`

    return (
      <div className="flex flex-col items-center gap-1">
        <div className="flex items-center gap-1 text-xs text-gray-500 w-full">
          <span className="font-medium">{leg.airport}</span>
          <div className="flex-1 h-px bg-gray-300 mx-1" />
          {numStops > 0 && (
            <>
              {leg.stops?.map((stop, index) => (
                <span key={index} className="w-2 h-2 rounded-full bg-gray-400 flex-shrink-0" />
              ))}
              <div className="flex-1 h-px bg-gray-300 mx-1" />
            </>
          )}
          <span className="font-medium">{leg.arrivalAirport}</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-primary font-semibold">{stopText}</span>
          {numStops > 0 && leg.stops && (
            <span className="text-gray-500">via {leg.stops.map((stop) => stop.cityName).join(", ")}</span>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="w-full md:w-[300px] lg:w-[320px] pr-4 md:pr-6 border-r border-gray-200 bg-white rounded-lg shadow-sm p-4 mr-4 md:mr-6 flex-shrink-0">
        <div className="pb-4 border-b border-gray-200 mb-4">
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
        <div className="pb-4 border-b border-gray-200 mb-4">
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
              {selectedAirlines.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedAirlines([])}
                  className="text-xs text-primary hover:text-primary/80 p-0 h-auto"
                >
                  Clear all
                </Button>
              )}
            </div>
          )}
        </div>
        <div className="pb-4 border-b border-gray-200 mb-4">
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
              {timeRanges.map((range) => {
                const IconComponent = range.icon
                return (
                  <div key={range.id} className="flex items-center gap-2">
                    <Checkbox
                      id={`time-${range.id}`}
                      checked={selectedTimeRanges.includes(range.id as TimeRange)}
                      onCheckedChange={(checked) => handleTimeRangeChange(range.id as TimeRange, checked as boolean)}
                    />
                    <Label
                      htmlFor={`time-${range.id}`}
                      className="flex items-center gap-2 text-sm font-medium cursor-pointer flex-1"
                    >
                      <IconComponent className="w-4 h-4 text-gray-500" />
                      <div className="flex flex-col">
                        <span>{range.label}</span>
                        <span className="text-xs text-gray-400">{range.time}</span>
                      </div>
                    </Label>
                  </div>
                )
              })}
              {selectedTimeRanges.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedTimeRanges([])}
                  className="text-xs text-primary hover:text-primary/80 p-0 h-auto"
                >
                  Clear all
                </Button>
              )}
            </div>
          )}
        </div>
        <div className="pb-4 border-b border-gray-200 mb-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-semibold">Set up price alerts</h2>
            <Switch
              id="price-alerts"
              checked={priceAlertsEnabled}
              onCheckedChange={setPriceAlertsEnabled}
              className="data-[state=checked]:bg-primary"
            />
          </div>
          <p className="text-sm text-gray-500">Receive alerts when the prices for this route change.</p>
        </div>
        <div className="pb-4 border-b border-gray-200 mb-4">
          <div
            className="flex items-center justify-between cursor-pointer py-1"
            onClick={() => setBagsExpanded(!bagsExpanded)}
          >
            <h2 className="text-base font-semibold">Bags</h2>
            {bagsExpanded ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </div>
          {bagsExpanded && (
            <div className="mt-2">
              <QuantityControl label="Cabin baggage" icon={Luggage} count={cabinBaggage} setCount={setCabinBaggage} />
              <QuantityControl
                label="Checked baggage"
                icon={Briefcase}
                count={checkedBaggage}
                setCount={setCheckedBaggage}
              />
            </div>
          )}
        </div>
        <div>
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
            <div className="mt-2">
              <RadioGroup value={selectedStop} onValueChange={setSelectedStop} className="grid gap-2">
                <Label htmlFor="any" className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                  <RadioGroupItem value="any" id="any" />
                  Any
                </Label>
                <Label htmlFor="direct" className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                  <RadioGroupItem value="direct" id="direct" />
                  Direct flights only
                </Label>
                <Label htmlFor="1-stop" className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                  <RadioGroupItem value="1-stop" id="1-stop" />
                  Up to 1 stop
                </Label>
                <Label htmlFor="2-stops" className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                  <RadioGroupItem value="2-stops" id="2-stops" />
                  Up to 2 stops
                </Label>
              </RadioGroup>
              <div className="flex items-center gap-2 mt-4">
                <Checkbox id="overnight-stopovers" checked={allowOvernight} onCheckedChange={setAllowOvernight} />
                <Label htmlFor="overnight-stopovers" className="text-sm font-medium cursor-pointer">
                  Allow overnight layovers
                </Label>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex-1 bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex space-x-3 pb-2">
              {dateFilterOptions.map((option) => (
                <Button
                  key={option.id}
                  variant="outline"
                  className={`flex-shrink-0 flex flex-col items-center justify-center h-auto py-2 px-3 rounded-lg border-2 transition-colors ${selectedDateFilter === option.id
                      ? "border-primary text-primary bg-primary/5"
                      : "border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  onClick={() => setSelectedDateFilter(option.id)}
                >
                  <span className="font-semibold text-sm">{option.label}</span>
                  <span className="text-xs font-medium mt-1 text-secondary">€{option.price}</span>
                </Button>
              ))}
            </div>
          </ScrollArea>
          <div className="flex items-center gap-2 ml-4 flex-shrink-0">
            <Button
              variant="ghost"
              className="flex flex-col items-center justify-center h-auto py-2 px-3 text-gray-600 hover:bg-gray-100"
            >
              <LayoutGrid className="w-5 h-5 mb-1" />
              <span className="text-xs">Pricing table</span>
            </Button>
            <Button
              variant="ghost"
              className="flex flex-col items-center justify-center h-auto py-2 px-3 text-gray-600 hover:bg-gray-100"
            >
              <BarChart2 className="w-5 h-5 mb-1" />
              <span className="text-xs">Price trends</span>
            </Button>
          </div>
        </div>
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full mb-6">
          <TabsList className="grid w-full grid-cols-4 h-auto p-0 bg-transparent border-b border-gray-200">
            <TabsTrigger
              value="best"
              className="flex flex-col items-start px-4 py-2 text-left rounded-none border-b-2 border-transparent text-gray-600 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-primary/5"
            >
              <span className="font-semibold text-sm">Best</span>
              <span className="text-xs text-gray-500">
                {best ? `€${best.basePrice} • ${best.outbound.totalDuration}` : "N/A"}
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="cheapest"
              className="flex flex-col items-start px-4 py-2 text-left rounded-none border-b-2 border-transparent text-gray-600 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-primary/5"
            >
              <span className="font-semibold text-sm">Cheapest</span>
              <span className="text-xs text-gray-500">
                {cheapest ? `€${cheapest.basePrice} • ${cheapest.outbound.totalDuration}` : "N/A"}
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="fastest"
              className="flex flex-col items-start px-4 py-2 text-left rounded-none border-b-2 border-transparent text-gray-600 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-primary/5"
            >
              <span className="font-semibold text-sm">Fastest</span>
              <span className="text-xs text-gray-500">
                {fastest ? `€${fastest.basePrice} • ${fastest.outbound.totalDuration}` : "N/A"}
              </span>
            </TabsTrigger>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <TabsTrigger
                  value="other-options"
                  className="flex flex-col items-start px-4 py-2 text-left rounded-none border-b-2 border-transparent text-gray-600 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-primary/5"
                >
                  <span className="font-semibold text-sm flex items-center gap-1">
                    Other options <ChevronDown className="w-3 h-3" />
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
        </Tabs>
        <ScrollArea className="h-[calc(100vh-180px)] pr-4">
          <div className="grid gap-4">
            {filteredFlights.length > 0 ? (
              filteredFlights.map((option) => (
                <Card
                  key={option.id}
                  className="p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {/* Placeholder for airline logo */}
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                        {option.outbound.airline.charAt(0)}
                      </div>
                      <span className="font-semibold text-base text-gray-800">{option.outbound.airline}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-primary">€{option.basePrice}</span>
                    </div>
                  </div>
                  {/* Outbound Flight Details */}
                  <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2 mb-2">
                    <div className="text-right">
                      <div className="font-bold text-lg">{option.outbound.time}</div>
                      <div className="text-sm text-gray-500">{option.outbound.airport}</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="text-xs text-gray-500 mb-1">{option.outbound.totalDuration}</div>
                      {renderSimplifiedStops(option.outbound)}
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-lg">{option.outbound.arrivalTime}</div>
                      <div className="text-sm text-gray-500">{option.outbound.arrivalAirport}</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 text-center mb-3">{option.outbound.date}</div>
                  {/* Inbound Flight Details (if round-trip) */}
                  {option.inbound && (
                    <>
                      <div className="border-t border-dashed border-gray-200 my-3" />
                      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2 mb-2">
                        <div className="text-right">
                          <div className="font-bold text-lg">{option.inbound.time}</div>
                          <div className="text-sm text-gray-500">{option.inbound.airport}</div>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="text-xs text-gray-500 mb-1">{option.inbound.totalDuration}</div>
                          {renderSimplifiedStops(option.inbound)}
                        </div>
                        <div className="text-left">
                          <div className="font-bold text-lg">{option.inbound.arrivalTime}</div>
                          <div className="text-sm text-gray-500">{option.inbound.arrivalAirport}</div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 text-center mb-3">{option.inbound.date}</div>
                      <Button onClick={() => setIsOpen((prev) => !prev)} className="w-full mt-4 bg-primary hover:bg-primary/90 text-white font-semibold py-2 rounded-md">
                        Select Flight
                      </Button>

                    </>
                  )}
                </Card>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No flights found matching your criteria.</p>
                <p className="text-sm mt-2">Try adjusting your filters to see more options.</p>
              </div>
            )}
             <AnimatePresence>
              {
                isOpen ?
                  (
                    <FlightDetailModal onOpenChange={setIsOpen} open={isOpen} />
                  ):null
              }
            </AnimatePresence>
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}

export default SearchResult
