"use client"

import { useState, useCallback } from "react"
import { useBookingStore } from "@/lib/booking-store"
import { FlightAPI } from "@/lib/flight-api"
import type { FlightOffer } from "@/types/flight"

export const useFlightBooking = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    flightOffer,
    passengers,
    baggage,
    seats,
    contactDetails,
    billingDetails,
    currentStep,
    setFlightOffer,
    setCurrentStep,
    getTotalPrice,
    getBookingData,
    resetBooking,
  } = useBookingStore()

  const searchFlights = useCallback(
    async (searchParams: {
      origin: string
      destination: string
      departureDate: string
      returnDate?: string
      passengers: { adults: number; children: number; infants: number }
      cabinClass?: "economy" | "premium_economy" | "business" | "first"
    }) => {
      setLoading(true)
      setError(null)

      try {
        const offers = await FlightAPI.searchFlights(searchParams)
        return offers
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to search flights")
        return []
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  const selectFlightOffer = useCallback(
    (offer: FlightOffer) => {
      setFlightOffer(offer)
      setCurrentStep("booking")
    },
    [setFlightOffer, setCurrentStep],
  )

  const proceedToSeats = useCallback(() => {
    if (!flightOffer) {
      setError("No flight selected")
      return false
    }

    // Validate passenger data
    const hasValidPassengers = passengers.every(
      (p) =>
        p.givenNames.trim() &&
        p.surnames.trim() &&
        p.nationality &&
        p.gender &&
        p.dateOfBirth.day &&
        p.dateOfBirth.month &&
        p.dateOfBirth.year &&
        p.passportNumber.trim(),
    )

    if (!hasValidPassengers) {
      setError("Please complete all passenger details")
      return false
    }

    setCurrentStep("seats")
    return true
  }, [flightOffer, passengers, setCurrentStep])

  const proceedToPayment = useCallback(() => {
    setCurrentStep("payment")
    return true
  }, [setCurrentStep])

  const getAvailableSeats = useCallback(
    async (sliceId: string) => {
      if (!flightOffer) return []

      setLoading(true)
      try {
        const seats = await FlightAPI.getAvailableSeats(flightOffer.id, sliceId)
        return seats
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to get seats")
        return []
      } finally {
        setLoading(false)
      }
    },
    [flightOffer],
  )

  const createBooking = useCallback(async () => {
    const bookingData = getBookingData()
    if (!bookingData) {
      setError("Invalid booking data")
      return null
    }

    setLoading(true)
    setError(null)

    try {
      const booking = await FlightAPI.createBooking(bookingData)
      return booking
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create booking")
      return null
    } finally {
      setLoading(false)
    }
  }, [getBookingData])

  const processPayment = useCallback(
    async (paymentMethod: any) => {
      const bookingData = getBookingData()
      if (!bookingData) {
        setError("Invalid booking data")
        return { success: false, error: "Invalid booking data" }
      }

      setLoading(true)
      setError(null)

      try {
        // First create the booking
        const booking = await FlightAPI.createBooking(bookingData)
        if (!booking) {
          throw new Error("Failed to create booking")
        }

        // Then process payment
        const paymentResult = await FlightAPI.processPayment({
          bookingId: booking.id,
          amount: getTotalPrice(),
          currency: flightOffer?.total_currency || "USD",
          paymentMethod,
        })

        if (paymentResult.success) {
          // Reset booking state after successful payment
          resetBooking()
        }

        return paymentResult
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Payment failed"
        setError(errorMessage)
        return { success: false, error: errorMessage }
      } finally {
        setLoading(false)
      }
    },
    [getBookingData, getTotalPrice, flightOffer, resetBooking],
  )

  return {
    // State
    flightOffer,
    passengers,
    baggage,
    seats,
    contactDetails,
    billingDetails,
    currentStep,
    loading,
    error,

    // Computed
    totalPrice: getTotalPrice(),
    bookingData: getBookingData(),

    // Actions
    searchFlights,
    selectFlightOffer,
    proceedToSeats,
    proceedToPayment,
    getAvailableSeats,
    createBooking,
    processPayment,
    resetBooking,

    // Utilities
    setError,
    clearError: () => setError(null),
  }
}
