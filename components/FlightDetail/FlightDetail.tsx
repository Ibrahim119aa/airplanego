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
  const [selectedCabinBaggage, setSelectedCabinBaggage] = useState("personal-item")
  const [checkedBaggage12kgQuantity, setCheckedBaggage12kgQuantity] = useState(0)
  const [checkedBaggage20kgQuantity, setCheckedBaggage20kgQuantity] = useState(0)
  const [noCheckedBaggage, setNoCheckedBaggage] = useState(false)
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
        {/* Flight Detail Progress Bar */}
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
        {/* End Flight Detail Progress Bar */}
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
                <div className="bg-blue-100 text-blue-800 p-4 rounded-md flex items-start space-x-3">
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
                      <Image src="/assets/images/baggage1.png" alt="Backpack" width={80} height={80} className="my-4" />
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
                        <Image src="/assets/images/baggage1.png" alt="Backpack" width={60} height={60} />
                        <Image src="/assets/images/baggage1.png" alt="Small Suitcase" width={60} height={60} />
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
                        src="/assets/images/baggage2.png"
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
                          onClick={() => setCheckedBaggage12kgQuantity(Math.max(0, checkedBaggage12kgQuantity - 1))}
                          disabled={noCheckedBaggage || checkedBaggage12kgQuantity === 0}
                        >
                          -
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
                          onClick={() => setCheckedBaggage12kgQuantity(checkedBaggage12kgQuantity + 1)}
                          disabled={noCheckedBaggage}
                        >
                          +
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
                        src="/assets/images/baggage2.png"
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
                          onClick={() => setCheckedBaggage20kgQuantity(Math.max(0, checkedBaggage20kgQuantity - 1))}
                          disabled={noCheckedBaggage || checkedBaggage20kgQuantity === 0}
                        >
                          -
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
                          onClick={() => setCheckedBaggage20kgQuantity(checkedBaggage20kgQuantity + 1)}
                          disabled={noCheckedBaggage}
                        >
                          +
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
            {/* Travel Insurance Section */}
          
            {/* Booking for more passengers */}
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
        <Button className=" bg-[#1479C9] hover:bg-sky-600 text-white font-semibold py-3">
          Continue <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </footer>
    </div>
  )
}
