"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "../Service-outer/service-outer.module.css";

const ARROW_UP_RIGHT = (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path
      d="M3 11L11 3M11 3H4M11 3V10"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PLAY_ICON = (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
    <path d="M6 4.5L17 11L6 17.5V4.5Z" fill="currentColor" />
  </svg>
);

const CLOSE_ICON = (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path
      d="M1 1L19 19M19 1L1 19"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

export default function ServiceBanner({data}) {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  function openVideo() {
    setIsVideoOpen(true);
  }

  function closeVideo() {
    setIsVideoOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = isVideoOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isVideoOpen]);

  useEffect(() => {
    function handleEscape(event) {
      if (event.key === "Escape") closeVideo();
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const banner = data || {};

const title = banner.title || "";

const subtext =
  banner.description?.[0]?.children?.[0]?.text || "";

const ctaText = banner.cta_text || "";

const ctaHref = banner.cta_link || "#";

const overlayText = banner.tagline || "";

const thumbnail = banner.video_thumbnail?.url
  ? `${process.env.NEXT_PUBLIC_API_URL}${banner.video_thumbnail.url}`
  : "/service-banner.png";

const videoId = banner.videourl
  ? banner.videourl.match(
      /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^&?/]+)/
    )?.[1] || ""
  : "";

  return (
    <section className={styles.spServiceBanner}>

      <div className={styles.spServiceBannerInner}>
        <div className={styles.spContent}>
          <h2 className={styles.spHeading}>
  {title}
</h2>

          <p className={styles.spSubtext}>{subtext}</p>

          <Link href={ctaHref} className={styles.spCta}>
            <span>{ctaText}</span>
            <span className={styles.spCtaIcon}>{ARROW_UP_RIGHT}</span>
          </Link>
        </div>

        <div className={styles.spVideoWrap}>
          <button
            type="button"
            className={styles.spPlayBtn}
            aria-label="Play showreel"
            onClick={openVideo}
          >
            {PLAY_ICON}
          </button>

            <Image
              src={thumbnail}
              alt={overlayText}
              fill
              className={styles.spThumbnail}
              sizes="(max-width: 900px) 100vw, 50vw"
            />

          {overlayText && (
            <span className={styles.spOverlayText}>{overlayText}</span>
          )}
        </div>
      </div>

      <div
        className={`${styles.spVideoModalBackdrop} ${
          isVideoOpen ? styles.spVideoModalBackdropOpen : ""
        }`}
        onClick={closeVideo}
      >
        <div
          className={`${styles.spVideoModal} ${
            isVideoOpen ? styles.spVideoModalOpen : ""
          }`}
          onClick={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            className={styles.spVideoModalClose}
            aria-label="Close video"
            onClick={closeVideo}
          >
            {CLOSE_ICON}
          </button>

          <div className={styles.spVideoModalFrame}>
            {isVideoOpen && videoId && (
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                title="Showreel"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                className={styles.spVideoModalIframe}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}