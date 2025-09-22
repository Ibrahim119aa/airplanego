"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { FlightOffer, BookingPassenger, BaggageSelection, SeatSelection, BookingData } from "@/types/flight"
import { sampleFlightOffer } from "@/lib/flight-data"

interface BookingStore {
  // Flight data
  flightOffer: FlightOffer | null

  // Booking form data
  passengers: BookingPassenger[]
  baggage: BaggageSelection
  seats: SeatSelection[]
  contactDetails: {
    email: string
    phone: string
    countryCode: string
    smsUpdates: boolean
  }
  billingDetails: {
    type: "personal" | "company"
    givenNames: string
    surnames: string
    companyName: string
    vatId: string
    country: string
    streetAddress: string
    city: string
    postalCode: string
  } | null

  // UI state
  currentStep: "booking" | "seats" | "payment"

  // Actions
  setFlightOffer: (offer: FlightOffer) => void
  setPassengers: (passengers: BookingPassenger[]) => void
  updatePassenger: (id: string, updates: Partial<BookingPassenger>) => void
  addPassenger: () => void
  removePassenger: (id: string) => void
  setBaggage: (baggage: BaggageSelection) => void
  setSeats: (seats: SeatSelection[]) => void
  updateSeat: (flightId: string, seatId: string | null, autoAssigned: boolean, price: number) => void
  setContactDetails: (details: Partial<BookingStore["contactDetails"]>) => void
  setBillingDetails: (details: BookingStore["billingDetails"]) => void
  setCurrentStep: (step: BookingStore["currentStep"]) => void

  // Computed values
  getTotalPrice: () => number
  getBookingData: () => BookingData | null

  proceedToPayment: () => void

  // Reset
  resetBooking: () => void
}

const initialPassenger: BookingPassenger = {
  id: "1",
  type: "adult",
  givenNames: "",
  surnames: "",
  nationality: "",
  gender: "",
  dateOfBirth: { day: "", month: "", year: "" },
  passportNumber: "",
  passportExpiration: { day: "", month: "", year: "" },
  noExpiration: false,
  travelInsurance: "basic",
}

const initialBaggage: BaggageSelection = {
  cabinBaggage: "personal-item",
  checkedBaggage12kg: 0,
  checkedBaggage20kg: 0,
  noCheckedBaggage: false,
}

export const useBookingStore = create<BookingStore>()(
  persist(
    (set, get) => ({
      // Initial state
      flightOffer: sampleFlightOffer,
      passengers: [{ ...initialPassenger }],
      baggage: { ...initialBaggage },
      seats: [],
      contactDetails: {
        email: "",
        phone: "",
        countryCode: "+92",
        smsUpdates: false,
      },
      billingDetails: null,
      currentStep: "booking",

      // Actions
      setFlightOffer: (offer) => set({ flightOffer: offer }),

      setPassengers: (passengers) => set({ passengers }),

      updatePassenger: (id, updates) =>
        set((state) => ({
          passengers: state.passengers.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        })),

      addPassenger: () =>
        set((state) => ({
          passengers: [
            ...state.passengers,
            {
              ...initialPassenger,
              id: Date.now().toString(),
            },
          ],
        })),

      removePassenger: (id) =>
        set((state) => ({
          passengers: state.passengers.filter((p) => p.id !== id),
        })),

      setBaggage: (baggage) => set({ baggage }),

      setSeats: (seats) => set({ seats }),

      updateSeat: (flightId, seatId, autoAssigned, price) =>
        set((state) => {
          const existingIndex = state.seats.findIndex((s) => s.flightId === flightId)
          const newSeat: SeatSelection = { flightId, seatId, autoAssigned, price }

          if (existingIndex >= 0) {
            const newSeats = [...state.seats]
            newSeats[existingIndex] = newSeat
            return { seats: newSeats }
          } else {
            return { seats: [...state.seats, newSeat] }
          }
        }),

      setContactDetails: (details) =>
        set((state) => ({
          contactDetails: { ...state.contactDetails, ...details },
        })),

      setBillingDetails: (details) => set({ billingDetails: details }),

      setCurrentStep: (step) => set({ currentStep: step }),

      // Computed values
      getTotalPrice: () => {
        const state = get()
        if (!state.flightOffer) return 0

        let total = Number.parseFloat(state.flightOffer.total_amount)

        // Add baggage costs
        if (state.baggage.cabinBaggage === "cabin-bag") {
          total += 25
        }
        total += state.baggage.checkedBaggage12kg * 35
        total += state.baggage.checkedBaggage20kg * 55

        // Add seat costs (only for manually selected seats)
        state.seats.forEach((seat) => {
          if (seat.seatId && !seat.autoAssigned) {
            total += seat.price
          }
        })

        // Add insurance costs
        state.passengers.forEach((passenger) => {
          if (passenger.travelInsurance === "plus") {
            total += 29.99
          } else if (passenger.travelInsurance === "basic") {
            total += 14.99
          }
        })

        return total
      },

      getBookingData: () => {
        const state = get()
        if (!state.flightOffer) return null

        return {
          flightOffer: state.flightOffer,
          passengers: state.passengers,
          baggage: state.baggage,
          seats: state.seats,
          contactDetails: state.contactDetails,
          billingDetails: state.billingDetails,
        }
      },

      proceedToPayment: () => {
        const state = get()

        // Validate required data before proceeding
        if (!state.flightOffer) {
          console.error("No flight offer selected")
          return
        }

        if (state.passengers.length === 0) {
          console.error("No passengers added")
          return
        }

        // Move to payment step
        set({ currentStep: "payment" })

        // Here you can add additional logic like:
        // - API calls to create booking
        // - Payment processing
        // - Validation checks
        console.log("Proceeding to payment with booking data:", state.getBookingData())
      },

      resetBooking: () =>
        set({
          
          flightOffer: null,
          passengers: [{ ...initialPassenger }],
          baggage: { ...initialBaggage },
          seats: [],
          contactDetails: {
            email: "",
            phone: "",
            countryCode: "+92",
            smsUpdates: false,
          },
          billingDetails: null,
          currentStep: "booking",
        }),
    }),
    {
      name: "flight-booking-storage",
      partialize: (state) => ({
        flightOffer: state.flightOffer,
        passengers: state.passengers,
        baggage: state.baggage,
        seats: state.seats,
        contactDetails: state.contactDetails,
        billingDetails: state.billingDetails,
        currentStep: state.currentStep,
      }),
    },
  ),
)
