"use client";
import { useEffect, useRef, useState } from "react";
import tbb1 from "./images/tbb1.png";
import tbb2 from "./images/tbb2.png";
import tbb3 from "./images/tbb3.png";

const posts = [
  {
    date: "03/05/2026",
    title: "What Is Brand's: Tone of Voice (and how to derive it)",
    image: tbb1,
    href: "#!",
  },
  {
    date: "03/05/2026",
    title: "What Is Brand's: Tone of Voice (and how to derive it)",
    image: tbb2,
    href: "#!",
  },
  {
    date: "03/05/2026",
    title: "What Is Brand's: Tone of Voice (and how to derive it)",
    image: tbb3,
    href: "#!",
  },
  {
    date: "03/05/2026",
    title: "What Is Brand's: Tone of Voice (and how to derive it)",
    image: tbb2,
    href: "#!",
  },
];

export default function ThinkBeforeBuild() {
  const trackRef   = useRef(null);
  const cursorRef  = useRef(null);
  const isDragging = useRef(false);
  const startX     = useRef(0);
  const scrollLeft = useRef(0);

  const [cursorVisible, setCursorVisible] = useState(false);
  const [cursorPos, setCursorPos]         = useState({ x: 0, y: 0 });

  useEffect(() => {
    const track = trackRef.current;

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
  }, []);

  return (
    <section className="think-to-build">
      <div className="container">
        <div className="heading">
          <h2>Think before you build</h2>
        </div>
      </div>

      <div className="think-to-build-in" ref={trackRef}>
        {/* custom drag cursor */}
        {cursorVisible && (
          <div
            ref={cursorRef}
            className="ttb-drag-cursor"
            style={{ left: cursorPos.x, top: cursorPos.y }}
          >
            <span>&lt; DRAG &gt;</span>
          </div>
        )}

        {posts.map((post, i) => (
          <div className="ttb-card" key={i}>
            <div className="ttb-card-meta">
              <span className="ttb-date">{post.date}</span>
              <p className="ttb-title">{post.title}</p>
            </div>
            <div className="ttb-card-img">
              <img src={post.image.src} alt={post.title} className="img" draggable="false" />
            </div>
            <a href={post.href} className="ttb-read-more">Read More</a>
          </div>
        ))}
      </div>
    </section>
  );
}
