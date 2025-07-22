"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Info, Check, Lock, Luggage, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"

export default function FlightBookingForm() {
    const [noExpiration, setNoExpiration] = useState(false)

    const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i)
    const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, "0"))
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

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <main className="flex-1 container mx-auto px-4 py-8 md:py-12 lg:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Passenger Details & Travel Insurance */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Primary Passenger Section */}
                        <Card className="shadow-sm">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg font-semibold">Primary passenger</CardTitle>
                                    <Select defaultValue="adult">
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="adult">Adult (over 12 years)</SelectItem>
                                            <SelectItem value="child">Child (2-12 years)</SelectItem>
                                            <SelectItem value="infant">Infant (under 2 years)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="bg-info text-info-foreground p-4 rounded-md flex items-start space-x-3">
                                    <Info className="h-5 w-5 mt-0.5 flex-shrink-0" />
                                    <p className="text-sm">
                                        To avoid boarding complications, enter all names and surnames exactly as they appear in your
                                        <span className="font-medium"> passport/ID</span>.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="given-names">Given names</Label>
                                        <Input id="given-names" placeholder="e.g. Harry James" />
                                    </div>
                                    <div>
                                        <Label htmlFor="surnames">Surnames</Label>
                                        <Input id="surnames" placeholder="e.g. Brown" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="nationality">Nationality</Label>
                                        <Select>
                                            <SelectTrigger id="nationality">
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="us">United States</SelectItem>
                                                <SelectItem value="ca">Canada</SelectItem>
                                                <SelectItem value="mx">Mexico</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label htmlFor="gender">Gender</Label>
                                        <Select>
                                            <SelectTrigger id="gender">
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="male">Male</SelectItem>
                                                <SelectItem value="female">Female</SelectItem>
                                                <SelectItem value="other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div>
                                    <Label>Date of birth</Label>
                                    <div className="grid grid-cols-3 gap-2">
                                        <Select>
                                            <SelectTrigger>
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
                                        <Select>
                                            <SelectTrigger>
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
                                        <Select>
                                            <SelectTrigger>
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
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="passport-id">Passport or ID number</Label>
                                        <Input id="passport-id" placeholder="Passport or ID number" />
                                    </div>
                                    <div>
                                        <Label>Passport or ID expiration date</Label>
                                        <div className="grid grid-cols-3 gap-2">
                                            <Select disabled={noExpiration}>
                                                <SelectTrigger>
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
                                            <Select disabled={noExpiration}>
                                                <SelectTrigger>
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
                                            <Select disabled={noExpiration}>
                                                <SelectTrigger>
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
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="no-expiration"
                                        checked={noExpiration}
                                        onCheckedChange={(checked) => setNoExpiration(!!checked)}
                                    />
                                    <Label htmlFor="no-expiration">No expiration</Label>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Travel Insurance Section */}
                        <Card className="shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold">Travel insurance</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="bg-info text-info-foreground p-4 rounded-md flex items-start space-x-3">
                                    <Info className="h-5 w-5 mt-0.5 flex-shrink-0" />
                                    <p className="text-sm">Applies to COVID-19 and related treatment.</p>
                                </div>
                                <div className="text-sm text-right">
                                    <a href="#" className="text-secondary hover:underline flex items-center justify-end">
                                        <Info className="h-4 w-4 mr-1" /> Comparison and terms
                                    </a>
                                </div>

                                <RadioGroup defaultValue="travel-basic" className="space-y-4">
                                    <Label
                                        htmlFor="travel-plus"
                                        className="flex items-center justify-between p-4 border rounded-md cursor-pointer has-[[data-state=checked]]:border-secondary has-[[data-state=checked]]:ring-2 has-[[data-state=checked]]:ring-secondary"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <RadioGroupItem value="travel-plus" id="travel-plus" />
                                            <div>
                                                <p className="font-medium">Travel Plus</p>
                                                <p className="text-sm text-primary">+ $5.03 per day</p>
                                            </div>
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            <Check className="h-4 w-4 inline-block mr-1 text-green-500" /> 7 benefits
                                        </div>
                                    </Label>
                                    <Label
                                        htmlFor="travel-basic"
                                        className="flex items-center justify-between p-4 border rounded-md cursor-pointer has-[[data-state=checked]]:border-secondary has-[[data-state=checked]]:ring-2 has-[[data-state=checked]]:ring-secondary"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <RadioGroupItem value="travel-basic" id="travel-basic" />
                                            <div>
                                                <p className="font-medium">Travel Basic</p>
                                                <p className="text-sm text-primary">+ $2.51 per day</p>
                                            </div>
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            <Check className="h-4 w-4 inline-block mr-1 text-green-500" /> 3 benefits
                                        </div>
                                    </Label>
                                    <Label
                                        htmlFor="no-insurance"
                                        className="flex items-center justify-between p-4 border rounded-md cursor-pointer has-[[data-state=checked]]:border-secondary has-[[data-state=checked]]:ring-2 has-[[data-state=checked]]:ring-secondary"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <RadioGroupItem value="no-insurance" id="no-insurance" />
                                            <p className="font-medium">No insurance</p>
                                        </div>
                                    </Label>
                                </RadioGroup>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                                    <ul className="space-y-2">
                                        <li className="flex items-center">
                                            <Check className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" /> Medical expenses (including
                                            COVID-19)
                                        </li>
                                        <li className="flex items-center">
                                            <Check className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" /> Trip cancellation due to your
                                            illness (incl. COVID-19), accident, death
                                        </li>
                                        <li className="flex items-center">
                                            <Check className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" /> Assistance services
                                        </li>
                                        <li className="flex items-center">
                                            <Check className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" /> Lost baggage
                                        </li>
                                        <li className="flex items-center">
                                            <Check className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" /> Air travel insurance
                                        </li>
                                        <li className="flex items-center">
                                            <Check className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" /> Liability
                                        </li>
                                    </ul>
                                    <ul className="space-y-2">
                                        <li className="flex items-center">
                                            <Check className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" /> Medical expenses (including
                                            COVID-19)
                                        </li>
                                        <li className="flex items-center">
                                            <Check className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" /> Trip cancellation due to your
                                            illness (incl. COVID-19), accident, death
                                        </li>
                                        <li className="flex items-center">
                                            <Check className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" /> Assistance services
                                        </li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Booking for more passengers */}
                        <div className="flex items-center justify-between pt-4">
                            <h2 className="text-lg font-semibold">Booking for more passengers?</h2>
                            <Button
                                variant="outline"
                                className="text-secondary border-secondary hover:bg-secondary/10 bg-transparent"
                            >
                                Add another passenger
                            </Button>
                        </div>
                    </div>

                    {/* Right Column: Price Summary & Lock Price */}
                    <div className="lg:col-span-1 space-y-8">
                        {/* Price Summary */}
                        <Card className="shadow-sm">
                            <CardContent className="p-6 space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span>1x Adult</span>
                                    <span>$276</span>
                                </div>
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
                                    <span>$310</span>
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

                        {/* Need more time to decide? */}
                        <Card className="shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold">Need more time to decide?</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4 text-center">
                                <Image
                                    src="/placeholder.svg?height=80&width=80"
                                    alt="Lock and money bags"
                                    width={80}
                                    height={80}
                                    className="mx-auto"
                                />
                                <p className="text-sm text-muted-foreground">
                                    We&apos;ll hold this ticket price for 3 days and you pay the locked price of{" "}
                                    <span className="font-semibold text-foreground">$310</span> when ready to finish your booking.
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    If the price goes down, you&apos;ll pay the new, lower price.
                                </p>
                                <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90">
                                    <Lock className="h-4 w-4 mr-2" /> Lock price for $31.12
                                </Button>
                                <div className="flex items-center justify-center text-xs text-muted-foreground">
                                    <Luggage className="h-4 w-4 mr-1" /> Baggage won&apos;t be locked
                                </div>
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
                <Button className=" bg-[#1479C9] hover:bg-sky-600 text-white font-semibold py-3" >
                    Continue <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
            </footer>
        </div>
    )
}
