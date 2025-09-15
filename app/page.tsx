"use client"
import React from "react"
import AOS from 'aos';
import 'aos/dist/aos.css';



// const ScatteredLetters = React.lazy(() => import('@/components/Home/ScatteredLetter'));
const Banner = React.lazy(() => import('@/components/Home/Banner'));
const PopularFlight = React.lazy(() => import("@/components/Home/PopularFlight"));



export default function Component() {

 




  return (
    <div >

      {/* <ScatteredLetters /> */}
      <Banner />
      <PopularFlight />



    </div>
  )
}
