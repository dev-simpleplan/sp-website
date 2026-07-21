"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function VideoAnimated({ id, data }) {
  const sectionRef = useRef(null);
  const frameRef = useRef(null);
  const innerRef = useRef(null);
  const iframeRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(true);

  // ===============================
  // API DATA
  // ===============================
  const section = data || {};

  const sectionLabel = section.section_label || "";

  const thumbnail = section.thumbnail?.url
    ? `${process.env.NEXT_PUBLIC_API_URL}${section.thumbnail.url}`
    : "";

  const videoId = section.videourl
    ? section.videourl.match(
        /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^&?/]+)/
      )?.[1] || ""
    : "";

  const YT_SRC = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0&playsinline=1&enablejsapi=1`;

  const postCmd = (func) => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({
        event: "command",
        func,
        args: [],
      }),
      "*"
    );
  };

  const togglePlay = () => {
    const next = !isPlaying;
    postCmd(next ? "playVideo" : "pauseVideo");
    setIsPlaying(next);
  };

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        frameRef.current,
        {
          y: "30vh",
        },
        {
          y: "0vh",
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "top top",
            scrub: true,
          },
        }
      );

      gsap.fromTo(
        innerRef.current,
        {
          scale: 0.62,
        },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.5,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="video-animated-section"
      id={id}
      data-sticky-section
    >
      <div className="video-animated-sticky">
        <div ref={frameRef} className="video-animated-frame">
          <div
            ref={innerRef}
            className="video-animated-inner"
            style={
              thumbnail
                ? {
                    backgroundImage: `url(${thumbnail})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }
                : {}
            }
          >
            <iframe
              ref={iframeRef}
              src={YT_SRC}
              allow="autoplay; encrypted-media"
              allowFullScreen
              title={sectionLabel || "SimplePlan Reel"}
            />

            <button
              className="video-play-btn"
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}