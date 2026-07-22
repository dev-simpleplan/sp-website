"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function useSplitReveal() {
  useEffect(() => {
    const splitInstances = [];

    function initSplitReveal() {
      // Cleanup previous split
      splitInstances.forEach((instance) => instance.revert());
      splitInstances.length = 0;

      // Kill previous ScrollTriggers
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.id === "splitReveal") {
          trigger.kill();
        }
      });

      document.querySelectorAll(".split-reveal").forEach((element) => {
        // Create SplitText
        const split = SplitText.create(element, {
          type: "lines",
          linesClass: "split-line",
        });

        splitInstances.push(split);

        // Wrap every line
        split.lines.forEach((line) => {
          const inner = document.createElement("div");
          inner.classList.add("split-line-inner");

          while (line.firstChild) {
            inner.appendChild(line.firstChild);
          }

          line.appendChild(inner);
        });

        const lineInners = split.lines.map((line) => line.firstChild);

        // Hide original flash
        gsap.set(element, {
          visibility: "visible",
        });

        // Initial state
        gsap.set(lineInners, {
          yPercent: 110,
        });

        // Animation
        gsap.to(lineInners, {
          yPercent: 0,
          duration: 1,
          stagger: 0.06,
          ease: "power4.out",

          scrollTrigger: {
            id: "splitReveal",
            trigger: element,
            start: "top 80%",
            once: true,
          },
        });
      });

      ScrollTrigger.refresh();
    }

    // Wait one frame so DOM is fully rendered
    requestAnimationFrame(initSplitReveal);

    let resizeTimer;

    const handleResize = () => {
      clearTimeout(resizeTimer);

      resizeTimer = setTimeout(() => {
        initSplitReveal();
      }, 250);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      splitInstances.forEach((instance) => instance.revert());

      window.removeEventListener("resize", handleResize);

      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.id === "splitReveal") {
          trigger.kill();
        }
      });
    };
  }, []);
}