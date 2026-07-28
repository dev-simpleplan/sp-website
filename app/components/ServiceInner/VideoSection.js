"use client";

import { useEffect, useRef, useState } from "react";
import { getImageUrl } from "../getImageUrl";

function getYoutubeId(url) {
  if (!url) return "";
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^&?/]+)/
  );
  return match ? match[1] : "";
}

function VideoBlock({ section }) {
  const iframeRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const sectionLabel = section?.section_label || "";
  const thumbnail = section?.thumbnail ? getImageUrl(section.thumbnail) : "";
  const videoId = getYoutubeId(section?.videourl);

  const handlePlay = () => {
    // guard: if videourl isn't a real youtube link yet (e.g. the "#"
    // placeholder currently coming from Strapi), stay on the thumbnail
    // instead of rendering a broken embed
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
    <div className="video-animated-inner">
      {!playing && (
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
          <button className="video-play-btn" onClick={handlePlay} aria-label="Play">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
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
          title={sectionLabel || "Video"}
        />
      )}
    </div>
  );
}

export default function VideoAnimated({ id, data }) {
  // video_section from the API is an array of blocks
  const blocks = data || [];

  if (!blocks.length) return null;

  return (
    <section className="video-animated-section service-inner" id={id}>
      <div className="container">
        {blocks.map((block) => (
          <div className="video-animated-frame" key={block.id}>
            {block.section_label && <span className="tag">{block.section_label}</span>}
            <VideoBlock section={block} />
          </div>
        ))}
      </div>
    </section>
  );
}