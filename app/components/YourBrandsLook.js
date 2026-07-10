"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import bl1 from "./images/bl1.png";
import bl2 from "./images/bl2.png";
import bl3 from "./images/bl3.png";

const folds = [
  {
    image: bl1,
    heading: "If Your Brand Looks Like Everyone Else In The Room",
    service: "Branding & Identity",
    text: "The foundation. Before anything looks like anything, we make sure the thinking is solid.",
    href: "#!",
  },
  {
    image: bl2,
    heading: "If Your Website Is Losing You Customers The Moment They Land",
    service: "Website & Development",
    text: "Your brand on the internet. Clean, intuitive, and built to actually work.",
    href: "#!",
  },
  {
    image: bl3,
    heading: "If Your Website Is Losing You Customers The Moment They Land",
    service: "Marketing & Content",
    text: "Getting your brand in front of the right people in the right way.",
    href: "#!",
  },
];

export default function YourBrandsLook({id}) {
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

  return (
    <section ref={sectionRef} className="your-brands-look" id={id}>
      <div ref={trackRef} className="ybl-track">
        {folds.map((fold, i) => (
          <div className="your-brands-fold" key={i}>
            <h2>{fold.heading}</h2>
            <div className="your-brands-fold-wrap">
              <div className="left">
                <div className="ybf-img">
                  <img src={fold.image.src} alt={fold.service} className="img" />
                </div>
              </div>
              <div className="right">
                <p className="head">{fold.service}</p>
                <p className="text">{fold.text}</p>
                <a href={fold.href} className="custom-btn">learn more</a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
