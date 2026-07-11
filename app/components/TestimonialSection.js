"use client";
import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import authorImg from "./images/test-author-img.jpg";
import brandImg from "./images/test-brand-img.svg";

const testimonials = [
  {
    brand: brandImg,
    rating: "5.0 Rating",
    quote: "We support today's innovators to create tomorrow's products, services and solutions by implementing tailor-made Talent Management solutions. With our support your company is fully fledged for a healthy and sustainable growth.",
    author: authorImg,
    name: "John Doe",
    designation: "Gravette",
  },
  {
    brand: brandImg,
    rating: "5.0 Rating",
    quote: "We support today's innovators to create tomorrow's products, services and solutions by implementing tailor-made Talent Management solutions. With our support your company is fully fledged for a healthy and sustainable growth.",
    author: authorImg,
    name: "John Doe",
    designation: "Gravette",
  },
  {
    brand: brandImg,
    rating: "5.0 Rating",
    quote: "We support today's innovators to create tomorrow's products, services and solutions by implementing tailor-made Talent Management solutions. With our support your company is fully fledged for a healthy and sustainable growth.",
    author: authorImg,
    name: "John Doe",
    designation: "Gravette",
  },
];

export default function TestimonialSection({id}) {
  const swiperRef = useRef(null);

  return (
    <section className="testimonial-section" id={id}>
  

      <div className="testimonial-slider-wrap gap-left">
        <Swiper
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          slidesPerView={1.15}
          spaceBetween={40}
          loop={false}
          rewind={true}
          breakpoints={{
            768:  { slidesPerView: 1.5, spaceBetween: 48 },
            1024: { slidesPerView: 2.2, spaceBetween: 56 },
          }}
        >
          {testimonials.map((t, i) => (
            <SwiperSlide key={i}>
              <div className="testimonial-block">
                <div className="ts-platform">
                  <div className="ts-brand-logo">
                    <img src={t.brand.src} alt="Platform" className="icon" />
                  </div>
                </div>
                <p className="ts-quote">{t.quote}</p>
                <div className="author">
                  <div className="author-img">
                    <img src={t.author.src} alt={t.name} className="img" />
                  </div>
                  <div className="author-details">
                    <p className="author-name">{t.name}</p>
                    <p className="author-desig">{t.designation}</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
          <div className="container">
        <div className="testimonial-top gap-left">
          <div className="testimonial-nav">
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
      </div>
    </section>
  );
}
