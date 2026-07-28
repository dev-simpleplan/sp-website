"use client";
import { useEffect, useRef, useState } from "react";
import { getImageUrl } from "./getImageUrl";

const formatDate = (dateString) => {
  if (!dateString) return "";
  const d = new Date(dateString);
  if (isNaN(d)) return "";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

export default function ThinkBeforeBuild({ id, data }) {
  const trackRef   = useRef(null);
  const cursorRef  = useRef(null);
  const isDragging = useRef(false);
  const startX     = useRef(0);
  const scrollLeft = useRef(0);

  const [cursorVisible, setCursorVisible] = useState(false);
  const [cursorPos, setCursorPos]         = useState({ x: 0, y: 0 });

  const posts = data?.blog_posts || [];

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const onMouseMove = (e) => {
      const rect = track.getBoundingClientRect();
      setCursorPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });

      if (isDragging.current) {
        e.preventDefault();
        const dx = e.clientX - startX.current;
        track.scrollLeft = scrollLeft.current - dx;
      }
    };

    const onMouseDown = (e) => {
      isDragging.current = true;
      startX.current     = e.clientX;
      scrollLeft.current = track.scrollLeft;
      track.style.cursor = "grabbing";
    };

    const onMouseUp = () => {
      isDragging.current = false;
      track.style.cursor = "";
    };

    const onMouseEnter = () => setCursorVisible(true);
    const onMouseLeave = () => { setCursorVisible(false); isDragging.current = false; track.style.cursor = ""; };

    track.addEventListener("mousemove",  onMouseMove);
    track.addEventListener("mousedown",  onMouseDown);
    track.addEventListener("mouseup",    onMouseUp);
    track.addEventListener("mouseenter", onMouseEnter);
    track.addEventListener("mouseleave", onMouseLeave);

    return () => {
      track.removeEventListener("mousemove",  onMouseMove);
      track.removeEventListener("mousedown",  onMouseDown);
      track.removeEventListener("mouseup",    onMouseUp);
      track.removeEventListener("mouseenter", onMouseEnter);
      track.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [posts.length]);

  if (!data) return null;

  return (
    <section className="think-to-build" id={id}>
      <div className="container">
        <div className="heading gap-left">
          <h2 className="reveal-heading">{data?.title}</h2>
        </div>
        <div className="think-to-build-in gap-left" ref={trackRef}>
          {/* custom drag cursor */}
          {cursorVisible && (
            <div
              ref={cursorRef}
              className="think-drag-cursor"
              style={{ left: cursorPos.x, top: cursorPos.y }}
            >
              <span>&lt; DRAG &gt;</span>
            </div>
          )}

          {posts.map((post) => (
            <div className="ttb-card" key={post.id}>
              <div className="ttb-card-meta">
                <span className="ttb-date">{formatDate(post.publishing_date)}</span>
                <p className="ttb-title">{post.title}</p>
              </div>
              <div className="ttb-card-img">
                <img
                  src={getImageUrl(post.featured_image)}
                  alt={post.featured_image?.alternativeText || post.title}
                  className="img"
                  draggable="false"
                />
              </div>
              <a href={`/blog/${post.slug}`} className="ttb-read-more">Read More</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}