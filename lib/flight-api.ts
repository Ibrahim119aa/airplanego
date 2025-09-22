import type { FlightOffer, FlightSlice, FlightSegment } from "@/types/flight"

// Mock API functions that simulate real flight booking API calls
export class FlightAPI {
  private static baseUrl = process.env.NEXT_PUBLIC_API_URL || "/api"

  // Search for flights
  static async searchFlights(params: {
    origin: string
    destination: string
    departureDate: string
    returnDate?: string
    passengers: { adults: number; children: number; infants: number }
    cabinClass?: "economy" | "premium_economy" | "business" | "first"
  }): Promise<FlightOffer[]> {
    try {
      const response = await fetch(`${this.baseUrl}/flights/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      })

      if (!response.ok) {
        throw new Error("Failed to search flights")
      }

      return await response.json()
    } catch (error) {
      console.error("Flight search error:", error)
      // Return mock data for development
      return this.getMockFlightOffers(params)
    }
  }

  // Get flight offer details
  static async getFlightOffer(offerId: string): Promise<FlightOffer | null> {
    try {
      const response = await fetch(`${this.baseUrl}/flights/offers/${offerId}`)

      if (!response.ok) {
        throw new Error("Failed to get flight offer")
      }

      return await response.json()
    } catch (error) {
      console.error("Flight offer error:", error)
      return null
    }
  }

  // Get available seats for a flight
  static async getAvailableSeats(offerId: string, sliceId: string): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/flights/offers/${offerId}/slices/${sliceId}/seats`)

      if (!response.ok) {
        throw new Error("Failed to get available seats")
      }

      return await response.json()
    } catch (error) {
      console.error("Seats error:", error)
      // Return mock seat data
      return this.getMockSeats()
    }
  }

