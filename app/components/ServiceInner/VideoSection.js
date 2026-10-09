
"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getImageUrl } from "../getImageUrl";

function getYoutubeId(url) {
  if (!url) return "";

  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^&?/]+)/
  );

  return match ? match[1] : "";
}

function isDirectVideo(url) {
  return !!url && /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url);
}

function getVideoFileUrl(url) {
  if (!url) return "";

  // Same-origin proxy avoids mixed-content blocking of the http Strapi host.
  return getImageUrl({ url });
}

function VideoBlock({ section }) {
  const iframeRef = useRef(null);
  const videoRef = useRef(null);
  const trackRef = useRef(null);
  const innerRef = useRef(null);

  // started: user has clicked play at least once (media stays mounted after).
  // showThumb: thumbnail + play button overlay is visible.
  const [started, setStarted] = useState(false);
  const [showThumb, setShowThumb] = useState(true);

  const inViewRef = useRef(false);
  const startedRef = useRef(false);
  const showThumbRef = useRef(true);
  const userPausedRef = useRef(false); // user paused it themselves
  const endedRef = useRef(false);
  const programmaticAtRef = useRef(0); // when we last paused it ourselves
  const playedRef = useRef(false); // YouTube has actually reported "playing"

  // A pause within this window of our own pause() call is not the user's.
  const isOurPause = () => Date.now() - programmaticAtRef.current < 1500;

  const sectionLabel = section?.section_label || "";
  const thumbnail = section?.thumbnail
    ? getImageUrl(section.thumbnail)
    : "";

  const rawVideoUrl = section?.videourl || "";
  const videoId = getYoutubeId(rawVideoUrl);
  const isFile = !videoId && isDirectVideo(rawVideoUrl);
  const fileUrl = isFile ? getVideoFileUrl(rawVideoUrl) : "";

  const setThumb = (v) => {
    showThumbRef.current = v;
    setShowThumb(v);
  };

  const ytCmd = (func, args = []) => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func, args }),
      "*"
    );
  };

  // Sound is on only while the user is inside this section.
  const applyAudio = () => {
    const on = inViewRef.current;

    if (videoRef.current) {
      videoRef.current.muted = !on;
      if (on) videoRef.current.volume = 1;
    }

    ytCmd(on ? "unMute" : "mute");
  };

  // Resume from the current timestamp (or start for the first time).
  const resume = () => {
    userPausedRef.current = false;
    endedRef.current = false;
    setThumb(false);

    if (!startedRef.current) {
      startedRef.current = true;
      setStarted(true); // mounts the media; it starts itself (see below)
      return;
    }

    if (isFile) {
      applyAudio();
      videoRef.current?.play().catch(() => {});
    } else {
      applyAudio();
      ytCmd("playVideo");
    }
  };

  // Leaving the section without pausing: pause in place, show the thumbnail.
  const autoPause = () => {
    programmaticAtRef.current = Date.now();

    if (isFile) {
      videoRef.current?.pause();
    } else {
      ytCmd("pauseVideo");
    }

    setThumb(true);
  };

  // Sticky + scale-up on scroll, and section enter/leave handling.
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const tween = gsap.fromTo(
        innerRef.current,
        { scale: 0.62 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: trackRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.5,
          },
        }
      );

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });

    const sectionTrigger = ScrollTrigger.create({
      trigger: trackRef.current,
      start: "top 70%",
      end: "bottom 30%",
      onToggle: (self) => {
        inViewRef.current = self.isActive;

        if (!startedRef.current) return;

        if (self.isActive) {
          // Coming back: autoplay from the same timestamp, unless the user
          // paused it themselves or it already finished.
          if (!userPausedRef.current && !endedRef.current) resume();
          else applyAudio();
        } else {
          applyAudio();
          if (!showThumbRef.current && !userPausedRef.current) autoPause();
        }
      },
    });

    return () => {
      mm.revert();
      sectionTrigger.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // First play for an uploaded file: start it once the element is mounted.
  useEffect(() => {
    if (!started || !isFile || !videoRef.current) return;

    const video = videoRef.current;

    video.muted = !inViewRef.current;
    video.volume = 1;
    video.play().catch(() => {});
  }, [started, isFile, fileUrl]);

  // YouTube: listen to player state to tell user pauses from our own.
  useEffect(() => {
    if (!started || !videoId) return;

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
        userPausedRef.current = false;
        applyAudio();
      } else if (state === 2) {
        // Only a pause after real playback, not made by us, is the user's.
        if (playedRef.current && !isOurPause()) userPausedRef.current = true;
      } else if (state === 0) {
        endedRef.current = true;
        setThumb(true);
      }
    };

    window.addEventListener("message", onMessage);

    // The first play click mounts a fresh iframe, and commands sent before
    // the player is ready are silently dropped (video stays paused). Keep
    // asking it to play until it reports "playing".
    let tries = 0;
    const retry = setInterval(() => {
      tries += 1;

      if (
        playedRef.current ||
        tries > 20 ||
        userPausedRef.current ||
        endedRef.current
      ) {
        clearInterval(retry);
        return;
      }

      if (!showThumbRef.current) {
        ytCmd("playVideo");
        applyAudio();
      }
    }, 400);

    return () => {
      window.removeEventListener("message", onMessage);
      clearInterval(retry);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, videoId]);

  useEffect(() => {
    const video = videoRef.current;
    return () => {
      video?.pause();
    };
  }, []);

  const handleFileEnded = () => {
    if (videoRef.current) videoRef.current.currentTime = 0;
    endedRef.current = true;
    setThumb(true);
  };

  const handleFilePause = () => {
    if (isOurPause()) return;
    // Ignore the pause event fired right before "ended".
    if (videoRef.current?.ended) return;
    userPausedRef.current = true;
  };

  const handleIframeLoad = () => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "listening", id: 1, channel: "widget" }),
      "*"
    );
    applyAudio();

    // Don't rely on the URL's autoplay flag alone (some browsers drop it):
    // explicitly start playback if the user is meant to be watching.
    if (!showThumbRef.current && !userPausedRef.current && !endedRef.current) {
      ytCmd("playVideo");
    }
  };

  return (
    <div className="vs-track" ref={trackRef}>
      <div className="vs-sticky">
        {sectionLabel && <span className="tag">{sectionLabel}</span>}

        <div className="video-animated-inner" ref={innerRef}>
          {started && videoId && (
            <iframe
              ref={iframeRef}
              src={`https://www.youtube.com/embed/${videoId}?controls=1&rel=0&enablejsapi=1&autoplay=1&mute=1&playsinline=1`}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              title={sectionLabel || "Video"}
              onLoad={handleIframeLoad}
            />
          )}

          {started && isFile && (
            <video
              ref={videoRef}
              src={fileUrl}
              controls
              playsInline
              preload="metadata"
              onPlay={() => {
                userPausedRef.current = false;
                endedRef.current = false;
                setThumb(false);
              }}
              onPause={handleFilePause}
              onEnded={handleFileEnded}
              title={sectionLabel || "Video"}
            />
          )}

          {showThumb && (
            <>
              <div
                className="video-thumbnail-cover"
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

              {(videoId || isFile) && (
                <button
                  className="video-play-btn"
                  onClick={resume}
                  aria-label="Play"
                  type="button"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VideoAnimated({ id, data }) {
  // video_section from the API is an array of blocks.
  const blocks = data || [];

  if (!blocks.length) return null;

  return (
    <section className="video-animated-section service-inner" id={id}>
      <div className="container">
        {blocks.map((block) => (
          <VideoBlock section={block} key={block.id} />
        ))}
      </div>
    </section>
  );
}