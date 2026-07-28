"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getImageUrl } from "../getImageUrl";

const extractText = (description = []) =>
  description.map((block) => (block.children || []).map((c) => c.text).join("")).join("\n");

export default function OurProudWork({ id, data }) {
  const sectionRef = useRef(null);
  const pinWrapRef = useRef(null); // only this wraps the pinned/sticky part
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
        // each direct child of the track is one <div className="fold-wrap"...> card
        const cardEls = gsap.utils.toArray(track?.children);

        if (isDesktop) {
          gsap.to(track, {
            x: () => -(track.scrollWidth - window.innerWidth),
            ease: "none",
            scrollTrigger: {
              // pin only the track wrapper, NOT the heading — so the
              // heading scrolls away normally and only the cards go sticky
              trigger: pinWrapRef.current,
              pin: true,
              scrub: 1.2,
              end: () => `+=${track?.scrollWidth - window.innerWidth}`,
              invalidateOnRefresh: true,
              onEnter: () => notifyStickyState(true),
              onLeave: () => notifyStickyState(false),
              onEnterBack: () => notifyStickyState(true),
              onLeaveBack: () => notifyStickyState(false),
            },
          });
        }

        if (isMobile) {
          // start with only the first card visible, rest hidden (stacked via CSS)
          gsap.set(cardEls, { autoAlpha: 0 });
          gsap.set(cardEls[0], { autoAlpha: 1 });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: pinWrapRef.current,
              start: "top top",
              end: () => `+=${(cardEls.length - 1) * window.innerHeight}`,
              scrub: 1,
              pin: true,
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

  if (!data) return null;

  const cards = data.proud_work || [];

  return (
    <section ref={sectionRef} className="we-are-proud" id={id}>
      <div className="container">
        <div className="we-are-proud-head gap-left">
          <div className="heading">
            <h2>{data?.title}</h2>
          </div>
        </div>
      </div>

      {/* only this wrapper pins/sticks — heading above stays in normal flow */}
      <div className="we-are-proud-pin" ref={pinWrapRef} data-sticky-section data-pinned-section>
        <div ref={trackRef} className="we-are-proud-in gap-left">
          {cards.map((card) => (
            <div className="fold-wrap" key={card.id}>
              <div className="left">
                <div className="wap-img">
                  <img
                    src={getImageUrl(card.image)}
                    alt={card.title}
                    className="img"
                  />
                </div>
                <div className="wap-text">
                  <div className="wap-text-left">
                    <h5>{card.title}</h5>
                    <p>{extractText(card.description)}</p>
                  </div>
                  <div className="ap-text-right">
                    <p>{card.year}</p>
                  </div>
                </div>
              </div>
              <div className="right">
                <div className="fw-right-top">
                  {card.work_stats?.map((stat) => (
                    <div key={stat.id}>
                      <h4>
                        {stat.numbertext?.replace(/[%x]/gi, "")}
                        <span>{stat.numbertext?.match(/[%x]/gi)?.[0]}</span>
                      </h4>
                      <p>{stat.textbelownumber}</p>
                    </div>
                  ))}
                </div>
                <div className="fw-right-bottom">
                  <p className="eye-head">{card.title_of_services_provided}</p>
                  <div className="fw-points-wrap">
                    {card.services_provided?.map((service) => (
                      <p key={service.id}>{service.title}</p>
                    ))}
                  </div>
                </div>
                {card.cta_link && (
                  <a href={card.cta_link} className="fw-cta">
                    {card.cta_text}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}