"use client";
import { useState, useEffect } from "react";
import { Check } from "lucide-react";

const TopBanner = () => {
    const [url, setUrl] = useState("");

    useEffect(() => {
        setUrl(window.location.pathname);
    }, []);

    const isPaymentPage = /^\/Booking\/[^/]+$/.test(url);
    const isSearchResult = /^\/flight$/.test(url);
    const isPassengerDetailPage = /^\/flight\/[^/]+$/.test(url);
    const isSeatDetailPage = /^\/flight\/seat\/[^/]+$/.test(url);

    const topbannerlist = [
        { title: "Search", isActive: isSearchResult },
        { title: "Passenger and baggage", isActive: isPassengerDetailPage },
        { title: "Seat", isActive: isSeatDetailPage },
        { title: "Overview and Payment", isActive: isPaymentPage }
    ];

    return (
        <div className="bg-white py-4 border-b mb-8 rounded-lg shadow-sm">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between text-center">
                    {topbannerlist.map((item, index) => (
                        <>
                            {item.isActive ? (
                                <>
                                    <div className="flex flex-col items-center flex-1 min-w-0">
                                        <div className="w-6 h-6 rounded-full bg-[#1479C9] flex items-center justify-center text-white">
                                            <Check className="h-4 w-4" />
                                        </div>
                                        <span className="text-sm mt-2 text-[#1479C9] whitespace-nowrap">{item.title}</span>
                                    </div>
                                    <div className="flex-1 h-0.5 bg-[#1479C9] mx-2"></div>
                                </>
                            ) : (
                                <>
                                    <div className="flex flex-col items-center flex-1 min-w-0">
                                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-semibold">
                                            {index + 1}
                                        </div>
                                        <span className="text-sm mt-2 text-gray-500 whitespace-nowrap">{item.title}</span>
                                    </div>
                                    <div className="flex-1 h-0.5 bg-gray-200 mx-2"></div>
                                </>
                            )}
                        </>
                    ))}
                </div>
            </div>
        </div>
    );
};
export default TopBanner;
