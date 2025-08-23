"use client"
import { useState, useEffect } from "react"
import { Check } from "lucide-react"

const TopBanner = () => {
    const [url, setUrl] = useState("")

    useEffect(() => {
        setUrl(window.location.pathname)
    }, [])

    const isPaymentPage = /^\/Booking\/[^/]+$/.test(url)
    const isSearchResult = /^\/flight$/.test(url)
    const isPassengerDetailPage = /^\/flight\/[^/]+$/.test(url)
    const isSeatDetailPage = /^\/flight\/seat\/[^/]+$/.test(url)

    const topbannerlist = [
        { title: "Search", shortTitle: "Search", isActive: isSearchResult },
        { title: "Passenger and baggage", shortTitle: "Passenger", isActive: isPassengerDetailPage },
        { title: "Seat", shortTitle: "Seat", isActive: isSeatDetailPage },
        { title: "Overview and Payment", shortTitle: "Payment", isActive: isPaymentPage },
    ]

    return (
        <div className="bg-white  md:py-4 border-b   rounded-lg shadow-sm">
            <div className="container mx-auto px-2 sm:px-4">
                {/* Mobile Layout - Vertical Stack */}
                <div className="flex flex-col space-y-3 sm:hidden">
                    {topbannerlist.map((item, index) => (
                        <div key={index} className="flex items-center">
                            <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center text-white mr-3 ${item.isActive ? "bg-[#1479C9]" : "bg-gray-200"
                                    }`}
                            >
                                {item.isActive ? (
                                    <Check className="h-4 w-4" />
                                ) : (
                                    <span className="text-gray-500 font-semibold text-xs">{index + 1}</span>
                                )}
                            </div>
                            <span className={`text-sm font-medium ${item.isActive ? "text-[#1479C9]" : "text-gray-500"}`}>
                                {item.shortTitle}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Desktop/Tablet Layout - Horizontal */}
                <div className="hidden sm:flex items-center justify-between">
                    {topbannerlist.map((item, index) => (
                        <div key={index} className="flex items-center flex-1">
                            <div className="flex flex-col items-center flex-1 min-w-0">
                                <div
                                    className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-white ${item.isActive ? "bg-[#1479C9]" : "bg-gray-200"
                                        }`}
                                >
                                    {item.isActive ? (
                                        <Check className="h-3 w-3 md:h-4 md:w-4" />
                                    ) : (
                                        <span className="text-gray-500 font-semibold text-xs md:text-sm">{index + 1}</span>
                                    )}
                                </div>
                                <span
                                    className={`text-xs sm:text-sm md:text-base mt-1 md:mt-2 text-center px-1 ${item.isActive ? "text-[#1479C9]" : "text-gray-500"
                                        }`}
                                >
                                    <span className="sm:hidden">{item.shortTitle}</span>
                                    <span className="hidden sm:inline">{item.title}</span>
                                </span>
                            </div>
                            {index < topbannerlist.length - 1 && (
                                <div className={`flex-1 h-0.5 mx-1 md:mx-2 ${item.isActive ? "bg-[#1479C9]" : "bg-gray-200"}`}></div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default TopBanner
