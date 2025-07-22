import React from "react";

const Banner = React.lazy(() => import("@/components/ResultPage/Banner"));
const FlightDetailComponent = React.lazy(() => import("@/components/FlightDetail/FlightDetail"));

interface PageProps {
    params: {
        Id: string;
    };
}

const FlightDetail = ({ params }: PageProps) => {
    return (
        <div>

            <FlightDetailComponent />
        </div>
    )
}
export default FlightDetail;