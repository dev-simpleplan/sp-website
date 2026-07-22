"use client";
import { useRef, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const Dot = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <circle cx="6" cy="6" r="5.5" fill="white" stroke="white" />
  </svg>
);

const Card = ({ b }) => (
  <div className="block-box">
    <div className="bb-top">
      <div className="dot">
        {[...Array(b.step_number)].map((_, d) => (
          <Dot key={d} />
        ))}
      </div>

      <h4>{b.title}</h4>
    </div>

    <p>{b.description?.[0]?.children?.[0]?.text}</p>
  </div>
);

export default function OurApproach({ id, data }) {
  const swiperRef = useRef(null);
  const [isSlider, setIsSlider] = useState(false);

  const blocks = data?.cards || [];

  useEffect(() => {
    const check = () => setIsSlider(window.innerWidth < 1200);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (!data) return null;

  return (
    <section className="our-approach" id={id}>
      <div className="container">
        <div className="our-approach-top gap-left">
          <div className="heading">
            <h2 className="reveal-heading">{data.headline}</h2>
          </div>
        </div>

        <div className="our-approach-in gap-left">
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
                {blocks.map((b) => (
                  <SwiperSlide key={b.id}>
                    <Card b={b} />
                  </SwiperSlide>
                ))}
              </Swiper>

              <div className="oa-nav">
                <button
                  className="ts-nav-btn"
                  onClick={() => swiperRef.current?.slidePrev()}
                  aria-label="Previous"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>

                <button
                  className="ts-nav-btn"
                  onClick={() => swiperRef.current?.slideNext()}
                  aria-label="Next"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            <div className="block-box-wrap">
              {blocks.map((b) => (
                <Card b={b} key={b.id} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}