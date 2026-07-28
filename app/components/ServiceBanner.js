"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./service-outer.module.css";

const PLAY_ICON = (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
    <path d="M6 4.5L17 11L6 17.5V4.5Z" fill="currentColor" />
  </svg>
);

// Loads the YouTube IFrame Player API script once and shares the same
// promise across every ServiceBanner instance on the page.
let ytApiPromise = null;
function loadYouTubeIframeApi() {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.YT && window.YT.Player) return Promise.resolve();
  if (ytApiPromise) return ytApiPromise;

  ytApiPromise = new Promise((resolve) => {
    const prevCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prevCallback?.();
      resolve();
    };
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
  });

  return ytApiPromise;
}

export default function ServiceBanner({ data }) {
  const iframeRef = useRef(null);
  const playerRef = useRef(null);
  const [started, setStarted] = useState(false);

  const banner = data || {};

  const tagLabel = banner.tagline || "";
  const title = banner.title || "";
  const subtext = banner.description?.[0]?.children?.[0]?.text || "";
  const ctaText = banner.cta_text || "Start A Branding Project";
  const ctaHref = banner.cta_link || "#";

  const rawThumbUrl = banner.video_thumbnail?.url || "";
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";

  let thumbnail = "/service-banner.png"; // fallback
  if (rawThumbUrl) {
    if (rawThumbUrl.startsWith("http")) {
      // Strapi already returned a full URL
      thumbnail = rawThumbUrl;
    } else if (apiUrl) {
      thumbnail = `${apiUrl}${rawThumbUrl}`;
    } else {
      console.warn(
        "NEXT_PUBLIC_API_URL is not set — falling back to placeholder thumbnail. Check .env.local."
      );
    }
  }

  const thumbnailAlt = banner.video_thumbnail?.alternativeText || title || "Video thumbnail";

  const videoId = banner.videourl
    ? banner.videourl.match(
        /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^&?/]+)/
      )?.[1] || ""
    : "";

  // Create the real YouTube player once, when the iframe first mounts.
  // We never destroy() it on end/replay — destroy() removes the <iframe>
  // from the DOM directly, which fights with React's reconciliation and
  // breaks the next render. We only destroy on unmount.
  useEffect(() => {
    if (!videoId) return;

    let cancelled = false;

    loadYouTubeIframeApi().then(() => {
      if (cancelled || !iframeRef.current) return;

      playerRef.current = new window.YT.Player(iframeRef.current, {
        events: {
          onStateChange: (e) => {
            if (e.data === window.YT.PlayerState.ENDED) {
              // stopVideo() resets the player to its unstarted state
              // without touching the DOM node — safe to call repeatedly.
              playerRef.current?.stopVideo?.();
              setStarted(false); // back to default: thumbnail + play button
            }
          },
        },
      });
    });

    return () => {
      cancelled = true;
      playerRef.current?.destroy?.();
      playerRef.current = null;
    };
  }, [videoId]);

  function handlePlayClick() {
    setStarted(true); // hides thumbnail + play button immediately
    playerRef.current?.playVideo?.();
  }

  return (
    <section className={styles.spServiceBanner}>
      <div className="container">
        <div className={styles.spServiceBannerInner}>
          <div className={styles.spContent}>
            <h2 className={`${styles.spHeading} reveal-heading`}>{title}</h2>

            <p className={styles.spSubtext}>{subtext}</p>

            <Link href={ctaHref} className="custom-btn">
              <span>{ctaText}</span>
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
            </Link>
          </div>

          <div className={styles.spVideoWrap}>
            {videoId && (
              <iframe
                ref={iframeRef}
                src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&playsinline=1&modestbranding=1&rel=0`}
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                title={title || "Showreel"}
                className={styles.spVideoIframe}
              />
            )}

            {!started && (
              <>
                <Image
                  src={thumbnail}
                  alt={thumbnailAlt}
                  fill
                  className={styles.spThumbnail}
                  sizes="(max-width: 900px) 100vw, 50vw"
                  priority
                />
                <button
                  type="button"
                  className={styles.spPlayBtn}
                  aria-label="Play showreel"
                  onClick={handlePlayClick}
                >
                  {PLAY_ICON}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}