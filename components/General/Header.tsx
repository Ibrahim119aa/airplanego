"use client"
import Image from "next/image"
import { useState } from "react"
import { Globe, User, HelpCircle, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    return (
        <header className="w-full bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 ">
                <div className="flex items-center justify-between h-16 lg:h-20">
                    {/* Logo and Navigation */}
                    <div className="flex items-center space-x-8">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                            <div data-aos="fade-right" data-aos-duration="1000" className="flex items-center justify-center">
                                <Image
                                    className="w-16 h-12 sm:w-20 sm:h-16 lg:w-24 lg:h-20"
                                    width={96}
                                    height={80}
                                    src={"/assets/images/logo.png"}
                                    alt="Logo"
                                />
                            </div>
                        </div>

                        {/* Desktop Navigation */}
                        <nav data-aos="fade-left" data-aos-duration="1000" className="hidden lg:flex space-x-1">
                            <Link href="" className="px-3 py-2 text-sm font-medium text-blue-600  rounded-md">
                                Flights
                            </Link>
                            <Link
                                href="#"
                                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                            >
                                Cars
                            </Link>
                            <Link
                                href="#"
                                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                            >
                                Stays
                            </Link>
                            <Link
                                href="#"
                                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                            >
                                Magazine
                            </Link>
                            <Link
                                href="#"
                                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                            >
                                Travel hacks
                            </Link>
                            <Link
                                href="#"
                                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                            >
                                Deals
                            </Link>
                        </nav>
                    </div>

                    {/* Desktop Right side */}
                    <div data-aos="fade-left" data-aos-duration="1000" className="hidden lg:flex items-center space-x-2">
                        <Button variant="ghost" size="sm" className="text-gray-700 hover:text-blue-600">
                            <Globe className="w-4 h-4 mr-1 text-[#1479C9]" />
                            USD
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-700 hover:text-blue-600">
                            <HelpCircle className="w-4 h-4 mr-1 text-[#1479C9]" />
                            Help & support
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-700 hover:text-blue-600">
                            <User className="w-4 h-4 mr-1 text-[#1479C9]" />
                            Sign in
                        </Button>
                    </div>

                    {/* Mobile menu button */}
                    <div className="lg:hidden">
                        <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
                <div className="lg:hidden bg-white border-t border-gray-200">
                    <div className="px-4 py-3 space-y-1">
                        {/* Navigation Links */}
                        <Link href="" className="block px-3 py-2 text-base font-medium text-blue-600 bg-blue-50 rounded-md">
                            Flights
                        </Link>
                        <Link
                            href="#"
                            className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
                        >
                            Cars
                        </Link>
                        <Link
                            href="#"
                            className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
                        >
                            Stays
                        </Link>
                        <Link
                            href="#"
                            className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
                        >
                            Magazine
                        </Link>
                        <Link
                            href="#"
                            className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
                        >
                            Travel hacks
                        </Link>
                        <Link
                            href="#"
                            className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
                        >
                            Deals
                        </Link>

                        {/* Mobile Right Side Buttons */}
                        <div className="pt-4 border-t border-gray-200 space-y-1">
                            <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-blue-600">
                                <Globe className="w-4 h-4 mr-2 text-[#1479C9]" />
                                USD
                            </Button>
                            <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-blue-600">
                                <HelpCircle className="w-4 h-4 mr-2 text-[#1479C9]" />
                                Help & support
                            </Button>
                            <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-blue-600">
                                <User className="w-4 h-4 mr-2 text-[#1479C9]" />
                                Sign in
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    )
}

export default Header
