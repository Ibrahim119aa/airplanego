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
interface PageProps {
    params: {
        Id: string;
    };
}

export default function SeatSelection({ params }: PageProps) {
    const [selectedSeat, setSelectedSeat] = useState<string | null>(null)

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

    const [seats] = useState<Seat[]>(generateSeats())

    const handleSeatSelect = (seatId: string) => {
        const seat = seats.find((s) => s.id === seatId)
        if (seat && seat.status === "available") {
            setSelectedSeat(selectedSeat === seatId ? null : seatId)
            // Update seat status
            seat.status = selectedSeat === seatId ? "available" : "selected"
            if (selectedSeat && selectedSeat !== seatId) {
                const prevSeat = seats.find((s) => s.id === selectedSeat)
                if (prevSeat) prevSeat.status = "available"
            }
        }
    }

    const selectedSeatData = seats.find((s) => s.id === selectedSeat)
    const seatPrice = selectedSeatData?.price || 0

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

    const steps = [
        { name: "Search", completed: true },
        { name: "Passenger details", completed: true },
        { name: "Baggage", completed: true },
        { name: "Ticket fare", completed: true },
        { name: "Seating", completed: false, current: true },
        { name: "Overview & payment", completed: false },
    ]

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
                            </div>

                            {/* Aircraft Layout */}
                            <div className="relative">
                                <div className="flex justify-center mb-4">
                                    <Plane className="w-8 h-8 text-[#1479C9]" />
                                </div>

                                <div className="max-h-96 overflow-y-auto border rounded-lg p-4 bg-gradient-to-b from-blue-50 to-white">
                                    {/* Seat Map */}
                                    <div className="space-y-2">
                                        {Array.from({ length: 30 }, (_, rowIndex) => {
                                            const rowNumber = rowIndex + 1
                                            const rowSeats = seats.filter((seat) => seat.row === rowNumber)

                                            return (
                                                <div key={rowNumber} className="flex items-center justify-center gap-1">
                                                    <span className="w-6 text-xs text-gray-500 text-center">{rowNumber}</span>

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
                                                                title={`Seat ${seat.id} - ${seat.type} ${seat.price > 0 ? `$${seat.price}` : "Free"}`}
                                                            >
                                                                {seat.letter}
                                                            </button>
                                                        ))}
                                                    </div>

                                                    {/* Aisle */}
                                                    <div className="w-4"></div>

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
                                                                title={`Seat ${seat.id} - ${seat.type} ${seat.price > 0 ? `$${seat.price}` : "Free"}`}
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

                            {selectedSeat && (
                                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                                    <h4 className="font-semibold text-green-800">Selected Seat: {selectedSeat}</h4>
                                    <p className="text-sm text-green-700">
                                        {selectedSeatData?.type.charAt(0).toUpperCase() + selectedSeatData?.type.slice(1)} class
                                        {seatPrice > 0 ? ` - Additional $${seatPrice}` : " - No additional cost"}
                                    </p>
                                </div>
                            )}
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
                                        <span>Included</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>1x Flexi fare</span>
                                        <span>$108.50</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>1x Kiwi.com Guarantee</span>
                                        <span>$35</span>
                                    </div>
                                    {seatPrice > 0 && (
                                        <div className="flex justify-between text-[#EF3D23]">
                                            <span>Seat selection</span>
                                            <span>+${seatPrice}</span>
                                        </div>
                                    )}
                                    <hr />
                                    <div className="flex justify-between font-bold text-lg">
                                        <span>Total (USD)</span>
                                        <span>${(418.49 + seatPrice).toFixed(2)}</span>
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
                        disabled={!selectedSeat}
                    >
                        Continue
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
