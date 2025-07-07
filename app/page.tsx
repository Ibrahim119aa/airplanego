"use client"
import React, { useEffect } from "react"
import AOS from 'aos';
import 'aos/dist/aos.css';



const ScatteredLetters = React.lazy(() => import('@/components/Home/ScatteredLetter'));
const Banner = React.lazy(() => import('@/components/Home/Banner'));
const PopularFlight = React.lazy(() => import("@/components/Home/PopularFlight"));



export default function Component() {

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);




  return (
    <div >

      <ScatteredLetters />
      <Banner />
      <PopularFlight />
      


    </div>
  )
}
