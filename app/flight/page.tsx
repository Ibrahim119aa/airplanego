import React from "react";

const Banner = React.lazy(() => import("@/components/ResultPage/Banner"));
const SearchResult = React.lazy(() => import("@/components/ResultPage/SeachResult"));
const Result = () => {
    return (
        <div>
            <Banner />
            <SearchResult />
        </div>
    )
}
export default Result;