"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function HowWeDoIt({id, data}) {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  const standardCard = data?.standards || [];

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
        pinSpacing: true,
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
    }});
  }, sectionRef);

  return () => ctx.revert();
}, [standardCard.length]);

  return (
    <section className="standards-section" ref={sectionRef}>
      <div className="container">

        <div className="heading gap-left">
          <h2>{data?.title}</h2>
        </div>

        <div className="cards-stage gap-left">
          {standardCard.map((item, index) => (
            <div
              key={item.id}
              ref={(el) => (cardsRef.current[index] = el)}
              className={`standards-card ${index % 2 ? "right" : "left"}`}
            >
              <span className="standard-card-num">
                {item.number}
              </span>

              <p className="standard-card-title">
                {item.title}
              </p>

              <p className="standard-card-info">
                {item.description?.[0]?.children?.[0]?.text}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}