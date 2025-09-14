"use client"
import { SignJWT, jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode("your-secret-key");
import { useState, useMemo, useEffect, useCallback } from "react"
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
  Plane,
  Clock,
  Euro,
  Loader2,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

type FlightSegment = {
  id: string
  origin: {
    iata_code: string
    name: string
    city_name: string
  }
  destination: {
    iata_code: string
    name: string
    city_name: string
  }
  departing_at: string
  arriving_at: string
  duration: string
  marketing_carrier: {
    name: string
    iata_code: string
    logo_symbol_url?: string
    marketing_carrier_flight_number?: string
  }
  operating_carrier: {
    name: string
    iata_code: string
  }
  stops: any[]
}

type FlightSlice = {
  id: string
  origin: {
    iata_code: string
    name: string
    city_name: string
  }
  destination: {
    iata_code: string
    name: string
    city_name: string
  }
  duration: string
  segments: FlightSegment[]
}

type FlightOffer = {
  id: string
  total_amount: string
  total_currency: string
  base_amount: string
  tax_amount: string
  total_emissions_kg: string
  slices: FlightSlice[]
  owner: {
    name: string
    iata_code: string
    logo_symbol_url?: string
  }
  created_at: string
  expires_at: string
}

const parseDuration = (duration: string): string => {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/)
  if (!match) return duration

  const hours = match[1] ? Number.parseInt(match[1]) : 0
  const minutes = match[2] ? Number.parseInt(match[2]) : 0

  if (hours && minutes) {
    return `${hours}h ${minutes}m`
  } else if (hours) {
    return `${hours}h`
  } else if (minutes) {
    return `${minutes}m`
  }
  return duration
}

const formatTime = (isoString: string): string => {
  const date = new Date(isoString)
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
}

const formatDate = (isoString: string): string => {
  const date = new Date(isoString)
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  })
}

