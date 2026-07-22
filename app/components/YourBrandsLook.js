"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import bl1 from "./images/bl1.png";
import bl2 from "./images/bl2.png";
import bl3 from "./images/bl3.png";
import { getImageUrl } from "./getImageUrl";

export default function YourBrandsLook({ id, data }) {
  const sectionRef = useRef(null);
  const trackRef   = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const track = trackRef.current;

      gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          scrub: 1.2,
          end: () => `+=${track.scrollWidth - window.innerWidth}`,
          invalidateOnRefresh: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const folds = data || [];

  return (
    <section ref={sectionRef} className="your-brands-look" id={id} data-sticky-section>
      <div ref={trackRef} className="ybl-track">
        {folds.map((fold) => (
          <div className="your-brands-fold" key={fold.id}>
            <h2 className="reveal-heading">{fold.title?.[0]?.children?.[0]?.text}</h2>
            <div className="your-brands-fold-wrap">
              <div className="left">
                <div className="ybf-img">
                  <img
                      src={getImageUrl(fold?.featured_image)}
                      alt={fold.service_name}
                      className="img"
                    />
                </div>
              </div>
              <div className="right">
                <p className="head">{fold.service_name}</p>
                <p className="text">{fold.description?.[0]?.children?.[0]?.text}</p>
                <a href={fold.cta_link} className="custom-btn">
                  <span>{fold.cta_text}</span>
                  <span className="arrow-wrap">
                      <svg className="arrow arrow-1" width="12" height="12" viewBox="0 0 12 12" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                          <path
                                d="M0.878125 11.6667L0 10.7885L9.53854 1.25H3.75V0H11.6667V7.91667H10.4167V2.12813L0.878125 11.6667Z"
                                fill="currentColor" />
                      </svg>

                      <svg className="arrow arrow-2" width="12" height="12" viewBox="0 0 12 12" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                          <path
                                d="M0.878125 11.6667L0 10.7885L9.53854 1.25H3.75V0H11.6667V7.91667H10.4167V2.12813L0.878125 11.6667Z"
                                fill="currentColor" />
                      </svg>
                  </span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}