"use client";
import { useRef, useState } from "react";

const VIDEO_ID = "a7yNYcLgU_8";
const YT_SRC = `https://www.youtube.com/embed/${VIDEO_ID}?controls=0&modestbranding=1&rel=0&playsinline=1&enablejsapi=1`;
const THUMBNAIL = `https://img.youtube.com/vi/${VIDEO_ID}/maxresdefault.jpg`;

export default function MeetTheSimp() {
  const iframeRef = useRef(null);
  const [started, setStarted]   = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const postCmd = (func) => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func, args: [] }),
      "*"
    );
  };

  const togglePlay = () => {
    if (!started) {
      // First click: hide thumbnail, start video
      setStarted(true);
      setIsPlaying(true);
      // Small delay so iframe is interactive after thumbnail unmounts
      setTimeout(() => postCmd("playVideo"), 100);
      return;
    }
    const next = !isPlaying;
    postCmd(next ? "playVideo" : "pauseVideo");
    setIsPlaying(next);
  };

  return (
    <section className="meet-the-simp">
      <div className="container">
        <div className="heading">
          <h2>Meet the Simps</h2>
          <p>
            SimplePlan started in 2018 with a simple idea — that building a
            brand shouldn't be this hard.
          </p>
        </div>
        <div className="meet-the-simp-in">
          <div className="left">
            <div className="meet-simp-video">
              <iframe
                ref={iframeRef}
                src={YT_SRC}
                allow="autoplay; encrypted-media"
                allowFullScreen
                title="Meet the Simps"
              />

              {/* Covers YouTube UI until user hits play */}
              {!started && (
                <div
                  className="video-thumbnail-cover"
                  style={{ backgroundImage: `url(${THUMBNAIL})` }}
                />
              )}

              {/* Blocks YouTube overlays after play starts */}
              <div className="video-overlay" />

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
          <div className="right">
            <p>
              We work with founders to cut through the noise & find what makes
              them different.
            </p>
            <p>
              Strategy, identity, websites, and marketing — all under one roof,
              all pointing in the same direction.
            </p>
            <div className="know-more-cta">
              <a href="#!" className="custom-btn">
                know more about us
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
