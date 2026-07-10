"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Wayfinding.module.css";

/**
 * Wayfinding
 * ----------
 * A left-side "you are here" rail for long, section-based pages.
 *
 * IMPORTANT: this is intentionally NOT a click-to-scroll nav.
 * If your page has sticky-positioned sections, scrollIntoView()/scrollTo()
 * calculations get thrown off (a sticky section's on-screen position and its
 * real offsetTop in the document disagree once it's pinned), so a click
 * handler here would frequently jump to the wrong place or fight the
 * sticky element. Instead this component only *reflects* scroll position —
 * it watches which section is on screen with IntersectionObserver and
 * lights up the matching marker. Hovering reveals all section names.
 *
 * Usage:
 *   <Wayfinding
 *     sections={[
 *       { id: "hero", label: "Home" },
 *       { id: "what-we-do", label: "What We Do" },
 *       { id: "our-work", label: "Our Work" },
 *       { id: "clients", label: "Clients" },
 *       { id: "contact", label: "Contact" },
 *     ]}
 *   />
 *
 * Each entry's `id` must match the `id` attribute on the actual section
 * element in your page (e.g. <section id="hero">...</section>).
 */
export default function Wayfinding({ sections = [], id }) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? null);
  const [isHovered, setIsHovered] = useState(false);
  const ratiosRef = useRef({});

  useEffect(() => {
    if (!sections.length) return;

    const elements = sections
      .map((section) => ({
        id: section.id,
        el: document.getElementById(section.id),
      }))
      .filter((entry) => entry.el);

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          ratiosRef.current[entry.target.id] = entry.intersectionRatio;
        });

        // Pick whichever observed section currently has the greatest
        // visible ratio. This holds up well even when a sticky section
        // stays pinned on screen for a long scroll range, since its ratio
        // naturally stays high while it's the dominant thing in view.
        let bestId = null;
        let bestRatio = 0;
        for (const [id, ratio] of Object.entries(ratiosRef.current)) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        }
        if (bestId && bestRatio > 0) {
          setActiveId(bestId);
        }
      },
      {
        // Multiple thresholds so we get updates as ratio changes gradually,
        // not just at one crossing point.
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
        // Slightly shrink the observed viewport vertically so a section
        // has to be reasonably centered before it "wins" — this avoids
        // flicker when a sticky section overlaps the next one.
        rootMargin: "-15% 0px -15% 0px",
      }
    );

    elements.forEach(({ el }) => observer.observe(el));

    return () => observer.disconnect();
  }, [sections]);

  if (!sections.length) return null;

  return (
    <nav
      className={styles.spWayfinding}
      aria-label="Page sections"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={styles.spWayfindingLine} aria-hidden="true" />

      <ul className={styles.spWayfindingList}>
        {sections.map((section) => {
          const isActive = section.id === activeId;
          return (
            <li key={section.id} className={styles.spWayfindingItem}>
              <span
                className={`${styles.spWayfindingDot} ${
                  isActive ? styles.spWayfindingDotActive : ""
                }`}
                aria-hidden="true"
              />
              <span
                className={`${styles.spWayfindingLabel} ${
                  isHovered ? styles.spWayfindingLabelVisible : ""
                } ${isActive ? styles.spWayfindingLabelActive : ""}`}
              >
                {section.label}
              </span>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}