"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ttbImg from "./images/ttb-img.png";

const VIDEO_ID = "a7yNYcLgU_8";
const THUMBNAIL = `https://img.youtube.com/vi/${VIDEO_ID}/maxresdefault.jpg`;

const folds = [
  {
    type: "image",
    text: "We've packaged everything we know into tools, templates, and SaaS products built for founders, freelancers, and agency owners. Whether you're building a brand from scratch or scaling an existing one, our products give you the thinking, the frameworks, and the tools to do it right.",
    btnLabel: "Explore products",
    btnHref: "#!",
  },
  {
    type: "video",
    text: "We create educational content for people who are figuring it out — freelancers, students, creative professionals, and early-stage founders. Free resources, paid courses, and real expertise, all designed to make branding and strategy feel less overwhelming.",
    btnLabel: "Explore content",
    btnHref: "#!",
  },
];

function VideoFold() {
  const [playing, setPlaying] = useState(false);
  const iframeRef = useRef(null);

  const handlePlay = () => {
    setPlaying(true);
    setTimeout(() => {
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: "command", func: "playVideo", args: [] }),
        "*"
      );
    }, 100);
  };

  return (
    <div className="ttb-media ttb-video-wrap">
      {!playing && (
        <>
          <img src={THUMBNAIL} alt="Video thumbnail" className="img" />
          <button className="ttb-play-btn" onClick={handlePlay} aria-label="Play">
            <svg viewBox="0 0 24 24" fill="#1A1A1A">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        </>
      )}
      {playing && (
        <iframe
          ref={iframeRef}
          src={`https://www.youtube.com/embed/${VIDEO_ID}?controls=1&rel=0&enablejsapi=1&autoplay=1`}
          allow="autoplay; encrypted-media"
          allowFullScreen
          title="Video"
        />
      )}
    </div>
  );
}

export default function ToolsToBuild({id}) {
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
    <section ref={sectionRef} className="tools-to-build" id={id}>
      <div className="container">
        <div className="heading">
          <h2 className="reveal-heading">Tools to build your brand</h2>
        </div>
      </div>

      <div ref={trackRef} className="ttb-track">
        {folds.map((fold, i) => (
          <div className="ttb-fold" key={i}>
            <div className="ttb-left">
              {fold.type === "image" ? (
                <div className="ttb-media">
                  <img src={ttbImg.src} alt="Tools" className="img" />
                </div>
              ) : (
                <VideoFold />
              )}
            </div>
            <div className="ttb-right">
              <p>{fold.text}</p>
              <a href={fold.btnHref} className="custom-btn">
                <span>{fold.btnLabel}</span>
                <span className="arrow-wrap">
                      <svg className="arrow arrow-1" width="12" height="12" viewBox="0 0 12 12" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                          <path
                                d="M0.878125 11.6667L0 10.7885L9.53854 1.25H3.75V0H11.6667V7.91667H10.4167V2.12813L0.878125 11.6667Z"
                                fill="currentColor" />
                      </svg>

                      <svg className="arrow arrow-2" width="12" height="12" viewBox="0 0 12 12" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                          <path
                                d="M0.878125 11.6667L0 10.7885L9.53854 1.25H3.75V0H11.6667V7.91667H10.4167V2.12813L0.878125 11.6667Z"
                                fill="currentColor" />
                      </svg>
                  </span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
