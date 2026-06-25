"use client";
import { useRef, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const blocks = [
  {
    dots: 1,
    title: "Discovery first",
    text: "We get to know your business, your goals, and the gap between where you are and where you want to be.",
  },
  {
    dots: 2,
    title: "Strategy before creative",
    text: "Before anything looks like anything, we make sure the thinking is solid. Positioning, messaging, and clarity — nailed down before a single pixel moves.",
  },
  {
    dots: 3,
    title: "Build for consistency",
    text: "A brand that shows up differently every time is a brand no one remembers. We build systems that hold — across every touchpoint, every channel, every conversation.",
  },
  {
    dots: 4,
    title: "Work with you, not around you.",
    text: "You know your business better than anyone. We bring the strategic lens, the process, and the clarity — you bring the context. It works because we do it together.",
  },
];

const Dot = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <circle cx="6" cy="6" r="5.5" fill="white" stroke="white" />
  </svg>
);

const Card = ({ b }) => (
  <div className="block-box">
    <div className="bb-top">
      <div className="dot">
        {[...Array(b.dots)].map((_, d) => <Dot key={d} />)}
      </div>
      <h4>{b.title}</h4>
    </div>
    <p>{b.text}</p>
  </div>
);

export default function OurApproach() {
  const swiperRef = useRef(null);
  const [isSlider, setIsSlider] = useState(false);

  useEffect(() => {
    const check = () => setIsSlider(window.innerWidth < 1200);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <section className="our-approach">
      <div className="container">
        <div className="our-approach-top">
          <div className="heading">
            <h2>Our approach is simple</h2>
          </div>
        </div>

        <div className="our-approach-in">
          {isSlider ? (
            <div className="block-box-swiper">
              <Swiper
                onSwiper={(s) => (swiperRef.current = s)}
                slidesPerView={1}
                spaceBetween={1}
                loop={false}
                rewind={true}
                breakpoints={{
                  600: { slidesPerView: 1 },
                  768: { slidesPerView: 2 },
                  992: { slidesPerView: 3 },
                }}
              >
                {blocks.map((b, i) => (
                  <SwiperSlide key={i}>
                    <Card b={b} />
                  </SwiperSlide>
                ))}
              </Swiper>

              <div className="oa-nav">
                <button className="ts-nav-btn" onClick={() => swiperRef.current?.slidePrev()} aria-label="Previous">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>
                <button className="ts-nav-btn" onClick={() => swiperRef.current?.slideNext()} aria-label="Next">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            <div className="block-box-wrap">
              {blocks.map((b, i) => <Card b={b} key={i} />)}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
