"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const standards = [
  {
    number: "01.",
    title: "THINKING BEFORE TOOLS",
    text: "Most agencies open Figma on day one. We don't touch a single design file until your positioning is locked. Every visual decision we make is downstream of a strategic one. That's why our work holds up — because it's built on something real.",
  },
  {
    number: "02.",
    title: "CLARITY YOU CAN USE, NOT JUST A BRAND YOU CAN SEE",
    text: "At the end of every engagement you walk away with more than a logo and a website. You have a positioning document, a messaging framework, and a clear answer to the question every founder struggles with: what makes us different and why should anyone care.",
  },
  {
    number: "03.",
    title: "SENIOR PEOPLE, START TO FINISH",
    text: "You won't meet an impressive strategist in the pitch and then get handed to someone you've never spoken to. The people you meet are the people who do the work.",
  },
  {
    number: "04.",
    title: "WE ONLY WORK WITH FOUNDERS WHO MEAN IT",
    text: "We are selective about who we take on. Not because we are precious, but because brand clarity requires a founder who is willing to interrogate assumptions before we start designing.",
  },
];

export default function HowWeDoIt() {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
  gsap.registerPlugin(ScrollTrigger);

  const ctx = gsap.context(() => {
    gsap.set(cardsRef.current, {
      y: 150,
      opacity: 0,
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "+=4500",
        scrub: 1,
        pin: true,
        anticipatePin: 1,
      },
    });

    cardsRef.current.forEach((card, index) => {
      tl.to(card, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power2.out",
      });

      if (index !== cardsRef.current.length - 1) {
        tl.to(card, {
        y: 150,
        opacity: 0,
        duration: 1,
        ease: "power2.in",
        });
    }
    });
  }, sectionRef);

  return () => ctx.revert();
}, []);

  return (
    <section className="standards-section" ref={sectionRef}>
      <div className="container">

        <div className="heading gap-left">
          <h2>How We Do It Differently</h2>
        </div>

        <div className="cards-stage gap-left">
          {standards.map((item, index) => (
            <div
              key={index}
              ref={(el) => (cardsRef.current[index] = el)}
              className={`standards-card ${index % 2 ? "right" : "left"}`}
            >
              <span className="standard-card-num">{item.number}</span>
              <p className="standard-card-title">{item.title}</p>
              <p className="standard-card-info">{item.text}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}