"use client"

import React from "react"
import { useState } from "react"
import { ChevronLeft, ChevronRight, Plane, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"

// Lazy TopBanner (wrap with Suspense when used)
const TopBanner = React.lazy(() => import("@/components/General/TopBanner"))

interface Seat {
  id: string
  row: number
  letter: string
  type: "economy" | "premium" | "business"
  status: "available" | "occupied" | "selected"
  price: number // ensure seats always have a price (paid-only)
}

interface Flight {
  id: string
  route: string
  date: string
  time: string
  seats: Seat[]
  hasSeatSelection: boolean
  hasBaggageOption: boolean
}

interface FlightSeatSelection {
  flightId: string
  seatId: string | null
  autoAssigned: boolean // true when user skipped and we assigned randomly (no charge)
}

type PageProps = {
  params?: {
    Id?: string
  }
}

export default function SeatSelection({ params }: PageProps) {
  const [activeFlightTab, setActiveFlightTab] = useState<string>("outbound")
  const [flightSelections, setFlightSelections] = useState<FlightSeatSelection[]>([
    { flightId: "outbound", seatId: null, autoAssigned: false },
    { flightId: "return", seatId: null, autoAssigned: false },
  ])
  const n = useRouter()

  // Generate seat map data: Paid-only seats (no free seats to choose).
  // Example pricing: economy $15, premium $45-$75, business $150
  const generateSeats = (): Seat[] => {
    const seats: Seat[] = []
    const letters = ["A", "B", "C", "D", "E", "F"]
    for (let row = 1; row <= 30; row++) {
      for (const letter of letters) {
        let type: "economy" | "premium" | "business" = "economy"
        let price = 15 // base economy price (paid-only)
        if (row <= 3) {
          type = "business"
          price = 150
        } else if (row <= 8) {
          type = "premium"
          price = 75
        } else if (row >= 12 && row <= 14) {
          type = "premium"
          price = 45
        } else {
          type = "economy"
          price = 15
        }
        const isOccupied = Math.random() < 0.3
        seats.push({
          id: `${row}${letter}`,
          row,
          letter,
          type,
          status: isOccupied ? "occupied" : "available",
          price,
        })
      }
    }
    return seats
  }

  // Generate flights data
  const generateFlights = (): Flight[] => {
    return [
      {
        id: "outbound",
        route: "Karachi → Dubai",
        date: "Dec 15, 2024",
        time: "14:30 - 18:45",
        seats: generateSeats(),
        hasSeatSelection: true,
        hasBaggageOption: true,
      },
      {
        id: "return",
        route: "Dubai → Karachi",
        date: "Dec 22, 2024",
        time: "09:15 - 12:30",
        seats: generateSeats(),
        hasSeatSelection: false,
        hasBaggageOption: false,
      },
    ]
  }

  const [flights, setFlights] = useState<Flight[]>(generateFlights())

  const handleSeatSelect = (seatId: string) => {
    const activeFlight = flights.find((f) => f.id === activeFlightTab)
    if (!activeFlight || !activeFlight.hasSeatSelection) return
    const seat = activeFlight.seats.find((s) => s.id === seatId)
    if (seat && seat.status === "available") {
      const updatedFlights = flights.map((flight) => {
        if (flight.id === activeFlightTab) {
          const newSeats = flight.seats.map((s) => {
            if (s.id === seatId) {
              return { ...s, status: "selected" as const }
            } else if (s.status === "selected") {
              return { ...s, status: "available" as const }
            }
            return s
          })
          return { ...flight, seats: newSeats }
        }
        return flight
      })
      setFlights(updatedFlights)

      const updatedSelections = flightSelections.map((fs) =>
        fs.flightId === activeFlightTab
          ? { ...fs, seatId, autoAssigned: false } // manual selection => charge applies
          : fs,
      )
      setFlightSelections(updatedSelections)
    }
  }

  const handleCancelSeat = (flightId: string) => {
    const updatedFlights = flights.map((flight) => {
      if (flight.id === flightId) {
        const newSeats = flight.seats.map((seat) =>
          seat.status === "selected" ? { ...seat, status: "available" as const } : seat,
        )
        return { ...flight, seats: newSeats }
      }
      return flight
    })
    setFlights(updatedFlights)
    const updatedSelections = flightSelections.map((fs) =>
      fs.flightId === flightId ? { ...fs, seatId: null, autoAssigned: false } : fs,
    )
    setFlightSelections(updatedSelections)
  }

  const getSeatColor = (seat: Seat) => {
    if (seat.status === "occupied") return "bg-gray-400"
    if (seat.status === "selected") return "bg-[#EF3D23]"
    switch (seat.type) {
      case "business":
        return "bg-[#1479C9] hover:bg-[#1479C9]/80"
      case "premium":
        return "bg-green-500 hover:bg-green-600"
      default:
        return "bg-gray-200 hover:bg-gray-300"
    }
  }

  // Emergency exit rows 12-14
  const hasEmergencyExit = (rowNumber: number) => rowNumber >= 12 && rowNumber <= 14

  const steps = [
    { name: "Search", completed: true },
    { name: "Passenger details", completed: true },
    { name: "Baggage", completed: true },
    { name: "Ticket fare", completed: true },
    { name: "Seating", completed: false, current: true },
    { name: "Overview & payment", completed: false },
  ]

  const overallHasBaggageOption = flights.some((flight) => flight.hasBaggageOption)

  // Disabled if any flight that requires seat selection is missing one
  const isContinueDisabled = flights.some(
    (flight) => flight.hasSeatSelection && flightSelections.find((fs) => fs.flightId === flight.id)?.seatId === null,
  )

  // Random available seat (used for skip flow). Random, not cheapest, per requirement.
  const pickRandomAvailableSeat = (seats: Seat[]): Seat | undefined => {
    const avail = seats.filter((s) => s.status === "available")
    if (avail.length === 0) return undefined
    const idx = Math.floor(Math.random() * avail.length)
    return avail[idx]
  }

  // Assign random seats (no extra cost) for flights that require selection but don't have one yet
  const assignDefaultRandomSeats = () => {
    const selectionsByFlight: Record<string, string> = {}
    const updatedFlights = flights.map((flight) => {
      if (!flight.hasSeatSelection) return flight
      const currentSel = flightSelections.find((fs) => fs.flightId === flight.id)
      if (currentSel?.seatId) return flight
      const seat = pickRandomAvailableSeat(flight.seats)
      if (!seat) return flight
      selectionsByFlight[flight.id] = seat.id
      const newSeats = flight.seats.map((s) => (s.id === seat.id ? { ...s, status: "selected" as const } : s))
      return { ...flight, seats: newSeats }
    })
    const updatedSelections = flightSelections.map((fs) =>
      selectionsByFlight[fs.flightId]
        ? { ...fs, seatId: selectionsByFlight[fs.flightId], autoAssigned: true } // auto-assigned => no charge
        : fs,
    )
    setFlights(updatedFlights)
    setFlightSelections(updatedSelections)
  }

  // Skip manual selection and continue (auto-assign random seats at no cost)
  const handleContinueWithoutSeats = () => {
    assignDefaultRandomSeats()
    n.push("/Booking/1")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <React.Suspense fallback={null}>
        <TopBanner />
      </React.Suspense>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Seat Map */}
          <div className="xl:col-span-2 order-2 xl:order-1">
            <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 lg:p-6">
              <div className="mb-4 sm:mb-6">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2">
                  Karachi → Dubai and back
                </h1>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-800 w-fit">
                    <Shield className="w-3 h-3 mr-1" />
                    {"guarantee included"}
                  </Badge>
                  <span className="text-xs sm:text-sm text-[#1479C9]">
                    {"Disruption Protection • Instant Credit • Check-in"}
                  </span>
                </div>
              </div>

              {/* Seat Legend */}
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Seat Types</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-[#1479C9] rounded flex-shrink-0"></div>
                    <span>Business ($150)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded flex-shrink-0"></div>
                    <span>Premium ($45–75)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gray-200 rounded flex-shrink-0"></div>
                    <span>Economy ($15)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gray-400 rounded flex-shrink-0"></div>
                    <span>Occupied</span>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-600">
                  <span>* Emergency exit rows</span>
                </div>
              </div>

              {/* Flight Tabs */}
              <div className="mb-4 sm:mb-6">
                <div className="flex flex-col sm:flex-row border-b overflow-x-auto">
                  {flights.map((flight) => {
                    const selection = flightSelections.find((fs) => fs.flightId === flight.id)
                    return (
                      <button
                        key={flight.id}
                        onClick={() => setActiveFlightTab(flight.id)}
                        className={`px-3 sm:px-6 py-3 font-medium text-sm border-b-2 transition-colors flex-shrink-0 ${activeFlightTab === flight.id
                          ? "border-[#1479C9] text-[#1479C9]"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                          }`}
                      >
                        <div className="text-left">
                          <div className="font-semibold text-sm sm:text-base">{flight.route}</div>
                          <div className="text-xs text-gray-500">
                            {flight.date} • {flight.time}
                          </div>
                          {flight.hasSeatSelection ? (
                            selection?.seatId && (
                              <div className="text-xs text-green-600 mt-1">
                                {"Seat "}
                                {selection.seatId}
                                {selection.autoAssigned ? " assigned (random)" : " selected"}
                              </div>
                            )
                          ) : (
                            <div className="text-xs text-gray-400 mt-1">No seat selection</div>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Active Flight Seat Map */}
              {(() => {
                const activeFlight = flights.find((f) => f.id === activeFlightTab)
                const activeSelection = flightSelections.find((fs) => fs.flightId === activeFlightTab)
                if (!activeFlight) return null
                return (
                  <>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 mb-4">
                      <h2 className="text-lg sm:text-xl font-semibold">{activeFlight.route}</h2>
                      {activeFlight.hasSeatSelection && activeSelection?.seatId && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancelSeat(activeFlightTab)}
                          className="text-red-600 border-red-200 hover:bg-red-50 w-fit"
                        >
                          Cancel Selection
                        </Button>
                      )}
                    </div>

                    {activeFlight.hasSeatSelection ? (
                      <div className="relative">
                        <div className="flex justify-center mb-4">
                          <Plane className="w-6 h-6 sm:w-8 sm:h-8 text-[#1479C9]" />
                        </div>

                        <div className="max-h-64 sm:max-h-80 lg:max-h-96 overflow-y-auto border rounded-lg p-2 sm:p-4 bg-gradient-to-b from-blue-50 to-white">
                          <div className="space-y-1 sm:space-y-2">
                            {Array.from({ length: 30 }, (_, rowIndex) => {
                              const rowNumber = rowIndex + 1
                              const rowSeats = activeFlight.seats.filter((seat) => seat.row === rowNumber)
                              const isExitRow = hasEmergencyExit(rowNumber)
                              return (
                                <div key={rowNumber} className="flex items-center justify-center gap-1">
                                  <span className="w-4 sm:w-6 text-xs text-gray-500 text-center flex items-center justify-center">
                                    {rowNumber}
                                    {isExitRow && <span className="text-red-500 ml-0.5">*</span>}
                                  </span>

                                  {/* Left side seats (A, B, C) */}
                                  <div className="flex gap-0.5 sm:gap-1">
                                    {rowSeats.slice(0, 3).map((seat) => (
                                      <button
                                        key={seat.id}
                                        onClick={() => handleSeatSelect(seat.id)}
                                        disabled={seat.status === "occupied"}
                                        className={`w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 rounded text-xs font-medium transition-colors ${getSeatColor(
                                          seat,
                                        )} ${seat.status === "occupied" ? "cursor-not-allowed" : "cursor-pointer"} 
                                        touch-manipulation active:scale-95`}
                                        title={`Seat ${seat.id} - ${seat.type} $${seat.price}${isExitRow ? " (Emergency Exit)" : ""
                                          }`}
                                      >
                                        {seat.letter}
                                      </button>
                                    ))}
                                  </div>

                                  {/* Aisle */}
                                  <div className="w-3 sm:w-4 flex items-center justify-center">
                                    {isExitRow && <span className="text-xs text-red-500 font-bold">*</span>}
                                  </div>

                                  {/* Right side seats (D, E, F) */}
                                  <div className="flex gap-0.5 sm:gap-1">
                                    {rowSeats.slice(3, 6).map((seat) => (
                                      <button
                                        key={seat.id}
                                        onClick={() => handleSeatSelect(seat.id)}
                                        disabled={seat.status === "occupied"}
                                        className={`w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 rounded text-xs font-medium transition-colors ${getSeatColor(
                                          seat,
                                        )} ${seat.status === "occupied" ? "cursor-not-allowed" : "cursor-pointer"}
                                        touch-manipulation active:scale-95`}
                                        title={`Seat ${seat.id} - ${seat.type} $${seat.price}${isExitRow ? " (Emergency Exit)" : ""
                                          }`}
                                      >
                                        {seat.letter}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>

                        {/* Note about skipping */}
                        <div className="mt-3 text-xs text-gray-600">
                          Prefer not to pick a paid seat? Continue without choosing and we'll assign a random seat at no
                          extra cost.
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-lg">
                        Seat selection is not available for this flight.
                      </div>
                    )}

                    {/* Selected Seat Info */}
                    {activeFlight.hasSeatSelection &&
                      activeSelection?.seatId &&
                      (() => {
                        const selectedSeatData = activeFlight.seats.find((s) => s.id === activeSelection.seatId)
                        return (
                          <div className="mt-4 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0">
                              <div className="flex-1">
                                <h4 className="font-semibold text-green-800 text-sm sm:text-base">
                                  {activeFlight.route} - Seat {activeSelection.seatId}
                                </h4>
                                <p className="text-xs sm:text-sm text-green-700">
                                  {(selectedSeatData?.type.charAt(0).toUpperCase() ?? "") +
                                    (selectedSeatData?.type.slice(1) ?? "")}{" "}
                                  {"class"}{" "}
                                  {activeSelection.autoAssigned
                                    ? " - Randomly assigned (no extra cost)"
                                    : ` - Additional $${selectedSeatData?.price ?? 0}`}{" "}
                                  {hasEmergencyExit(selectedSeatData?.row || 0) && " (Emergency Exit Row)"}
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCancelSeat(activeFlightTab)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 w-fit"
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        )
                      })()}
                  </>
                )
              })()}
            </div>
          </div>

          {/* Price Summary */}
          <div className="space-y-4 sm:space-y-6 order-1 xl:order-2">
            <Card>
              <CardContent className="p-4 sm:p-6">
                <h3 className="font-semibold mb-3 sm:mb-4 text-base sm:text-lg">Price Summary</h3>
                <div className="space-y-2 sm:space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>1x Adult</span>
                    <span>$275</span>
                  </div>
                  <div className="flex justify-between">
                    <span>1x Cabin baggage</span>
                    <span>Included</span>
                  </div>
                  <div className="flex justify-between">
                    <span>1x Checked baggage 20 kg</span>
                    <span>{overallHasBaggageOption ? "Included" : "Not included"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>1x Flexi fare</span>
                    <span>$108.50</span>
                  </div>
                  <div className="flex justify-between">
                    <span>1x Kiwi.com Guarantee</span>
                    <span>$35</span>
                  </div>

                  {/* Seat selections with additional costs (manual paid selections only) */}
                  {flightSelections.map((selection) => {
                    if (!selection.seatId) return null
                    if (selection.autoAssigned) return null // skip charging for auto-assigned random seats
                    const flight = flights.find((f) => f.id === selection.flightId)
                    if (!flight?.hasSeatSelection) return null
                    const seat = flight?.seats.find((s) => s.id === selection.seatId)
                    const price = seat?.price || 0
                    if (price > 0) {
                      return (
                        <div key={selection.flightId} className="flex justify-between text-[#EF3D23]">
                          <span className="break-words">
                            Seat {selection.seatId} ({flight?.route})
                          </span>
                          <span className="flex-shrink-0">+${price}</span>
                        </div>
                      )
                    }
                    return null
                  })}

                  <hr />
                  <div className="flex justify-between font-bold text-base sm:text-lg">
                    <span>Total (USD)</span>
                    <span>
                      $
                      {(
                        418.49 +
                        flightSelections.reduce((total, selection) => {
                          if (!selection.seatId || selection.autoAssigned) return total
                          const flight = flights.find((f) => f.id === selection.flightId)
                          if (!flight?.hasSeatSelection) return total
                          const seat = flight?.seats.find((s) => s.id === selection.seatId)
                          return total + (seat?.price || 0)
                        }, 0)
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3 leading-relaxed">
                  {
                    "Includes all taxes, fees, surcharges, and Kiwi.com service fees. Kiwi.com service fees are calculated "
                  }
                  {"per passenger and are not refundable."}
                </p>
                <button className="text-sm text-[#1479C9] underline mt-2 hover:no-underline">
                  View price breakdown
                </button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center mt-6 sm:mt-8 pt-4 sm:pt-6 border-t">
          <Button
            variant="outline"
            className="flex items-center justify-center gap-2 bg-transparent order-3 sm:order-1"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>
          <div className="flex flex-col sm:flex-row gap-3 order-1 sm:order-2">
            {/* Continue without choosing seats (random, no cost) */}
            <Button
              variant="outline"
              className="bg-transparent text-sm sm:text-base px-3 sm:px-4"
              onClick={handleContinueWithoutSeats}
              title="We'll assign a random seat at no extra cost"
            >
              Continue without choosing seats
            </Button>
            <Button
              onClick={() => n.push("/Booking/1")}
              className="bg-[#1479C9] hover:bg-[#1479C9]/90 text-white flex items-center justify-center gap-2 text-sm sm:text-base px-4 sm:px-6"
              disabled={isContinueDisabled}
            >
              Continue
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
