"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function useRevealUp() {
    useEffect(() => {

        document.querySelectorAll(".reveal-up").forEach((element) => {

            // Prevent duplicate wrappers
            if (element.querySelector(".reveal-up-inner")) return;

            const inner = document.createElement("div");
            inner.classList.add("reveal-up-inner");

            while (element.firstChild) {
                inner.appendChild(element.firstChild);
            }

            element.appendChild(inner);

            gsap.set(inner, {
                yPercent: 100
            });

            gsap.to(inner, {
                yPercent: 0,
                duration: 1,
                ease: "power4.out",
                scrollTrigger: {
                    trigger: element,
                    start: "top 85%",
                    once: true
                }
            });

        });

    }, []);
}