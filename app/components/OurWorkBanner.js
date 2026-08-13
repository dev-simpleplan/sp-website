"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function OurWorkBanner({ data }) {
  const sectionRef = useRef(null);
  const cardRef = useRef(null);
  const imageWrapRef = useRef(null);
  const scrollIdleTimeout = useRef(null);

  // ---- 1. Load Animation: card top -> center -> grow to full banner ----
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Start state: small card, above viewport, hidden
      gsap.set(cardRef.current, {
        y: -120,
        opacity: 0,
        scale: 0.6,
      });

      tl.to(cardRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.9,
      }) // Step 1: move top -> center
        .to(cardRef.current, {
          scale: 1,
          width: "100%",
          height: "100%",
          duration: 1.1,
          ease: "power2.inOut",
        }); // Step 2: grow to cover full banner
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // ---- 2. Scroll Animation: image top->bottom move + scale on scroll-idle ----
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = window.innerHeight; // adjust range as needed

      const progress = Math.min(scrollY / maxScroll, 1);

      gsap.to(imageWrapRef.current, {
        yPercent: progress * 20, // image moves top -> bottom subtly
        overwrite: "auto",
        duration: 0.3,
        ease: "power1.out",
      });

      // Reset "moving" scale while actively scrolling
      gsap.to(imageWrapRef.current, {
        scale: 1,
        overwrite: "auto",
        duration: 0.3,
      });

      clearTimeout(scrollIdleTimeout.current);
      scrollIdleTimeout.current = setTimeout(() => {
        // Scroll stopped -> grow image smoothly
        gsap.to(imageWrapRef.current, {
          scale: 1.08,
          duration: 0.6,
          ease: "power2.out",
        });
      }, 150); // idle threshold
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollIdleTimeout.current);
    };
  }, []);

  return (
    <section className="our-work-banner" ref={sectionRef}>
      <div className="our-work-banner__card" ref={cardRef}>
        <div className="our-work-banner__image-wrap" ref={imageWrapRef}>
          <img
            src={data?.image?.url}
            alt={data?.title || "Featured Work"}
            className="our-work-banner__image"
          />
        </div>

        <span className="our-work-banner__tag">
          {data?.category || "Fashion & Beauty"}
        </span>

        <a href={data?.case_study_link || "#"} className="our-work-banner__cta">
          View Case Study
        </a>
      </div>
    </section>
  );
}