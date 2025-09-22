"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import {
  Armchair,
  Award as IdCard,
  CalendarClock,
  Calendar,
  Info,
  Mail,
  Phone,
  ShieldAlert,
  User,
  AlertCircle,
  Check,
  ChevronLeft,
} from "lucide-react"
import { LuggageIcon } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { useBookingStore } from "@/lib/booking-store"
import { useFlightBooking } from "@/hooks/use-flight-booking"
import { formatDuration, formatDateTime } from "@/lib/flight-data"

type BillingType = "personal" | "company"

type CountryOption = {
  code: string
  name: string
  flag: string
}

const countries: CountryOption[] = [
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "PK", name: "Pakistan", flag: "🇵🇰" },
  { code: "AE", name: "United Arab Emirates", flag: "🇦🇪" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "SA", name: "Saudi Arabia", flag: "🇸🇦" },
]

export default function PaymentConfirmation() {
  const router = useRouter()

  const {
    flightOffer,
    passengers,
    baggage,
    seats,
    contactDetails,
    billingDetails,
    getTotalPrice,
    setContactDetails,
    setBillingDetails,
  } = useBookingStore()

  const { processPayment, loading, error } = useFlightBooking()

  const [priceChanged, setPriceChanged] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const [isTripDetailsOpen, setIsTripDetailsOpen] = useState(false)

  // Invoice flow
  const [isBillingDialogOpen, setIsBillingDialogOpen] = useState(false)
  const [invoiceRequested, setInvoiceRequested] = useState(!!billingDetails)

  // Local billing form state
  const [localBillingType, setLocalBillingType] = useState<BillingType>(billingDetails?.type || "personal")
  const [localGivenNames, setLocalGivenNames] = useState(billingDetails?.givenNames || "")
  const [localSurnames, setLocalSurnames] = useState(billingDetails?.surnames || "")
  const [localCompanyName, setLocalCompanyName] = useState(billingDetails?.companyName || "")
  const [localVatId, setLocalVatId] = useState(billingDetails?.vatId || "")
  const [localSelectedCountry, setLocalSelectedCountry] = useState<CountryOption>(
    countries.find((c) => c.code === billingDetails?.country) || countries[0],
  )
  const [localStreetAddress, setLocalStreetAddress] = useState(billingDetails?.streetAddress || "")
  const [localCity, setLocalCity] = useState(billingDetails?.city || "")
  const [localPostalCode, setLocalPostalCode] = useState(billingDetails?.postalCode || "")

  // Contact details state
  const [email, setEmail] = useState(contactDetails.email)
  const [phone, setPhone] = useState(contactDetails.phone)
  const [countryCode, setCountryCode] = useState(contactDetails.countryCode)
  const [smsUpdates, setSmsUpdates] = useState(contactDetails.smsUpdates)

  const currentPrice = getTotalPrice()
  const originalPrice = flightOffer ? Number.parseFloat(flightOffer.total_amount) : 0

  useEffect(() => {
    if (currentPrice !== originalPrice && originalPrice > 0) {
      setPriceChanged(true)
    }
  }, [currentPrice, originalPrice])

  useEffect(() => {
    if (error) {
      setPaymentError(error)
    }
  }, [error])

  const handlePaymentSuccess = () => {
    setPaymentError(null)
    alert("Payment processed successfully!")
    // router.push("/booking-confirmation")
  }

  const handlePaymentError = (message: string) => {
    setPaymentError(message)
  }

  const simulateApiError = () => {
    setPaymentError("API connection failed. Please try again later.")
  }

  const handleCountryChange = (code: string) => {
    const found = countries.find((c) => c.code === code)
    if (found) setLocalSelectedCountry(found)
  }

  const saveBillingDetails = () => {
    const newBillingDetails = {
      type: localBillingType,
      givenNames: localGivenNames,
      surnames: localSurnames,
      companyName: localCompanyName,
      vatId: localVatId,
      country: localSelectedCountry.code,
      streetAddress: localStreetAddress,
      city: localCity,
      postalCode: localPostalCode,
    }

    setBillingDetails(newBillingDetails)
    setInvoiceRequested(true)
    setIsBillingDialogOpen(false)
  }

  const handleContactDetailsChange = () => {
    setContactDetails({
      email,
      phone,
      countryCode,
      smsUpdates,
    })
  }

  const handlePayment = async () => {
    // Update contact details first
    handleContactDetailsChange()

    // Mock payment method - in real app this would come from Stripe/payment provider
    const mockPaymentMethod = {
      type: "card",
      card: {
        number: "4242424242424242",
        exp_month: 12,
        exp_year: 2025,
        cvc: "123",
      },
    }

    const result = await processPayment(mockPaymentMethod)

    if (result) {
      handlePaymentSuccess()
    } else {
      handlePaymentError(result.error || "Payment failed")
    }
  }

  if (!flightOffer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No Flight Selected</h1>
          <p className="text-gray-600 mb-6">Please complete the booking process first.</p>
          <Button onClick={() => router.push("/")} className="bg-[#1479C9] hover:bg-sky-600 text-white">
            Go Back to Booking
          </Button>
        </div>
      </div>
    )
  }

  const displayError = paymentError || error

  return (
    <div className="min-h-screen bg-gray-100 pb-24 sm:pb-20">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          {/* Left Column */}
          <div className="space-y-6 lg:col-span-2 lg:space-y-8">
            {/* Notifications */}
            {priceChanged && (
              <Alert variant="default" className="bg-yellow-100 border-yellow-400 text-yellow-800">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Price Update!</AlertTitle>
                <AlertDescription className="text-sm sm:text-base">
                  {"The ticket price has changed from "}
                  <span className="font-semibold">${originalPrice.toFixed(2)}</span>
                  {" to "}
                  <span className="font-semibold">${currentPrice.toFixed(2)}</span>. Please review before proceeding.
                </AlertDescription>
              </Alert>
            )}

            {displayError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Payment Error</AlertTitle>
                <AlertDescription className="text-sm sm:text-base">
                  {displayError} {"Please check your details or try again. If the issue persists, contact support."}
                </AlertDescription>
              </Alert>
            )}

            {/* Flight Details (Expandable) */}
            <Collapsible open={isTripDetailsOpen} onOpenChange={setIsTripDetailsOpen}>
              <Card>
                <CollapsibleTrigger asChild>
                  <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 cursor-pointer">
                    <Image
                      src="/flight-route-illustration.jpg"
                      alt="Flight route illustration"
                      width={80}
                      height={80}
                      className="rounded-md flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg">
                        {flightOffer.slices[0].origin.city_name} - {flightOffer.slices[0].destination.city_name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {formatDateTime(flightOffer.slices[0].segments[0].departing_at).date}
                        {flightOffer.slices.length > 1 &&
                          ` - ${formatDateTime(flightOffer.slices[1].segments[0].departing_at).date}`}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="w-full sm:w-auto bg-transparent">
                      {isTripDetailsOpen ? "Hide full itinerary" : "View full itinerary"}
                    </Button>
                  </CardContent>
                </CollapsibleTrigger>
                <CollapsibleContent className="px-4 pb-4 sm:px-6 sm:pb-6">
                  <Separator className="my-4" />
                  <div className="space-y-3 sm:space-y-4 text-sm text-gray-700">
                    <h4 className="font-semibold">Detailed Trip Information:</h4>
                    {flightOffer.slices.map((slice, index) => (
                      <div key={slice.id} className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                        <p>
                          <strong>{index === 0 ? "Departure" : "Return Departure"}:</strong> {slice.origin.city_name} (
                          {slice.origin.iata_code}) - {formatDateTime(slice.segments[0].departing_at).date},{" "}
                          {formatDateTime(slice.segments[0].departing_at).time}
                        </p>
                        <p>
                          <strong>{index === 0 ? "Arrival" : "Return Arrival"}:</strong> {slice.destination.city_name} (
                          {slice.destination.iata_code}) -{" "}
                          {formatDateTime(slice.segments[slice.segments.length - 1].arriving_at).date},{" "}
                          {formatDateTime(slice.segments[slice.segments.length - 1].arriving_at).time}
                        </p>
                        <p>
                          <strong>Airline:</strong> {slice.segments[0].operating_carrier.name} (
                          {slice.segments[0].operating_carrier.iata_code}{" "}
                          {slice.segments[0].operating_carrier_flight_number})
                        </p>
                        <p>
                          <strong>Duration:</strong> {formatDuration(slice.duration)}
                        </p>
                      </div>
                    ))}
                    <p className="text-xs text-gray-500">
                      {"*"}Times are local. Flight details are subject to change by the airline.
                    </p>
                  </div>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Passenger Information and Extras */}
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">Passenger information and extras</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                {/* Personal details */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
                  <div className="lg:col-span-2 space-y-2">
                    <h4 className="font-medium text-gray-700">Personal details</h4>
                    <div className="space-y-2">
                      {passengers.map((passenger, index) => (
                        <div key={passenger.id} className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <User className="h-4 w-4 flex-shrink-0" />
                            <span>
                              {passenger.givenNames} {passenger.surnames} - {passenger.gender}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4 flex-shrink-0" />
                            <span>
                              {passenger.dateOfBirth.day}/{passenger.dateOfBirth.month}/{passenger.dateOfBirth.year}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <IdCard className="h-4 w-4 flex-shrink-0" />
                            <span>Passport: {passenger.passportNumber}</span>
                          </div>
                          {!passenger.noExpiration && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <CalendarClock className="h-4 w-4 flex-shrink-0" />
                              <span>
                                Expires: {passenger.passportExpiration.day}/{passenger.passportExpiration.month}/
                                {passenger.passportExpiration.year}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-start lg:justify-end">
                    <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
                      Edit
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Baggage */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
                  <div className="lg:col-span-2 space-y-2">
                    <h4 className="font-medium text-gray-700">Baggage</h4>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <LuggageIcon className="h-4 w-4 flex-shrink-0" />
                        <span>
                          {baggage.cabinBaggage === "cabin-bag"
                            ? "1x Cabin bag + 1x Personal item"
                            : "1x Personal item"}
                        </span>
                      </div>
                      {baggage.checkedBaggage12kg > 0 && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <LuggageIcon className="h-4 w-4 flex-shrink-0" />
                          <span>{baggage.checkedBaggage12kg}x Checked bag 12kg</span>
                        </div>
                      )}
                      {baggage.checkedBaggage20kg > 0 && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <LuggageIcon className="h-4 w-4 flex-shrink-0" />
                          <span>{baggage.checkedBaggage20kg}x Checked bag 20kg</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-start lg:justify-end">
                    <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
                      Edit
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Travel Insurance */}
                {passengers.some((p) => p.travelInsurance !== "none") && (
                  <>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
                      <div className="lg:col-span-2 space-y-2">
                        <h4 className="font-medium text-gray-700">Travel Insurance</h4>
                        <div className="space-y-1">
                          {passengers.map(
                            (passenger, index) =>
                              passenger.travelInsurance !== "none" && (
                                <div key={passenger.id} className="flex items-center gap-2 text-sm text-gray-600">
                                  <ShieldAlert className="h-4 w-4 flex-shrink-0" />
                                  <span>
                                    {passenger.givenNames} {passenger.surnames} - {passenger.travelInsurance} insurance
                                  </span>
                                </div>
                              ),
                          )}
                        </div>
                      </div>
                      <div className="flex justify-start lg:justify-end">
                        <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
                          Edit
                        </Button>
                      </div>
                    </div>
                    <Separator />
                  </>
                )}

                {/* Seating */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
                  <div className="lg:col-span-2 space-y-2">
                    <h4 className="font-medium text-gray-700">Seating</h4>
                    <div className="space-y-1">
                      {seats.length > 0 ? (
                        seats.map((seat) => (
                          <div key={seat.flightId} className="flex items-center gap-2 text-sm text-gray-600">
                            <Armchair className="h-4 w-4 flex-shrink-0" />
                            <span>
                              {seat.seatId ? `Seat ${seat.seatId}` : "Random seat"}
                              {seat.autoAssigned ? " (assigned)" : ""}
                              {seat.flightId === "outbound" ? " (Outbound)" : " (Return)"}
                            </span>
                            <Info className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          </div>
                        ))
                      ) : (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Armchair className="h-4 w-4 flex-shrink-0" />
                          <span>Random seat assignment</span>
                          <Info className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-start lg:justify-end">
                    <Button variant="ghost" size="sm" onClick={() => router.push("/seat-selection")}>
                      Edit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact details */}
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">Contact details</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="youremail@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone
                    </Label>
                    <div className="flex gap-2">
                      <Select value={countryCode} onValueChange={setCountryCode}>
                        <SelectTrigger className="w-20 sm:w-24">
                          <SelectValue placeholder="Code" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="+92">+92</SelectItem>
                          <SelectItem value="+1">+1</SelectItem>
                          <SelectItem value="+44">+44</SelectItem>
                          <SelectItem value="+971">+971</SelectItem>
                          <SelectItem value="+49">+49</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Your phone number"
                        className="flex-1"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <Checkbox id="sms-updates" className="mt-0.5" checked={smsUpdates} onCheckedChange={setSmsUpdates} />
                  <Label htmlFor="sms-updates" className="text-sm leading-relaxed">
                    I want to receive SMS updates about my trip.
                  </Label>
                </div>
              </CardContent>
            </Card>

            {/* Request invoice (opens dialog) */}
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <div className="flex items-center justify-between w-full">
                  <CardTitle className="text-lg sm:text-xl">Invoices</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-3">
                <p className="text-sm text-muted-foreground">
                  Need a formal invoice for your order? Add your billing details and we'll include it with your receipt.
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <Button variant="outline" onClick={() => setIsBillingDialogOpen(true)} className="w-full sm:w-auto">
                    {invoiceRequested ? "Edit billing details" : "Request an invoice"}
                  </Button>
                  {invoiceRequested && (
                    <div className="flex items-center gap-1 text-sm text-green-700">
                      <Check className="h-4 w-4" />
                      <span>Invoice details saved</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Add promo code */}
            <Collapsible className="w-full">
              <Card>
                <CollapsibleTrigger asChild>
                  <CardHeader className="p-4 sm:p-6 flex flex-row items-center justify-between cursor-pointer">
                    <CardTitle className="text-lg sm:text-xl">Add promo code</CardTitle>
                    <Info className="h-5 w-5 text-gray-400" />
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="p-4 sm:p-6 pt-0">
                    <div className="space-y-2">
                      <Input placeholder="Enter promo code" />
                      <Button className="w-full">Apply</Button>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Simulate API error */}
            <Button variant="outline" onClick={simulateApiError} className="w-full bg-transparent">
              Simulate API/Payment Error
            </Button>
          </div>

          {/* Right Column - Summary */}
          <div className="space-y-6 lg:col-span-1 lg:space-y-8">
            <div className="lg:sticky lg:top-4">
              <Card>
                <CardContent className="p-4 sm:p-6 space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Flight tickets ({passengers.length} passenger{passengers.length > 1 ? "s" : ""})
                      </span>
                      <span className="font-medium">${Number.parseFloat(flightOffer.total_amount).toFixed(2)}</span>
                    </div>

                    {baggage.cabinBaggage === "cabin-bag" && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Cabin baggage</span>
                        <span className="font-medium">$25.00</span>
                      </div>
                    )}

                    {baggage.checkedBaggage12kg > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">{baggage.checkedBaggage12kg}x Checked bag 12kg</span>
                        <span className="font-medium">${(35 * baggage.checkedBaggage12kg).toFixed(2)}</span>
                      </div>
                    )}

                    {baggage.checkedBaggage20kg > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">{baggage.checkedBaggage20kg}x Checked bag 20kg</span>
                        <span className="font-medium">${(55 * baggage.checkedBaggage20kg).toFixed(2)}</span>
                      </div>
                    )}

                    {/* Seat costs */}
                    {seats
                      .filter((seat) => seat.seatId && !seat.autoAssigned)
                      .map((seat) => (
                        <div key={seat.flightId} className="flex justify-between">
                          <span className="text-gray-600">
                            Seat {seat.seatId} ({seat.flightId})
                          </span>
                          <span className="font-medium">${seat.price.toFixed(2)}</span>
                        </div>
                      ))}

                    {/* Insurance costs */}
                    {passengers.some((p) => p.travelInsurance !== "none") && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Travel insurance</span>
                        <span className="font-medium">
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
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total (USD)</span>
                    <span>${currentPrice.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {
                      "Includes all taxes, fees, surcharges, and service fees. Service fees are calculated per passenger and are not refundable."
                    }
                  </p>
                  <Button variant="link" className="p-0 h-auto text-sm">
                    View price breakdown
                  </Button>
                </CardContent>
              </Card>

              {/* Compact invoice summary when saved */}
              {invoiceRequested && billingDetails && (
                <Card className="mt-6 lg:mt-8">
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="text-base">Invoice details</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 pt-0 space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Type</span>
                      <span className="font-medium capitalize">{billingDetails.type}</span>
                    </div>
                    {billingDetails.type === "personal" ? (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Name</span>
                        <span className="font-medium text-right">
                          {billingDetails.givenNames} {billingDetails.surnames}
                        </span>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Company</span>
                          <span className="font-medium text-right">{billingDetails.companyName || "-"}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">VAT/Tax ID</span>
                          <span className="font-medium text-right">{billingDetails.vatId || "-"}</span>
                        </div>
                      </>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Country</span>
                      <span className="font-medium">
                        {countries.find((c) => c.code === billingDetails.country)?.flag}{" "}
                        {countries.find((c) => c.code === billingDetails.country)?.name}
                      </span>
                    </div>
                    <div className="flex items-start justify-between">
                      <span className="text-gray-600">Address</span>
                      <span className="font-medium text-right max-w-[60%]">
                        {billingDetails.streetAddress || "-"}
                        {billingDetails.streetAddress ? ", " : ""}
                        {billingDetails.city || ""}
                        {billingDetails.postalCode ? `, ${billingDetails.postalCode}` : ""}
                      </span>
                    </div>
                    <div className="pt-2">
                      <Button
                        variant="outline"
                        className="w-full bg-transparent"
                        onClick={() => setIsBillingDialogOpen(true)}
                      >
                        Edit invoice details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
            <Button
              variant="ghost"
              className="order-2 sm:order-1 w-full sm:w-auto"
              onClick={() => router.push("/seat-selection")}
            >
              <ChevronLeft className="h-4 w-4 mr-2" /> Back
            </Button>
            <div className="order-1 sm:order-2 flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
              {invoiceRequested && (
                <div className="hidden sm:flex items-center gap-2 text-xs text-green-700">
                  <Check className="h-4 w-4" />
                  <span>Invoice will be issued</span>
                </div>
              )}
              <Button
                className="w-full sm:w-auto px-6 sm:px-8 py-2 text-base sm:text-lg font-semibold"
                onClick={handlePayment}
                disabled={loading}
              >
                {loading ? "Processing..." : `Pay $${currentPrice.toFixed(2)} (USD)`}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Billing details dialog */}
      <Dialog open={isBillingDialogOpen} onOpenChange={setIsBillingDialogOpen}>
        <DialogContent
          aria-describedby="billing-dialog-desc"
          className="max-w-2xl max-h-[90vh] overflow-y-auto mx-4 sm:mx-auto"
        >
          <DialogHeader>
            <DialogTitle>Billing details</DialogTitle>
            <DialogDescription id="billing-dialog-desc">
              Use the name and address that match your payment method.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Personal vs Company */}
            <div className="flex flex-wrap items-center gap-6">
              <RadioGroup
                value={localBillingType}
                onValueChange={(v: string) => setLocalBillingType(v as BillingType)}
                className="flex items-center gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem id="personal" value="personal" />
                  <Label htmlFor="personal">Personal</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem id="company" value="company" />
                  <Label htmlFor="company">Company</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Name/company rows */}
            {localBillingType === "personal" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="given-names">Given names</Label>
                  <Input
                    id="given-names"
                    placeholder="John Michael"
                    value={localGivenNames}
                    onChange={(e) => setLocalGivenNames(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="surnames">Surnames</Label>
                  <Input
                    id="surnames"
                    placeholder="Doe"
                    value={localSurnames}
                    onChange={(e) => setLocalSurnames(e.target.value)}
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Company name</Label>
                  <Input
                    id="company-name"
                    placeholder="ABC Corp"
                    value={localCompanyName}
                    onChange={(e) => setLocalCompanyName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vat-id">VAT/Tax ID (optional)</Label>
                  <Input
                    id="vat-id"
                    placeholder="e.g., GB123456789"
                    value={localVatId}
                    onChange={(e) => setLocalVatId(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Country */}
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Select value={localSelectedCountry.code} onValueChange={handleCountryChange}>
                <SelectTrigger id="country" className="w-full">
                  <SelectValue
                    placeholder="Select a country"
                    aria-label={`Selected country ${localSelectedCountry?.name ?? ""}`}
                  >
                    {localSelectedCountry ? (
                      <div className="flex items-center gap-2">
                        <span className="text-lg leading-none">{localSelectedCountry.flag}</span>
                        <span>{localSelectedCountry.name}</span>
                      </div>
                    ) : null}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {countries.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      <div className="flex items-center gap-2">
                        <span className="text-lg leading-none">{c.flag}</span>
                        <span>{c.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Street address */}
            <div className="space-y-2">
              <Label htmlFor="street-address">Street address</Label>
              <Input
                id="street-address"
                placeholder="123 Main St, Apt 4B"
                value={localStreetAddress}
                onChange={(e) => setLocalStreetAddress(e.target.value)}
              />
            </div>

            {/* City + Postal code */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="London"
                  value={localCity}
                  onChange={(e) => setLocalCity(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postal-code">Postal code</Label>
                <Input
                  id="postal-code"
                  placeholder="SW1A 1AA"
                  value={localPostalCode}
                  onChange={(e) => setLocalPostalCode(e.target.value)}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="mt-6 flex-col sm:flex-row gap-2">
            <Button variant="ghost" onClick={() => setIsBillingDialogOpen(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button onClick={saveBillingDetails} className="w-full sm:w-auto">
              Save billing details
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
