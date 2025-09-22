"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Plane, Clock, ExternalLink, Info, X, Check } from "lucide-react"
import { useRouter } from "next/navigation"

interface FlightDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  flightData?: any // Duffel API flight data structure
}

const generateDynamicOptions = (flightData: any) => {
  if (!flightData) {
    // Fallback to basic options if no flight data
    return [
      {
        type: "Basic",
        price: 250,
        features: ["Carry-on bag included", "Standard seat", "Basic service"],
        restrictions: ["No changes allowed", "No refunds"],
      },
    ]
  }

  const basePrice = flightData.total_amount ? Math.floor(Number.parseFloat(flightData.total_amount)) : 250
  const currency = flightData.total_currency || "EUR"
  const passenger = flightData.passengers?.[0]
  const segment = flightData.slices?.[0]?.segments?.[0]
  const conditions = flightData.conditions || {}
  const sliceConditions = flightData.slices?.[0]?.conditions || {}

  // Extract baggage information
  const baggages = segment?.passengers?.[0]?.baggages || []
  const hasCheckedBag = baggages.some((bag: any) => bag.type === "checked")
  const hasCarryOn = baggages.some((bag: any) => bag.type === "carry_on")

  // Extract cabin amenities
  const amenities = segment?.passengers?.[0]?.cabin?.amenities || {}
  const cabinClass = segment?.passengers?.[0]?.cabin?.marketing_name || "Economy"

  // Extract conditions
  const canRefund = conditions.refund_before_departure?.allowed || false
  const canChange = conditions.change_before_departure?.allowed || false
  const refundPenalty = conditions.refund_before_departure?.penalty_amount
  const changePenalty = conditions.change_before_departure?.penalty_amount

  // Generate basic option based on API data
  const basicFeatures = []
  const basicRestrictions = []

  if (hasCarryOn) basicFeatures.push("Carry-on bag included")
  if (hasCheckedBag) basicFeatures.push("Checked bag included")
  basicFeatures.push(`${cabinClass} cabin`)
  if (amenities.wifi?.available) {
    basicFeatures.push(amenities.wifi.cost === "free" ? "Free WiFi" : "WiFi available (paid)")
  }
  if (amenities.power?.available) basicFeatures.push("Power outlets available")
  if (amenities.seat?.pitch) basicFeatures.push(`${amenities.seat.pitch}" seat pitch`)

  if (!canChange) {
    basicRestrictions.push("No changes allowed")
  } else if (changePenalty) {
    basicRestrictions.push(`Changes allowed with ${currency} ${changePenalty} fee`)
  } else {
    basicRestrictions.push("Changes allowed")
  }

  if (!canRefund) {
    basicRestrictions.push("No refunds")
  } else if (refundPenalty) {
    basicRestrictions.push(`Refunds with ${currency} ${refundPenalty} penalty`)
  } else {
    basicRestrictions.push("Full refunds allowed")
  }

  const options = [
    {
      type: flightData.slices?.[0]?.fare_brand_name || "Basic",
      price: basePrice,
      features: basicFeatures,
      restrictions: basicRestrictions,
    },
  ]

  // Add a premium option with enhanced features
  const premiumFeatures = [...basicFeatures]
  const premiumRestrictions = []

  if (!hasCheckedBag) premiumFeatures.push("Additional checked bag")
  premiumFeatures.push("Priority boarding")
  premiumFeatures.push("Seat selection included")
  premiumFeatures.push("Extra legroom seats available")
  if (amenities.wifi?.cost === "paid") {
    premiumFeatures[premiumFeatures.findIndex((f) => f.includes("WiFi"))] = "Free WiFi included"
  }

  premiumRestrictions.push("Free changes up to 24h before departure")
  if (canRefund) {
    premiumRestrictions.push("Free cancellation with flight credit")
  } else {
    premiumRestrictions.push("Cancellation with minimal fees")
  }

  options.push({
    type: "Flex",
    price: Math.floor(basePrice * 1.4),
    features: premiumFeatures,
    restrictions: premiumRestrictions,
  })

  return options
}

