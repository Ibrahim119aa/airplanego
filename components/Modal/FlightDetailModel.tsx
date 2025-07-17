"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Plane, Clock, ExternalLink, Info, X, Check } from "lucide-react"

interface TripDetailsModalFramerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Sample data for booking options
const options = [
  {
    type: "Standard",
    price: 450,
    features: ["10kg carry-on bag", "Seat selection (standard)", "No change fees", "No cancellation fees"],
    restrictions: ["Changes allowed up to 24 hours before departure", "Cancellation refund as flight credit only"],
  },
  {
    type: "Flex",
    price: 620,
    features: ["20kg checked bag", "Seat selection (any)", "Free changes", "Free cancellations",],
    restrictions: ["Changes allowed up to 24 hours before departure", "Cancellation refund as flight credit only"],

  },
]

export function FlightDetailModal({ open, onOpenChange }: TripDetailsModalFramerProps) {
  // This state is used for the button's onClick, but the modal's open state is controlled by props.
  // It seems like the original code intended to toggle the modal itself, but the prop-based control is more robust.
  // For demonstration, I'll keep the `setIsOpen` call on the button, but it won't directly affect the modal's visibility
  // as `open` is controlled externally.
  const [isOpen, setIsOpen] = useState(false) // This state is not directly controlling the modal's visibility

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
                      <span className="text-2xl font-bold">01:40</span>
                      <div className="text-sm text-muted-foreground">
                        <div>Fri, 18 Jul</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">Karachi • KHI</div>
                      <div className="text-sm text-muted-foreground">Jinnah International</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pl-4">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">2h 15m</span>
                    <Plane className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600">Pakistan International Airlines</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold">02:55</span>
                      <div className="text-sm text-muted-foreground">
                        <div>Fri, 18 Jul</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">Dubai • DXB</div>
                      <div className="text-sm text-muted-foreground">Dubai International</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <Info className="h-4 w-4" />
                    <span>Rooms from $212 by</span>
                    <span className="font-semibold">Booking.com</span>
                    <ExternalLink className="h-3 w-3" />
                  </div>
                </motion.div>
                <div className="text-center py-2">
                  <span className="text-sm font-medium">13 nights in Dubai</span>
                </div>
                <Separator />
                {/* Return Flight */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold flex items-center gap-2">Dubai → Karachi</h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>2h 15m</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold">20:30</span>
                      <div className="text-sm text-muted-foreground">
                        <div>Thu, 31 Jul</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">Dubai • DXB</div>
                      <div className="text-sm text-muted-foreground">Dubai International</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pl-4">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">2h 15m</span>
                    <Plane className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600">Pakistan International Airlines</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold">23:45</span>
                      <div className="text-sm text-muted-foreground">
                        <div>Thu, 31 Jul</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">Karachi • KHI</div>
                      <div className="text-sm text-muted-foreground">Jinnah International</div>
                    </div>
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
                    {options.map((option) => (
                      <div
                        key={option.type}
                        className={`relative overflow-hidden rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${option.type === "Standard"
                            ? "border-gray-200 bg-gradient-to-r from-gray-50 to-white hover:border-gray-300"
                            : "border-blue-200 bg-gradient-to-r from-blue-50 to-white hover:border-blue-300 hover:shadow-blue-100"
                          }`}
                      >
                        {/* Header Section */}
                        <div className="flex items-center justify-between p-4 pb-3">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-3 h-3 rounded-full ${option.type === "Standard" ? "bg-gray-400" : "bg-blue-500"}`}
                            ></div>
                            <span className="font-bold text-lg text-gray-900">{option.type}</span>
                            {option.type === "Flex" && (
                              <span className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
                                Most Popular
                              </span>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-gray-900">${option.price}</div>
                            <div className="text-xs text-gray-500">per person</div>
                          </div>
                        </div>
                        {/* Features Section */}
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
                            className={`w-full h-12 text-base font-semibold rounded-lg transition-all duration-200 ${option.type === "Standard"
                                ? "bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                                : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl"
                              }`}
                            onClick={() => setIsOpen(!isOpen)} // This will toggle the internal isOpen state, not the modal's visibility
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
