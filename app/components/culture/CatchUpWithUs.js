"use client";
import { useEffect, useRef, useState } from "react";
import { getImageUrl } from "../getImageUrl";

// The ticker shows the latest reels of the Instagram account (via
// /api/instagram-reels). While that is not configured / returns nothing, it
// falls back to the static Strapi `community.images`.
//
// NOTE: `community.images` is a plain array of Strapi media objects — no
// per-image link or video flag, so ticker items render as static images
// (no "watch" badge, nothing to click through to). If per-post links or a
// video indicator get added to this field later, that's easy to wire back
// in — see the "is_video" version of this file in chat history.
//
// `social_media` items don't send an icon field right now — getImageUrl()
// already falls back to /fallback-image.jpg when passed undefined/missing
// media, so nothing extra is needed here; once Strapi adds a `social_icon`
// field per item, the real icon shows up automatically.
// One reel in the ticker. Plays muted on a loop, but only while it is on
// screen — the ticker holds many duplicated videos and decoding them all at
// once would be heavy.
function ReelItem({ reel, focusable }) {
  const itemRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const el = itemRef.current;
    const video = videoRef.current;
    if (!el || !video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <a
      ref={itemRef}
      className="catch-up-item"
      href={reel.permalink}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Watch reel on Instagram"
      tabIndex={focusable ? 0 : -1}
    >
      {reel.video ? (
        <video
          ref={videoRef}
          className="img"
          src={reel.video}
          poster={reel.thumbnail}
          muted
          loop
          playsInline
          preload="none"
          draggable="false"
        />
      ) : (
        <img
          src={reel.thumbnail}
          alt=""
          className="img"
          draggable="false"
          referrerPolicy="no-referrer"
        />
      )}
    </a>
  );
}

export default function CatchUpWithUs({ id, data }) {
  const socials = data?.social_media || [];
  const images = data?.images || [];

  const [reels, setReels] = useState([]);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/instagram-reels")
      .then((res) => (res.ok ? res.json() : { reels: [] }))
      .then((json) => {
        if (!cancelled) setReels(json.reels || []);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  const hasReels = reels.length > 0;
  const items = hasReels ? reels : images;

  // Same duplicate-for-seamless-loop trick as BucketList.js / OffsitesRetreats.
  const tickerImages = [...items, ...items];

  if (!data) return null;

  return (
    <section className="catch-up-section" id={id}>
      <div className="container">
        <div className="catch-up-in gap-left">
          <h2 className="reveal-heading">{data?.title}</h2>

          {socials.length > 0 && (
            <div className="catch-up-socials">
              {socials.map((social) => (
                <a
                  href={social?.social_link || "#"}
                  key={social.id}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="catch-up-social-icon"
                >
                  <img
                    src={getImageUrl(social?.social_icon)}
                    alt=""
                    className="img"
                  />
                </a>
              ))}
            </div>
          )}

          {items.length > 0 && (
            <div className="catch-up-ticker">
              <div className="catch-up-track">
                {tickerImages.map((item, index) =>
                  hasReels ? (
                    <ReelItem
                      key={`${item.id}-${index}`}
                      reel={item}
                      focusable={index < reels.length}
                    />
                  ) : (
                    <div
                      className="catch-up-item"
                      key={`${item.id}-${index}`}
                    >
                      <img
                        src={getImageUrl(item, "small")}
                        alt=""
                        className="img"
                        draggable="false"
                      />
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}