  // Create booking
  static async createBooking(bookingData: any): Promise<{ id: string; status: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      })

      if (!response.ok) {
        throw new Error("Failed to create booking")
      }

      return await response.json()
    } catch (error) {
      console.error("Booking creation error:", error)
      // Return mock booking response
      return {
        id: `booking_${Date.now()}`,
        status: "confirmed",
      }
    }
  }

  // Process payment
  static async processPayment(paymentData: {
    bookingId: string
    amount: number
    currency: string
    paymentMethod: any
  }): Promise<{ success: boolean; transactionId?: string; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/payments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      })

      if (!response.ok) {
        throw new Error("Payment failed")
      }

      const result = await response.json()
      return {
        success: true,
        transactionId: result.transaction_id,
      }
    } catch (error) {
      console.error("Payment error:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Payment failed",
      }
    }
  }

  // Mock data generators for development
  private static getMockFlightOffers(params: any): FlightOffer[] {
    // Generate mock flight offers based on search parameters
    const mockOffers: FlightOffer[] = []

    for (let i = 0; i < 5; i++) {
      const basePrice = 200 + Math.random() * 300
      const taxes = basePrice * 0.15

      mockOffers.push({
        id: `offer_${Date.now()}_${i}`,
        total_amount: (basePrice + taxes).toFixed(2),
        total_currency: "USD",
        base_amount: basePrice.toFixed(2),
        base_currency: "USD",
        tax_amount: taxes.toFixed(2),
        tax_currency: "USD",
        total_emissions_kg: (Math.random() * 500 + 200).toFixed(0),
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes
        slices: this.generateMockSlices(params),
        passengers: this.generateMockPassengers(params.passengers),
        conditions: {
          refund_before_departure: {
            allowed: Math.random() > 0.5,
            penalty_amount: "50.00",
            penalty_currency: "USD",
          },
          change_before_departure: {
            allowed: Math.random() > 0.3,
            penalty_amount: "100.00",
            penalty_currency: "USD",
          },
        },
        owner: {
          id: "airline_mock",
          iata_code: "MK",
          name: "Mock Airlines",
          logo_symbol_url: "/placeholder.svg",
          conditions_of_carriage_url: "https://example.com/conditions",
        },
        payment_requirements: {
          requires_instant_payment: false,
          price_guarantee_expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          payment_required_by: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
        },
      })
    }

    return mockOffers
  }

  private static generateMockSlices(params: any): FlightSlice[] {
    const slices: FlightSlice[] = []

    // Outbound slice
    slices.push({
      id: `slice_outbound_${Date.now()}`,
      origin: this.getMockAirport(params.origin),
      destination: this.getMockAirport(params.destination),
      departure_date: params.departureDate,
      arrival_date: new Date(new Date(params.departureDate).getTime() + 8 * 60 * 60 * 1000).toISOString(),
      duration: "PT8H0M",
      fare_brand_name: "Economy Basic",
      segments: [this.generateMockSegment(params.origin, params.destination, params.departureDate)],
      conditions: {
        change_before_departure: {
          allowed: false,
          penalty_amount: null,
          penalty_currency: null,
        },
      },
    })

    // Return slice if round trip
    if (params.returnDate) {
      slices.push({
        id: `slice_return_${Date.now()}`,
        origin: this.getMockAirport(params.destination),
        destination: this.getMockAirport(params.origin),
        departure_date: params.returnDate,
        arrival_date: new Date(new Date(params.returnDate).getTime() + 8 * 60 * 60 * 1000).toISOString(),
        duration: "PT8H0M",
        fare_brand_name: "Economy Basic",
        segments: [this.generateMockSegment(params.destination, params.origin, params.returnDate)],
        conditions: {
          change_before_departure: {
            allowed: false,
            penalty_amount: null,
            penalty_currency: null,
          },
        },
      })
    }

    return slices
  }

  private static generateMockSegment(origin: string, destination: string, departureDate: string): FlightSegment {
    return {
      id: `segment_${Date.now()}`,
      origin: this.getMockAirport(origin),
      destination: this.getMockAirport(destination),
      departing_at: departureDate,
      arriving_at: new Date(new Date(departureDate).getTime() + 8 * 60 * 60 * 1000).toISOString(),
      duration: "PT8H0M",
      distance: "5000",
      aircraft: null,
      operating_carrier: {
        id: "airline_mock",
        iata_code: "MK",
        name: "Mock Airlines",
        logo_symbol_url: "/placeholder.svg",
        conditions_of_carriage_url: "https://example.com/conditions",
      },
      marketing_carrier: {
        id: "airline_mock",
        iata_code: "MK",
        name: "Mock Airlines",
        logo_symbol_url: "/placeholder.svg",
        conditions_of_carriage_url: "https://example.com/conditions",
      },
      operating_carrier_flight_number: "MK123",
      marketing_carrier_flight_number: "MK123",
      stops: [],
      passengers: [],
    }
  }

  private static getMockAirport(code: string): any {
    const airports: Record<string, any> = {
      LHR: {
        id: "arp_lhr_gb",
        iata_code: "LHR",
        icao_code: "EGLL",
        name: "Heathrow Airport",
        city_name: "London",
        iata_city_code: "LON",
        iata_country_code: "GB",
        latitude: 51.470311,
        longitude: -0.458118,
        time_zone: "Europe/London",
        type: "airport",
        city: {
          id: "cit_lon_gb",
          name: "London",
          iata_code: "LON",
          iata_city_code: "LON",
          iata_country_code: "GB",
          type: "city",
        },
      },
      JFK: {
        id: "arp_jfk_us",
        iata_code: "JFK",
        icao_code: "KJFK",
        name: "John F. Kennedy International Airport",
        city_name: "New York",
        iata_city_code: "NYC",
        iata_country_code: "US",
        latitude: 40.640556,
        longitude: -73.778519,
        time_zone: "America/New_York",
        type: "airport",
        city: {
          id: "cit_nyc_us",
          name: "New York",
          iata_code: "NYC",
          iata_city_code: "NYC",
          iata_country_code: "US",
          type: "city",
        },
      },
    }

    return airports[code] || airports["LHR"]
  }

  private static generateMockPassengers(passengerCounts: any): any[] {
    const passengers = []

    for (let i = 0; i < passengerCounts.adults; i++) {
      passengers.push({
        id: `passenger_adult_${i}`,
        type: "adult",
        loyalty_programme_accounts: [],
      })
    }

    for (let i = 0; i < passengerCounts.children; i++) {
      passengers.push({
        id: `passenger_child_${i}`,
        type: "child",
        loyalty_programme_accounts: [],
      })
    }

    for (let i = 0; i < passengerCounts.infants; i++) {
      passengers.push({
        id: `passenger_infant_${i}`,
        type: "infant",
        loyalty_programme_accounts: [],
      })
    }

    return passengers
  }

  private static getMockSeats(): any[] {
    const seats = []
    const letters = ["A", "B", "C", "D", "E", "F"]

    for (let row = 1; row <= 30; row++) {
      for (const letter of letters) {
        let type = "economy"
        let price = 15

        if (row <= 3) {
          type = "business"
          price = 150
        } else if (row <= 8 || (row >= 12 && row <= 14)) {
          type = "premium"
          price = row <= 8 ? 75 : 45
        }

        seats.push({
          id: `${row}${letter}`,
          row,
          letter,
          type,
          available: Math.random() > 0.3,
          price,
        })
      }
    }

    return seats
  }
}
