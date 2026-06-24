"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import img826 from "./images/826.png";

const items = [
  {
    image: img826,
    title: "826 Digital",
    year: "2023",
    description: "Gold Winner in websites Design for Social Change",
  },
  {
    image: img826,
    title: "Willow Tree Kids",
    year: "2022",
    description: "Silver Winner in Branding for Social Change",
  },
  {
    image: img826,
    title: "Client Three",
    year: "2021",
    description: "Award or achievement description goes here",
  },
];

export default function WeDoStand() {
  const sectionRef  = useRef(null);
  const imgRefs     = useRef([]);
  const itemRefs    = useRef([]);
  const wrapRef     = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const imgs = imgRefs.current;
    const els  = itemRefs.current;
    const wrap = wrapRef.current;

    // first image visible, others hidden
    imgs.forEach((el, i) => gsap.set(el, { opacity: i === 0 ? 1 : 0 }));

    // measure one item's height, then set wrap to that size
    const itemH = els[0].offsetHeight;
    wrap.style.height = itemH + "px";

    // push items 1+ below the wrap (out of overflow:hidden)
    els.forEach((el, i) => {
      if (i > 0) gsap.set(el, { y: itemH + 60 });
    });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          scrub: 1,
          start: "top top",
          end: `+=${(items.length - 1) * (itemH + 60) * 2}`,
          invalidateOnRefresh: true,
        },
      });

      items.forEach((_, i) => {
        if (i === items.length - 1) return;

        // current item slides up and out
        tl.to(els[i],      { y: -(itemH + 60), ease: "none" });
        // next item slides in from below  (parallel)
        tl.to(els[i + 1],  { y: 0,             ease: "none" }, "<");
        // image crossfade                  (parallel)
        tl.to(imgs[i],     { opacity: 0,        ease: "none" }, "<");
        tl.to(imgs[i + 1], { opacity: 1,        ease: "none" }, "<");
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="we-do-stand">
      {/* child of pinned element — overflow:hidden works here */}
      <div className="wds-viewport">
        <div className="container">
          <div className="wds-top-heading">
            <h2>What We Do Stands Out</h2>
          </div>

          <div className="we-do-stand-in">
            {/* LEFT — image stack, stays in place while section is pinned */}
            <div className="wds-left">
              <div className="wds-img-stack">
                {items.map((item, i) => (
                  <div
                    key={i}
                    className="wds-img-slide"
                    ref={el => (imgRefs.current[i] = el)}
                  >
                    <img src={item.image.src} alt={item.title} className="img" />
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — items slide up one by one inside overflow:hidden wrap */}
            <div className="wds-right">
              <div className="wds-items-wrap" ref={wrapRef}>
                {items.map((item, i) => (
                  <div
                    key={i}
                    className="wds-item"
                    ref={el => (itemRefs.current[i] = el)}
                  >
                    <div className="wds-item-top">
                      <h3>{item.title}</h3>
                      <span className="wds-year">{item.year}</span>
                    </div>
                    <p className="wds-desc">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