const LoadingState = () => (
  <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50 p-2 sm:p-4 md:p-6 gap-4">
    {/* Loading Sidebar */}
    <div className="hidden lg:block w-[300px] xl:w-[320px] flex-shrink-0">
      <div className="bg-white rounded-lg shadow-sm p-4 h-fit sticky top-4">
        <div className="space-y-4">
          {/* Trip type skeleton */}
          <div className="pb-4 border-b border-gray-200">
            <div className="h-4 bg-gray-200 rounded w-20 mb-3 animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-100 rounded w-24 animate-pulse"></div>
              <div className="h-4 bg-gray-100 rounded w-20 animate-pulse"></div>
            </div>
          </div>

          {/* Airlines skeleton */}
          <div className="pb-4 border-b border-gray-200">
            <div className="h-4 bg-gray-200 rounded w-16 mb-3 animate-pulse"></div>
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-100 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-100 rounded flex-1 animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>

          {/* More filter skeletons */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="pb-4 border-b border-gray-200">
              <div className="h-4 bg-gray-200 rounded w-24 mb-3 animate-pulse"></div>
              <div className="space-y-2">
                {[1, 2].map((j) => (
                  <div key={j} className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-100 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-100 rounded flex-1 animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Loading Main Content */}
    <div className="flex-1 bg-white rounded-lg shadow-sm p-3 sm:p-4 lg:p-6">
      {/* Loading Header with Animated Plane */}
      <div className="text-center py-12 mb-8">
        <div className="relative inline-block">
          <Plane className="w-16 h-16 text-primary animate-bounce mb-4" />
          <div className="absolute -top-2 -right-2">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Searching for flights...</h2>
        <p className="text-gray-600 mb-4">Finding the best deals for your journey</p>

        {/* Animated Progress Bar */}
        <div className="w-64 mx-auto bg-gray-200 rounded-full h-2 mb-4">
          <div
            className="bg-primary h-2 rounded-full animate-pulse"
            style={{
              animation: "loading-progress 2s ease-in-out infinite",
            }}
          ></div>
        </div>

        {/* Loading Steps */}
        <div className="flex justify-center items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
            <span>Searching airlines</span>
          </div>
          <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span>Comparing prices</span>
          </div>
          <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
          <div className="flex items-center gap-2">
            <Euro className="w-4 h-4 text-gray-400" />
            <span>Finding deals</span>
          </div>
        </div>
      </div>

      {/* Date Filter Skeleton */}
      <div className="mb-4">
        <div className="flex space-x-2 sm:space-x-3 pb-2">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="flex-shrink-0 min-w-[100px] sm:min-w-[120px]">
              <div className="h-16 bg-gray-100 rounded-lg animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="mb-6">
        <div className="flex gap-4 border-b border-gray-200 pb-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="min-w-[100px]">
              <div className="h-4 bg-gray-200 rounded w-12 mb-1 animate-pulse"></div>
              <div className="h-3 bg-gray-100 rounded w-20 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Flight Cards Skeleton */}
      <div className="grid gap-3 sm:gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-3 sm:p-4 border border-gray-200 rounded-lg">
            {/* Airline Header Skeleton */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
              </div>
              <div className="text-right">
                <div className="h-6 bg-gray-200 rounded w-16 mb-1 animate-pulse"></div>
                <div className="h-3 bg-gray-100 rounded w-20 animate-pulse"></div>
              </div>
            </div>

            {/* Flight Details Skeleton */}
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 mb-4">
              <div className="text-right">
                <div className="h-5 bg-gray-200 rounded w-12 mb-1 animate-pulse"></div>
                <div className="h-3 bg-gray-100 rounded w-8 mb-1 animate-pulse"></div>
                <div className="h-3 bg-gray-100 rounded w-16 animate-pulse"></div>
              </div>
              <div className="flex flex-col items-center px-2">
                <div className="h-3 bg-gray-100 rounded w-12 mb-2 animate-pulse"></div>
                <div className="flex items-center justify-center w-full">
                  <div className="flex-1 h-px bg-gray-200"></div>
                  <Plane className="w-4 h-4 mx-2 text-gray-300 animate-pulse" />
                  <div className="flex-1 h-px bg-gray-200"></div>
                </div>
                <div className="h-3 bg-gray-100 rounded w-8 mt-2 animate-pulse"></div>
              </div>
              <div className="text-left">
                <div className="h-5 bg-gray-200 rounded w-12 mb-1 animate-pulse"></div>
                <div className="h-3 bg-gray-100 rounded w-8 mb-1 animate-pulse"></div>
                <div className="h-3 bg-gray-100 rounded w-16 animate-pulse"></div>
              </div>
            </div>

            {/* Footer Skeleton */}
            <div className="flex justify-between items-center text-xs mb-3 pt-2 border-t border-gray-100">
              <div className="h-3 bg-gray-100 rounded w-24 animate-pulse"></div>
              <div className="h-3 bg-gray-100 rounded w-20 animate-pulse"></div>
            </div>

            {/* Button Skeleton */}
            <div className="h-10 bg-gray-200 rounded-md animate-pulse"></div>
          </Card>
        ))}
      </div>
    </div>

    <style jsx>{`
      @keyframes loading-progress {
        0% { width: 0%; }
        50% { width: 70%; }
        100% { width: 100%; }
      }
    `}</style>
  </div>
)

export default function FlightSearch() {
  const [Loading, setLoading] = useState(false)
  const [sampleApiResponse, setSampleApiResponse] = useState<FlightOffer[]>([])
  const [tripType, setTripType] = useState<"round-trip" | "one-way">("one-way")
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
  async function getSearchData() {
    const token = localStorage.getItem("searchDataToken");
    if (!token) return null;

    try {
      const { payload } = await jwtVerify(token, SECRET_KEY);
      localStorage.removeItem("searchDataToken");
      return payload; // this will be your original object
    } catch (error) {
      console.error("Invalid or expired token", error);
      return null;
    }
  }
  const getFlightDetail = useCallback(async () => {
    try {
      console.log("this is search data ");
      console.log(getSearchData());
      // const searchData = {
      //   fromLocationCode: "KHI",
      //   toLocationCode: "DXB",
      //   startDate: "2025-10-01",
      //   passengers: { adults: 1, children: 0, infants: 0 },
      //   cabinClass: "economy",
      // }
       const searchData = await getSearchData();

     
      console.log("[v0] Searching flights with data:", searchData)
      setLoading(true)
      const response = await fetch("/api/search-flights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(searchData),
      })

      const result = await response.json()

      console.log("this is result")
      console.log(result)
      setSampleApiResponse(result)
      setLoading(false)
    } catch (e) {
      console.error("Error fetching flight details:", e)
    }
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      await getFlightDetail()
    }
    fetchData()
  }, [getFlightDetail])

  const flightOffers = sampleApiResponse || []
  const availableAirlines = Array.from(new Set(flightOffers.map((offer) => offer.owner.name)))

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
    return flightOffers.filter((offer) => {
      if (selectedAirlines.length > 0 && !selectedAirlines.includes(offer.owner.name)) {
        return false
      }
      const price = Number.parseFloat(offer.total_amount)
      if (price < priceRange[0] || price > priceRange[1]) {
        return false
      }
      return true
    })
  }, [flightOffers, selectedAirlines, priceRange])

  const best = useMemo(() => {
    if (filteredFlights.length === 0) return null
    return filteredFlights.reduce((prev, current) => {
      const prevPrice = Number.parseFloat(prev.total_amount)
      const currentPrice = Number.parseFloat(current.total_amount)
      const prevDuration = prev.slices[0]?.duration || "PT0M"
      const currentDuration = current.slices[0]?.duration || "PT0M"

      const prevScore = prevPrice * 0.6 + parseDuration(prevDuration).length * 0.4
      const currentScore = currentPrice * 0.6 + parseDuration(currentDuration).length * 0.4
      return prevScore < currentScore ? prev : current
    })
  }, [filteredFlights])

  const cheapest = useMemo(() => {
    if (filteredFlights.length === 0) return null
    return filteredFlights.reduce((prev, current) =>
      Number.parseFloat(prev.total_amount) < Number.parseFloat(current.total_amount) ? prev : current,
    )
  }, [filteredFlights])

  const fastest = useMemo(() => {
    if (filteredFlights.length === 0) return null
    return filteredFlights.reduce((prev, current) => {
      const prevDuration = prev.slices[0]?.duration || "PT24H"
      const currentDuration = current.slices[0]?.duration || "PT24H"
      return prevDuration < currentDuration ? prev : current
    })
  }, [filteredFlights])

  const renderFlightStops = (segments: FlightSegment[]) => {
    const totalStops = segments.reduce((acc, segment) => acc + segment.stops.length, 0)

    if (totalStops === 0) {
      return (
        <div className="flex items-center justify-center w-full">
          <div className="flex-1 h-px bg-gray-300"></div>
          <div className="mx-2 text-xs text-gray-500 flex items-center gap-1">
            <Plane className="w-3 h-3" />
            Direct
          </div>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>
      )
    }

    return (
      <div className="flex items-center justify-center w-full">
        <div className="flex-1 h-px bg-gray-300"></div>
        <div className="mx-2 text-xs text-gray-500 flex items-center gap-1">
          <Plane className="w-3 h-3" />
          {totalStops} stop{totalStops > 1 ? "s" : ""}
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

  if (Loading) {
    return <LoadingState />
  }

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
          <div className="flex-1" />
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

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full mb-6">
          <ScrollArea className="w-full whitespace-nowrap">
            <TabsList className="flex justify-start h-auto p-0 bg-transparent border-b border-gray-200 w-full min-w-max">
              <TabsTrigger
                value="best"
                className="flex flex-col items-start px-3 sm:px-4 py-2 text-left rounded-none border-b-2 border-transparent text-gray-600 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-primary/5 min-w-[80px] sm:min-w-[100px]"
              >
                <span className="font-semibold text-xs sm:text-sm">Best</span>
                <span className="text-xs text-gray-500 truncate max-w-[70px] sm:max-w-none">
                  {best ? `€${best.total_amount} • ${parseDuration(best.slices[0]?.duration || "")}` : "N/A"}
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="cheapest"
                className="flex flex-col items-start px-3 sm:px-4 py-2 text-left rounded-none border-b-2 border-transparent text-gray-600 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-primary/5 min-w-[80px] sm:min-w-[100px]"
              >
                <span className="font-semibold text-xs sm:text-sm">Cheapest</span>
                <span className="text-xs text-gray-500 truncate max-w-[70px] sm:max-w-none">
                  {cheapest
                    ? `€${cheapest.total_amount} • ${parseDuration(cheapest.slices[0]?.duration || "")}`
                    : "N/A"}
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="fastest"
                className="flex flex-col items-start px-3 sm:px-4 py-2 text-left rounded-none border-b-2 border-transparent text-gray-600 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-primary/5 min-w-[80px] sm:min-w-[100px]"
              >
                <span className="font-semibold text-xs sm:text-sm">Fastest</span>
                <span className="text-xs text-gray-500 truncate max-w-[70px] sm:max-w-none">
                  {fastest ? `€${fastest.total_amount} • ${parseDuration(fastest.slices[0]?.duration || "")}` : "N/A"}
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
              filteredFlights.map((offer) => (
                <Card
                  key={offer.id}
                  className="p-3 sm:p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 mb-3">
                    <div className="flex items-center gap-2">
                      {offer.owner.logo_symbol_url ? (
                        <img
                          src={offer.owner.logo_symbol_url || "/placeholder.svg"}
                          alt={offer.owner.name}
                          className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
                        />
                      ) : (
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                          {offer.owner.iata_code}
                        </div>
                      )}
                      <span className="font-semibold text-sm sm:text-base text-gray-800">{offer.owner.name}</span>
                    </div>
                    <div className="text-left sm:text-right">
                      <div className="flex items-center gap-1">
                        <Euro className="w-4 h-4 text-primary" />
                        <span className="text-xl sm:text-2xl font-bold text-primary">{offer.total_amount}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        Base: €{offer.base_amount} + Tax: €{offer.tax_amount}
                      </div>
                    </div>
                  </div>

                  {offer.slices.map((slice, sliceIndex) => (
                    <div key={slice.id} className="mb-4">
                      {slice.segments.map((segment, segmentIndex) => (
                        <div key={segment.id}>
                          <div className="grid grid-cols-[1fr_auto_1fr] sm:grid-cols-[auto_1fr_auto] items-center gap-2 mb-2">
                            <div className="text-left sm:text-right">
                              <div className="font-bold text-base sm:text-lg">{formatTime(segment.departing_at)}</div>
                              <div className="text-xs sm:text-sm text-gray-500">{segment.origin.iata_code}</div>
                              <div className="text-xs text-gray-400">{segment.origin.city_name}</div>
                            </div>
                            <div className="flex flex-col items-center px-2">
                              <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {parseDuration(segment.duration)}
                              </div>
                              {renderFlightStops([segment])}
                              <div className="text-xs text-gray-400 mt-1">
                                {segment.marketing_carrier.iata_code}{" "}
                                {segment.marketing_carrier.marketing_carrier_flight_number || ""}
                              </div>
                            </div>
                            <div className="text-right sm:text-left">
                              <div className="font-bold text-base sm:text-lg">{formatTime(segment.arriving_at)}</div>
                              <div className="text-xs sm:text-sm text-gray-500">{segment.destination.iata_code}</div>
                              <div className="text-xs text-gray-400">{segment.destination.city_name}</div>
                            </div>
                          </div>
                          <div className="text-xs text-gray-500 text-center mb-3">
                            {formatDate(segment.departing_at)}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}

                  <div className="flex justify-between items-center text-xs text-gray-500 mb-3 pt-2 border-t border-gray-100">
                    <span>CO₂ emissions: {offer.total_emissions_kg}kg</span>
                    <span>Expires: {formatTime(offer.expires_at)}</span>
                  </div>

                  <Button className="w-full mt-4 bg-primary hover:bg-primary/90 text-white font-semibold py-2 rounded-md">
                    Select Flight - €{offer.total_amount}
                  </Button>
                </Card>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No flights found matching your criteria.</p>
                <p className="text-sm mt-2">Try adjusting your filters to see more options.</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
