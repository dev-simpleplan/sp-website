"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const VIDEO_ID = "jGcetqbi53o";
const YT_SRC = `https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&mute=1&loop=1&playlist=${VIDEO_ID}&controls=0&modestbranding=1&rel=0&playsinline=1&enablejsapi=1`;

export default function VideoAnimated({id}) {
  const sectionRef = useRef(null);
  const frameRef  = useRef(null);   // parallax target (whole frame)
  const innerRef  = useRef(null);   // zoom target (container-sized box)
  const iframeRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const postCmd = (func) => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func, args: [] }),
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
      // 1. Pre-pin parallax — frame rushes upward as section enters the viewport
      //    starts when section bottom hits viewport bottom, ends when section pins
      gsap.fromTo(
        frameRef.current,
        { y: "30vh" },
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

      // 2. Zoom — once section is pinned, scale inner from small → container size
      gsap.fromTo(
        innerRef.current,
        { scale: 0.62 },
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
    <section ref={sectionRef} className="video-animated-section" id={id}>
      <div className="video-animated-sticky">
        <div ref={frameRef} className="video-animated-frame">
          <div ref={innerRef} className="video-animated-inner">
            <iframe
              ref={iframeRef}
              src={YT_SRC}
              allow="autoplay; encrypted-media"
              allowFullScreen
              title="SimplePlan Reel"
            />
            <button
              className="video-play-btn"
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
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