export default function FlightDetailModal({ open, onOpenChange, flightData }: FlightDetailModalProps) {
  const [isOpen, setIsOpen] = useState(false)

  const navigation = useRouter()

  const handleNavigation = (type: string) => {
    setIsOpen((prev) => !prev)
    navigation.push(`/flight/${type}`)
  }

  const formatTime = (timeString: string) => {
    if (!timeString) return "00:00"
    return new Date(timeString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "Date TBD"
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      day: "2-digit",
      month: "short",
    })
  }

  const parseDuration = (duration: string) => {
    if (!duration) return "Duration TBD"
    // Parse ISO 8601 duration format (PT7H58M)
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/)
    if (!match) return duration
    const hours = Number.parseInt(match[1] || "0")
    const minutes = Number.parseInt(match[2] || "0")
    return `${hours}h ${minutes}m`
  }

  const dynamicOptions = generateDynamicOptions(flightData)

  useEffect(() => {
    console.log("this is flight")
    console.log(flightData)
  }, [])

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 bg-black/50 z-50"
          />
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-semibold">Trip details</h2>
                <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)} className="h-8 w-8 p-0">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Outbound Flight */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold">
                        {flightData?.slices?.[0]?.segments?.[0]?.departing_at
                          ? formatTime(flightData.slices[0].segments[0].departing_at)
                          : "00:00"}
                      </span>
                      <div className="text-sm text-muted-foreground">
                        <div>
                          {flightData?.slices?.[0]?.segments?.[0]?.departing_at
                            ? formatDate(flightData.slices[0].segments[0].departing_at)
                            : "Date TBD"}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {flightData?.slices?.[0]?.origin?.iata_code || "LHR"} 
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {flightData?.slices?.[0]?.origin?.name || "Heathrow Airport"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pl-4">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {flightData?.slices?.[0]?.segments?.[0]?.duration
                        ? parseDuration(flightData.slices[0].segments[0].duration)
                        : "Duration TBD"}
                    </span>
                    <Plane className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600">
                      {flightData?.slices?.[0]?.segments?.[0]?.operating_carrier?.name || "Duffel Airways"}{" "}
                      {flightData?.slices?.[0]?.segments?.[0]?.operating_carrier_flight_number || "4992"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold">
                        {flightData?.slices?.[0]?.segments?.[0]?.arriving_at
                          ? formatTime(flightData.slices[0].segments[0].arriving_at)
                          : "02:58"}
                      </span>
                      <div className="text-sm text-muted-foreground">
                        <div>
                          {flightData?.slices?.[0]?.segments?.[0]?.arriving_at
                            ? formatDate(flightData.slices[0].segments[0].arriving_at)
                            : "Date TBD"}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {flightData?.slices?.[0]?.destination?.iata_code || "JFK"} 
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {flightData?.slices?.[0]?.destination?.name || "John F. Kennedy International Airport"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <Info className="h-4 w-4" />
                    <span>Rooms from $212 by</span>
                    <span className="font-semibold">Booking.com</span>
                    <ExternalLink className="h-3 w-3" />
                  </div>
                </motion.div>

                <Separator />
                {/* Booking Options */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-semibold">Choose a booking option</h3>
                  <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                    {dynamicOptions.map((option) => (
                      <div
                        key={option.type}
                        className={`relative overflow-hidden rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                          option.type === "Basic" || option.type === "Standard"
                            ? "border-gray-200 bg-gradient-to-r from-gray-50 to-white hover:border-gray-300"
                            : "border-blue-200 bg-gradient-to-r from-blue-50 to-white hover:border-blue-300 hover:shadow-blue-100"
                        }`}
                      >
                        {/* Header Section */}
                        <div className="flex items-center justify-between p-4 pb-3">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-3 h-3 rounded-full ${option.type === "Basic" || option.type === "Standard" ? "bg-gray-400" : "bg-blue-500"}`}
                            ></div>
                            <span className="font-bold text-lg text-gray-900">{option.type}</span>
                            {option.type === "Flex" && (
                              <span className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
                                Most Popular
                              </span>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-gray-900">
                              {flightData?.total_currency || "EUR"} {option.price}
                            </div>
                            <div className="text-xs text-gray-500">per person</div>
                          </div>
                        </div>
                        {/* Features */}
                        <div className="px-4 pb-4">
                          <div className="grid grid-cols-1 gap-2 mb-4">
                            {option.features.map((feature, index) => (
                              <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                                <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                                  <Check className="w-3 h-3 text-green-600" />
                                </div>
                                <span>{feature}</span>
                              </div>
                            ))}
                          </div>
                          {/* Restrictions */}
                          {option.restrictions.length > 0 && (
                            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                              <div className="text-xs font-medium text-gray-600 mb-1">Important notes:</div>
                              {option.restrictions.map((restriction, index) => (
                                <div key={index} className="text-xs text-gray-500">
                                  • {restriction}
                                </div>
                              ))}
                            </div>
                          )}
                          {/* Action Button */}
                          <Button
                            className={`w-full h-12 text-base font-semibold rounded-lg transition-all duration-200 ${
                              option.type === "Basic" || option.type === "Standard"
                                ? "bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                                : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl"
                            }`}
                            onClick={() => handleNavigation(option.type)}
                          >
                            Select {option.type}
                            {option.type === "Flex" && <span className="ml-2 text-sm opacity-90">→</span>}
                          </Button>
                        </div>
                        {/* Decorative Element for Flex */}
                        {option.type === "Flex" && (
                          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 opacity-10 rounded-bl-full"></div>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
