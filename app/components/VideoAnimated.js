"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getImageUrl } from "./getImageUrl";

export default function VideoAnimated({ id, data }) {
  const sectionRef = useRef(null);
  const frameRef = useRef(null);
  const innerRef = useRef(null);
  const iframeRef = useRef(null);

  // started: user has pressed play at least once (iframe stays mounted after).
  // isPlaying: video is meant to be playing; otherwise thumbnail + play icon.
  const [started, setStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const startedRef = useRef(false);
  const isPlayingRef = useRef(false);
  const inViewRef = useRef(false);
  const userPausedRef = useRef(false);
  const playedRef = useRef(false); // YouTube has reported "playing"

  // ===============================
  // API DATA
  // ===============================
  const section = data || {};

  const sectionLabel = section.section_label || "";

  const thumbnail = section.thumbnail?.url
    ? getImageUrl(section.thumbnail)
    : "";

  const videoId = section.videourl
    ? section.videourl.match(
        /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^&?/]+)/
      )?.[1] || ""
    : "";

  // Starts muted (always allowed to autoplay); sound is applied via the API.
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

  const setPlaying = (v) => {
    isPlayingRef.current = v;
    setIsPlaying(v);
  };

  // Sound only while the user is inside this section and it is playing.
  const applyAudio = () => {
    postCmd(inViewRef.current && isPlayingRef.current ? "unMute" : "mute");
  };

  // Play, or resume from the current timestamp.
  const resume = () => {
    userPausedRef.current = false;
    setPlaying(true);

    if (!startedRef.current) {
      startedRef.current = true;
      setStarted(true); // mounts the iframe; load/retry handlers start it
      return;
    }

    postCmd("playVideo");
    applyAudio();
  };

  const togglePlay = () => {
    if (isPlayingRef.current) {
      userPausedRef.current = true;
      postCmd("pauseVideo");
      setPlaying(false);
    } else {
      resume();
    }
  };

  const handleIframeLoad = () => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "listening", id: 1, channel: "widget" }),
      "*"
    );
    if (isPlayingRef.current) {
      postCmd("playVideo");
      applyAudio();
    }
  };

  // Commands sent before the fresh iframe's player is ready are dropped, so
  // keep asking it to play until it reports "playing".
  useEffect(() => {
    if (!started) return;

    const onMessage = (e) => {
      if (e.source !== iframeRef.current?.contentWindow) return;

      let d = e.data;
      if (typeof d === "string") {
        try {
          d = JSON.parse(d);
        } catch {
          return;
        }
      }

      const state =
        d?.event === "onStateChange"
          ? d.info
          : d?.event === "infoDelivery"
          ? d.info?.playerState
          : undefined;

      if (state === 1) {
        playedRef.current = true;
        applyAudio();
      }
    };

    window.addEventListener("message", onMessage);

    let tries = 0;
    const retry = setInterval(() => {
      tries += 1;

      if (playedRef.current || tries > 20 || userPausedRef.current) {
        clearInterval(retry);
        return;
      }

      if (isPlayingRef.current) {
        postCmd("playVideo");
        applyAudio();
      }
    }, 400);

    return () => {
      window.removeEventListener("message", onMessage);
      clearInterval(retry);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
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
    });

    const audioTrigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 70%",
      end: "bottom 30%",
      onToggle: (self) => {
        inViewRef.current = self.isActive;

        if (!startedRef.current) return;

        if (self.isActive) {
          // Coming back: continue from the same timestamp unless the user
          // paused it themselves.
          if (!userPausedRef.current) resume();
        } else {
          applyAudio();
          // Leaving without pausing: pause in place and show the thumbnail.
          if (isPlayingRef.current) {
            postCmd("pauseVideo");
            setPlaying(false);
          }
        }
      },
    });

    return () => {
      mm.revert();
      audioTrigger.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            data-hide-side-rails
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
            {started && videoId && (
              <iframe
                ref={iframeRef}
                src={YT_SRC}
                allow="autoplay; encrypted-media"
                allowFullScreen
                onLoad={handleIframeLoad}
                title={sectionLabel || "SimplePlan Reel"}
              />
            )}

            {/* YouTube renders its own big center play/pause icon inside
                the iframe whenever the video is paused — controls=0 only
                hides the bottom control bar, not that overlay. Since the
                iframe has pointer-events:none (see CSS), that icon is
                purely visual and can't be clicked, so it's just confusing
                next to our own corner button. We can't reach into the
                cross-origin iframe to hide it directly, so instead we
                cover the whole frame with the poster image while paused —
                same idea as a native <video>'s poster reappearing on
                pause — leaving only our corner button visible/clickable. */}
            {!isPlaying && (
              <div
                className="video-pause-overlay"
                aria-hidden="true"
                style={
                  thumbnail
                    ? {
                        backgroundImage: `url(${thumbnail})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }
                    : {}
                }
              />
            )}

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