"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { getImageUrl } from "../getImageUrl";

const PLAY_ICON = (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
    <path d="M6 4.5L17 11L6 17.5V4.5Z" fill="currentColor" />
  </svg>
);

const isVideo = (media) =>
  media?.mime?.toLowerCase().startsWith("video/");

function MediaBlock({ media, alt }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  if (!media) return null;

  if (isVideo(media)) {
    const handlePlay = async () => {
      setPlaying(true);

      try {
        await videoRef.current?.play();
      } catch (err) {
        console.error(err);
      }
    };

    const handleEnded = () => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }

      setPlaying(false);
    };

    return (
      <div className="for-good-video-wrap">
        <video
          ref={videoRef}
          src={getImageUrl(media)}
          poster={
            media?.poster
              ? getImageUrl(media.poster)
              : media?.previewUrl || undefined
          }
          className="img"
          playsInline
          preload="metadata"
          controls={playing}
          onEnded={handleEnded}
        />

        {!playing && (
          <button
            type="button"
            className="video-play-btn"
            onClick={handlePlay}
            aria-label="Play video"
          >
            {PLAY_ICON}
          </button>
        )}
      </div>
    );
  }

  return (
    <img
      src={getImageUrl(media)}
      alt={alt || "Media"}
      className="img"
    />
  );
}

export default function Initiatives({ id, data }) {
  if (!data) return null;

  const title = data?.title;
  const description =
    data?.description?.[0]?.children?.[0]?.text;
  const ctaText = data?.cta_text;
  const ctaLink = data?.cta_link;

  return (
    <section className="sp-for-good-sec" id={id}>
      <div className="container">
        <div className="spFor-good-in gap-left">
          <div className="heading">
            <h2 className="reveal-heading">{title}</h2>
          </div>

          <div className="spFor-good-grid">
            <div className="for-good-img">
              <MediaBlock
                media={data?.image}
                alt={title}
              />
            </div>

            <div className="for-good-info">
              <p>{description}</p>

              {ctaLink && (
  <div className="for-good-cta">
    <Link
      href={ctaLink}
      className="custom-btn"
      target="_blank"
      rel="noopener noreferrer"
    >
      <span>{ctaText}</span>

      <span className="arrow-wrap">
        <svg
          className="arrow arrow-1"
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0.878125 11.6667L0 10.7885L9.53854 1.25H3.75V0H11.6667V7.91667H10.4167V2.12813L0.878125 11.6667Z"
            fill="currentColor"
          />
        </svg>

        <svg
          className="arrow arrow-2"
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0.878125 11.6667L0 10.7885L9.53854 1.25H3.75V0H11.6667V7.91667H10.4167V2.12813L0.878125 11.6667Z"
            fill="currentColor"
          />
        </svg>
      </span>
    </Link>
  </div>
)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}