"use client"

import React, { useEffect, useState, Suspense } from "react"
import Image from "next/image"
import {
  Armchair,
  BadgeIcon as IdCard,
  CalendarClock,
  Calendar,
  CheckCircle,
  Info,
  Mail,
  Phone,
  ShieldAlert,
  Ticket,
  User,
  AlertCircle,
  Check,
} from "lucide-react"
import { LuggageIcon } from "lucide-react"

const TopBanner = React.lazy(() => import("@/components/General/TopBanner"))
const CheckoutForm = React.lazy(() => import("@/components/Stripe/StripeCheckoutForm"))

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

type BillingType = "personal" | "company"

type CountryOption = {
  code: string
  name: string
  flag: string // emoji for light-weight flag display
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
  const originalPrice = 390.01
  const [currentPrice, setCurrentPrice] = useState(originalPrice)
  const [priceChanged, setPriceChanged] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const [isTripDetailsOpen, setIsTripDetailsOpen] = useState(false)

  // Invoice flow
  const [isBillingDialogOpen, setIsBillingDialogOpen] = useState(false)
  const [invoiceRequested, setInvoiceRequested] = useState(false)

  // Billing details state
  const [billingType, setBillingType] = useState<BillingType>("personal")
  const [givenNames, setGivenNames] = useState("Mohammed")
  const [surnames, setSurnames] = useState("Alhamayda")
  const [companyName, setCompanyName] = useState("")
  const [vatId, setVatId] = useState("")
  const [selectedCountry, setSelectedCountry] = useState<CountryOption>(countries[0]) // United Kingdom
  const [streetAddress, setStreetAddress] = useState("")
  const [city, setCity] = useState("")
  const [postalCode, setPostalCode] = useState("")

  useEffect(() => {
    const priceChangeTimer = setTimeout(() => {
      const newPrice = 410.5
      if (newPrice !== originalPrice) {
        setCurrentPrice(newPrice)
        setPriceChanged(true)
      }
    }, 3000)
    return () => clearTimeout(priceChangeTimer)
  }, [])

  const handlePaymentSuccess = () => {
    setPaymentError(null)
    alert("Payment processed successfully!")
  }

  const handlePaymentError = (message: string) => {
    setPaymentError(message)
  }

  const simulateApiError = () => {
    setPaymentError("API connection failed. Please try again later.")
  }

  const handleCountryChange = (code: string) => {
    const found = countries.find((c) => c.code === code)
    if (found) setSelectedCountry(found)
  }

  const saveBillingDetails = () => {
    // Minimal validation could be added here if desired.
    setInvoiceRequested(true)
    setIsBillingDialogOpen(false)
  }

  return (
    <div>
      <div>
        <TopBanner />
      </div>
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

              {paymentError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Payment Error</AlertTitle>
                  <AlertDescription className="text-sm sm:text-base">
                    {paymentError} {"Please check your details or try again. If the issue persists, contact support."}
                  </AlertDescription>
                </Alert>
              )}

              {/* Flight Details (Expandable) */}
              <Collapsible open={isTripDetailsOpen} onOpenChange={setIsTripDetailsOpen}>
                <Card>
                  <CollapsibleTrigger asChild>
                    <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 cursor-pointer">
                      <Image
                        src="/placeholder-qumxa.png"
                        alt="Flight route illustration"
                        width={80}
                        height={80}
                        className="rounded-md flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg">Karachi - Dubai</h3>
                        <p className="text-sm text-gray-500">Sat, 27 Sep - Thu, 02 Oct</p>
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
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                        <p>
                          <strong>Departure:</strong> Karachi (KHI) - 27 Sep, 10:00 AM
                        </p>
                        <p>
                          <strong>Arrival:</strong> Dubai (DXB) - 27 Sep, 01:00 PM
                        </p>
                        <p>
                          <strong>Airline:</strong> Fly Emirates (EK 600)
                        </p>
                        <p>
                          <strong>Return Departure:</strong> Dubai (DXB) - 02 Oct, 03:00 PM
                        </p>
                        <p>
                          <strong>Return Arrival:</strong> Karachi (KHI) - 02 Oct, 06:00 PM
                        </p>
                        <p>
                          <strong>Return Airline:</strong> Fly Emirates (EK 601)
                        </p>
                      </div>
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
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <User className="h-4 w-4 flex-shrink-0" />
                          <span>Ibrahim Memon - male</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4 flex-shrink-0" />
                          <span>12/03/1990</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <IdCard className="h-4 w-4 flex-shrink-0" />
                          <span>Passport Number</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <CalendarClock className="h-4 w-4 flex-shrink-0" />
                          <span>12/3/2025</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-start lg:justify-end">
                      <Button variant="ghost" size="sm">
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
                          <span>1x Cabin bag</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <LuggageIcon className="h-4 w-4 flex-shrink-0" />
                          <span>1x Checked bag 20kg</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-start lg:justify-end">
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  {/* Ticket type */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
                    <div className="lg:col-span-2 space-y-2">
                      <h4 className="font-medium text-gray-700">Ticket type and service package</h4>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Ticket className="h-4 w-4 flex-shrink-0" />
                        <span>1x Standard ticket</span>
                      </div>
                    </div>
                    <div className="flex justify-start lg:justify-end">
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  {/* Other extras */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
                    <div className="lg:col-span-2 space-y-2">
                      <h4 className="font-medium text-gray-700">Other extras</h4>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <ShieldAlert className="h-4 w-4 flex-shrink-0" />
                        <span>Disruption Protection</span>
                      </div>
                    </div>
                    <div className="flex justify-start lg:justify-end">
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  {/* Seating */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
                    <div className="lg:col-span-2 space-y-2">
                      <h4 className="font-medium text-gray-700">Seating</h4>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Armchair className="h-4 w-4 flex-shrink-0" />
                          <span>{"1x Random seat (Karachi - Dubai)"}</span>
                          <Info className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Armchair className="h-4 w-4 flex-shrink-0" />
                          <span>{"1x Random seat (Dubai - Karachi)"}</span>
                          <Info className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-start lg:justify-end">
                      <Button variant="ghost" size="sm">
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
                      <Input id="email" type="email" placeholder="youremail@example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Phone
                      </Label>
                      <div className="flex gap-2">
                        <Select defaultValue="+92">
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
                        <Input id="phone" type="tel" placeholder="Your phone number" className="flex-1" />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Checkbox id="sms-updates" className="mt-0.5" />
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

              {/* Pay with Stripe (stubbed for preview) */}
              <Suspense fallback={<div className="text-sm text-gray-500">Loading payment...</div>}>
                <CheckoutForm
                  amount={currentPrice}
                  currency="usd"
                  onPaymentSuccess={handlePaymentSuccess}
                  onPaymentError={handlePaymentError}
                />
              </Suspense>

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
                        <span className="text-gray-600">1x Adult</span>
                        <span className="font-medium">$277.07</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">1x Cabin baggage</span>
                        <span className="font-medium">Included</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">1x Checked baggage 20 kg</span>
                        <span className="font-medium">Included</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">1x Standard fare</span>
                        <span className="font-medium">$78.01</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">1x Kiwi.com Guarantee</span>
                        <span className="font-medium">$1.93</span>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total (USD)</span>
                      <span>${currentPrice.toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {
                        "Includes all taxes, fees, surcharges, and Kiwi.com service fees. Kiwi.com service fees are calculated per passenger and are not refundable."
                      }
                    </p>
                    <Button variant="link" className="p-0 h-auto text-sm">
                      View price breakdown
                    </Button>
                  </CardContent>
                </Card>

                {/* Compact invoice summary when saved */}
                {invoiceRequested && (
                  <Card className="mt-6 lg:mt-8">
                    <CardHeader className="p-4 sm:p-6">
                      <CardTitle className="text-base">Invoice details</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6 pt-0 space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Type</span>
                        <span className="font-medium capitalize">{billingType}</span>
                      </div>
                      {billingType === "personal" ? (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Name</span>
                          <span className="font-medium text-right">
                            {givenNames} {surnames}
                          </span>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Company</span>
                            <span className="font-medium text-right">{companyName || "-"}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">VAT/Tax ID</span>
                            <span className="font-medium text-right">{vatId || "-"}</span>
                          </div>
                        </>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Country</span>
                        <span className="font-medium">
                          {selectedCountry.flag} {selectedCountry.name}
                        </span>
                      </div>
                      <div className="flex items-start justify-between">
                        <span className="text-gray-600">Address</span>
                        <span className="font-medium text-right max-w-[60%]">
                          {streetAddress || "-"}
                          {streetAddress ? ", " : ""}
                          {city || ""}
                          {postalCode ? `, ${postalCode}` : ""}
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
              <Button variant="ghost" className="order-2 sm:order-1 w-full sm:w-auto">
                {"<"} Back
              </Button>
              <div className="order-1 sm:order-2 flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                {invoiceRequested && (
                  <div className="hidden sm:flex items-center gap-2 text-xs text-green-700">
                    <Check className="h-4 w-4" />
                    <span>Invoice will be issued</span>
                  </div>
                )}
                <Button className="w-full sm:w-auto px-6 sm:px-8 py-2 text-base sm:text-lg font-semibold">
                  Pay ${currentPrice.toFixed(2)} (USD)
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Billing details dialog (hidden until requested) */}
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
                  value={billingType}
                  onValueChange={(v: string) => setBillingType(v as BillingType)}
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
              {billingType === "personal" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="given-names">Given names</Label>
                    <Input
                      id="given-names"
                      placeholder="John Michael"
                      value={givenNames}
                      onChange={(e) => setGivenNames(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="surnames">Surnames</Label>
                    <Input
                      id="surnames"
                      placeholder="Doe"
                      value={surnames}
                      onChange={(e) => setSurnames(e.target.value)}
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
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vat-id">VAT/Tax ID (optional)</Label>
                    <Input
                      id="vat-id"
                      placeholder="e.g., GB123456789"
                      value={vatId}
                      onChange={(e) => setVatId(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Country */}
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select value={selectedCountry.code} onValueChange={handleCountryChange}>
                  <SelectTrigger id="country" className="w-full">
                    <SelectValue
                      placeholder="Select a country"
                      aria-label={`Selected country ${selectedCountry?.name ?? ""}`}
                    >
                      {selectedCountry ? (
                        <div className="flex items-center gap-2">
                          <span className="text-lg leading-none">{selectedCountry.flag}</span>
                          <span>{selectedCountry.name}</span>
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
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                />
              </div>

              {/* City + Postal code */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" placeholder="London" value={city} onChange={(e) => setCity(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postal-code">Postal code</Label>
                  <Input
                    id="postal-code"
                    placeholder="SW1A 1AA"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                  />
                </div>
              </div>

              {/* Optional reference image */}
              <Collapsible>
                <CollapsibleTrigger asChild>
                  <Button variant="link" className="px-0 h-auto text-sm">
                    Show reference image
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-2">
                  <Image
                    src="/billing-details-form.png"
                    alt="Reference: Billing details layout"
                    width={900}
                    height={560}
                    className="w-full rounded-md border"
                  />
                </CollapsibleContent>
              </Collapsible>
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

    </div>

  )
}
