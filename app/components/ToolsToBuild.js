"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getImageUrl } from "./getImageUrl";

// Temporary fallback until the backend adds a dedicated video URL field on
// tools_section cards (fold?.video_url). Once that field exists in the API
// response, it will automatically take priority over this fallback.
const FALLBACK_VIDEO_URL = "https://www.youtube.com/watch?v=a7yNYcLgU_8";

function VideoFold({ videoUrl, thumbnail }) {
  const [playing, setPlaying] = useState(false);
  const iframeRef = useRef(null);

  const getYoutubeId = (url) => {
    if (!url) return "";
    const match = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&]+)/
    );
    return match ? match[1] : "";
  };

  const videoId = getYoutubeId(videoUrl);

  const handlePlay = () => {
    if (!videoId) return;
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
          <img src={thumbnail} alt="Video thumbnail" className="img" />
          <button className="ttb-play-btn" onClick={handlePlay} aria-label="Play">
            <svg viewBox="0 0 24 24" fill="#1A1A1A">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        </>
      )}
      {playing && videoId && (
        <iframe
          ref={iframeRef}
          src={`https://www.youtube.com/embed/${videoId}?controls=1&rel=0&enablejsapi=1&autoplay=1`}
          allow="autoplay; encrypted-media"
          allowFullScreen
          title="Video"
        />
      )}
    </div>
  );
}

export default function ToolsToBuild({ id, data }) {
  const sectionRef = useRef(null);
  const trackRef   = useRef(null);
  const folds = data?.tools || [];

  useEffect(() => {
  if (!folds.length) return;

  gsap.registerPlugin(ScrollTrigger);

  const mm = gsap.matchMedia();

  const notifyStickyState = (active) => {
    window.dispatchEvent(
      new CustomEvent("sticky-section-active", {
        detail: active,
      })
    );
  };

  mm.add(
    {
      isDesktop: "(min-width:768px)",
      isMobile: "(max-width:767px)",
    },
    (context) => {
      const { isDesktop, isMobile } = context.conditions;

      const track = trackRef.current;
      const cards = gsap.utils.toArray(".ttb-fold");

      if (isDesktop) {
        gsap.to(track, {
          x: () => -(track.scrollWidth - window.innerWidth),
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            pin: true,
            scrub: 1.2,
            end: () => `+=${track.scrollWidth - window.innerWidth}`,
            invalidateOnRefresh: true,

            onEnter: () => notifyStickyState(true),
            onLeave: () => notifyStickyState(false),
            onEnterBack: () => notifyStickyState(true),
            onLeaveBack: () => notifyStickyState(false),
          },
        });
      }

      if (isMobile) {
        const scrollDistance = track.scrollWidth - window.innerWidth;

        gsap.to(track, {
          x: -scrollDistance,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: `+=${scrollDistance}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,

            onEnter: () => notifyStickyState(true),
            onLeave: () => notifyStickyState(false),
            onEnterBack: () => notifyStickyState(true),
            onLeaveBack: () => notifyStickyState(false),
          },
        });
      }
    }
  );

  return () => mm.revert();
}, [folds.length]);

  if (!data) return null;

  return (
    <section
      ref={sectionRef}
      className="tools-to-build"
      id={id}
      data-sticky-section
      data-pinned-section
    >
      <div className="container">
        <div className="heading gap-left">
          <h2 className="reveal-heading">{folds?.[0]?.title || ""}</h2>
        </div>
      </div>

      <div className="founder-slide-wrapper">
          <div className="founder-track-in">
            <div ref={trackRef} className="ttb-track gap-left">
              {folds.map((fold, i) => (
                <div className="ttb-fold" key={fold.id ?? i}>
                  <div className="ttb-left">
                    {i === 0 ? (
                      <div className="ttb-media">
                        <img
                          src={getImageUrl(fold?.image)}
                          alt={fold?.title}
                          className="img"
                        />
                      </div>
                    ) : (
                      <VideoFold
                        videoUrl={fold?.video_url || FALLBACK_VIDEO_URL}
                        thumbnail={getImageUrl(fold?.image)}
                      />
                    )}
                  </div>
                  <div className="ttb-right">
                    <p>{fold?.description?.[0]?.children?.[0]?.text}</p>
                    <a href={fold?.cta_link} className="custom-btn">
                      <span>{fold?.cta_text}</span>
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
          </div>
      </div>
    </section>
  );
}