"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Luggage, Briefcase, ChevronUp, ChevronDown, MapPin, Plane, Plus, Minus, ShieldCheck } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FlightDetailModal } from "../Modal/FlightDetailModel"
type QuantityControlProps = {
    label: string;
    icon: React.ElementType; // or JSX.Element if you're passing an actual element
    count: number;
    setCount: (newCount: number) => void;
};
const SearchResult = () => {
    const [isOpen, setIsOpen] = useState(false);

    const [priceAlertsEnabled, setPriceAlertsEnabled] = useState(false)
    const [cabinBaggage, setCabinBaggage] = useState(0)
    const [checkedBaggage, setCheckedBaggage] = useState(0)
    const [bagsExpanded, setBagsExpanded] = useState(true)
    const [stopsExpanded, setStopsExpanded] = useState(true)
    const [selectedStop, setSelectedStop] = useState("any")
    const [allowOvernight, setAllowOvernight] = useState<boolean | "indeterminate">(false)
    const [selectedTab, setSelectedTab] = useState("best")

    const flightOptions = [
        {
            id: "flight1",
            outbound: {
                date: "Fri, 18 Jul",
                time: "01:40",
                airport: "KHI",
                duration: "2h 15m",
                type: "Direct",
                arrivalTime: "02:55",
                arrivalAirport: "DXB",
            },
            inbound: {
                date: "Thu, 31 Jul",
                time: "20:30",
                airport: "DXB",
                duration: "2h 15m",
                type: "Direct",
                arrivalTime: "23:45",
                arrivalAirport: "KHI",
            },
            nightsInDestination: 13,
            price: 294,
            guaranteeAvailable: true,
            guaranteeAmount: 37,
        },
        {
            id: "flight2",
            outbound: {
                date: "Fri, 18 Jul",
                time: "01:40",
                airport: "KHI",
                duration: "2h 15m",
                type: "Direct",
                arrivalTime: "02:55",
                arrivalAirport: "DXB",
            },
            inbound: {
                date: "Thu, 26 Jul",
                time: "20:30",
                airport: "DXB",
                duration: "2h 15m",
                type: "Direct",
                arrivalTime: "23:45",
                arrivalAirport: "KHI",
            },
            nightsInDestination: 8,
            price: 294,
            guaranteeAvailable: true,
            guaranteeAmount: 37,
        },
    ]

    const QuantityControl: React.FC<QuantityControlProps> = ({ label, icon: Icon, count, setCount }) => (
        <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2">
                <Icon className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium">{label}</span>
            </div>
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="icon"
                    className="w-7 h-7 rounded-full bg-transparent"
                    onClick={() => setCount(Math.max(0, count - 1))}
                >
                    <Minus className="w-4 h-4" />
                </Button>
                <span className="w-5 text-center text-sm font-medium">{count}</span>
                <Button
                    variant="outline"
                    size="icon"
                    className="w-7 h-7 rounded-full bg-transparent"
                    onClick={() => setCount(count + 1)}
                >
                    <Plus className="w-4 h-4" />
                </Button>
            </div>
        </div>
    )

    return (
        <div className="flex min-h-screen bg-gray-100 p-6">
            <div className="w-[280px] pr-6 border-r border-gray-200 bg-white rounded-lg shadow-sm p-4 mr-6">
                <div className="pb-4 border-b border-gray-200 mb-4">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-base font-semibold">Set up price alerts</h2>
                        <Switch
                            id="price-alerts"
                            checked={priceAlertsEnabled}
                            onCheckedChange={setPriceAlertsEnabled}
                            className="data-[state=checked]:bg-blue-500"
                        />
                    </div>
                    <p className="text-sm text-gray-500">Receive alerts when the prices for this route change.</p>
                </div>

                <div className="pb-4 border-b border-gray-200 mb-4">
                    <div
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => setBagsExpanded(!bagsExpanded)}
                    >
                        <h2 className="text-base font-semibold">Bags</h2>
                        {bagsExpanded ? (
                            <ChevronUp className="w-4 h-4 text-gray-500" />
                        ) : (
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                        )}
                    </div>
                    {bagsExpanded && (
                        <div className="mt-2">
                            <QuantityControl label="Cabin baggage" icon={Luggage} count={cabinBaggage} setCount={setCabinBaggage} />
                            <QuantityControl
                                label="Checked baggage"
                                icon={Briefcase}
                                count={checkedBaggage}
                                setCount={setCheckedBaggage}
                            />
                        </div>
                    )}
                </div>

                <div>
                    <div
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => setStopsExpanded(!stopsExpanded)}
                    >
                        <h2 className="text-base font-semibold">Stops</h2>
                        {stopsExpanded ? (
                            <ChevronUp className="w-4 h-4 text-gray-500" />
                        ) : (
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                        )}
                    </div>
                    {stopsExpanded && (
                        <div className="mt-2">
                            <RadioGroup value={selectedStop} onValueChange={setSelectedStop} className="grid gap-2">
                                <Label htmlFor="any" className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                                    <RadioGroupItem value="any" id="any" />
                                    Any
                                </Label>
                                <Label htmlFor="direct" className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                                    <RadioGroupItem value="direct" id="direct" />
                                    Direct
                                </Label>
                                <Label htmlFor="1-stop" className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                                    <RadioGroupItem value="1-stop" id="1-stop" />
                                    Up to 1 stop
                                </Label>
                                <Label htmlFor="2-stops" className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                                    <RadioGroupItem value="2-stops" id="2-stops" />
                                    Up to 2 stops
                                </Label>
                            </RadioGroup>
                            <div className="flex items-center gap-2 mt-4">
                                <Checkbox id="overnight-stopovers" checked={allowOvernight} onCheckedChange={setAllowOvernight} />
                                <Label htmlFor="overnight-stopovers" className="text-sm font-medium cursor-pointer">
                                    Allow overnight stopovers
                                </Label>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex-1 bg-white rounded-lg shadow-sm p-4">
                <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full mb-6">
                    <TabsList className="grid w-full grid-cols-4 h-auto p-0 bg-transparent">
                        <TabsTrigger
                            value="best"
                            className="flex flex-col items-start px-4 py-2 text-left rounded-none border-b-2 border-blue-500 text-blue-600 data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-600"
                        >
                            <span className="font-semibold text-sm">Best</span>
                            <span className="text-xs text-gray-500">${"294 \u2022 4h 30m"}</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="cheapest"
                            className="flex flex-col items-start px-4 py-2 text-left rounded-none border-b-2 border-transparent text-gray-600 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600"
                        >
                            <span className="font-semibold text-sm">Cheapest</span>
                            <span className="text-xs text-gray-500">${"294 \u2022 4h 30m"}</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="fastest"
                            className="flex flex-col items-start px-4 py-2 text-left rounded-none border-b-2 border-transparent text-gray-600 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600"
                        >
                            <span className="font-semibold text-sm">Fastest</span>
                            <span className="text-xs text-gray-500">${"304 \u2022 4h 00m"}</span>
                        </TabsTrigger>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <TabsTrigger
                                    value="other-options"
                                    className="flex flex-col items-start px-4 py-2 text-left rounded-none border-b-2 border-transparent text-gray-600 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600"
                                >
                                    <span className="font-semibold text-sm flex items-center gap-1">
                                        Other options <ChevronDown className="w-3 h-3" />
                                    </span>
                                    <span className="text-xs text-gray-500">Earliest departure</span>
                                </TabsTrigger>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>Earliest departure</DropdownMenuItem>
                                <DropdownMenuItem>Latest departure</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TabsList>
                </Tabs>

                <ScrollArea className="h-[calc(100vh-180px)] pr-4">
                    <div className="grid gap-4">
                        {flightOptions.map((option) => (
                            <Card key={option.id} className="p-4 border border-gray-200 rounded-lg shadow-sm">
                                <div className="grid gap-4">
                                    <div className="flex items-center justify-between text-sm font-semibold text-gray-700">
                                        <span>{option.outbound.date} • Outbound</span>
                                        <MapPin className="w-4 h-4 text-gray-400" />
                                    </div>
                                    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4">
                                        <div className="text-right">
                                            <div className="font-bold text-lg">{option.outbound.time}</div>
                                            <div className="text-sm text-gray-500">{option.outbound.airport}</div>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <div className="text-xs text-gray-500">{option.outbound.duration}</div>
                                            <div className="w-full h-px bg-gray-300 my-1" />
                                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                                <Plane className="w-3 h-3 text-green-600" />
                                                {option.outbound.type}
                                            </div>
                                        </div>
                                        <div className="text-left">
                                            <div className="font-bold text-lg">{option.outbound.arrivalTime}</div>
                                            <div className="text-sm text-gray-500">{option.outbound.arrivalAirport}</div>
                                        </div>
                                    </div>
                                    <div className="text-center text-xs text-gray-500 bg-gray-50 py-1 px-2 rounded-full inline-block mx-auto">
                                        {option.nightsInDestination} nights in Dubai
                                    </div>

                                    <div className="flex items-center justify-between text-sm font-semibold text-gray-700 mt-2">
                                        <span>{option.inbound.date} • Inbound</span>
                                        <MapPin className="w-4 h-4 text-gray-400" />
                                    </div>
                                    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4">
                                        <div className="text-right">
                                            <div className="font-bold text-lg">{option.inbound.time}</div>
                                            <div className="text-sm text-gray-500">{option.inbound.airport}</div>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <div className="text-xs text-gray-500">{option.inbound.duration}</div>
                                            <div className="w-full h-px bg-gray-300 my-1" />
                                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                                <Plane className="w-3 h-3 text-green-600" />
                                                {option.inbound.type}
                                            </div>
                                        </div>
                                        <div className="text-left">
                                            <div className="font-bold text-lg">{option.inbound.arrivalTime}</div>
                                            <div className="text-sm text-gray-500">{option.inbound.arrivalAirport}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                                        <div className="flex flex-col items-start">
                                            {option.guaranteeAvailable && (
                                                <div className="flex items-center gap-1 text-green-600 text-xs font-medium mb-1">
                                                    <ShieldCheck className="w-3 h-3" />
                                                    {`+$${option.guaranteeAmount} Guarantee available`}
                                                </div>
                                            )}
                                            <div className="text-2xl font-bold text-gray-900">${option.price}</div>
                                        </div>
                                        <Button onClick={() => setIsOpen(!isOpen)} className=" bg-[#1479C9] hover:bg-sky-600 text-white font-semibold py-3">Select</Button>
                                        <FlightDetailModal open={isOpen} onOpenChange={setIsOpen} />
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </ScrollArea>
            </div>
        </div>
    )
}
export default SearchResult
