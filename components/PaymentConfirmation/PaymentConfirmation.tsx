"use client"
import React from "react"
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
    ShieldCheck,
    LuggageIcon,
    Ticket,
    User,
    AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useState, useEffect } from "react"
const CheckoutForm = React.lazy(() => import("@/components/Stripe/StripeCheckoutForm"));


export default function PaymentConfirmation() {
    const originalPrice = 390.01
    const [currentPrice, setCurrentPrice] = useState(originalPrice)
    const [priceChanged, setPriceChanged] = useState(false)
    const [paymentError, setPaymentError] = useState<string | null>(null)
    const [needsInvoice, setNeedsInvoice] = useState(false)
    const [isTripDetailsOpen, setIsTripDetailsOpen] = useState(false)

    useEffect(() => {
        // Simulate a price change after a delay
        const priceChangeTimer = setTimeout(() => {
            const newPrice = 410.5 // Example new price
            if (newPrice !== originalPrice) {
                setCurrentPrice(newPrice)
                setPriceChanged(true)
            }
        }, 3000) // Price changes after 3 seconds

        return () => clearTimeout(priceChangeTimer)
    }, [])

    const handlePaymentSuccess = () => {
        setPaymentError(null)
        alert("Payment processed successfully!")
        // In a real app, you would navigate to a success page or show a confirmation.
    }

    const handlePaymentError = (message: string) => {
        setPaymentError(message)
    }

    // Simulate an API error for demonstration
    const simulateApiError = () => {
        setPaymentError("API connection failed. Please try again later.")
    }

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-8 lg:p-12">
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
            <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Main Content */}

                <div className="lg:col-span-2 space-y-8">
                    {/* Overview & Payment Header */}


                    {/* Price Change Notification */}
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

                    {/* Payment Error Alert */}
                    {paymentError && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Payment Error</AlertTitle>
                            <AlertDescription>
                                {paymentError} Please check your details or try again. If the issue persists, contact support.
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Flight Details Card (Expandable) */}
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
                                        *Times are local. Flight details are subject to change by the airline.
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
                                            <CheckCircle className="h-4 w-4 #1479C9flex-shrink-0 mt-0.5" />
                                            <span>Automatic check-in</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-4 w-4 #1479C9flex-shrink-0 mt-0.5" />
                                            <span>Disruption Protection</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-4 w-4 #1479C9flex-shrink-0 mt-0.5" />
                                            <span>Live Boarding Pass</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-4 w-4 #1479C9flex-shrink-0 mt-0.5" />
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
                            {/* Travel insurance */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                                <div className="space-y-2">
                                    <h4 className="font-medium text-gray-700">Travel insurance</h4>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <ShieldCheck className="h-4 w-4" />
                                        <span>No travel insurance</span>
                                    </div>
                                </div>
                                <div className="flex justify-end md:justify-start">
                                    <Button variant="ghost" size="sm">
                                        Edit
                                    </Button>
                                </div>
                            </div>
                            <Separator />
                            {/* Ticket type and service package */}
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
                                                <SelectItem value="+86">+86</SelectItem>
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
                                        <CheckCircle className="h-5 w-5 #1479C9flex-shrink-0 mt-0.5" />
                                        <span>
                                            Flight compensation service: up to {"600 €"} for flight delays, cancellations, and airline
                                            overbookings.
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="h-5 w-5 #1479C9 flex-shrink-0 mt-0.5" />
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

                    {/* Billing details (with optional invoice) */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Billing details</CardTitle>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="needs-invoice"
                                    checked={needsInvoice}
                                    onCheckedChange={(checked) => setNeedsInvoice(!!checked)}
                                />
                                <Label htmlFor="needs-invoice">I need an invoice for this purchase.</Label>
                            </div>
                        </CardHeader>
                        {needsInvoice && (
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="invoice-name">Full Name or Company Name</Label>
                                    <Input id="invoice-name" placeholder="John Doe or ABC Corp" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="billing-address">Billing Address</Label>
                                    <Input id="billing-address" placeholder="123 Main St, City, Country" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="vat-tax-id">VAT/Tax ID (optional)</Label>
                                    <Input id="vat-tax-id" placeholder="e.g., GB123456789" />
                                </div>
                            </CardContent>
                        )}
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
                                    <Button className="mt-2 w-full bg-primary hover:bg-primary/90 text-white">Apply</Button>
                                </CardContent>
                            </CollapsibleContent>
                        </Card>
                    </Collapsible>

                    {/* Pay with Stripe */}
                    <CheckoutForm
                        amount={currentPrice}
                        currency="usd"
                        onPaymentSuccess={handlePaymentSuccess}
                        onPaymentError={handlePaymentError}
                    />
                    {/* Button to simulate API error for testing */}
                    <Button variant="outline" onClick={simulateApiError} className="w-full bg-transparent">
                        Simulate API/Payment Error
                    </Button>
                </div>

                {/* Right Column - Summary */}
                <div className="lg:col-span-1 space-y-8">
                    {/* Price Breakdown */}
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

                    {/* Need more time to decide? */}

                </div>
            </div>
            {/* Fixed Footer */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-between items-center shadow-lg">
                <Button variant="ghost">{"<"} Back</Button>
                <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-2 text-lg font-semibold">
                    Pay ${currentPrice.toFixed(2)} (USD)
                </Button>
            </div>
        </div>
    )
}
