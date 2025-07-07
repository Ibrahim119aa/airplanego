import { useState } from "react"
import { Combobox } from '@headlessui/react';
import { ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { User, Calendar, X, ChevronRight, ChevronLeft, ArrowLeftRight, Plus, Luggage } from "lucide-react"

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
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


const pricingData = {
    1: 219,
    2: 219,
    3: 219,
    4: 215,
    5: 208,
    6: 208,
    7: 219,
    8: 219,
    9: 219,
    10: 215,
    11: 208,
    12: 208,
    13: 208,
    14: 206,
    15: 206,
    16: 207,
    17: 207,
    18: 211,
    19: 211,
    20: 208,
    21: 207,
    22: 207,
    23: 207,
    24: 206,
    25: 211,
    26: 211,
    27: 211,
    28: 207,
    29: 207,
    30: 207,
    31: 207,
}
const Banner = () => {
    const [fromLocation, setFromLocation] = useState("Karachi")
    const [toLocation, setToLocation] = useState("Dubai")

    const [showCalender, setShowCalender] = useState<boolean>(false);

    const [startDate, setStartDate] = useState<number | null>(null);
    const [endDate, setEndDate] = useState<number | null>(null);
    const [selectingStart, setSelectingStart] = useState(true);


    const [currentMonth, setCurrentMonth] = useState(6) // July (0-indexed)
    const [currentYear, setCurrentYear] = useState(2025)
    const [selectedDays, setSelectedDays] = useState<number | null>(null)

    const today = 6

    const getDaysInMonth = (month: number, year: number) => {
        return new Date(year, month + 1, 0).getDate()
    }

    const getFirstDayOfMonth = (month: number, year: number) => {
        const firstDay = new Date(year, month, 1).getDay()
        return firstDay === 0 ? 6 : firstDay - 1 // Convert Sunday (0) to be last (6)
    }

    const formatSelectedDate = () => {
        if (!startDate && !endDate) return "";
        if (startDate && !endDate) return `${months[currentMonth]} ${startDate}`;
        if (startDate && endDate)
            return `${months[currentMonth]} ${startDate} - ${months[currentMonth]} ${endDate}`;
        return "";
    };
    const handleDateClick = (day: number) => {
        if (selectingStart || (!startDate && !endDate)) {
            setStartDate(day);
            setEndDate(null);
            setSelectingStart(false);
        } else {
            if (day < (startDate ?? 0)) {
                // If user selects an earlier day than start, start over
                setStartDate(day);
                setEndDate(null);
                setSelectingStart(false);
            } else {
                setEndDate(day);
                setShowCalender(false); // Optionally close calendar
                setSelectingStart(true);
            }
        }
    };


    const getPriceColor = (price: number) => {
        if (price <= 206) return "text-green-600"
        if (price <= 208) return "text-blue-600"
        return "text-gray-600"
    }

    const renderCalendarDays = () => {
        const daysInMonth = getDaysInMonth(currentMonth, currentYear);
        const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
        const days = [];

        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-16"></div>);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const price = pricingData[day as keyof typeof pricingData];
            const isSelected = day === startDate || day === endDate;
            const inRange =
                startDate && endDate && day > startDate && day < endDate;

            days.push(
                <div
                    key={day}
                    className={`h-16 flex flex-col items-center justify-center cursor-pointer rounded-lg transition-colors relative
        ${isSelected ? "bg-blue-500 text-white" : inRange ? "bg-blue-100" : "hover:bg-gray-100"}
        `}
                    onClick={() => handleDateClick(day)}
                >
                    <span className={`text-sm font-medium ${isSelected ? "text-white" : "text-gray-900"}`}>{day}</span>
                    {price && (
                        <span className={`text-xs ${isSelected ? "text-white" : getPriceColor(price)}`}>
                            ${price}
                        </span>
                    )}
                </div>
            );
        }

        return days;
    };


    const navigateMonth = (direction: "prev" | "next") => {
        if (direction === "prev") {
            if (currentMonth === 0) {
                setCurrentMonth(11)
                setCurrentYear(currentYear - 1)
            } else {
                setCurrentMonth(currentMonth - 1)
            }
        } else {
            if (currentMonth === 11) {
                setCurrentMonth(0)
                setCurrentYear(currentYear + 1)
            } else {
                setCurrentMonth(currentMonth + 1)
            }
        }
    }

    const swapLocations = () => {
        const temp = fromLocation
        setFromLocation(toLocation)
        setToLocation(temp)
    }
    const cities = [
        'Karachi, Pakistan',
        'Dubai, UAE',
        'Lahore, Pakistan',
        'Islamabad, Pakistan',
    ];
    const [selectedCity, setSelectedCity] = useState<string | null>('');
    const [query, setQuery] = useState('');

    const filteredCities =
        query === ''
            ? cities
            : cities.filter((city) =>
                city.toLowerCase().includes(query.toLowerCase())
            );
    return (
        <div className="h-[50rem] bg-gradient-to-br from-[#1479C9] via-[#0B2F5C] to-[#EF3D23] relative overflow-hidden">

            <main className=" relative z-10 max-w-7xl  mx-auto  sm:px-6 lg:px-8 pt-16 pb-24">
                {/* Hero Text */}
                <div className="text-center mb-12">
                    <h1 data-aos="fade-up" data-aos-duration="1000" className="text-4xl md:text-6xl lg:text-7xl font-bold text-[#fff] font-poppins mb-4 tracking-wider">
                        YOU GOD UWL SUCK KC
                    </h1>
                    <p data-aos="fade-down" data-aos-duration="1000" className="text-xl md:text-2xl text-[#EF3D23] font-bold max-w-2xl mx-auto">
                        Book cheap flights other sites simply can't find.
                    </p>
                </div>

                {/* Search Form */}
                <Card data-aos="zoom-in" data-aos-duration="1000" className=" max-w-4xl relative mx-auto shadow-2xl">
                    <CardContent className="p-6">
                        <Button variant="ghost" size="sm" onClick={swapLocations} className="p-2 absolute top-[46%] left-[26.2%] z-40 hover:bg-sky-50">
                            <ArrowLeftRight className="w-4 h-4 text-[ #1479C9]" />
                        </Button>

                        {/* Trip Options */}
                        <div className="flex flex-wrap items-center gap-4 mb-6">
                            <Select defaultValue="return">
                                <SelectTrigger className="w-32">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="return">Return</SelectItem>
                                    <SelectItem value="oneway">One way</SelectItem>
                                    <SelectItem value="multicity">Multi-city</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select defaultValue="economy">
                                <SelectTrigger className="w-32">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="economy">Economy</SelectItem>
                                    <SelectItem value="premium">Premium</SelectItem>
                                    <SelectItem value="business">Business</SelectItem>
                                    <SelectItem value="first">First</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select defaultValue="1">
                                <SelectTrigger className="w-40">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">
                                        <div className="flex items-center">
                                            <User className="w-4 h-4 mr-2" />1 Passenger
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="2">2 Passengers</SelectItem>
                                    <SelectItem value="3">3 Passengers</SelectItem>
                                    <SelectItem value="4">4+ Passengers</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select defaultValue="0">
                                <SelectTrigger className="w-24">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="0">
                                        <div className="flex items-center">
                                            <Luggage className="w-4 h-4 mr-2" />0
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="1">1 Bag</SelectItem>
                                    <SelectItem value="2">2 Bags</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Location and Date Inputs */}
                        <div className="grid grid-cols-1 lg:grid-cols-10 gap-2 mb-6">
                            {/* From Location */}
                            <div className="lg:col-span-3">

                                <div className="relative">
                                    <Combobox value={selectedCity} onChange={setSelectedCity}>
                                        <div className="relative">
                                            {/* Input Box */}
                                            <div className="relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-sm border bg-popover text-popover-foreground shadow-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2">
                                                <Combobox.Input
                                                    className="w-full placeholder-[#212529] px-4 py-2 text-sm leading-5 text-gray-900  focus:outline-none"
                                                    placeholder="From"
                                                    onChange={(e) => setQuery(e.target.value)}
                                                    displayValue={(city: string) => city}
                                                />
                                                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-3">
                                                    <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
                                                </Combobox.Button>
                                            </div>

                                            {/* Dropdown Panel */}
                                            {filteredCities.length > 0 && (
                                                <Combobox.Options className="absolute mt-2 w-full z-10 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto text-sm text-gray-900">
                                                    <div className="px-4 pt-3 pb-1 text-xs font-medium text-gray-500 uppercase">
                                                        Suggestions
                                                    </div>
                                                    {filteredCities.map((city) => (
                                                        <Combobox.Option
                                                            key={city}
                                                            value={city}
                                                            className={({ active }) =>
                                                                `flex justify-between items-center px-4 py-2 cursor-pointer ${active ? 'bg-blue-100' : 'hover:bg-gray-100'
                                                                }`
                                                            }
                                                        >
                                                            <span className="truncate">{city}</span>
                                                            <button className="text-blue-500 font-bold text-lg">+</button>
                                                        </Combobox.Option>
                                                    ))}
                                                </Combobox.Options>
                                            )}
                                        </div>
                                    </Combobox>
                                </div>
                            </div>

                            {/* Swap Button */}


                            {/* To Location */}
                            <div className="lg:col-span-3">
                                <div className="relative">
                                    <Combobox value={selectedCity} onChange={setSelectedCity}>
                                        <div className="relative">
                                            {/* Input Box */}
                                            <div className="relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-sm border bg-popover text-popover-foreground shadow-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2">
                                                <Combobox.Input
                                                    className="w-full placeholder-[#212529] px-4 py-2 text-sm leading-5 text-gray-900  focus:outline-none"
                                                    placeholder="To"
                                                    onChange={(e) => setQuery(e.target.value)}
                                                    displayValue={(city: string) => city}
                                                />
                                                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-3">
                                                    <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
                                                </Combobox.Button>
                                            </div>

                                            {/* Dropdown Panel */}
                                            {filteredCities.length > 0 && (
                                                <Combobox.Options className="absolute mt-2 w-full z-10 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto text-sm text-gray-900">
                                                    <div className="px-4 pt-3 pb-1 text-xs font-medium text-gray-500 uppercase">
                                                        Suggestions
                                                    </div>
                                                    {filteredCities.map((city) => (
                                                        <Combobox.Option
                                                            key={city}
                                                            value={city}
                                                            className={({ active }) =>
                                                                `flex justify-between items-center px-4 py-2 cursor-pointer ${active ? 'bg-blue-100' : 'hover:bg-gray-100'
                                                                }`
                                                            }
                                                        >
                                                            <span className="truncate">{city}</span>
                                                            <button className="text-blue-500 font-bold text-lg">+</button>
                                                        </Combobox.Option>
                                                    ))}
                                                </Combobox.Options>
                                            )}
                                        </div>
                                    </Combobox>
                                </div>

                            </div>

                            {/* Departure Date */}
                            <div className="lg:col-span-3">
                                <div >

                                    <div className="space-y-2">

                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                                <Calendar className="h-4 w-4 text-blue-500" />
                                            </div>
                                            <Input
                                                id="departure"
                                                value={formatSelectedDate()}
                                                readOnly
                                                onClick={() => setShowCalender(!showCalender)}
                                                placeholder="Departure to Arrival"
                                                className="relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-sm border bg-popover text-popover-foreground shadow-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
                                            />
                                            <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                                <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                                            </button>
                                        </div>
                                    </div>
                                    {
                                        showCalender ?
                                            (
                                                <div className="space-y-4 absolute w-2/3  left-1/2 z-20 bg-white">
                                                    {/* Calendar Header */}
                                                    <div className="flex items-center justify-between">
                                                        <Button variant="ghost" size="sm" onClick={() => navigateMonth("prev")}>
                                                            <ChevronLeft className="h-4 w-4" />
                                                        </Button>
                                                        <h3 className="font-medium text-gray-900">
                                                            {months[currentMonth]} {currentYear}
                                                        </h3>
                                                        <Button variant="ghost" size="sm" onClick={() => navigateMonth("next")}>
                                                            <ChevronRight className="h-4 w-4" />
                                                        </Button>
                                                    </div>

                                                    {/* Days of Week Header */}
                                                    <div className="grid grid-cols-7 gap-1">
                                                        {daysOfWeek.map((day) => (
                                                            <div key={day} className="h-8 flex items-center justify-center">
                                                                <span className="text-xs font-medium text-gray-500">{day}</span>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {/* Calendar Grid */}
                                                    <div className="grid grid-cols-7 gap-1">{renderCalendarDays()}</div>
                                                </div>
                                            ) : ''
                                    }
                                </div>
                            </div>



                            {/* Search Button */}
                            <div className="lg:col-span-1 flex self-center ">
                                <Button className="w-full bg-[#1479C9] hover:bg-sky-600 text-white font-semibold py-3">Search</Button>
                            </div>
                        </div>

                        {/* Booking.com Integration */}
                        <div className="flex items-end justify-end space-x-2">
                            <Checkbox id="accommodation" defaultChecked />
                            <label htmlFor="accommodation" className="text-sm text-gray-700">
                                Check accommodation with <span className="text-blue-600 font-semibold">Booking.com</span>
                            </label>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>

    )
}
export default Banner;