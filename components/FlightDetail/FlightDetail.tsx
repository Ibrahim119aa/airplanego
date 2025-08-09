"use client"

import { useMemo, useRef, useState } from "react"
import {
  Share2,
  ChevronRight,
  Plane,
  Luggage,
  Utensils,
  Wifi,
  Tv,
  User,
  Info,
  Check,
  ChevronLeft,
  X,
  Plus,
} from "lucide-react"
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
import TopBanner from "@/components/General/TopBanner"

interface Passenger {
  id: string
  type: "adult" | "child" | "infant"
  givenNames: string
  surnames: string
  nationality: string
  gender: string
  dateOfBirth: {
    day: string
    month: string
    year: string
  }
  passportNumber: string
  passportExpiration: {
    day: string
    month: string
    year: string
  }
  noExpiration: boolean
  travelInsurance: "plus" | "basic" | "none"
}

export default function FlightBookingForm() {
  const router = useRouter()

  const [selectedCabinBaggage, setSelectedCabinBaggage] = useState("personal-item")
  const [checkedBaggage12kgQuantity, setCheckedBaggage12kgQuantity] = useState(0)
  const [checkedBaggage20kgQuantity, setCheckedBaggage20kgQuantity] = useState(0)
  const [noCheckedBaggage, setNoCheckedBaggage] = useState(false)

  const [passengers, setPassengers] = useState<Passenger[]>([
    {
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
    },
  ])

  // Validation UI state
  const [showErrors, setShowErrors] = useState(false)
  const [globalError, setGlobalError] = useState<string | null>(null)
  const passengerRefs = useRef<Map<string, HTMLDivElement>>(new Map())

  const years = useMemo(() => Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i), [])
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

  const addPassenger = () => {
    const newPassenger: Passenger = {
      id: Date.now().toString(),
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
    setPassengers((prev) => [...prev, newPassenger])
  }

  const removePassenger = (id: string) => {
    setPassengers((prev) => (prev.length > 1 ? prev.filter((p) => p.id !== id) : prev))
  }

  const updatePassenger = (id: string, field: keyof Passenger, value: any) => {
    setPassengers((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)))
  }

  const updatePassengerDateOfBirth = (id: string, field: "day" | "month" | "year", value: string) => {
    setPassengers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, dateOfBirth: { ...p.dateOfBirth, [field]: value } } : p)),
    )
  }

  const updatePassengerPassportExpiration = (id: string, field: "day" | "month" | "year", value: string) => {
    setPassengers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, passportExpiration: { ...p.passportExpiration, [field]: value } } : p)),
    )
  }

  const calculateTotalPrice = () => {
    const basePrice = 276
    const adultCount = passengers.filter((p) => p.type === "adult").length
    const childCount = passengers.filter((p) => p.type === "child").length
    const infantCount = passengers.filter((p) => p.type === "infant").length
    let total = adultCount * basePrice + childCount * basePrice * 0.75 + infantCount * basePrice * 0.1

    passengers.forEach((p) => {
      if (p.travelInsurance === "plus") total += 4.99 * 14 // 14 days
      if (p.travelInsurance === "basic") total += 2.49 * 14 // 14 days
    })

    if (selectedCabinBaggage === "carry-on-bundle") total += 29.64
    total += checkedBaggage12kgQuantity * 37.24
    total += checkedBaggage20kgQuantity * 64.31
    total += 34 // Kiwi.com Guarantee

    return Math.round(total)
  }

  // Validation helpers
  const isEmpty = (v?: string) => !v || v.trim() === ""
  const passengerHasErrors = (p: Passenger) => {
    if (isEmpty(p.givenNames)) return true
    if (isEmpty(p.surnames)) return true
    if (isEmpty(p.nationality)) return true
    if (isEmpty(p.gender)) return true
    if (isEmpty(p.dateOfBirth.day) || isEmpty(p.dateOfBirth.month) || isEmpty(p.dateOfBirth.year)) return true
    if (isEmpty(p.passportNumber)) return true
    if (!p.noExpiration) {
      if (
        isEmpty(p.passportExpiration.day) ||
        isEmpty(p.passportExpiration.month) ||
        isEmpty(p.passportExpiration.year)
      )
        return true
    }
    return false
  }

  const validateAllPassengers = () => {
    const firstInvalid = passengers.find((p) => passengerHasErrors(p))
    const valid = !firstInvalid
    return { valid, firstInvalidId: firstInvalid?.id }
  }

  const scrollToPassenger = (id?: string) => {
    if (!id) return
    const el = passengerRefs.current.get(id)
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  const handleContinue = () => {
    setShowErrors(true)
    const { valid, firstInvalidId } = validateAllPassengers()
    if (!valid) {
      setGlobalError("Please fill in all required passenger details before continuing.")
      scrollToPassenger(firstInvalidId)
      return
    }
    setGlobalError(null)
    router.push("/flight/seat/1")
  }

  const renderPassengerForm = (passenger: Passenger, index: number) => {
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
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">
                {index === 0 ? "Primary passenger" : `Passenger ${index + 1}`}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Select
                  value={passenger.type}
                  onValueChange={(value: "adult" | "child" | "infant") => updatePassenger(passenger.id, "type", value)}
                >
                  <SelectTrigger className="w-[180px]">
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
                    onClick={() => removePassenger(passenger.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-blue-100 text-blue-800 p-4 rounded-md flex items-start space-x-3">
              <Info className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <p className="text-sm">
                To avoid boarding complications, enter all names and surnames exactly as they appear in your{" "}
                <span className="font-medium">passport/ID</span>.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`given-names-${passenger.id}`}>Given names</Label>
                <Input
                  id={`given-names-${passenger.id}`}
                  placeholder="e.g. Harry James"
                  value={passenger.givenNames}
                  onChange={(e) => updatePassenger(passenger.id, "givenNames", e.target.value)}
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
                  onChange={(e) => updatePassenger(passenger.id, "surnames", e.target.value)}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`nationality-${passenger.id}`}>Nationality</Label>
                <Select
                  value={passenger.nationality}
                  onValueChange={(value) => updatePassenger(passenger.id, "nationality", value)}
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
                  onValueChange={(value) => updatePassenger(passenger.id, "gender", value)}
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
              <div className="grid grid-cols-3 gap-2">
                <Select
                  value={passenger.dateOfBirth.day}
                  onValueChange={(value) => updatePassengerDateOfBirth(passenger.id, "day", value)}
                >
                  <SelectTrigger
                    aria-invalid={dobInvalid}
                    aria-describedby={dobInvalid ? `dob-${passenger.id}-error` : undefined}
                    className={cn(dobInvalid && "border-red-500 focus-visible:ring-red-500")}
                  >
                    <SelectValue placeholder="DD" />
                  </SelectTrigger>
                  <SelectContent>
                    {days.map((day) => (
                      <SelectItem key={day} value={day}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={passenger.dateOfBirth.month}
                  onValueChange={(value) => updatePassengerDateOfBirth(passenger.id, "month", value)}
                >
                  <SelectTrigger
                    aria-invalid={dobInvalid}
                    aria-describedby={dobInvalid ? `dob-${passenger.id}-error` : undefined}
                    className={cn(dobInvalid && "border-red-500 focus-visible:ring-red-500")}
                  >
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month, index) => (
                      <SelectItem key={month} value={(index + 1).toString()}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={passenger.dateOfBirth.year}
                  onValueChange={(value) => updatePassengerDateOfBirth(passenger.id, "year", value)}
                >
                  <SelectTrigger
                    aria-invalid={dobInvalid}
                    aria-describedby={dobInvalid ? `dob-${passenger.id}-error` : undefined}
                    className={cn(dobInvalid && "border-red-500 focus-visible:ring-red-500")}
                  >
                    <SelectValue placeholder="YYYY" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {dobInvalid && (
                <p id={`dob-${passenger.id}-error`} className="mt-1 text-sm text-red-600">
                  Date of birth is required
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`passport-id-${passenger.id}`}>Passport or ID number</Label>
                <Input
                  id={`passport-id-${passenger.id}`}
                  placeholder="Passport or ID number"
                  value={passenger.passportNumber}
                  onChange={(e) => updatePassenger(passenger.id, "passportNumber", e.target.value)}
                  aria-invalid={passportInvalid}
                  aria-describedby={passportInvalid ? `passport-${passenger.id}-error` : undefined}
                  className={cn(passportInvalid && "border-red-500 focus-visible:ring-red-500")}
                />
                {passportInvalid && (
                  <p id={`passport-${passenger.id}-error`} className="mt-1 text-sm text-red-600">
                    Passport or ID number is required
                  </p>
                )}
              </div>
              <div>
                <Label>Passport or ID expiration date</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Select
                    disabled={passenger.noExpiration}
                    value={passenger.passportExpiration.day}
                    onValueChange={(value) => updatePassengerPassportExpiration(passenger.id, "day", value)}
                  >
                    <SelectTrigger
                      aria-invalid={passExpInvalid}
                      aria-describedby={passExpInvalid ? `pass-exp-${passenger.id}-error` : undefined}
                      className={cn(passExpInvalid && "border-red-500 focus-visible:ring-red-500")}
                    >
                      <SelectValue placeholder="DD" />
                    </SelectTrigger>
                    <SelectContent>
                      {days.map((day) => (
                        <SelectItem key={day} value={day}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    disabled={passenger.noExpiration}
                    value={passenger.passportExpiration.month}
                    onValueChange={(value) => updatePassengerPassportExpiration(passenger.id, "month", value)}
                  >
                    <SelectTrigger
                      aria-invalid={passExpInvalid}
                      aria-describedby={passExpInvalid ? `pass-exp-${passenger.id}-error` : undefined}
                      className={cn(passExpInvalid && "border-red-500 focus-visible:ring-red-500")}
                    >
                      <SelectValue placeholder="Month" />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((month, index) => (
                        <SelectItem key={month} value={(index + 1).toString()}>
                          {month}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    disabled={passenger.noExpiration}
                    value={passenger.passportExpiration.year}
                    onValueChange={(value) => updatePassengerPassportExpiration(passenger.id, "year", value)}
                  >
                    <SelectTrigger
                      aria-invalid={passExpInvalid}
                      aria-describedby={passExpInvalid ? `pass-exp-${passenger.id}-error` : undefined}
                      className={cn(passExpInvalid && "border-red-500 focus-visible:ring-red-500")}
                    >
                      <SelectValue placeholder="YYYY" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {!passenger.noExpiration && passExpInvalid && (
                  <p id={`pass-exp-${passenger.id}-error`} className="mt-1 text-sm text-red-600">
                    Passport expiration date is required
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id={`no-expiration-${passenger.id}`}
                checked={passenger.noExpiration}
                onCheckedChange={(checked) => updatePassenger(passenger.id, "noExpiration", !!checked)}
              />
              <Label htmlFor={`no-expiration-${passenger.id}`}>No expiration</Label>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12 lg:py-16">
        {/* Top Banner */}
        <TopBanner />

        {/* Global validation alert */}
        {globalError && (
          <div className="mb-4">
            <Alert variant="destructive" role="alert" aria-live="assertive">
              <AlertTitle>Incomplete passenger details</AlertTitle>
              <AlertDescription>{globalError}</AlertDescription>
            </Alert>
          </div>
        )}

        {/* Trip Summary Section */}
        <Card className="shadow-sm mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">Trip summary</CardTitle>
              <Button variant="ghost" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <Accordion type="multiple" className="w-full space-y-4">
              {/* Outbound Flight */}
              <AccordionItem value="outbound" className="border rounded-lg">
                <AccordionTrigger className="px-4 py-3 hover:no-underline">
                  <div className="flex items-center justify-between w-full mr-4">
                    <h3 className="font-semibold text-base flex items-center gap-2">
                      Karachi <ChevronRight className="h-4 w-4" /> Dubai
                    </h3>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="font-semibold text-lg">01:40</div>
                        <div className="text-sm text-muted-foreground">Fri, 19 Sept</div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="text-sm text-muted-foreground">2h 15m</div>
                        <div className="flex items-center gap-2 my-1">
                          <div className="w-2 h-2 rounded-full bg-muted-foreground"></div>
                          <div className="w-16 h-0.5 bg-muted-foreground"></div>
                          <Plane className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          </div>
                          PIA
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-lg">02:55</div>
                        <div className="text-sm text-muted-foreground">Fri, 19 Sept</div>
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="space-y-4">
                    {/* Basic Flight Info */}
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <div className="font-medium">Karachi · KHI</div>
                        <div className="text-muted-foreground">Jinnah International</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">Dubai · DXB</div>
                        <div className="text-muted-foreground">Dubai International</div>
                      </div>
                    </div>
                    <Separator />
                    {/* Flight Details */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <h4 className="font-medium mb-2">Flight Details</h4>
                        <div className="space-y-1 text-muted-foreground">
                          <div>Flight: PK 213</div>
                          <div>Aircraft: Boeing 777-300ER</div>
                          <div>Class: Economy</div>
                          <div>Seat: 24A (Window)</div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Services</h4>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary" className="text-xs">
                            <Luggage className="h-3 w-3 mr-1" />
                            23kg
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            <Utensils className="h-3 w-3 mr-1" />
                            Meal
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            <Wifi className="h-3 w-3 mr-1" />
                            WiFi
                          </Badge>
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
                        <div key={passenger.id} className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                          <User className="h-4 w-4" />
                          <span>
                            {passenger.givenNames || "Passenger"} {passenger.surnames || index + 1} -{" "}
                            {passenger.type === "adult" ? "Adult" : passenger.type === "child" ? "Child" : "Infant"}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            Confirmed
                          </Badge>
                        </div>
                      ))}
                    </div>
                    {/* Baggage Info */}
                    <div>
                      <h4 className="font-medium mb-2 text-sm">Baggage Allowance</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                        <div>
                          <div className="font-medium text-foreground">Carry-on</div>
                          <div>7kg, 55x40x20cm</div>
                        </div>
                        <div>
                          <div className="font-medium text-foreground">Checked</div>
                          <div>23kg, 158cm total</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Stay Duration */}
              <div className="text-center py-2">
                <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
                  14 nights in Dubai
                </span>
              </div>

              {/* Return Flight */}
              <AccordionItem value="return" className="border rounded-lg">
                <AccordionTrigger className="px-4 py-3 hover:no-underline">
                  <div className="flex items-center justify-between w-full mr-4">
                    <h3 className="font-semibold text-base flex items-center gap-2">
                      Dubai <ChevronRight className="h-4 w-4" /> Karachi
                    </h3>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="font-semibold text-lg">20:45</div>
                        <div className="text-sm text-muted-foreground">Fri, 3 Oct</div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="text-sm text-muted-foreground">2h 10m</div>
                        <div className="flex items-center gap-2 my-1">
                          <div className="w-2 h-2 rounded-full bg-muted-foreground"></div>
                          <div className="w-16 h-0.5 bg-muted-foreground"></div>
                          <Plane className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          </div>
                          PIA
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-lg">23:55</div>
                        <div className="text-sm text-muted-foreground">Fri, 3 Oct</div>
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="space-y-4">
                    {/* Basic Flight Info */}
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <div className="font-medium">Dubai · DXB</div>
                        <div className="text-muted-foreground">Dubai International</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">Karachi · KHI</div>
                        <div className="text-muted-foreground">Jinnah International</div>
                      </div>
                    </div>
                    <Separator />
                    {/* Flight Details */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <h4 className="font-medium mb-2">Flight Details</h4>
                        <div className="space-y-1 text-muted-foreground">
                          <div>Flight: PK 214</div>
                          <div>Aircraft: Boeing 777-200LR</div>
                          <div>Class: Economy</div>
                          <div>Seat: 18F (Aisle)</div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Services</h4>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary" className="text-xs">
                            <Luggage className="h-3 w-3 mr-1" />
                            23kg
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            <Utensils className="h-3 w-3 mr-1" />
                            Meal
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            <Wifi className="h-3 w-3 mr-1" />
                            WiFi
                          </Badge>
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
                        <div key={passenger.id} className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                          <User className="h-4 w-4" />
                          <span>
                            {passenger.givenNames || "Passenger"} {passenger.surnames || index + 1} -{" "}
                            {passenger.type === "adult" ? "Adult" : passenger.type === "child" ? "Child" : "Infant"}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            Confirmed
                          </Badge>
                        </div>
                      ))}
                    </div>
                    {/* Baggage Info */}
                    <div>
                      <h4 className="font-medium mb-2 text-sm">Baggage Allowance</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                        <div>
                          <div className="font-medium text-foreground">Carry-on</div>
                          <div>7kg, 55x40x20cm</div>
                        </div>
                        <div>
                          <div className="font-medium text-foreground">Checked</div>
                          <div>23kg, 158cm total</div>
                        </div>
                      </div>
                    </div>

                    {/* Special Requests (static demo) */}
                    <div>
                      <h4 className="font-medium mb-2 text-sm">Special Requests</h4>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-xs">
                          Vegetarian Meal
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Extra Legroom
                        </Badge>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Passenger Details & Travel Insurance */}
          <div className="lg:col-span-2 space-y-8">
            {/* Passenger Forms */}
            {passengers.map((passenger, index) => renderPassengerForm(passenger, index))}

            {/* Add Another Passenger Button */}
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">Booking for more passengers?</h3>
                    <p className="text-sm text-muted-foreground">Add additional passengers to your booking</p>
                  </div>
                  <Button onClick={addPassenger} className="bg-[#1479C9] hover:bg-sky-600 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Add another passenger
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Cabin or carry-on baggage Section */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  Cabin or carry-on baggage <Info className="h-4 w-4 text-muted-foreground" />
                </CardTitle>
                <p className="text-sm text-muted-foreground">Select one option:</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <RadioGroup
                  defaultValue="personal-item"
                  onValueChange={setSelectedCabinBaggage}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <Label
                    htmlFor="personal-item"
                    className="flex flex-col items-center justify-between p-4 border rounded-md cursor-pointer has-[[data-state=checked]]:border-secondary has-[[data-state=checked]]:ring-2 has-[[data-state=checked]]:ring-secondary"
                  >
                    <RadioGroupItem value="personal-item" id="personal-item" className="sr-only" />
                    <div className="flex flex-col items-center text-center space-y-2">
                      <p className="font-medium">1x personal item</p>
                      <p className="text-sm text-muted-foreground">Must fit under front seat</p>
                      <Image
                        src="/placeholder.svg?height=80&width=80"
                        alt="Backpack"
                        width={80}
                        height={80}
                        className="my-4"
                      />
                      <p className="text-sm text-muted-foreground">15 x 30 x 40 cm</p>
                      <div className="flex items-center text-green-600 font-medium mt-2">
                        <Check className="h-4 w-4 mr-1" /> Included
                      </div>
                    </div>
                  </Label>
                  <Label
                    htmlFor="carry-on-bundle"
                    className="relative flex flex-col items-center justify-between p-4 border rounded-md cursor-pointer has-[[data-state=checked]]:border-secondary has-[[data-state=checked]]:ring-2 has-[[data-state=checked]]:ring-secondary"
                  >
                    <RadioGroupItem value="carry-on-bundle" id="carry-on-bundle" className="sr-only" />
                    <span className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                      Popular
                    </span>
                    <div className="flex flex-col items-center text-center space-y-2">
                      <p className="font-medium">Carry-on bundle</p>
                      <p className="text-sm text-muted-foreground">1x personal item (3 kg) + 1x cabin bag (8 kg)</p>
                      <div className="flex items-center justify-center gap-2 my-4">
                        <Image src="/placeholder.svg?height=60&width=60" alt="Backpack" width={60} height={60} />
                        <Image src="/placeholder.svg?height=60&width=60" alt="Small Suitcase" width={60} height={60} />
                      </div>
                      <p className="text-sm text-muted-foreground">15 x 30 x 40 cm 20 x 40 x 55 cm</p>
                      <p className="font-semibold text-lg mt-2">29.64 €</p>
                    </div>
                  </Label>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Checked baggage Section */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  Checked baggage <Info className="h-4 w-4 text-muted-foreground" />
                </CardTitle>
                <p className="text-sm text-muted-foreground">Select one option:</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <RadioGroup
                  defaultValue="none"
                  onValueChange={(value) => setNoCheckedBaggage(value === "none")}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <Label
                    htmlFor="checked-12kg"
                    className="flex flex-col items-center justify-between p-4 border rounded-md cursor-pointer has-[[data-state=checked]]:border-secondary has-[[data-state=checked]]:ring-2 has-[[data-state=checked]]:ring-secondary"
                  >
                    <RadioGroupItem value="checked-12kg" id="checked-12kg" className="sr-only" />
                    <div className="flex flex-col items-center text-center space-y-2">
                      <p className="font-medium">12 kg</p>
                      <Image
                        src="/placeholder.svg?height=100&width=100"
                        alt="Large Suitcase"
                        width={100}
                        height={100}
                        className="my-4"
                      />
                      <p className="text-sm text-muted-foreground">28 x 52 x 78 cm</p>
                      <p className="font-semibold text-lg mt-2">37.24 €</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="w-8 h-8 bg-transparent"
                          onClick={() => setCheckedBaggage12kgQuantity((q) => Math.max(0, q - 1))}
                          disabled={noCheckedBaggage || checkedBaggage12kgQuantity === 0}
                        >
                          {"-"}
                        </Button>
                        <Input
                          type="number"
                          value={checkedBaggage12kgQuantity}
                          onChange={(e) => setCheckedBaggage12kgQuantity(Number(e.target.value))}
                          className="w-16 text-center"
                          disabled={noCheckedBaggage}
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          className="w-8 h-8 bg-transparent"
                          onClick={() => setCheckedBaggage12kgQuantity((q) => q + 1)}
                          disabled={noCheckedBaggage}
                        >
                          {"+"}
                        </Button>
                      </div>
                    </div>
                  </Label>
                  <Label
                    htmlFor="checked-20kg"
                    className="flex flex-col items-center justify-between p-4 border rounded-md cursor-pointer has-[[data-state=checked]]:border-secondary has-[[data-state=checked]]:ring-2 has-[[data-state=checked]]:ring-secondary"
                  >
                    <RadioGroupItem value="checked-20kg" id="checked-20kg" className="sr-only" />
                    <div className="flex flex-col items-center text-center space-y-2">
                      <p className="font-medium">20 kg</p>
                      <Image
                        src="/placeholder.svg?height=100&width=100"
                        alt="Large Suitcase"
                        width={100}
                        height={100}
                        className="my-4"
                      />
                      <p className="text-sm text-muted-foreground">28 x 52 x 78 cm</p>
                      <p className="font-semibold text-lg mt-2">64.31 €</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="w-8 h-8 bg-transparent"
                          onClick={() => setCheckedBaggage20kgQuantity((q) => Math.max(0, q - 1))}
                          disabled={noCheckedBaggage || checkedBaggage20kgQuantity === 0}
                        >
                          {"-"}
                        </Button>
                        <Input
                          type="number"
                          value={checkedBaggage20kgQuantity}
                          onChange={(e) => setCheckedBaggage20kgQuantity(Number(e.target.value))}
                          className="w-16 text-center"
                          disabled={noCheckedBaggage}
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          className="w-8 h-8 bg-transparent"
                          onClick={() => setCheckedBaggage20kgQuantity((q) => q + 1)}
                          disabled={noCheckedBaggage}
                        >
                          {"+"}
                        </Button>
                      </div>
                    </div>
                  </Label>
                </RadioGroup>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="no-checked-baggage"
                    checked={noCheckedBaggage}
                    onCheckedChange={(checked) => {
                      setNoCheckedBaggage(!!checked)
                      if (checked) {
                        setCheckedBaggage12kgQuantity(0)
                        setCheckedBaggage20kgQuantity(0)
                      }
                    }}
                  />
                  <Label htmlFor="no-checked-baggage">I don&apos;t need checked baggage</Label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Price Summary */}
          <div className="lg:col-span-1 space-y-8">
            <Card className="shadow-sm">
              <CardContent className="p-6 space-y-4">
                {passengers.map((passenger) => (
                  <div key={passenger.id} className="flex justify-between items-center text-sm">
                    <span>
                      1x {passenger.type === "adult" ? "Adult" : passenger.type === "child" ? "Child" : "Infant"}
                    </span>
                    <span>${passenger.type === "adult" ? "276" : passenger.type === "child" ? "207" : "28"}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center text-sm">
                  <span>1x Cabin baggage</span>
                  <span>Included</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>1x Checked baggage 20 kg</span>
                  <span>Included</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>1x Saver fare</span>
                  <span>Included</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>1x Kiwi.com Guarantee</span>
                  <span>$34</span>
                </div>
                <div className="border-t pt-4 flex justify-between items-center font-bold text-lg">
                  <span>Total (USD)</span>
                  <span>${calculateTotalPrice()}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Includes all taxes, fees, surcharges, and Kiwi.com service fees. Kiwi.com service fees are calculated
                  per passenger and are not refundable.
                </p>
                <a href="#" className="text-secondary text-sm hover:underline block">
                  View price breakdown
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Sticky Footer */}
      <footer className="sticky bottom-0 w-full bg-white border-t p-4 flex justify-between items-center shadow-lg">
        <Button variant="outline" className="text-muted-foreground border-input hover:bg-accent bg-transparent">
          <ChevronLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <Button onClick={handleContinue} className="bg-[#1479C9] hover:bg-sky-600 text-white font-semibold py-3">
          Continue <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </footer>
    </div>
  )
}
