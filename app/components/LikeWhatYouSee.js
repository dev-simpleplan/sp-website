"use client";
import { useEffect, useRef } from "react";

const COUNTERS = [
  { target: 200, suffix: "+" },
  { target: 100, suffix: "M+" },
  { target: 20,  suffix: "+" },
];

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function runCounter(el, target, suffix, duration = 2500) {
  let startTime = null;
  const tick = (timestamp) => {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    el.textContent = Math.round(easeOutCubic(progress) * target) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

export default function LikeWhatYouSee({id}) {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const headings = section.querySelectorAll(".counter-block h2");

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          headings.forEach((el, i) => {
            const { target, suffix } = COUNTERS[i];
            runCounter(el, target, suffix);
          });
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="like-what-you-see" ref={sectionRef} id={id}>
      <div className="container">
        <div className="like-what-you-see-in gap-left">
          <div className="heading">
            <h2>Like what you see? Imagine what we could do for your brand.</h2>
          </div>
          <a href="#!" className="custom-btn">
            view all case studies
          </a>
          <div className="counter-wrap">
            <div className="counter-block">
              <h2>200+</h2>
              <p>Brands Launched</p>
            </div>

            <div className="counter-block">
              <h2>100M+</h2>
              <p>Revenue Moved</p>
            </div>

            <div className="counter-block">
              <h2>20+</h2>
              <p>Awards Won</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
