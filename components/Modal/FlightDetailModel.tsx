"use client"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Plane, Clock, ExternalLink, Info, CheckCircle, Shield, Luggage, CreditCard, X } from "lucide-react"

interface TripDetailsModalFramerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function FlightDetailModal({ open, onOpenChange }: TripDetailsModalFramerProps) {
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
                  <div className="grid gap-4 md:grid-cols-2">
                    {/* Kiwi.com Guarantee */}
                    <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
                      <Card className="relative border-2 border-green-200">
                        <Badge className="absolute -top-2 left-4 bg-green-600 text-white">Best value</Badge>
                        <CardContent className="p-4 pt-6">
                          <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center">
                              <span className="text-white font-bold text-sm">K</span>
                            </div>
                            <div>
                              <h4 className="font-semibold">Kiwi.com Guarantee</h4>
                            </div>
                          </div>
                          <div className="space-y-3 text-sm">
                            <div className="flex items-start gap-2">
                              <CreditCard className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span>Instant Kiwi.com Credit if airline cancels</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span>Automatic check-in</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <Shield className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span>Live Boarding Pass</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <Luggage className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span>Savings on baggage & seating</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>

                    {/* Kiwi.com Basic */}
                    <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
                      <Card className="relative">
                        <Badge className="absolute -top-2 left-4 bg-gray-600 text-white">Starter</Badge>
                        <CardContent className="p-4 pt-6">
                          <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center">
                              <span className="text-white font-bold text-sm">K</span>
                            </div>
                            <div>
                              <h4 className="font-semibold">Kiwi.com Basic</h4>
                            </div>
                          </div>
                          <div className="space-y-3 text-sm">
                            <div className="flex items-start gap-2">
                              <Info className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                              <span>Refunds depend on airline policies</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                              <span>Self check-in</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <Shield className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                              <span>Start simple, build from there</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
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
