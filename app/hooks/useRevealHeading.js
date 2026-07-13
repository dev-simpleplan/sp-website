"use client";
console.log("Reveal Heading Hook Running");
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitText from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function useRevealHeading() {

    useEffect(() => {

            // Animation Code
            let splitInstances = [];

            function initRevealHeadings() {

                splitInstances.forEach(instance => instance.revert());
                splitInstances = [];

                document.querySelectorAll(".reveal-heading").forEach((heading) => {

                    const split = SplitText.create(heading, {
                        type: "lines",
                        linesClass: "reveal-line"
                    });

                    splitInstances.push(split);

                    split.lines.forEach((line) => {

                        const inner = document.createElement("div");

                        while (line.firstChild) {
                            inner.appendChild(line.firstChild);
                        }

                        line.appendChild(inner);

                    });

                    gsap.from(
                        split.lines.map(line => line.firstChild),
                        {
                            yPercent: 80,
                            duration: 1.5,
                            stagger: 0.08,
                            filter: "blur(10px)",
                            ease: "power4.out",

                            scrollTrigger: {
                                trigger: heading,
                                start: "top 85%",
                                once: true
                            }
                        }
                    );
                });

            }

            initRevealHeadings();

            window.addEventListener("resize", () => {
                ScrollTrigger.refresh();
                initRevealHeadings();
            });

    }, []);
}