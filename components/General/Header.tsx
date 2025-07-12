"use client"
import Image from "next/image"
import { useState } from "react"
import { Globe, User, HelpCircle, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    return (
        <div className="Header">
            <div className="Header-Parent">
                <div className="Header-Layout">
                    {/* Logo */}
                    <div className="flex justify-center gap-2 items-center">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div data-aos="fade-right" data-aos-duration="1000" className="  rounded-full flex items-center justify-center">
                                    <Image
                                        className="w-[6rem] h-[5rem]"
                                        width={50}
                                        height={40}
                                        src={"/assets/images/logo.png"}
                                        alt=""
                                    />
                                </div>
                            </div>


                        </div>


                        <nav data-aos="fade-left" data-aos-duration="1000" className="hidden md:flex space-x-1">
                            <Link href={""} className="nav-active">
                                Flights
                            </Link>
                            <Link
                                href="#" className="nav-link">
                                Cars
                            </Link>
                            <Link href="#" className="nav-link">
                                Stays
                            </Link>
                            <Link href="#" className="nav-link">
                                Magazine
                            </Link>
                            <Link href="#" className="nav-link">
                                Travel hacks
                            </Link>
                            <Link href="#" className="nav-link">
                                Deals
                            </Link>
                        </nav>
                    </div>

                    {/* Right side */}
                    <div data-aos="fade-left" data-aos-duration="1000" className="hidden md:flex items-center space-x-4">
                        <Button variant="ghost" size="sm" className="nav-link">
                            <Globe className="w-4 h-4 mr-1 text-[#1479C9]" />
                            USD
                        </Button>
                        <Button variant="ghost" size="sm" className="nav-link">
                            <HelpCircle className="w-4 h-4 mr-1 text-[#1479C9]" />
                            Help & support
                        </Button>
                        <Button variant="ghost" size="sm" className="nav-link">
                            <User className="w-4 h-4 mr-1 text-[#1479C9]" />
                            Sign in
                        </Button>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        <a href="#" className="block px-3 py-2 text-base font-medium text-gray-900">
                            Flights
                        </a>
                        <a href="#" className="block px-3 py-2 text-base font-medium text-gray-700">
                            Cars
                        </a>
                        <a href="#" className="block px-3 py-2 text-base font-medium text-gray-700">
                            Stays
                        </a>
                        <a href="#" className="block px-3 py-2 text-base font-medium text-gray-700">
                            Magazine
                        </a>
                        <a href="#" className="block px-3 py-2 text-base font-medium text-gray-700">
                            Travel hacks
                        </a>
                        <a href="#" className="block px-3 py-2 text-base font-medium text-gray-700">
                            Deals
                        </a>
                    </div>
                </div>
            )}
        </div>
    )
}
export default Header;