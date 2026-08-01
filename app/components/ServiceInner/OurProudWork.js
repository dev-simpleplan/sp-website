"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getImageUrl } from "../getImageUrl";

export default function OurProudWork({ id, data }) {
  const sectionRef = useRef(null);
  const wrapperRef = useRef(null); // .founder-slide-wrapper — the real clipping viewport
  const trackRef = useRef(null);

  const cards = data?.proud_work || [];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();

    const notifyStickyState = (active) => {
      window.dispatchEvent(
        new CustomEvent("sticky-section-active", {
          detail: active,
        })
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
        if (!track) return;

        const cardEls = gsap.utils.toArray(track.children);

        // ---------------- DESKTOP ----------------
        if (isDesktop) {
          // IMPORTANT: distance must be measured against the actual
          // clipping viewport (.founder-slide-wrapper, which has
          // overflow:hidden and its own max-width) — NOT against the
          // wider pin target (.we-are-proud). Using the wrong element
          // here is what made the scroll distance wrong on small/large
          // screens (the gap between the two elements' widths isn't
          // constant across viewport sizes).
          const getDistance = () =>
            Math.max(
              0,
              track.scrollWidth - (wrapperRef.current?.clientWidth || 0)
            );

          const START_HOLD = 300;
          const END_HOLD = 300;
          const distance = getDistance();

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              pin: true,
              anticipatePin: 1,
              scrub: 1.2,
              invalidateOnRefresh: true,
              end: () => `+=${START_HOLD + getDistance() + END_HOLD}`,

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

        // ---------------- MOBILE ----------------
        if (isMobile) {
          // Cards are stacked via CSS (position: absolute, see the CSS
          // fix) so they all occupy the same box — but absolutely
          // positioned elements don't contribute to their parent's
          // height. Measure the tallest card and lock the track to that
          // height, so there's no leftover blank space and no layout
          // jump as cards fade in/out.
          const tallest = Math.max(...cardEls.map((el) => el.offsetHeight));
          gsap.set(track, { height: tallest });

          gsap.set(cardEls, { autoAlpha: 0 });
          gsap.set(cardEls[0], { autoAlpha: 1 });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: () => `+=${(cardEls.length - 1) * window.innerHeight}`,
              pin: true,
              anticipatePin: 1,
              scrub: 1,
              invalidateOnRefresh: true,

              onEnter: () => notifyStickyState(true),
              onLeave: () => notifyStickyState(false),
              onEnterBack: () => notifyStickyState(true),
              onLeaveBack: () => notifyStickyState(false),
            },
          });

          cardEls.forEach((card, i) => {
            if (i === 0) return;

            tl.to(cardEls[i - 1], { autoAlpha: 0, duration: 1 }, i - 1).to(
              card,
              { autoAlpha: 1, duration: 1 },
              i - 1
            );
          });
        }
      }
    );

    // Images inside the track can finish loading after ScrollTrigger has
    // already measured track.scrollWidth/height — refresh once they're
    // all in, so the pin distance / spacer height reflect the real
    // layout (this matters even more now that mobile height is measured
    // from actual image-loaded card heights).
    const imgs = trackRef.current
      ? Array.from(trackRef.current.querySelectorAll("img"))
      : [];

    const pendingImages = imgs.filter((img) => !img.complete);

    if (pendingImages.length > 0) {
      let loadedCount = 0;
      const onImgLoad = () => {
        loadedCount += 1;
        if (loadedCount === pendingImages.length) {
          ScrollTrigger.refresh();
        }
      };
      pendingImages.forEach((img) => {
        img.addEventListener("load", onImgLoad, { once: true });
        img.addEventListener("error", onImgLoad, { once: true });
      });
    }

    return () => {
      mm.revert();
    };
  }, [cards.length]);

  if (!data) return null;

  return (
    <section id={id} className="we-are-proud-section">
      <div className="container">
        <div className="we-are-proud-head gap-left">
          <div className="heading">
            <h2>{data?.title}</h2>
          </div>
        </div>
      </div>

      <div
        className="we-are-proud"
        ref={sectionRef}
        data-sticky-section
        data-pinned-section
      >
        <div className="founder-slide-wrapper" ref={wrapperRef}>
          <div className="founder-track-in">
            <div ref={trackRef} className="we-are-proud-in gap-left">
              {cards.map((card) => (
                <div className="fold-wrap" key={card.id}>
                  <div className="proud-content-wrapper">
                    <div className="left-1">
                      <div className="wap-img">
                        <img
                          src={getImageUrl(card.image)}
                          alt={card.title}
                          className="img"
                        />
                      </div>
                    </div>
                    <div className="right-1">
                      <div className="ap-text-right">
                        <p>{card.year}</p>
                      </div>
                    </div>
                  </div>

                  <div className="card-details-wrapper">
                    <div className="card-details">
                      <div className="wap-text">
                        <div className="wap-text-left">
                          <h5>{card.title}</h5>
                          <p>{card.description?.[0]?.children?.[0]?.text}</p>
                        </div>
                      </div>

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

                      {card.cta_link && (
                        <a href={card.cta_link} className="fw-cta">
                          {card.cta_text}
                        </a>
                      )}
                    </div>

                    <div className="fw-right-bottom">
                      <p className="eye-head">{card.title_of_services_provided}</p>
                      <div className="fw-points-wrap">
                        <ul>
                          {card.services_provided?.map((service) => (
                            <li key={service.id}>{service.title}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}