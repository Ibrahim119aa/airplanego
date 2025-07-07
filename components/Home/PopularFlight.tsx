import { Card } from "../ui/card";
import { Button } from "../ui/button";
import Image from "next/image";
import { ArrowLeftRight } from "lucide-react";
import { PopularFlights } from "@/types/Flight/PopularFlight";

const PopularFlight = () => {

    const popularflight: PopularFlights[] = [
        {
            imageUrl: "/assets/images/popularflight1.avif",
            start: "London",
            departure: "Istanbul"
        }
        , {
            imageUrl: "/assets/images/popularflight1.avif",
            start: "London",
            departure: "Istanbul"
        }
        , {
            imageUrl: "/assets/images/popularflight1.avif",
            start: "London",
            departure: "Istanbul"
        },

        {
            imageUrl: "/assets/images/popularflight1.avif",
            start: "London",
            departure: "Istanbul"
        }, {
            imageUrl: "/assets/images/popularflight1.avif",
            start: "London",
            departure: "Istanbul"
        },
        {
            imageUrl: "/assets/images/popularflight1.avif",
            start: "London",
            departure: "Istanbul"
        }
        ,
        {
            imageUrl: "/assets/images/popularflight1.avif",
            start: "London",
            departure: "Istanbul"
        }
        ,
        {
            imageUrl: "/assets/images/popularflight1.avif",
            start: "London",
            departure: "Istanbul"
        }
        ,
        {
            imageUrl: "/assets/images/popularflight1.avif",
            start: "London",
            departure: "Istanbul"
        }
        ,
        {
            imageUrl: "/assets/images/popularflight1.avif",
            start: "London",
            departure: "Istanbul"
        }
        ,
        {
            imageUrl: "/assets/images/popularflight1.avif",
            start: "London",
            departure: "Istanbul"
        }
        ,
        {
            imageUrl: "/assets/images/popularflight1.avif",
            start: "London",
            departure: "Istanbul"
        }
    ]
    return (
        <div className="Parent-Layout   bg-cloud-light" >
            <div className="Parent-Child pt-12 pb-10">
                <div className="flex flex-col gap-4">
                    <div>
                        <div className="flex flex-col gap-1">

                            <h4 data-aos="fade-left" data-duration="1000" className="primary-heading">Popular flights</h4>
                            <p data-aos="fade-right" data-duration="1000" className="secondary-heading">
                                Check these popular routes on airpline.com
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-x-10 gap-y-5">

                        {
                            popularflight &&
                            (
                                popularflight.map((e) =>
                                (
                                    <div data-aos="zoom-in" data-duration="1000">
                                        <Card className="hover:shadow-level1 cursor-pointer rounded-lg">
                                            <div className="flex gap-4">
                                                <div>
                                                    <Image
                                                        data-aos="zoom-out"
                                                        data-duration="1000"
                                                        className="h-24 rounded-l-lg"
                                                        src={e.imageUrl}
                                                        alt={""}
                                                        width={120}
                                                        height={120}
                                                    />
                                                </div>
                                                <div className="flex gap-3 items-center justify-center">
                                                    <h4 data-aos="fade-up-left" data-duration="1000" className="primary-heading">{e.start}</h4>
                                                    <ArrowLeftRight data-aos="zoom-in" data-duration="1000" data-aos-easing="ease-in-out" className="w-4 h-4 text-[ #1479C9]" />
                                                    <h4 data-aos="fade-up-right" data-duration="1000" data-aos-easing="ease-in-out" className=" primary-heading">{e.departure}</h4>

                                                </div>
                                            </div>
                                        </Card>
                                    </div>
                                ))
                            )
                        }

                    </div>
                </div>
            </div>
            <div>
                <Button>
                    Show more
                </Button>
            </div>
        </div >
    )
}
export default PopularFlight;