"use client"

import { useState } from "react"
import { Check, ChevronLeft, ChevronRight, Plane, Shield, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

interface Seat {
  id: string
  row: number
  letter: string
  type: "economy" | "premium" | "business"
  status: "available" | "occupied" | "selected"
  price?: number
}

interface Flight {
  id: string
  route: string
  date: string
  time: string
  seats: Seat[]
  hasSeatSelection: boolean // New: indicates if seat selection is available for this flight
  hasBaggageOption: boolean // New: indicates if baggage option is available for this flight
}

interface FlightSeatSelection {
  flightId: string
  seatId: string | null
}

interface PageProps {
  params: {
    Id: string
  }
}

export default function SeatSelection({ params }: PageProps) {
  const [activeFlightTab, setActiveFlightTab] = useState<string>("outbound")
  const [flightSelections, setFlightSelections] = useState<FlightSeatSelection[]>([
    { flightId: "outbound", seatId: null },
    { flightId: "return", seatId: null },
  ])

  // Generate seat map data
  const generateSeats = (): Seat[] => {
    const seats: Seat[] = []
    const letters = ["A", "B", "C", "D", "E", "F"]

    for (let row = 1; row <= 30; row++) {
      for (const letter of letters) {
        let type: "economy" | "premium" | "business" = "economy"
        let price = 0

        if (row <= 3) {
          type = "business"
          price = 150
        } else if (row <= 8) {
          type = "premium"
          price = 75
        } else if (row >= 12 && row <= 14) {
          type = "premium"
          price = 45
        }

        // Randomly set some seats as occupied
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
        hasSeatSelection: true, // Outbound flight has seat selection
        hasBaggageOption: true, // Outbound flight has baggage option
      },
      {
        id: "return",
        route: "Dubai → Karachi",
        date: "Dec 22, 2024",
        time: "09:15 - 12:30",
        seats: generateSeats(),
        hasSeatSelection: false, // Return flight does NOT have seat selection
        hasBaggageOption: false, // Return flight does NOT have baggage option
      },
    ]
  }

  const [flights, setFlights] = useState<Flight[]>(generateFlights())

  const handleSeatSelect = (seatId: string) => {
    const activeFlight = flights.find((f) => f.id === activeFlightTab)
    if (!activeFlight || !activeFlight.hasSeatSelection) return // Prevent selection if not available

    const seat = activeFlight.seats.find((s) => s.id === seatId)
    if (seat && seat.status === "available") {
      const currentSelection = flightSelections.find((fs) => fs.flightId === activeFlightTab)
      const currentSeatId = currentSelection?.seatId

      // Update flights with new seat statuses
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

      // Update flight selections
      const updatedSelections = flightSelections.map((fs) =>
        fs.flightId === activeFlightTab ? { ...fs, seatId: currentSeatId === seatId ? null : seatId } : fs,
      )
      setFlightSelections(updatedSelections)
    }
  }

  const handleCancelSeat = (flightId: string) => {
    // Update flights to clear selected seats
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

    // Clear selection
    const updatedSelections = flightSelections.map((fs) => (fs.flightId === flightId ? { ...fs, seatId: null } : fs))
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

  // Check if a row has emergency exits (typically rows 12-14 for over-wing exits)
  const hasEmergencyExit = (rowNumber: number) => {
    return rowNumber >= 12 && rowNumber <= 14
  }

  const steps = [
    { name: "Search", completed: true },
    { name: "Passenger details", completed: true },
    { name: "Baggage", completed: true },
    { name: "Ticket fare", completed: true },
    { name: "Seating", completed: false, current: true },
    { name: "Overview & payment", completed: false },
  ]

  // Determine if the overall booking has baggage option (e.g., if at least one flight has it)
  const overallHasBaggageOption = flights.some((flight) => flight.hasBaggageOption)

  // Determine if the "Continue" button should be disabled
  // It's disabled if any flight that *requires* seat selection doesn't have one selected.
  const isContinueDisabled = flights.some(
    (flight) => flight.hasSeatSelection && flightSelections.find((fs) => fs.flightId === flight.id)?.seatId === null,
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white py-4 border-b mb-8 rounded-lg shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between text-center">
            {/* Step 1: Search (Completed) */}
            <div className="flex flex-col items-center flex-1 min-w-0">
              <div className="w-6 h-6 rounded-full bg-[#1479C9] flex items-center justify-center text-white">
                <Check className="h-4 w-4" />
              </div>
              <span className="text-sm mt-2 text-[#1479C9] whitespace-nowrap">Search</span>
            </div>
            {/* Line between Step 1 and 2 */}
            <div className="flex-1 h-0.5 bg-[#1479C9] mx-2"></div>
            {/* Step 2: Passenger details (Current) */}
            <div className="flex flex-col items-center flex-1 min-w-0">
              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-semibold">
                2
              </div>
              <span className="text-sm mt-2 text-gray-500 whitespace-nowrap">Passenger detail</span>
            </div>
            {/* Line between Step 2 and 3 */}
            <div className="flex-1 h-0.5 bg-gray-200 mx-2"></div>
            {/* Step 3: Baggage (Future) */}
            <div className="flex flex-col items-center flex-1 min-w-0">
              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-semibold">
                3
              </div>
              <span className="text-sm mt-2 text-gray-500 whitespace-nowrap">Baggage</span>
            </div>
            {/* Line between Step 3 and 4 */}
            <div className="flex-1 h-0.5 bg-gray-200 mx-2"></div>
            {/* Step 4: Ticket fare (Future) */}
            <div className="flex flex-col items-center flex-1 min-w-0">
              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-semibold">
                4
              </div>
              <span className="text-sm mt-2 text-gray-500 whitespace-nowrap">Ticket fare</span>
            </div>
            {/* Line between Step 4 and 5 */}
            <div className="flex-1 h-0.5 bg-gray-200 mx-2"></div>
            {/* Step 5: Seating (Future) */}
            <div className="flex flex-col items-center flex-1 min-w-0">
              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-semibold">
                5
              </div>
              <span className="text-sm mt-2 text-gray-500 whitespace-nowrap">Seating</span>
            </div>
            {/* Line between Step 5 and 6 */}
            <div className="flex-1 h-0.5 bg-gray-200 mx-2"></div>
            {/* Step 6: Overview & payment (Future) */}
            <div className="flex flex-col items-center flex-1 min-w-0">
              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-semibold">
                6
              </div>
              <span className="text-sm mt-2 text-gray-500 whitespace-nowrap">Overview & payment</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Seat Map */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Karachi → Dubai and back</h1>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <Shield className="w-3 h-3 mr-1" />
                    guarantee included
                  </Badge>
                  <span className="text-sm text-[#1479C9]">Disruption Protection • Instant Credit • Check-in</span>
                </div>
              </div>

              {/* Seat Legend */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-3">Seat Types</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-[#1479C9] rounded"></div>
                    <span>Business ($150)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span>Premium ($45-75)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-200 rounded"></div>
                    <span>Economy (Free)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-400 rounded"></div>
                    <span>Occupied</span>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-600">
                  <span>* Emergency exit rows</span>
                </div>
              </div>

              {/* Flight Tabs */}
              <div className="mb-6">
                <div className="flex border-b">
                  {flights.map((flight) => {
                    const selection = flightSelections.find((fs) => fs.flightId === flight.id)
                    return (
                      <button
                        key={flight.id}
                        onClick={() => setActiveFlightTab(flight.id)}
                        className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                          activeFlightTab === flight.id
                            ? "border-[#1479C9] text-[#1479C9]"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        <div className="text-left">
                          <div className="font-semibold">{flight.route}</div>
                          <div className="text-xs text-gray-500">
                            {flight.date} • {flight.time}
                          </div>
                          {flight.hasSeatSelection ? (
                            selection?.seatId && (
                              <div className="text-xs text-green-600 mt-1">Seat {selection.seatId} selected</div>
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
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold">{activeFlight.route}</h2>
                      {activeFlight.hasSeatSelection && activeSelection?.seatId && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancelSeat(activeFlightTab)}
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          Cancel Selection
                        </Button>
                      )}
                    </div>

                    {activeFlight.hasSeatSelection ? (
                      <div className="relative">
                        <div className="flex justify-center mb-4">
                          <Plane className="w-8 h-8 text-[#1479C9]" />
                        </div>
                        <div className="max-h-96 overflow-y-auto border rounded-lg p-4 bg-gradient-to-b from-blue-50 to-white">
                          <div className="space-y-2">
                            {Array.from({ length: 30 }, (_, rowIndex) => {
                              const rowNumber = rowIndex + 1
                              const rowSeats = activeFlight.seats.filter((seat) => seat.row === rowNumber)
                              const isExitRow = hasEmergencyExit(rowNumber)

                              return (
                                <div key={rowNumber} className="flex items-center justify-center gap-1">
                                  <span className="w-6 text-xs text-gray-500 text-center flex items-center justify-center">
                                    {rowNumber}
                                    {isExitRow && <span className="text-red-500 ml-0.5">*</span>}
                                  </span>
                                  {/* Left side seats (A, B, C) */}
                                  <div className="flex gap-1">
                                    {rowSeats.slice(0, 3).map((seat) => (
                                      <button
                                        key={seat.id}
                                        onClick={() => handleSeatSelect(seat.id)}
                                        disabled={seat.status === "occupied"}
                                        className={`w-6 h-6 rounded text-xs font-medium transition-colors ${getSeatColor(
                                          seat,
                                        )} ${seat.status === "occupied" ? "cursor-not-allowed" : "cursor-pointer"}`}
                                        title={`Seat ${seat.id} - ${seat.type} ${seat.price > 0 ? `$${seat.price}` : "Free"}${isExitRow ? " (Emergency Exit)" : ""}`}
                                      >
                                        {seat.letter}
                                      </button>
                                    ))}
                                  </div>
                                  {/* Aisle */}
                                  <div className="w-4 flex items-center justify-center">
                                    {isExitRow && <span className="text-xs text-red-500 font-bold">*</span>}
                                  </div>
                                  {/* Right side seats (D, E, F) */}
                                  <div className="flex gap-1">
                                    {rowSeats.slice(3, 6).map((seat) => (
                                      <button
                                        key={seat.id}
                                        onClick={() => handleSeatSelect(seat.id)}
                                        disabled={seat.status === "occupied"}
                                        className={`w-6 h-6 rounded text-xs font-medium transition-colors ${getSeatColor(
                                          seat,
                                        )} ${seat.status === "occupied" ? "cursor-not-allowed" : "cursor-pointer"}`}
                                        title={`Seat ${seat.id} - ${seat.type} ${seat.price > 0 ? `$${seat.price}` : "Free"}${isExitRow ? " (Emergency Exit)" : ""}`}
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
                          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-semibold text-green-800">
                                  {activeFlight.route} - Seat {activeSelection.seatId}
                                </h4>
                                <p className="text-sm text-green-700">
                                  {selectedSeatData?.type.charAt(0).toUpperCase() + selectedSeatData?.type.slice(1)}{" "}
                                  class
                                  {(selectedSeatData?.price || 0) > 0
                                    ? ` - Additional $${selectedSeatData?.price}`
                                    : " - No additional cost"}
                                  {hasEmergencyExit(selectedSeatData?.row || 0) && " (Emergency Exit Row)"}
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCancelSeat(activeFlightTab)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
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
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Price Summary</h3>
                <div className="space-y-3 text-sm">
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

                  {/* Seat selections for both flights */}
                  {flightSelections.map((selection) => {
                    if (!selection.seatId) return null
                    const flight = flights.find((f) => f.id === selection.flightId)
                    // Only show seat selection cost if the flight actually has seat selection
                    if (!flight?.hasSeatSelection) return null

                    const seat = flight?.seats.find((s) => s.id === selection.seatId)
                    const price = seat?.price || 0

                    if (price > 0) {
                      return (
                        <div key={selection.flightId} className="flex justify-between text-[#EF3D23]">
                          <span>
                            Seat {selection.seatId} ({flight?.route})
                          </span>
                          <span>+${price}</span>
                        </div>
                      )
                    }
                    return null
                  })}

                  <hr />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total (USD)</span>
                    <span>
                      $
                      {(
                        418.49 +
                        flightSelections.reduce((total, selection) => {
                          if (!selection.seatId) return total
                          const flight = flights.find((f) => f.id === selection.flightId)
                          // Only add to total if the flight actually has seat selection
                          if (!flight?.hasSeatSelection) return total

                          const seat = flight?.seats.find((s) => s.id === selection.seatId)
                          return total + (seat?.price || 0)
                        }, 0)
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  Includes all taxes, fees, surcharges, and Kiwi.com service fees. Kiwi.com service fees are calculated
                  per passenger and are not refundable.
                </p>
                <button className="text-sm text-[#1479C9] underline mt-2">View price breakdown</button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Need more time to decide?</h3>
                <p className="text-sm text-gray-600 mb-4">Hold your booking for 24 hours and pay later.</p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>Hold for $15</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t">
          <Button variant="outline" className="flex items-center gap-2 bg-transparent">
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>
          <Button
            className="bg-[#1479C9] hover:bg-[#1479C9]/90 text-white flex items-center gap-2"
            disabled={isContinueDisabled}
          >
            Continue
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
