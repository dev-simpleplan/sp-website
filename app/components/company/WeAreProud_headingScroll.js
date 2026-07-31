"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import weAreP from "../images/we-are-p.png";
import weAreP2 from "../images/we-are-p2.png";
import weAreP3 from "../images/we-are-p3.png";
import weAreP4 from "../images/we-are-p4.png";

export default function WeAreProud({id}) {
  const sectionRef = useRef(null);
  const trackRef   = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();

    // helper to notify the global sticky-header logic, since this section
    // uses GSAP pinning instead of normal scroll flow, and rect-based
    // detection can't reliably track pinned elements.
    const notifyStickyState = (active) => {
      window.dispatchEvent(
        new CustomEvent("sticky-section-active", { detail: active })
      );
    };

    mm.add(
      {
        isDesktop: "(min-width: 768px)",
        isMobile: "(max-width: 767px)",
      },
      (context) => {
        const { isDesktop, isMobile } = context.conditions;
        const track = trackRef.current;
        // each direct child of the track is one <a className="fold-wrap"...> card
        const cardEls = gsap.utils.toArray(track?.children);

        if (isDesktop) {
          const getDistance = () => {
            const wrapper = track.parentElement;
            return Math.max(0, track.scrollWidth - wrapper.offsetWidth);
          };

          // Extra scroll "held" at the start/end of the pin — a pause before
          // the horizontal move begins and another before the section unpins.
          const START_HOLD = 300;
          const END_HOLD = 300;
          const distance = getDistance();

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              pin: true,
              anticipatePin: 1,
              scrub: 1.2,
              end: () => `+=${START_HOLD + getDistance() + END_HOLD}`,
              invalidateOnRefresh: true,
              onEnter: () => notifyStickyState(true),
              onLeave: () => notifyStickyState(false),
              onEnterBack: () => notifyStickyState(true),
              onLeaveBack: () => notifyStickyState(false),
            },
          });

          tl.to(track, { x: 0, duration: START_HOLD })
            .to(track, { x: () => -getDistance(), ease: "none", duration: distance || 1 })
            .to(track, { x: () => -getDistance(), duration: END_HOLD });
        }

        if (isMobile) {
          // start with only the first card visible, rest hidden (stacked via CSS)
          gsap.set(cardEls, { autoAlpha: 0 });
          gsap.set(cardEls[0], { autoAlpha: 1 });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: () => `+=${(cardEls.length - 1) * window.innerHeight}`,
              scrub: 1,
              pin: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onEnter: () => notifyStickyState(true),
              onLeave: () => notifyStickyState(false),
              onEnterBack: () => notifyStickyState(true),
              onLeaveBack: () => notifyStickyState(false),
            },
          });

          cardEls.forEach((card, i) => {
            if (i === 0) return;
            // crossfade: previous card fades out while next fades in, at each step
            tl.to(cardEls[i - 1], { autoAlpha: 0, duration: 1 }, i - 1)
              .to(card, { autoAlpha: 1, duration: 1 }, i - 1);
          });
        }
      }
    );

    return () => mm.revert();
  }, []);

  const cards = [
    {
      cardHeading: 'How we transformed Invogue to 7 figure business',
      image: weAreP,
      title: "Invouge",
      subtitle: "Rewriting rules of beauty and shapewear",
      year: "2026",
      metric: "3.2",
      metricSuffix: "x",
      metricLabel: "Revenue Growth",
      services: ["Brand Positioning", "Brand Messaging", "Content"],
      href: "#!",
    },
    {
      cardHeading: 'How we transformed aukera to 7 figure business',
      image: weAreP2,
      title: "aukera",
      subtitle: "Rewriting rules of beauty and shapewear",
      year: "2025",
      metric: "10.5",
      metricSuffix: "Cr",
      metricLabel: "Funding Raised",
            services: ["Brand Positioning", "Brand Messaging", "Content"],
      href: "#!",
    },
    {
      cardHeading: 'How we transformed crawford to 7 figure business',
      image: weAreP3,
      title: "crawford",
      subtitle: "Rewriting rules of beauty and shapewear",
      year: "2025",
      metric: "1.2",
      metricSuffix: "x",
      metricLabel: "Revenue Growth",
      services: ["Brand Positioning", "Brand Messaging", "Content"],
      href: "#!",
    },
    {
      cardHeading: 'How we transformed gutly to 7 figure business',
      image: weAreP4,
      title: "Gutly",
      subtitle: "Rewriting rules of beauty and shapewear",
      year: "2025",
      metric: "2.6",
      metricSuffix: "x",
      metricLabel: "Funding Raised",
      services: ["Brand Positioning", "Brand Messaging", "Content"],
      href: "#!",
    },
  ];

  return (
    <section ref={sectionRef} className="we-are-proud" id={id}>
      {/* <div className="container">
        
      </div> */}  

        <div className="founder-slide-wrapper">
          <div className="tracker-wrap">
            <div ref={trackRef} className="we-are-proud-in we-are-proud-in-company gap-left">
              {cards.map((card, i) => (
                <a href={card.href} key={i}>
                  <div className="we-are-proud-head">
                      <div className="heading">
                          <h2>{card.cardHeading}</h2>
                      </div>
                  </div>
                  <div className="fold-wrap hrzntl-scroll-company">
                    <div className="left">
                      <div className="wap-img">
                        <img src={card.image.src} alt={card.title} className="img" />
                      </div>
                      <div className="wap-text">
                        <div className="wap-text-left">
                          <h5>{card.title}</h5>
                          <p>{card.subtitle}</p>
                        </div>
                        <div className="ap-text-right">
                          <p>{card.year}</p>
                        </div>
                      </div>
                    </div>
                    <div className="right">
                      <div className="fw-right-top">
                        <h4>{card.metric}<span>{card.metricSuffix}</span></h4>
                        <p>{card.metricLabel}</p>
                      </div>
                      <div className="fw-right-bottom">
                        <p className="eye-head">What we did</p>
                        <div className="fw-points-wrap">
                          {card.services.map((s, j) => (
                            <p key={j}>{s}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
    </section>
  );
}