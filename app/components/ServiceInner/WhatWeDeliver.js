"use client";
import { useRef, useEffect, useState, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { getImageUrl } from "../getImageUrl";

const extractText = (description = []) =>
  description.map((block) => (block.children || []).map((c) => c.text).join("")).join("\n");

const Card = ({ b }) => {
  const content = (
    <>
      <div className="bb-top">
        <img src={getImageUrl(b.image)} alt={b.title} className="img" />
      </div>
      <h4>{b.title}</h4>
      <p>{extractText(b.description)}</p>
    </>
  );

  if (b.cta_link) {
    return (
      <a href={b.cta_link} className="block-box">
        {content}
      </a>
    );
  }

  return <div className="block-box">{content}</div>;
};

export default function WhatWeDeliver({ id, data }) {
  const swiperRef = useRef(null);
  const sliderRef = useRef(null);
  const cursorRef = useRef(null);
  const isDragging = useRef(false);
  const mousePos = useRef({ x: 0, y: 0 });
  const cursorPos = useRef({ x: 0, y: 0 });
  const rafId = useRef(null);

  const [isSlider, setIsSlider] = useState(false);
  const [showDragCursor, setShowDragCursor] = useState(false);

  const blocks = data?.deliverables || [];

  const updateCursorPosition = useCallback(() => {
    if (!showDragCursor) return;
    const cursor = cursorRef.current;
    const slider = sliderRef.current?.querySelector(".swiper");
    if (!cursor || !slider) return;

    const rect = slider.getBoundingClientRect();
    const targetX = mousePos.current.x - rect.left - 75;
    const targetY = mousePos.current.y - rect.top - 75;

    const ease = 0.3;
    cursorPos.current.x += (targetX - cursorPos.current.x) * ease;
    cursorPos.current.y += (targetY - cursorPos.current.y) * ease;

    const x = cursorPos.current.x;
    const y = cursorPos.current.y;
    cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    if (isDragging.current) cursor.classList.add("dragging");
    else cursor.classList.remove("dragging");
  }, [showDragCursor]);

  useEffect(() => {
    const loop = () => {
      updateCursorPosition();
      rafId.current = requestAnimationFrame(loop);
    };

    if (showDragCursor) {
      rafId.current = requestAnimationFrame(loop);
    }

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      rafId.current = null;
    };
  }, [updateCursorPosition, showDragCursor]);

  useEffect(() => {
    const check = () => {
  setIsSlider(true);

  const slidesVisible =
    window.innerWidth >= 1200
      ? 2.35
      : window.innerWidth >= 768
      ? 1.8
      : 1.1;

  setShowDragCursor(blocks.length > Math.floor(slidesVisible));
};

    check();
    window.addEventListener("resize", check);

    return () => window.removeEventListener("resize", check);
  }, [blocks.length]);

  useEffect(() => {
    if (!showDragCursor) return;
    const slider = sliderRef.current?.querySelector(".swiper");
    const cursor = cursorRef.current;

    if (!slider || !cursor) return;

    const onMouseEnter = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      cursor.classList.add("active");
      updateCursorPosition();
    };

    const onMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseLeave = () => {
      cursor.classList.remove("active");
    };

    const onMouseDown = () => {
      isDragging.current = true;
      cursor.classList.add("dragging");
    };

    const onMouseUp = () => {
      isDragging.current = false;
      cursor.classList.remove("dragging");
    };

    slider.addEventListener("mouseenter", onMouseEnter);
    slider.addEventListener("mousemove", onMouseMove);
    slider.addEventListener("mouseleave", onMouseLeave);
    slider.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      slider.removeEventListener("mouseenter", onMouseEnter);
      slider.removeEventListener("mousemove", onMouseMove);
      slider.removeEventListener("mouseleave", onMouseLeave);
      slider.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [showDragCursor]);

  if (!data) return null;

  return (
    <section className="our-approach what-we-deliver" id={id}>
      <div className="container">
        <div className="our-approach-top gap-left">
          <div className="heading">
            <h2 className="reveal-heading">{data?.title}</h2>
          </div>
        </div>

        <div className="our-approach-in gap-left">
          {isSlider ? (
            <div
              className={`block-box-swiper project-delievered-slider${showDragCursor ? " has-custom-cursor" : ""}`}
              ref={sliderRef}
            >
              {showDragCursor && (
                <div ref={cursorRef} className="ttb-drag-cursor">
                  <div className="custom-cursor">
                    <img src="/drag.svg" alt="Drag" />
                  </div>
                </div>
              )}

              <Swiper
  onSwiper={(swiper) => (swiperRef.current = swiper)}
  simulateTouch
  touchStartPreventDefault={false}
  followFinger
  resistance
  resistanceRatio={0.85}
  grabCursor={false}
  allowTouchMove={blocks.length > 2}
  watchOverflow={false}
  loop={false}
  rewind={true}
  centeredSlides={false}
  breakpoints={{
    0: {
      slidesPerView: 1.1,
      spaceBetween: 10,
    },
    768: {
      slidesPerView: 1.8,
      spaceBetween: 12,
    },
    1200: {
      slidesPerView: 2.75,
      spaceBetween: 15,
    },
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