"use client";
import { useRef } from "react";
import weAreP from "../images/we-are-p.png";
import weAreP2 from "../images/we-are-p2.png";
import weAreP3 from "../images/we-are-p3.png";
import weAreP4 from "../images/we-are-p4.png";
import useStickyHorizontalTrack from "../../hooks/useStickyHorizontalTrack";

// Distinct classnames throughout (we-are-proud-company, not we-are-proud) —
// this used to share classes with the homepage's WeAreProud.js, which broke
// once that component's CSS moved to the sticky/scroll-driven pattern (its
// height:400vh conflicted with this component's own GSAP pin).
export default function WeAreProud({ id }) {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);

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

  useStickyHorizontalTrack(sectionRef, trackRef, [cards.length]);

  return (
    <section ref={sectionRef} className="we-are-proud-company" id={id}>
      <div className="we-are-proud-company-sticky">
        <div className="container">

          <div className="slider-wrapper-outer gap-left">
            <div className="slider-wrapper-inner">

              <div ref={trackRef} className="we-are-proud-in-company">
                {cards.map((card, i) => (
                  <a href={card.href} key={i} className="we-are-proud-company-card">
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
        </div>
      </div>
    </section>
  );
}
