"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { getImageUrl } from "../components/getImageUrl";

// Real API fields, confirmed against the culture_banner response — each
// corner is its own named field, not an array.
const FLOAT_SLOTS = [
  { key: "left_top_image", className: "cb-float-tl", format: "thumbnail", floatRange: 14 },
  { key: "right_top_image", className: "cb-float-tr", format: "thumbnail", floatRange: 16 },
  { key: "left_bottom_image", className: "cb-float-bl", format: "thumbnail", floatRange: 12 },
  { key: "right_bottom_image", className: "cb-float-br", format: "small", floatRange: 10 },
];

export default function CustomBanner({ id, data }) {
  const sectionRef = useRef(null);
  const floatItems = useRef([]); // [{ el, floatRange }]
  floatItems.current = [];

  const addFloatRef = (el, floatRange) => {
    if (el && !floatItems.current.some((item) => item.el === el)) {
      floatItems.current.push({ el, floatRange });
    }
  };

  useEffect(() => {
    if (!floatItems.current.length) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      const els = floatItems.current.map((item) => item.el);

      // 1. Grow into place — runs as soon as this component mounts, which
      // (per app/page.js's `if (loading) return <loader />` gate) only
      // happens after the API has loaded and the loader has been removed.
      gsap.set(els, { scale: 0, opacity: 0 });

      const entrance = gsap.to(els, {
        scale: 1,
        opacity: 1,
        duration: 0.9,
        ease: "back.out(1.7)",
        stagger: 0.15,
        delay: 0.2,
      });

      // 2. Once every circle has grown in, start a slow, continuous,
      // slightly-offset float per image so they don't move in unison.
      if (!reduceMotion) {
        entrance.eventCallback("onComplete", () => {
          floatItems.current.forEach(({ el, floatRange }, i) => {
            gsap.to(el, {
              y: `+=${floatRange}`,
              x: `+=${floatRange / 3}`,
              duration: gsap.utils.random(3, 5),
              ease: "sine.inOut",
              repeat: -1,
              yoyo: true,
              delay: i * 0.3,
            });
          });
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [data]);

  if (!data) return null;

  return (
    <section ref={sectionRef} className="culture-banner" id={id}>
      <div className="container">
        <div className="culture-banner-in">
          {FLOAT_SLOTS.map((slot) => {
            const media = data?.[slot.key];
            if (!media) return null;

            return (
              <div
                key={slot.key}
                ref={(el) => addFloatRef(el, slot.floatRange)}
                className={`cb-float-img ${slot.className}`}
              >
                <img
                  src={getImageUrl(media, slot.format)}
                  alt={media?.alternativeText || ""}
                  className="img"
                  draggable="false"
                />
              </div>
            );
          })}

          <div className="custom-banner-cntnt">
            <div className="custom-b-text">
              <h1 className="reveal-heading">{data?.title}</h1>
              <p>{data?.description?.[0]?.children?.[0]?.text}</p>
            </div>
            <div className="Custom-b-cta">
              <Link href={data?.cta_link} className="custom-btn">
                <span>{data?.cta_text}</span>
                <span className="arrow-wrap">
                  <svg
                    className="arrow arrow-1"
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0.878125 11.6667L0 10.7885L9.53854 1.25H3.75V0H11.6667V7.91667H10.4167V2.12813L0.878125 11.6667Z"
                      fill="currentColor"
                    />
                  </svg>

                  <svg
                    className="arrow arrow-2"
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0.878125 11.6667L0 10.7885L9.53854 1.25H3.75V0H11.6667V7.91667H10.4167V2.12813L0.878125 11.6667Z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}