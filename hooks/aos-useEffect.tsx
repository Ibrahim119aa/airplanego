"use client";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from "react";

export const AosUseEffect = () => {
    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
        });
    }, []);
}