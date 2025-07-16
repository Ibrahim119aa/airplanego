"use client"
import { useState } from "react"
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
    MapPin,
    Plane,
    Plus,
    Minus,
    ShieldCheck,
    Clock,
    Building2,
    Sun,
    Sunset,
    Moon,
    Sunrise,
    Check,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"

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

const SearchResult = () => {
    const [isOpen, setIsOpen] = useState(false)
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
                        duration: "1h 45m",
                        isOvernight: false,
                        arrivalTime: "15:30",
                        departureTime: "17:15",
                    },
                    {
                        airport: "DOH",
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
                        duration: "3h 20m",
                        isOvernight: false,
                        arrivalTime: "11:05",
                        departureTime: "14:25",
                    },
                    {
                        airport: "ISB",
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

    // Get unique airlines from flight data
    const availableAirlines = Array.from(new Set(allFlightOptions.map((flight) => flight.outbound.airline))).sort()

    // Helper function to get time range from time string
    const getTimeRange = (timeString: string): TimeRange => {
        const hour = Number.parseInt(timeString.split(":")[0])
        if (hour >= 6 && hour < 12) return "morning"
        if (hour >= 12 && hour < 18) return "afternoon"
        if (hour >= 18 && hour < 22) return "evening"
        return "night"
    }

    // Time range definitions
    const timeRanges = [
        { id: "morning", label: "Morning", icon: Sunrise, time: "06:00 - 11:59" },
        { id: "afternoon", label: "Afternoon", icon: Sun, time: "12:00 - 17:59" },
        { id: "evening", label: "Evening", icon: Sunset, time: "18:00 - 21:59" },
        { id: "night", label: "Night", icon: Moon, time: "22:00 - 05:59" },
    ]

    // Filter flights based on selected criteria
    const filteredFlights = allFlightOptions
        .filter((flight) => {
            // Filter by trip type
            if (tripType === "one-way" && flight.inbound) {
                // For one-way, remove inbound leg
                return { ...flight, inbound: undefined }
            }
            if (tripType === "round-trip" && !flight.inbound) {
                return false
            }

            // Filter by airlines
            if (selectedAirlines.length > 0) {
                const outboundAirlineMatch = selectedAirlines.includes(flight.outbound.airline)
                const inboundAirlineMatch = !flight.inbound || selectedAirlines.includes(flight.inbound.airline)
                if (!outboundAirlineMatch || !inboundAirlineMatch) {
                    return false
                }
            }

            // Filter by departure time ranges
            if (selectedTimeRanges.length > 0) {
                const outboundTimeRange = getTimeRange(flight.outbound.time)
                const inboundTimeRange = flight.inbound ? getTimeRange(flight.inbound.time) : null

                const outboundTimeMatch = selectedTimeRanges.includes(outboundTimeRange)
                const inboundTimeMatch = !flight.inbound;

                if (!outboundTimeMatch || !inboundTimeMatch) {
                    return false
                }
            }

            // Filter by stops
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

            // Filter by overnight layovers
            const checkOvernight = (leg: FlightLeg) => {
                if (!allowOvernight && leg.stops) {
                    return !leg.stops.some((stop) => stop.isOvernight)
                }
                return true
            }

            const outboundValid = checkStops(flight.outbound) && checkOvernight(flight.outbound)
            const inboundValid = !flight.inbound || (checkStops(flight.inbound) && checkOvernight(flight.inbound))

            return outboundValid && inboundValid
        })
        .map((flight) => {
            // Remove inbound for one-way trips
            if (tripType === "one-way") {
                return { ...flight, inbound: undefined, nightsInDestination: undefined }
            }
            return flight
        })

    const handleAirlineChange = (airline: string, checked: boolean) => {
        if (checked) {
            setSelectedAirlines([...selectedAirlines, airline])
        } else {
            setSelectedAirlines(selectedAirlines.filter((a) => a !== airline))
        }
    }

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
                    className="w-7 h-7 rounded-full bg-transparent"
                    onClick={() => setCount(Math.max(0, count - 1))}
                >
                    <Minus className="w-4 h-4" />
                </Button>
                <span className="w-5 text-center text-sm font-medium">{count}</span>
                <Button
                    variant="outline"
                    size="icon"
                    className="w-7 h-7 rounded-full bg-transparent"
                    onClick={() => setCount(count + 1)}
                >
                    <Plus className="w-4 h-4" />
                </Button>
            </div>
        </div>
    )

    const renderStopsVisualization = (leg: FlightLeg) => {
        if (leg.type === "Direct") {
            return (
                <div className="flex items-center justify-center">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div className="w-16 h-px bg-blue-500"></div>
                        <Plane className="w-4 h-4 text-blue-500" />
                        <div className="w-16 h-px bg-blue-500"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    </div>
                </div>
            )
        }

        return (
            <div className="flex items-center justify-center">
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <div className="w-8 h-px bg-orange-500"></div>
                    {leg.stops?.map((stop, index) => (
                        <React.Fragment key={index}>
                            <div className="flex flex-col items-center">
                                <div className={`w-3 h-3 rounded-full ${stop.isOvernight ? "bg-red-500" : "bg-orange-500"}`}></div>
                                <span className="text-xs text-gray-500 mt-1">{stop.airport}</span>
                                {stop.isOvernight && <Clock className="w-3 h-3 text-red-500 mt-1" />}
                            </div>
                            <div className="w-8 h-px bg-orange-500"></div>
                        </React.Fragment>
                    ))}
                    <Plane className="w-4 h-4 text-orange-500" />
                    <div className="w-8 h-px bg-orange-500"></div>
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                </div>
            </div>
        )
    }

    const renderFlightLeg = (leg: FlightLeg, label: string) => (
        <>
            <div className="flex items-center justify-between text-sm font-semibold text-gray-700 mb-3">
                <span>
                    {leg.date} • {label}
                </span>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">{leg.airline}</span>
                    <MapPin className="w-4 h-4 text-gray-400" />
                </div>
            </div>

            {/* Flight Route Visualization */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 mb-3">
                    <div className="text-right">
                        <div className="font-bold text-lg">{leg.time}</div>
                        <div className="text-sm text-gray-500">{leg.airport}</div>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="text-xs text-gray-500 mb-2">
                            <span className="font-semibold">{leg.totalDuration}</span> total
                        </div>
                        {renderStopsVisualization(leg)}
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
                            <Plane className={`w-3 h-3 ${leg.type === "Direct" ? "text-green-600" : "text-orange-500"}`} />
                            {leg.type}
                        </div>
                    </div>
                    <div className="text-left">
                        <div className="font-bold text-lg">{leg.arrivalTime}</div>
                        <div className="text-sm text-gray-500">{leg.arrivalAirport}</div>
                    </div>
                </div>

                {/* Stop Details */}
                {leg.stops && leg.stops.length > 0 && (
                    <div className="border-t border-gray-200 pt-3">
                        <div className="text-xs text-gray-600 mb-2 font-medium">Layover details:</div>
                        {leg.stops.map((stop, index) => (
                            <div key={index} className="flex items-center justify-between text-xs text-gray-500 mb-1">
                                <div className="flex items-center gap-2">
                                    {stop.isOvernight && <Clock className="w-3 h-3 text-red-500" />}
                                    <span className="font-medium">{stop.airport}</span>
                                    {stop.isOvernight && <span className="text-red-500 font-medium">overnight</span>}
                                </div>
                                <div className="flex items-center gap-2">
                                    <span>
                                        {stop.arrivalTime} → {stop.departureTime}
                                    </span>
                                    <span className="font-medium">({stop.duration})</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Aircraft and Baggage Info */}
                <div className="border-t border-gray-200 pt-3 mt-3">
                    <div className="flex items-center justify-between text-xs text-gray-600">
                        <span>{leg.aircraftType}</span>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                                <Luggage className="w-3 h-3" />
                                <span>{leg.baggage.cabinBag}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Briefcase className="w-3 h-3" />
                                <span>{leg.baggage.checkedBag}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )

    const renderBookingOptions = (options: BookingOption[]) => (
        <div className="w-full grid grid-cols-2 gap-10">
            {options.map((option) => (
                <div
                    key={option.type}
                    className={`relative overflow-hidden rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${option.type === "Standard"
                        ? "border-gray-200 bg-gradient-to-r from-gray-50 to-white hover:border-gray-300"
                        : "border-blue-200 bg-gradient-to-r from-blue-50 to-white hover:border-blue-300 hover:shadow-blue-100"
                        }`}
                >
                    {/* Header Section */}
                    <div className="flex items-center justify-between p-4 pb-3">
                        <div className="flex items-center gap-3">
                            <div
                                className={`w-3 h-3 rounded-full ${option.type === "Standard" ? "bg-gray-400" : "bg-blue-500"}`}
                            ></div>
                            <span className="font-bold text-lg text-gray-900">{option.type}</span>
                            {option.type === "Flex" && (
                                <span className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
                                    Most Popular
                                </span>
                            )}
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-gray-900">${option.price}</div>
                            <div className="text-xs text-gray-500">per person</div>
                        </div>
                    </div>

                    {/* Features Section */}
                    <div className="px-4 pb-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                            {option.features.map((feature, index) => (
                                <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                                    <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                                        <Check className="w-3 h-3 text-green-600" />
                                    </div>
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div>

                        {/* Restrictions */}
                        {option.restrictions.length > 0 && (
                            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                                <div className="text-xs font-medium text-gray-600 mb-1">Important notes:</div>
                                {option.restrictions.map((restriction, index) => (
                                    <div key={index} className="text-xs text-gray-500">
                                        • {restriction}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Action Button */}
                        <Button
                            className={`w-full h-12 text-base font-semibold rounded-lg transition-all duration-200 ${option.type === "Standard"
                                ? "bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                                : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl"
                                }`}
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            Select {option.type}
                            {option.type === "Flex" && <span className="ml-2 text-sm opacity-90">→</span>}
                        </Button>
                    </div>

                    {/* Decorative Element for Flex */}
                    {option.type === "Flex" && (
                        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 opacity-10 rounded-bl-full"></div>
                    )}
                </div>
            ))}
        </div>
    )

    return (
        <div className="flex min-h-screen bg-gray-100 p-6">
            <div className="w-[320px] pr-6 border-r border-gray-200 bg-white rounded-lg shadow-sm p-4 mr-6">
                {/* Trip Type Selector */}
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

                {/* Airlines Filter */}
                <div className="pb-4 border-b border-gray-200 mb-4">
                    <div
                        className="flex items-center justify-between cursor-pointer"
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
                                    className="text-xs text-blue-600 hover:text-blue-800 p-0 h-auto"
                                >
                                    Clear all
                                </Button>
                            )}
                        </div>
                    )}
                </div>

                {/* Departure Time Filter */}
                <div className="pb-4 border-b border-gray-200 mb-4">
                    <div
                        className="flex items-center justify-between cursor-pointer"
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
                                    className="text-xs text-blue-600 hover:text-blue-800 p-0 h-auto"
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
                            className="data-[state=checked]:bg-blue-500"
                        />
                    </div>
                    <p className="text-sm text-gray-500">Receive alerts when the prices for this route change.</p>
                </div>

                <div className="pb-4 border-b border-gray-200 mb-4">
                    <div
                        className="flex items-center justify-between cursor-pointer"
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
                        className="flex items-center justify-between cursor-pointer"
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
                <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full mb-6">
                    <TabsList className="grid w-full grid-cols-4 h-auto p-0 bg-transparent">
                        <TabsTrigger
                            value="best"
                            className="flex flex-col items-start px-4 py-2 text-left rounded-none border-b-2 border-blue-500 text-blue-600 data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-600"
                        >
                            <span className="font-semibold text-sm">Best</span>
                            <span className="text-xs text-gray-500">${"294 \u2022 4h 30m"}</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="cheapest"
                            className="flex flex-col items-start px-4 py-2 text-left rounded-none border-b-2 border-transparent text-gray-600 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600"
                        >
                            <span className="font-semibold text-sm">Cheapest</span>
                            <span className="text-xs text-gray-500">${"189 \u2022 12h 25m"}</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="fastest"
                            className="flex flex-col items-start px-4 py-2 text-left rounded-none border-b-2 border-transparent text-gray-600 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600"
                        >
                            <span className="font-semibold text-sm">Fastest</span>
                            <span className="text-xs text-gray-500">${"294 \u2022 2h 15m"}</span>
                        </TabsTrigger>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <TabsTrigger
                                    value="other-options"
                                    className="flex flex-col items-start px-4 py-2 text-left rounded-none border-b-2 border-transparent text-gray-600 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600"
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
                    <div className="grid gap-6">
                        {filteredFlights.map((option) => (
                            <Card key={option.id} className="p-6 border border-gray-200 rounded-lg shadow-sm">
                                <div className="grid gap-4">
                                    {renderFlightLeg(option.outbound, "Outbound")}

                                    {option.inbound && option.nightsInDestination && (
                                        <div className="text-center text-xs text-gray-500 bg-gray-50 py-2 px-3 rounded-full inline-block mx-auto my-2">
                                            {option.nightsInDestination} nights in Dubai
                                        </div>
                                    )}

                                    {option.inbound && <div className="mt-2">{renderFlightLeg(option.inbound, "Inbound")}</div>}

                                    <div className="mt-6 pt-6 border-t border-gray-100">
                                        <div className="space-y-4">
                                            {/* Guarantee Section */}
                                            {option.guaranteeAvailable && (
                                                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                                                    <ShieldCheck className="w-4 h-4 text-green-600" />
                                                    <span className="text-sm font-medium text-green-700">
                                                        Price Guarantee available for +${option.guaranteeAmount}
                                                    </span>
                                                </div>
                                            )}

                                            {/* Pricing and Options Section */}
                                            <div className="bg-gray-50 rounded-xl p-6">
                                                <div className="text-center mb-6">
                                                    <div className="text-sm text-gray-600 mb-1">Starting from</div>
                                                    <div className="text-3xl font-bold text-gray-900">${option.basePrice}</div>
                                                    <div className="text-sm text-gray-500">Choose your preferred booking option below</div>
                                                </div>

                                                {renderBookingOptions(option.bookingOptions)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}

                        {filteredFlights.length === 0 && (
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

export default SearchResult
