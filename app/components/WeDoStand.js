"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getImageUrl } from "./getImageUrl";

export default function WeDoStand({ id, data }) {
  const sectionRef  = useRef(null);
  const imgRefs     = useRef([]);
  const itemRefs    = useRef([]);
  const wrapRef     = useRef(null);
  const items = data?.projects || [];

  useEffect(() => {
  if (!items.length) return;

  gsap.registerPlugin(ScrollTrigger);

  const imgs = imgRefs.current;
  const els = itemRefs.current;
  const wrap = wrapRef.current;

  imgs.forEach((el, i) => gsap.set(el, { opacity: i === 0 ? 1 : 0 }));

  const itemH = els[0].offsetHeight;
  wrap.style.height = itemH + "px";

  els.forEach((el, i) => {
    if (i > 0) gsap.set(el, { y: itemH + 60, opacity: 0.25 });
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

      tl.to(els[i], { y: -(itemH + 60), opacity: 0, ease: "none" });
      tl.to(els[i + 1], { y: 0, opacity: 1, ease: "none" }, "<");
      tl.to(imgs[i], { opacity: 0, ease: "none" }, "<");
      tl.to(imgs[i + 1], { opacity: 1, ease: "none" }, "<");
    });
  }, sectionRef);

  return () => ctx.revert();
}, [items]);

  return (
    <section ref={sectionRef} className="we-do-stand" id={id} data-sticky-section>
      {/* child of pinned element — overflow:hidden works here */}
      {/* <div className="wds-viewport gap-left"> */}
        <div className="container">
          <div className="wds-top-heading gap-left">
            <h2 className="reveal-heading">{data?.title}</h2>
          </div>

          <div className="we-do-stand-in gap-left">
            {/* LEFT — image stack, stays in place while section is pinned */}
            <div className="wds-left">
              <div className="wds-img-stack">
                {items.map((item, i) => (
                  <div
                    key={i}
                    className="wds-img-slide"
                    ref={el => (imgRefs.current[i] = el)}
                  >
                    <img
                      src={getImageUrl(item?.image, "small")}
                      srcSet={`
                        ${getImageUrl(item?.image, "thumbnail")} 125w,
                        ${getImageUrl(item?.image, "small")} 399w,
                        ${getImageUrl(item?.image)} 449w
                      `}
                      sizes="(max-width: 767px) 100vw, 449px"
                      alt={item?.image?.alternativeText || item?.title}
                      className="img"
                    />
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
                      <h3>{item?.title}</h3>
                      <span className="wds-year">{item?.year}</span>
                    </div>
                    <p className="wds-desc">{item?.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      {/* </div> */}
    </section>
  );
}
