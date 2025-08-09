"use client"

import React, { useEffect, useState, Suspense } from "react"
import Image from "next/image"
import {
  Armchair,
  Calendar,
  CheckCircle,
  Info,
  Check,
  Mail,
  Phone,
  ShieldAlert,
  LuggageIcon,
  Ticket,
  User,
  AlertCircle,
} from "lucide-react"
const TopBanner=React.lazy(()=>import("@/components/General/TopBanner"));
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

const CheckoutForm = React.lazy(() => import("@/components/Stripe/StripeCheckoutForm"))

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

  // New: Billing details state
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

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 lg:p-12">
     
<TopBanner/>
      <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Notifications */}
          {priceChanged && (
            <Alert variant="default" className="bg-yellow-100 border-yellow-400 text-yellow-800">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Price Update!</AlertTitle>
              <AlertDescription>
                The ticket price has changed from <span className="font-semibold">${originalPrice.toFixed(2)}</span> to{" "}
                <span className="font-semibold">${currentPrice.toFixed(2)}</span>. Please review before proceeding.
              </AlertDescription>
            </Alert>
          )}
          {paymentError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Payment Error</AlertTitle>
              <AlertDescription>
                {paymentError} Please check your details or try again. If the issue persists, contact support.
              </AlertDescription>
            </Alert>
          )}

          {/* Flight Details (Expandable) */}
          <Collapsible open={isTripDetailsOpen} onOpenChange={setIsTripDetailsOpen}>
            <Card>
              <CollapsibleTrigger asChild>
                <CardContent className="p-6 flex items-center gap-4 cursor-pointer">
                  <Image
                    src="/placeholder.svg?height=80&width=80"
                    alt="Flight route illustration"
                    width={80}
                    height={80}
                    className="rounded-md"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">Karachi - Dubai</h3>
                    <p className="text-sm text-gray-500">Sat, 27 Sep - Thu, 02 Oct</p>
                  </div>
                  <Button variant="outline">{isTripDetailsOpen ? "Hide full itinerary" : "View full itinerary"}</Button>
                </CardContent>
              </CollapsibleTrigger>
              <CollapsibleContent className="px-6 pb-6">
                <Separator className="my-4" />
                <div className="space-y-4 text-sm text-gray-700">
                  <h4 className="font-semibold">Detailed Trip Information:</h4>
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
                  <p className="text-xs text-gray-500">
                    {"*"}Times are local. Flight details are subject to change by the airline.
                  </p>
                </div>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Passenger Information and Extras */}
          <Card>
            <CardHeader>
              <CardTitle>Passenger information and extras</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Personal details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-700">Personal details</h4>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="h-4 w-4" />
                    <span>Ibrahim Memon - male</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>12/03/1990</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span>ibrahim.memon@example.com</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>+92 300 1234567</span>
                  </div>
                </div>
                <div className="flex justify-end md:justify-start">
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Kiwi.com Guarantee */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-700">Kiwi.com Guarantee</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                      <span>Automatic check-in</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                      <span>Disruption Protection</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                      <span>Live Boarding Pass</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                      <span>Premium services</span>
                    </li>
                  </ul>
                </div>
                <div className="flex justify-end md:justify-start">
                  <span className="text-sm text-gray-500">Included</span>
                </div>
              </div>

              <Separator />

              {/* Baggage */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-700">Baggage</h4>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <LuggageIcon className="h-4 w-4" />
                    <span>1x Cabin bag</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <LuggageIcon className="h-4 w-4" />
                    <span>1x Checked bag 20kg</span>
                  </div>
                </div>
                <div className="flex justify-end md:justify-start">
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Ticket type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-700">Ticket type and service package</h4>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Ticket className="h-4 w-4" />
                    <span>1x Standard ticket</span>
                  </div>
                </div>
                <div className="flex justify-end md:justify-start">
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Other extras */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-700">Other extras</h4>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <ShieldAlert className="h-4 w-4" />
                    <span>Disruption Protection</span>
                  </div>
                </div>
                <div className="flex justify-end md:justify-start">
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Seating */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-700">Seating</h4>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Armchair className="h-4 w-4" />
                    <span>1x Random seat (Karachi - Dubai)</span>
                    <Info className="h-4 w-4 text-gray-400" />
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Armchair className="h-4 w-4" />
                    <span>1x Random seat (Dubai - Karachi)</span>
                    <Info className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
                <div className="flex justify-end md:justify-start">
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact details */}
          <Card>
            <CardHeader>
              <CardTitle>Contact details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <SelectTrigger className="w-[100px]">
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
                    <Input id="phone" type="tel" placeholder="Your phone number" />
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="sms-updates" />
                <Label htmlFor="sms-updates">I want to receive SMS updates about my trip.</Label>
              </div>
            </CardContent>
          </Card>

          {/* AirHelp+ */}
          <Card>
            <CardHeader>
              <CardTitle>AirHelp+</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1 space-y-4">
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <span>
                      Flight compensation service: up to {"600 €"} for flight delays, cancellations, and airline
                      overbookings.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <span>
                      Cost reimbursement service: up to {"6,000 €"} for extra costs caused by a delay, including lost
                      baggage and missed reservations (hotels, flights, etc).
                    </span>
                  </li>
                </ul>
                <div className="flex gap-2">
                  <Button variant="outline">Add for $19.99</Button>
                  <Button variant="link" className="text-sm">
                    Learn more
                  </Button>
                </div>
                <p className="text-xs text-gray-500">Final price for all passengers and flights</p>
              </div>
              <Image
                src="/placeholder.svg?height=150&width=150"
                alt="AirHelp illustration"
                width={150}
                height={150}
                className="flex-shrink-0"
              />
            </CardContent>
          </Card>

          {/* Billing details (matches the provided image layout) */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between w-full">
                <CardTitle>Billing details</CardTitle>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Use the name and address that match your payment method.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-1">
                    <Label htmlFor="company-name">Company name</Label>
                    <Input
                      id="company-name"
                      placeholder="ABC Corp"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-1">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              {/* Reference image (optional, collapsed by default) */}
              <Collapsible>
                <CollapsibleTrigger asChild>
                  <Button variant="link" className="px-0 h-auto text-sm">
                    Show reference image
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-2">
                  <Image
                    src="/images/billing-detail.webp"
                    alt="Reference: Billing details layout"
                    width={900}
                    height={560}
                    className="w-full rounded-md border"
                  />
                </CollapsibleContent>
              </Collapsible>
            </CardContent>
          </Card>

          {/* Add promo code */}
          <Collapsible className="w-full">
            <Card>
              <CollapsibleTrigger asChild>
                <CardHeader className="flex flex-row items-center justify-between cursor-pointer">
                  <CardTitle>Add promo code</CardTitle>
                  <Info className="h-5 w-5 text-gray-400" />
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent>
                  <Input placeholder="Enter promo code" />
                  <Button className="mt-2 w-full">Apply</Button>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Pay with Stripe (stubbed) */}
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
        <div className="lg:col-span-1 space-y-8">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-gray-600">1x Adult</span>
                <span className="text-right font-medium">$277.07</span>
                <span className="text-gray-600">1x Cabin baggage</span>
                <span className="text-right font-medium">Included</span>
                <span className="text-gray-600">1x Checked baggage 20 kg</span>
                <span className="text-right font-medium">Included</span>
                <span className="text-gray-600">1x Standard fare</span>
                <span className="text-right font-medium">$78.01</span>
                <span className="text-gray-600">1x Kiwi.com Guarantee</span>
                <span className="text-right font-medium">$1.93</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total (USD)</span>
                <span>${currentPrice.toFixed(2)}</span>
              </div>
              <p className="text-xs text-gray-500">
                Includes all taxes, fees, surcharges, and Kiwi.com service fees. Kiwi.com service fees are calculated
                per passenger and are not refundable.
              </p>
              <Button variant="link" className="p-0 h-auto text-sm">
                View price breakdown
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Fixed Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-between items-center shadow-lg">
        <Button variant="ghost">{"<"} Back</Button>
        <Button className="px-8 py-2 text-lg font-semibold">Pay ${currentPrice.toFixed(2)} (USD)</Button>
      </div>
    </div>
  )
}
