"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import bl1 from "../images/bl1.png";
import bl2 from "../images/bl2.png";
import bl3 from "../images/bl3.png";
import { getImageUrl } from "../getImageUrl";


const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "";

function getFounderImage(founder, index) {
  const media = founder?.founders_image;
  if (media?.url) {
    return {
      src: `${STRAPI_URL}${media.url}`,
      width: media.width,
      height: media.height,
    };
  }
}

export default function YourBrandsLook({ id, data }) {
  const sectionRef = useRef(null);
  const trackRef   = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const track = trackRef.current;
      if (!track) return;

      gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          pinSpacing: true,
          scrub: 1.2,
          end: () => `+=${track.scrollWidth - window.innerWidth}`,
          invalidateOnRefresh: true,
        },
      });
    }, sectionRef);
    // ScrollTrigger.refresh();

    // Founder cards (and their images) arrive from the API after this
    // component's first mount, so the track's real scrollWidth changes
    // once they render. invalidateOnRefresh (above) makes ScrollTrigger
    // re-read `end` whenever refresh() runs, so just trigger a refresh
    // once content has settled.
    // const handleContentReady = () => ScrollTrigger.refresh();
    // window.addEventListener("app:content-ready", handleContentReady);

    return () => {
      window.removeEventListener("app:content-ready", handleContentReady);
      ctx.revert();
    };
  }, []);

  const title = data?.title;
  const founders = data?.founders || [];

  return (
    <section ref={sectionRef} className="your-brands-look founders-section" id={id} data-sticky-section>
        <div className="container">
            <div className="heading gap-left">
            <h2 className="reveal-heading">{title || "The Simps Behind SimplePlan"}</h2>
            </div>          
        </div>

        <div className="founder-slide-wrapper">
              <div className="founder-track-in">
                <div ref={trackRef} className="ybl-track">
                  {founders.map((founder, index) => {
                  //   const image = getFounderImage(founder, index);
                    const description = founder?.description?.[0]?.children?.[0]?.text;

                    return (
                      <div className="your-brands-fold founder-slide" key={founder.id}>
                          <div className="your-brands-fold-wrap">
                              <div className="left founderSec-left-cntnt">
                                  <div className="ybf-img">
                                      <img
                                      src={getImageUrl(founder.founders_image)}
                                      alt={founder?.founders_name || "founder image"}
                                      className="img"
                                      />
                                  </div>
                              </div>
                              <div className="right founderSec-right-cntnt">
                                  <div className="founder-info">
                                      <p className="head">{founder?.founders_name}</p>
                                      <p className="founder-designation">{founder?.founders_possition}</p>
                                  </div>
                                  <div className="founder-quote">
                                      <div className="founder-quote-img">
                                          <svg width="27" height="21" viewBox="0 0 27 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                              <path d="M10.125 0C4.55625 0 0 4.55625 0 10.125V20.25H10.125V10.125H3.375C3.375 6.37875 6.37875 3.375 10.125 3.375V0ZM27 0C21.4312 0 16.875 4.55625 16.875 10.125V20.25H27V10.125H20.25C20.25 6.37875 23.2537 3.375 27 3.375V0Z" fill="white"/>
                                          </svg>
                                      </div>
                                      {description && (
                                          <p className="founder-quote-text text">
                                              {description}
                                          </p>
                                      )}
                                  </div>
                              </div>
                          </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
    </section>
  );
}