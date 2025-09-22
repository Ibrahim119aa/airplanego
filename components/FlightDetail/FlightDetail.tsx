"use client"

import { useMemo, useRef, useState, useEffect } from "react"
import { Share2, ChevronRight, Plane, Luggage, Wifi, Tv, User, Info, Check, ChevronLeft, X, Plus } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import { useBookingStore } from "@/lib/booking-store"
import { useFlightBooking } from "@/hooks/use-flight-booking"
import { formatDuration, formatDateTime } from "@/lib/flight-data"
import type { BookingPassenger } from "@/types/flight"


export default function FlightBookingForm() {
  const router = useRouter()

  const {
    passengers,
    baggage,
    setPassengers,
    setBaggage,
    updatePassenger,
    addPassenger,
    removePassenger,
    getTotalPrice,
  } = useBookingStore()

  const { flightOffer, proceedToSeats, error, setError, clearError } = useFlightBooking()

  // Validation UI state
  const [showErrors, setShowErrors] = useState(false)
  const [globalError, setGlobalError] = useState<string | null>(null)
  const passengerRefs = useRef<Map<string, HTMLDivElement>>(new Map())

  const pasportyears = useMemo(() => Array.from({ length: 100 }, (_, i) => new Date().getFullYear() + i), [])
  const dobyears = useMemo(() => Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i), [])
  const days = useMemo(() => Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, "0")), [])
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const isEmpty = (value: string) => !value || value.trim() === ""

  const handleAddPassenger = () => {
    addPassenger()
  }

  const handleRemovePassenger = (id: string) => {
    removePassenger(id)
  }

  const handleUpdatePassenger = (id: string, field: keyof BookingPassenger, value: any) => {
    updatePassenger(id, { [field]: value })
  }

  const updatePassengerDateOfBirth = (id: string, field: "day" | "month" | "year", value: string) => {
    const passenger = passengers.find((p) => p.id === id)
    if (passenger) {
      updatePassenger(id, {
        dateOfBirth: {
          ...passenger.dateOfBirth,
          [field]: value,
        },
      })
    }
  }

  const updatePassengerPassportExpiration = (id: string, field: "day" | "month" | "year", value: string) => {
    const passenger = passengers.find((p) => p.id === id)
    if (passenger) {
      updatePassenger(id, {
        passportExpiration: {
          ...passenger.passportExpiration,
          [field]: value,
        },
      })
    }
  }

  const handleCabinBaggageChange = (value: string) => {
    setBaggage({
      ...baggage,
      cabinBaggage: value as "personal-item" | "cabin-bag",
    })
  }

  const handleCheckedBaggageChange = (type: "12kg" | "20kg", quantity: number) => {
    setBaggage({
      ...baggage,
      [`checkedBaggage${type}`]: quantity,
    })
  }

  const handleNoCheckedBaggageChange = (checked: boolean) => {
    setBaggage({
      ...baggage,
      noCheckedBaggage: checked,
      checkedBaggage12kg: checked ? 0 : baggage.checkedBaggage12kg,
      checkedBaggage20kg: checked ? 0 : baggage.checkedBaggage20kg,
    })
  }

  const calculateAge = (dateOfBirth: { day: string; month: string; year: string }) => {
    if (!dateOfBirth.day || !dateOfBirth.month || !dateOfBirth.year) {
      return null
    }

    const today = new Date()
    const birthDate = new Date(
      Number.parseInt(dateOfBirth.year),
      Number.parseInt(dateOfBirth.month) - 1,
      Number.parseInt(dateOfBirth.day),
    )

    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    return age
  }

  const validatePassengers = () => {
    const errors: string[] = []

    passengers.forEach((passenger, index) => {
      const passengerNumber = index + 1
      if (isEmpty(passenger.givenNames)) errors.push(`Passenger ${passengerNumber}: Given names required`)
      if (isEmpty(passenger.surnames)) errors.push(`Passenger ${passengerNumber}: Surnames required`)
      if (isEmpty(passenger.nationality)) errors.push(`Passenger ${passengerNumber}: Nationality required`)
      if (isEmpty(passenger.gender)) errors.push(`Passenger ${passengerNumber}: Gender required`)
      if (
        isEmpty(passenger.dateOfBirth.day) ||
        isEmpty(passenger.dateOfBirth.month) ||
        isEmpty(passenger.dateOfBirth.year)
      ) {
        errors.push(`Passenger ${passengerNumber}: Date of birth required`)
      } else {
        const age = calculateAge(passenger.dateOfBirth)
        if (age !== null && age < 16) {
          errors.push(`Passenger ${passengerNumber}: Passengers under 16 years old cannot book tickets`)
        }
      }
      if (isEmpty(passenger.passportNumber)) errors.push(`Passenger ${passengerNumber}: Passport number required`)
      if (
        !passenger.noExpiration &&
        (isEmpty(passenger.passportExpiration.day) ||
          isEmpty(passenger.passportExpiration.month) ||
          isEmpty(passenger.passportExpiration.year))
      ) {
        errors.push(`Passenger ${passengerNumber}: Passport expiration required`)
      }
    })

    return errors
  }

  const scrollToFirstError = () => {
    const firstPassengerWithError = passengers.find((passenger) => {
      return (
        isEmpty(passenger.givenNames) ||
        isEmpty(passenger.surnames) ||
        isEmpty(passenger.nationality) ||
        isEmpty(passenger.gender) ||
        isEmpty(passenger.dateOfBirth.day) ||
        isEmpty(passenger.dateOfBirth.month) ||
        isEmpty(passenger.dateOfBirth.year) ||
        isEmpty(passenger.passportNumber) ||
        (!passenger.noExpiration &&
          (isEmpty(passenger.passportExpiration.day) ||
            isEmpty(passenger.passportExpiration.month) ||
            isEmpty(passenger.passportExpiration.year)))
      )
    })

    if (firstPassengerWithError) {
      const element = passengerRefs.current.get(firstPassengerWithError.id)
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    }
  }

  const handleContinue = () => {
    const errors = validatePassengers()
    if (errors.length > 0) {
      setShowErrors(true)
      setGlobalError(`Please complete all required fields for ${errors.length} issue(s) found.`)
      scrollToFirstError()
      return
    }

    setShowErrors(false)
    setGlobalError(null)
    clearError()

    const success = proceedToSeats()
    if (success) {
      router.push("/flight/seat/1")
    }
  }

  useEffect(() => {
    clearError()
  }, [clearError])

  const renderPassengerForm = (passenger: BookingPassenger, index: number) => {
    const givenNamesInvalid = showErrors && isEmpty(passenger.givenNames)
    const surnamesInvalid = showErrors && isEmpty(passenger.surnames)
    const nationalityInvalid = showErrors && isEmpty(passenger.nationality)
    const genderInvalid = showErrors && isEmpty(passenger.gender)
    const dobInvalid =
      showErrors &&
      (isEmpty(passenger.dateOfBirth.day) ||
        isEmpty(passenger.dateOfBirth.month) ||
        isEmpty(passenger.dateOfBirth.year))
    const passportInvalid = showErrors && isEmpty(passenger.passportNumber)
    const passExpInvalid =
      showErrors &&
      !passenger.noExpiration &&
      (isEmpty(passenger.passportExpiration.day) ||
        isEmpty(passenger.passportExpiration.month) ||
        isEmpty(passenger.passportExpiration.year))

    return (
      <div
        key={passenger.id}
        ref={(el) => {
          if (el) {
            passengerRefs.current.set(passenger.id, el)
          }
        }}
      >
        <Card className="shadow-sm">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle className="text-lg font-semibold">
                {index === 0 ? "Primary passenger" : `Passenger ${index + 1}`}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Select
                  value={passenger.type}
                  onValueChange={(value: "adult" | "child" | "infant") =>
                    handleUpdatePassenger(passenger.id, "type", value)
                  }
                >
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="adult">Adult (over 12 years)</SelectItem>
                    <SelectItem value="child">Child (2-12 years)</SelectItem>
                    <SelectItem value="infant">Infant (under 2 years)</SelectItem>
                  </SelectContent>
                </Select>
                {index > 0 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemovePassenger(passenger.id)}
                    className="text-red-500 hover:text-red-700 flex-shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-blue-100 text-blue-800 p-3 sm:p-4 rounded-md flex items-start space-x-3">
              <Info className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <p className="text-sm">
                To avoid boarding complications, enter all names and surnames exactly as they appear in your{" "}
                <span className="font-medium">passport/ID</span>.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`given-names-${passenger.id}`}>Given names</Label>
                <Input
                  id={`given-names-${passenger.id}`}
                  placeholder="e.g. Harry James"
                  value={passenger.givenNames}
                  onChange={(e) => handleUpdatePassenger(passenger.id, "givenNames", e.target.value)}
                  aria-invalid={givenNamesInvalid}
                  aria-describedby={givenNamesInvalid ? `given-names-${passenger.id}-error` : undefined}
                  className={cn(givenNamesInvalid && "border-red-500 focus-visible:ring-red-500")}
                />
                {givenNamesInvalid && (
                  <p id={`given-names-${passenger.id}-error`} className="mt-1 text-sm text-red-600">
                    Given names are required
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor={`surnames-${passenger.id}`}>Surnames</Label>
                <Input
                  id={`surnames-${passenger.id}`}
                  placeholder="e.g. Brown"
                  value={passenger.surnames}
                  onChange={(e) => handleUpdatePassenger(passenger.id, "surnames", e.target.value)}
                  aria-invalid={surnamesInvalid}
                  aria-describedby={surnamesInvalid ? `surnames-${passenger.id}-error` : undefined}
                  className={cn(surnamesInvalid && "border-red-500 focus-visible:ring-red-500")}
                />
                {surnamesInvalid && (
                  <p id={`surnames-${passenger.id}-error`} className="mt-1 text-sm text-red-600">
                    Surnames are required
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`nationality-${passenger.id}`}>Nationality</Label>
                <Select
                  value={passenger.nationality}
                  onValueChange={(value) => handleUpdatePassenger(passenger.id, "nationality", value)}
                >
                  <SelectTrigger
                    id={`nationality-${passenger.id}`}
                    aria-invalid={nationalityInvalid}
                    aria-describedby={nationalityInvalid ? `nationality-${passenger.id}-error` : undefined}
                    className={cn(nationalityInvalid && "border-red-500 focus-visible:ring-red-500")}
                  >
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="ca">Canada</SelectItem>
                    <SelectItem value="mx">Mexico</SelectItem>
                    <SelectItem value="pk">Pakistan</SelectItem>
                    <SelectItem value="ae">United Arab Emirates</SelectItem>
                    <SelectItem value="gb">United Kingdom</SelectItem>
                    <SelectItem value="de">Germany</SelectItem>
                    <SelectItem value="fr">France</SelectItem>
                    <SelectItem value="sa">Saudi Arabia</SelectItem>
                  </SelectContent>
                </Select>
                {nationalityInvalid && (
                  <p id={`nationality-${passenger.id}-error`} className="mt-1 text-sm text-red-600">
                    Nationality is required
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor={`gender-${passenger.id}`}>Gender</Label>
                <Select
                  value={passenger.gender}
                  onValueChange={(value) => handleUpdatePassenger(passenger.id, "gender", value)}
                >
                  <SelectTrigger
                    id={`gender-${passenger.id}`}
                    aria-invalid={genderInvalid}
                    aria-describedby={genderInvalid ? `gender-${passenger.id}-error` : undefined}
                    className={cn(genderInvalid && "border-red-500 focus-visible:ring-red-500")}
                  >
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {genderInvalid && (
                  <p id={`gender-${passenger.id}-error`} className="mt-1 text-sm text-red-600">
                    Gender is required
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label>Date of birth</Label>
              <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-2">
                <div>
                  <Select
                    value={passenger.dateOfBirth.day}
                    onValueChange={(value) => updatePassengerDateOfBirth(passenger.id, "day", value)}
                  >
                    <SelectTrigger
                      aria-invalid={dobInvalid}
                      className={cn(dobInvalid && "border-red-500 focus-visible:ring-red-500", "text-xs sm:text-sm")}
                    >
                      <SelectValue placeholder="Day" />
                    </SelectTrigger>
                    <SelectContent>
                      {days.map((day) => (
                        <SelectItem key={day} value={day}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Select
                    value={passenger.dateOfBirth.month}
                    onValueChange={(value) => updatePassengerDateOfBirth(passenger.id, "month", value)}
                  >
                    <SelectTrigger
                      aria-invalid={dobInvalid}
                      className={cn(dobInvalid && "border-red-500 focus-visible:ring-red-500", "text-xs sm:text-sm")}
                    >
                      <SelectValue placeholder="Month" />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((month, index) => (
                        <SelectItem key={month} value={(index + 1).toString().padStart(2, "0")}>
                          <span className="hidden sm:inline">{month}</span>
                          <span className="sm:hidden">{month.slice(0, 3)}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Select
                    value={passenger.dateOfBirth.year}
                    onValueChange={(value) => updatePassengerDateOfBirth(passenger.id, "year", value)}
                  >
                    <SelectTrigger
                      aria-invalid={dobInvalid}
                      className={cn(dobInvalid && "border-red-500 focus-visible:ring-red-500", "text-xs sm:text-sm")}
                    >
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {dobyears.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {dobInvalid && <p className="mt-1 text-sm text-red-600">Date of birth is required</p>}
            </div>

            <div>
              <Label htmlFor={`passport-${passenger.id}`}>Passport number</Label>
              <Input
                id={`passport-${passenger.id}`}
                placeholder="e.g. A12345678"
                value={passenger.passportNumber}
                onChange={(e) => handleUpdatePassenger(passenger.id, "passportNumber", e.target.value)}
                aria-invalid={passportInvalid}
                aria-describedby={passportInvalid ? `passport-${passenger.id}-error` : undefined}
                className={cn(passportInvalid && "border-red-500 focus-visible:ring-red-500")}
              />
              {passportInvalid && (
                <p id={`passport-${passenger.id}-error`} className="mt-1 text-sm text-red-600">
                  Passport number is required
                </p>
              )}
            </div>

            <div>
              <Label>Passport expiration date</Label>
              <div className="flex items-center space-x-2 mt-2">
                <Checkbox
                  id={`no-expiration-${passenger.id}`}
                  checked={passenger.noExpiration}
                  onCheckedChange={(checked) => handleUpdatePassenger(passenger.id, "noExpiration", checked)}
                />
                <Label htmlFor={`no-expiration-${passenger.id}`} className="text-sm">
                  No expiration date
                </Label>
              </div>
              {!passenger.noExpiration && (
                <>
                  <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-2">
                    <div>
                      <Select
                        value={passenger.passportExpiration.day}
                        onValueChange={(value) => updatePassengerPassportExpiration(passenger.id, "day", value)}
                      >
                        <SelectTrigger
                          aria-invalid={passExpInvalid}
                          className={cn(
                            passExpInvalid && "border-red-500 focus-visible:ring-red-500",
                            "text-xs sm:text-sm",
                          )}
                        >
                          <SelectValue placeholder="Day" />
                        </SelectTrigger>
                        <SelectContent>
                          {days.map((day) => (
                            <SelectItem key={day} value={day}>
                              {day}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Select
                        value={passenger.passportExpiration.month}
                        onValueChange={(value) => updatePassengerPassportExpiration(passenger.id, "month", value)}
                      >
                        <SelectTrigger
                          aria-invalid={passExpInvalid}
                          className={cn(
                            passExpInvalid && "border-red-500 focus-visible:ring-red-500",
                            "text-xs sm:text-sm",
                          )}
                        >
                          <SelectValue placeholder="Month" />
                        </SelectTrigger>
                        <SelectContent>
                          {months.map((month, index) => (
                            <SelectItem key={month} value={(index + 1).toString().padStart(2, "0")}>
                              <span className="hidden sm:inline">{month}</span>
                              <span className="sm:hidden">{month.slice(0, 3)}</span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Select
                        value={passenger.passportExpiration.year}
                        onValueChange={(value) => updatePassengerPassportExpiration(passenger.id, "year", value)}
                      >
                        <SelectTrigger
                          aria-invalid={passExpInvalid}
                          className={cn(
                            passExpInvalid && "border-red-500 focus-visible:ring-red-500",
                            "text-xs sm:text-sm",
                          )}
                        >
                          <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent>
                          {pasportyears.map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {passExpInvalid && <p className="mt-1 text-sm text-red-600">Passport expiration date is required</p>}
                </>
              )}
            </div>

            <div>
              <Label>Travel insurance</Label>
              <RadioGroup
                value={passenger.travelInsurance}
                onValueChange={(value: "plus" | "basic" | "none") =>
                  handleUpdatePassenger(passenger.id, "travelInsurance", value)
                }
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="none" id={`insurance-none-${passenger.id}`} />
                  <Label htmlFor={`insurance-none-${passenger.id}`} className="text-sm">
                    No insurance
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="basic" id={`insurance-basic-${passenger.id}`} />
                  <Label htmlFor={`insurance-basic-${passenger.id}`} className="text-sm">
                    Basic insurance (+$14.99)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="plus" id={`insurance-plus-${passenger.id}`} />
                  <Label htmlFor={`insurance-plus-${passenger.id}`} className="text-sm">
                    Plus insurance (+$29.99)
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const displayError = globalError || error

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-24">
        {/* Global validation alert */}
        {displayError && (
          <div className="mb-4">
            <Alert variant="destructive" role="alert" aria-live="assertive">
              <AlertTitle>Incomplete passenger details</AlertTitle>
              <AlertDescription>{displayError}</AlertDescription>
            </Alert>
          </div>
        )}

        {/* Trip Summary Section */}
        {flightOffer && (
          <Card className="shadow-sm mb-6 sm:mb-8">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <CardTitle className="text-lg font-semibold">Trip summary</CardTitle>
                <Button variant="ghost" size="icon" className="self-start sm:self-center">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <Accordion type="multiple" className="w-full space-y-4">
                {flightOffer.slices.map((slice, sliceIndex) => (
                  <AccordionItem key={slice.id} value={slice.id} className="border rounded-lg">
                    <AccordionTrigger className="px-3 sm:px-4 py-3 hover:no-underline">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full mr-4 gap-3 sm:gap-4">
                        <h3 className="font-semibold text-base flex items-center gap-2 self-start">
                          {slice.origin.city_name} <ChevronRight className="h-4 w-4" /> {slice.destination.city_name}
                        </h3>
                        <div className="flex items-center justify-between sm:gap-4 w-full sm:w-auto">
                          <div className="text-center">
                            <div className="font-semibold text-base sm:text-lg">
                              {formatDateTime(slice.segments[0].departing_at).time}
                            </div>
                            <div className="text-xs sm:text-sm text-muted-foreground">
                              {formatDateTime(slice.segments[0].departing_at).date}
                            </div>
                          </div>
                          <div className="flex flex-col items-center px-2">
                            <div className="text-xs sm:text-sm text-muted-foreground">
                              {formatDuration(slice.duration)}
                            </div>
                            <div className="flex items-center gap-1 sm:gap-2 my-1">
                              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-muted-foreground"></div>
                              <div className="w-8 sm:w-16 h-0.5 bg-muted-foreground"></div>
                              <Plane className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                            </div>
                            <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
                              <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-green-500 flex items-center justify-center">
                                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white"></div>
                              </div>
                              {slice.segments[0].operating_carrier.iata_code}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold text-base sm:text-lg">
                              {formatDateTime(slice.segments[slice.segments.length - 1].arriving_at).time}
                            </div>
                            <div className="text-xs sm:text-sm text-muted-foreground">
                              {formatDateTime(slice.segments[slice.segments.length - 1].arriving_at).date}
                            </div>
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-3 sm:px-4 pb-4">
                      <div className="space-y-4">
                        {/* Basic Flight Info */}
                        <div className="flex items-center justify-between text-sm">
                          <div>
                            <div className="font-medium">
                              {slice.origin.city_name} · {slice.origin.iata_code}
                            </div>
                            <div className="text-muted-foreground text-xs sm:text-sm">{slice.origin.name}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">
                              {slice.destination.city_name} · {slice.destination.iata_code}
                            </div>
                            <div className="text-muted-foreground text-xs sm:text-sm">{slice.destination.name}</div>
                          </div>
                        </div>
                        <Separator />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                          <div>
                            <h4 className="font-medium mb-2">Flight Details</h4>
                            <div className="space-y-1 text-muted-foreground text-xs sm:text-sm">
                              <div>
                                Flight: {slice.segments[0].operating_carrier.iata_code}{" "}
                                {slice.segments[0].operating_carrier_flight_number}
                              </div>
                              <div>Aircraft: {slice.segments[0].aircraft?.name || "TBD"}</div>
                              <div>Class: {slice.fare_brand_name}</div>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Services</h4>
                            <div className="flex flex-wrap gap-1 sm:gap-2">
                              {slice.segments[0].passengers[0]?.baggages.map((baggage, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  <Luggage className="h-3 w-3 mr-1" />
                                  {baggage.quantity}x {baggage.type.replace("_", " ")}
                                </Badge>
                              ))}
                              {slice.segments[0].passengers[0]?.cabin.amenities.wifi?.available && (
                                <Badge variant="secondary" className="text-xs">
                                  <Wifi className="h-3 w-3 mr-1" />
                                  WiFi
                                </Badge>
                              )}
                              <Badge variant="secondary" className="text-xs">
                                <Tv className="h-3 w-3 mr-1" />
                                Entertainment
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <Separator />
                        {/* Passenger Info */}
                        <div>
                          <h4 className="font-medium mb-2 text-sm">Passenger Information</h4>
                          {passengers.map((passenger, index) => (
                            <div
                              key={passenger.id}
                              className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mb-1"
                            >
                              <User className="h-4 w-4 flex-shrink-0" />
                              <span className="flex-1 min-w-0">
                                {passenger.givenNames || "Passenger"} {passenger.surnames || index + 1} -{" "}
                                {passenger.type === "adult" ? "Adult" : passenger.type === "child" ? "Child" : "Infant"}
                              </span>
                              <Badge variant="outline" className="text-xs flex-shrink-0">
                                Confirmed
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}

                {/* Stay Duration for round trips */}
                {flightOffer.slices.length > 1 && (
                  <div className="text-center py-2">
                    <span className="text-xs sm:text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
                      Stay in {flightOffer.slices[0].destination.city_name}
                    </span>
                  </div>
                )}
              </Accordion>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column: Passenger Details & Travel Insurance */}
          <div className="xl:col-span-2 space-y-6 lg:space-y-8">
            {/* Passenger Forms */}
            {passengers.map((passenger, index) => renderPassengerForm(passenger, index))}

            {/* Add Another Passenger Button */}
            <Card className="shadow-sm">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-base sm:text-lg">Booking for more passengers?</h3>
                    <p className="text-sm text-muted-foreground">Add additional passengers to your booking</p>
                  </div>
                  <Button
                    onClick={handleAddPassenger}
                    className="bg-[#1479C9] hover:bg-sky-600 text-white w-full sm:w-auto"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add another passenger
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Cabin or carry-on baggage Section */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
                  Cabin or carry-on baggage <Info className="h-4 w-4 text-muted-foreground" />
                </CardTitle>
                <p className="text-sm text-muted-foreground">Select one option:</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <RadioGroup
                  value={baggage.cabinBaggage}
                  onValueChange={handleCabinBaggageChange}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-4"
                >
                  <Label
                    htmlFor="personal-item"
                    className="flex flex-col items-center justify-between p-4 border rounded-md cursor-pointer has-[[data-state=checked]]:border-secondary has-[[data-state=checked]]:ring-2 has-[[data-state=checked]]:ring-secondary min-h-[200px]"
                  >
                    <RadioGroupItem value="personal-item" id="personal-item" className="sr-only" />
                    <div className="flex flex-col items-center text-center space-y-2 flex-1">
                      <p className="font-medium text-sm sm:text-base">1x personal item</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">Must fit under front seat</p>
                      <Image
                        src="/personal-item-bag.jpg"
                        alt="Personal item"
                        width={60}
                        height={60}
                        className="sm:w-20 sm:h-20"
                      />
                      <p className="text-xs text-muted-foreground">40x30x15cm</p>
                    </div>
                    <div className="mt-4">
                      <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs sm:text-sm">
                        Included
                      </Badge>
                    </div>
                  </Label>

                  <Label
                    htmlFor="cabin-bag"
                    className="flex flex-col items-center justify-between p-4 border rounded-md cursor-pointer has-[[data-state=checked]]:border-secondary has-[[data-state=checked]]:ring-2 has-[[data-state=checked]]:ring-secondary min-h-[200px]"
                  >
                    <RadioGroupItem value="cabin-bag" id="cabin-bag" className="sr-only" />
                    <div className="flex flex-col items-center text-center space-y-2 flex-1">
                      <p className="font-medium text-sm sm:text-base">1x cabin bag + 1x personal item</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">Overhead compartment + under seat</p>
                      <Image
                        src="/cabin-bag-suitcase.jpg"
                        alt="Cabin bag"
                        width={60}
                        height={60}
                        className="sm:w-20 sm:h-20"
                      />
                      <p className="text-xs text-muted-foreground">55x40x20cm + 40x30x15cm</p>
                    </div>
                    <div className="mt-4">
                      <Badge variant="outline" className="text-xs sm:text-sm">
                        + $25.00
                      </Badge>
                    </div>
                  </Label>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Checked baggage Section */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
                  Checked baggage <Info className="h-4 w-4 text-muted-foreground" />
                </CardTitle>
                <p className="text-sm text-muted-foreground">Add checked bags to your booking:</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="no-checked-baggage"
                    checked={baggage.noCheckedBaggage}
                    onCheckedChange={handleNoCheckedBaggageChange}
                  />
                  <Label htmlFor="no-checked-baggage" className="text-sm">
                    I don't need checked baggage
                  </Label>
                </div>

                {!baggage.noCheckedBaggage && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="border rounded-md p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm sm:text-base">12kg checked bag</h4>
                            <p className="text-xs sm:text-sm text-muted-foreground">Standard size: 158cm total</p>
                            <p className="text-sm font-semibold text-green-600 mt-1">$35.00 each</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() =>
                                handleCheckedBaggageChange("12kg", Math.max(0, baggage.checkedBaggage12kg - 1))
                              }
                              disabled={baggage.checkedBaggage12kg === 0}
                              className="h-8 w-8"
                            >
                              -
                            </Button>
                            <span className="w-8 text-center text-sm">{baggage.checkedBaggage12kg}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleCheckedBaggageChange("12kg", baggage.checkedBaggage12kg + 1)}
                              className="h-8 w-8"
                            >
                              +
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="border rounded-md p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm sm:text-base">20kg checked bag</h4>
                            <p className="text-xs sm:text-sm text-muted-foreground">Standard size: 158cm total</p>
                            <p className="text-sm font-semibold text-green-600 mt-1">$55.00 each</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() =>
                                handleCheckedBaggageChange("20kg", Math.max(0, baggage.checkedBaggage20kg - 1))
                              }
                              disabled={baggage.checkedBaggage20kg === 0}
                              className="h-8 w-8"
                            >
                              -
                            </Button>
                            <span className="w-8 text-center text-sm">{baggage.checkedBaggage20kg}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleCheckedBaggageChange("20kg", baggage.checkedBaggage20kg + 1)}
                              className="h-8 w-8"
                            >
                              +
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Price Summary */}
          <div className="xl:col-span-1">
            <Card className="shadow-sm sticky top-4">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg font-semibold">Price summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>
                      Flight tickets ({passengers.length} passenger{passengers.length > 1 ? "s" : ""})
                    </span>
                    <span>${flightOffer ? Number.parseFloat(flightOffer.total_amount).toFixed(2) : "0.00"}</span>
                  </div>
                  {baggage.cabinBaggage === "cabin-bag" && (
                    <div className="flex justify-between">
                      <span>Cabin baggage</span>
                      <span>$25.00</span>
                    </div>
                  )}
                  {baggage.checkedBaggage12kg > 0 && (
                    <div className="flex justify-between">
                      <span>12kg checked bag × {baggage.checkedBaggage12kg}</span>
                      <span>${(35 * baggage.checkedBaggage12kg).toFixed(2)}</span>
                    </div>
                  )}
                  {baggage.checkedBaggage20kg > 0 && (
                    <div className="flex justify-between">
                      <span>20kg checked bag × {baggage.checkedBaggage20kg}</span>
                      <span>${(55 * baggage.checkedBaggage20kg).toFixed(2)}</span>
                    </div>
                  )}
                  {passengers.some((p) => p.travelInsurance !== "none") && (
                    <div className="flex justify-between">
                      <span>Travel insurance</span>
                      <span>
                        $
                        {passengers
                          .reduce((total, p) => {
                            if (p.travelInsurance === "plus") return total + 29.99
                            if (p.travelInsurance === "basic") return total + 14.99
                            return total
                          }, 0)
                          .toFixed(2)}
                      </span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-semibold text-base">
                    <span>Total</span>
                    <span>${getTotalPrice().toFixed(2)}</span>
                  </div>
                </div>

                <div className="bg-blue-50 p-3 rounded-md">
                  <div className="flex items-center gap-2 text-blue-800 text-sm">
                    <Check className="h-4 w-4" />
                    <span className="font-medium">Free cancellation</span>
                  </div>
                  <p className="text-xs text-blue-700 mt-1">Cancel within 24 hours for a full refund</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <footer className="sticky bottom-0 w-full bg-white border-t p-3 sm:p-4 flex flex-col sm:flex-row sm:justify-between items-center gap-3 shadow-lg">
        <Button
          variant="outline"
          className="text-muted-foreground border-input hover:bg-accent bg-transparent w-full sm:w-auto order-2 sm:order-1"
        >
          <ChevronLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <Button
          onClick={handleContinue}
          className="bg-[#1479C9] hover:bg-sky-600 text-white font-semibold py-3 w-full sm:w-auto order-1 sm:order-2"
        >
          Continue <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </footer>
    </div>
  )
}
