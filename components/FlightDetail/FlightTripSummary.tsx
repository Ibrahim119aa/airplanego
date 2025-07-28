"use client"

import { Share2, ChevronRight, Plane, Luggage, Utensils, Wifi, Tv, User } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default function FlightTripSummary() {
  return (
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
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>John Doe - Adult</span>
                    <Badge variant="outline" className="text-xs">
                      Confirmed
                    </Badge>
                  </div>
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
            <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">14 nights in Dubai</span>
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
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>John Doe - Adult</span>
                    <Badge variant="outline" className="text-xs">
                      Confirmed
                    </Badge>
                  </div>
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

                {/* Special Requests */}
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
  )
}
