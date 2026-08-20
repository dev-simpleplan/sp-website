"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import cardImg from "./images/we-are-p.png";

// Static placeholder data — the API currently only returns one work item
// (the "invouge" one, matching what OurWorkBanner used to hardcode). Add
// more entries here for now; once the CMS has multiple case studies this
// whole array should be replaced with `data` mapped from the
// `work_banner`/`case_study` API response instead.
const WORK_ITEMS = [
  {
    id: "invouge",
    tag: "Fashion & Beauty",
    title: "invouge",
    subtitle: "Lorem ipsum dolor sit amet consectetur.",
    stat: { value: "1.2", suffix: "x", label: "Revenue Growth" },
    whatWeDid: ["Brand Positioning"],
    image: cardImg.src,
    href: "#",
  },
  {
    id: "lumen",
    tag: "Wellness",
    title: "lumen",
    subtitle: "Lorem ipsum dolor sit amet consectetur.",
    stat: { value: "2.4", suffix: "x", label: "Engagement" },
    whatWeDid: ["Visual Identity"],
    image: cardImg.src,
    href: "#",
  },
  {
    id: "atlas",
    tag: "Technology",
    title: "atlas",
    subtitle: "Lorem ipsum dolor sit amet consectetur.",
    stat: { value: "3.1", suffix: "x", label: "User Growth" },
    whatWeDid: ["Web Design"],
    image: cardImg.src,
    href: "#",
  },
];

// How long the scroll has to be still before the currently-visible item's
// image grows to fill its section. Kept short so the grow reads as a
// direct response to the user pausing, not a random delayed animation.
const SCROLL_PAUSE_MS = 350;

// An item counts as "in view enough to grow" once it covers at least this
// much of the observed viewport band. Using a flat threshold (rather than
// "only the single highest ratio") is what lets two items grow at once
// when the user pauses with them roughly half-and-half on screen — both
// clear the bar together instead of one arbitrarily winning.
const ACTIVE_RATIO_THRESHOLD = 0.35;

const COMPACT_RADIUS = 16; // px — rounded corners in the resting card state

export default function OurWorkBanner({ id }) {
  const [activeIds, setActiveIds] = useState(() => (WORK_ITEMS[0] ? [WORK_ITEMS[0].id] : []));
  const [isPaused, setIsPaused] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const itemRefs = useRef({});
  const wrapRefs = useRef({}); // the compact card's image slot — defines layout + the resting crop window
  const stageRefs = useRef({}); // always sized to the full grown target; the <img> lives in here, never distorted
  const cursorCtaRef = useRef(null);
  const cursorCtaCleanupRefs = useRef([]);
  const ratiosRef = useRef({});

  // Tracks every item that's meaningfully in view (ratio above the
  // threshold), not just the single most-visible one — so when two items
  // are each about half-visible, both qualify and both get to grow. Falls
  // back to whichever single item has the best ratio if none clear the
  // threshold (e.g. right at the very top/bottom of the list).
  useEffect(() => {
    const elements = WORK_ITEMS.map((item) => itemRefs.current[item.id]).filter(Boolean);
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          ratiosRef.current[entry.target.dataset.itemId] = entry.intersectionRatio;
        });

        const ratios = Object.entries(ratiosRef.current);
        let qualifying = ratios
          .filter(([, ratio]) => ratio >= ACTIVE_RATIO_THRESHOLD)
          .map(([itemId]) => itemId);

        if (!qualifying.length) {
          let bestId = null;
          let bestRatio = 0;
          for (const [itemId, ratio] of ratios) {
            if (ratio > bestRatio) {
              bestRatio = ratio;
              bestId = itemId;
            }
          }
          qualifying = bestId ? [bestId] : [];
        }

        setActiveIds(qualifying);
      },
      {
        threshold: [0, 0.1, 0.25, 0.35, 0.5, 0.75, 1],
        rootMargin: "-10% 0px -10% 0px",
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Scrolling => not paused (shrink whatever was grown). Once scrolling
  // has been still for SCROLL_PAUSE_MS, flip to paused => the active
  // item's image grows.
  useEffect(() => {
    let pauseTimer = null;

    const onScroll = () => {
      setHasScrolled(true);
      setIsPaused(false);
      clearTimeout(pauseTimer);
      pauseTimer = setTimeout(() => setIsPaused(true), SCROLL_PAUSE_MS);
    };

    // No initial timer here on purpose — the first item must NOT grow on
    // load, only once the user has actually scrolled and then paused.
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(pauseTimer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const grownIds = hasScrolled && isPaused ? activeIds : [];
  const grownKey = grownIds.join(",");

  // Grow/shrink via clip-path, not a stretched transform. Each item's
  // <img> sits inside a "stage" that is ALWAYS sized to the full,
  // grown-to-cover box (so object-fit: cover is computed against one
  // constant size and the image is never distorted). The compact card
  // look comes purely from clip-path cropping the stage down to the
  // resting card's window; growing just animates that crop open to the
  // full stage — a true "zoom reveal", not a stretch.
  //
  // The stage's position/size AND both clip-path states are recomputed
  // on every mount/grow-toggle AND on window resize — the resize part is
  // what keeps this correct through pinch/ctrl-zooming or resizing the
  // window (zooming changes the effective viewport size, so anything
  // computed before the zoom is stale until recomputed).
  useLayoutEffect(() => {
    const recompute = () => {
      WORK_ITEMS.forEach((item) => {
        const wrapEl = wrapRefs.current[item.id];
        const stageEl = stageRefs.current[item.id];
        const itemEl = itemRefs.current[item.id];
        if (!wrapEl || !stageEl || !itemEl) return;

        const wrapRect = wrapEl.getBoundingClientRect();
        const itemRect = itemEl.getBoundingClientRect();
        const itemStyle = window.getComputedStyle(itemEl);
        const padTop = parseFloat(itemStyle.paddingTop) || 0;
        const padBottom = parseFloat(itemStyle.paddingBottom) || 0;
        const padLeft = parseFloat(itemStyle.paddingLeft) || 0;
        const padRight = parseFloat(itemStyle.paddingRight) || 0;

        const targetLeft = itemRect.left + padLeft;
        const targetTop = itemRect.top + padTop;
        const targetWidth = itemRect.width - padLeft - padRight;
        const targetHeight = itemRect.height - padTop - padBottom;

        if (targetWidth <= 0 || targetHeight <= 0 || wrapRect.width === 0) return;

        // Position the stage (relative to wrapEl, its positioned parent)
        // so it exactly covers the full grown target.
        const stageLeft = targetLeft - wrapRect.left;
        const stageTop = targetTop - wrapRect.top;
        stageEl.style.left = `${stageLeft}px`;
        stageEl.style.top = `${stageTop}px`;
        stageEl.style.width = `${targetWidth}px`;
        stageEl.style.height = `${targetHeight}px`;

        // The compact card's window, expressed in the stage's own local
        // coordinates — i.e. where the resting (small) box sits inside
        // the full-size stage. Cropping the stage down to exactly this
        // rect is what makes it look like the small, undisturbed card.
        const localLeft = -stageLeft;
        const localTop = -stageTop;
        const insetLeft = localLeft;
        const insetTop = localTop;
        const insetRight = targetWidth - (localLeft + wrapRect.width);
        const insetBottom = targetHeight - (localTop + wrapRect.height);

        const compactClip = `inset(${insetTop}px ${insetRight}px ${insetBottom}px ${insetLeft}px round ${COMPACT_RADIUS}px)`;
        const grownClip = "inset(0px round 0px)";

        stageEl.style.clipPath = grownIds.includes(item.id) ? grownClip : compactClip;
      });
    };

    recompute();

    window.addEventListener("resize", recompute);
    return () => window.removeEventListener("resize", recompute);
  }, [grownKey]);

  // Cursor-follow "View Case Study" circle, attached to whichever item(s)
  // are currently grown. Re-runs whenever the grown set changes so the
  // listeners always target the right elements.
  useEffect(() => {
    cursorCtaCleanupRefs.current.forEach((cleanup) => cleanup());
    cursorCtaCleanupRefs.current = grownIds
      .map((itemId) => stageRefs.current[itemId])
      .filter(Boolean)
      .map((hoverTarget) => setupCursorCta(cursorCtaRef.current, hoverTarget));

    return () => {
      cursorCtaCleanupRefs.current.forEach((cleanup) => cleanup());
      cursorCtaCleanupRefs.current = [];
    };
  }, [grownKey]);

  return (
    <section className="our-work-list" id={id}>
      {WORK_ITEMS.map((item) => {
        const isGrown = grownIds.includes(item.id);
        return (
          <div
            key={item.id}
            className="ow-item"
            data-item-id={item.id}
            ref={(el) => {
              if (el) itemRefs.current[item.id] = el;
            }}
          >
            <div className="we-are-proud-company-card ow-banner-card">
              <div className="fold-wrap hrzntl-scroll-company">
                <div className="left">
                  <div
                    className="wap-img ow-banner-img-wrap ow-item-media"
                    ref={(el) => {
                      if (el) wrapRefs.current[item.id] = el;
                    }}
                  >
                    <a
                      href={item.href}
                      className={`ow-item-stage${isGrown ? " ow-item-stage-grown" : ""}`}
                      ref={(el) => {
                        if (el) stageRefs.current[item.id] = el;
                      }}
                    >
                      <img src={item.image} alt={item.title} className="img ow-banner-img" />
                    </a>
                    <span className="ow-banner-tag">{item.tag}</span>
                  </div>
                  <div className="wap-text">
                    <div className="wap-text-left">
                      <h5>{item.title}</h5>
                      <p>{item.subtitle}</p>
                    </div>
                  </div>
                </div>

                <div className="right">
                  <div className="fw-right-top">
                    <h4>
                      {item.stat.value}
                      <span>{item.stat.suffix}</span>
                    </h4>
                    <p>{item.stat.label}</p>
                  </div>
                  <div className="fw-right-bottom">
                    <p className="eye-head">WHAT WE DID</p>
                    <div className="fw-points-wrap">
                      {item.whatWeDid.map((point) => (
                        <p key={point}>{point}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      <a href="#" className="ow-banner-cursor-cta" ref={cursorCtaRef}>
        <span>View Case</span>
        <span>Study</span>
      </a>
    </section>
  );
}

// Same cursor-follow behaviour OurWorkBanner used to have for its single
// image — generalized to accept whichever element is currently grown.
function setupCursorCta(cta, hoverTarget) {
  if (!cta || !hoverTarget) return () => {};

  let lastX = -9999;
  let lastY = -9999;
  let isHovering = false;

  const showCta = () => {
    isHovering = true;
    cta.style.transition = "transform .45s cubic-bezier(0.17,0.89,0.32,1.49), opacity .45s ease";
    cta.style.transform = "translate(-50%, -50%) scale(1)";
    cta.style.opacity = "1";
    hoverTarget.style.cursor = "none";
  };

  const hideCta = () => {
    isHovering = false;
    cta.style.transition = "transform .3s ease, opacity .3s ease";
    cta.style.transform = "translate(-50%, -50%) scale(0.4)";
    cta.style.opacity = "0";
    hoverTarget.style.cursor = "";
  };

  const moveCta = (x, y) => {
    cta.style.left = `${x}px`;
    cta.style.top = `${y}px`;
  };

  const trackPosition = (e) => {
    lastX = e.clientX;
    lastY = e.clientY;
  };

  const handleMove = (e) => {
    trackPosition(e);
    moveCta(lastX, lastY);
  };

  const handleEnter = (e) => {
    trackPosition(e);
    cta.style.transition = "none";
    moveCta(lastX, lastY);
    showCta();
  };

  const handleLeave = () => hideCta();

  const handleScroll = () => {
    const rect = hoverTarget.getBoundingClientRect();
    const isInside =
      lastX >= rect.left && lastX <= rect.right && lastY >= rect.top && lastY <= rect.bottom;

    if (isInside && !isHovering) {
      moveCta(lastX, lastY);
      showCta();
    } else if (!isInside && isHovering) {
      hideCta();
    }
  };

  window.addEventListener("mousemove", trackPosition, { passive: true });
  hoverTarget.addEventListener("mouseenter", handleEnter);
  hoverTarget.addEventListener("mousemove", handleMove);
  hoverTarget.addEventListener("mouseleave", handleLeave);
  window.addEventListener("scroll", handleScroll, { passive: true });

  return () => {
    window.removeEventListener("mousemove", trackPosition);
    hoverTarget.removeEventListener("mouseenter", handleEnter);
    hoverTarget.removeEventListener("mousemove", handleMove);
    hoverTarget.removeEventListener("mouseleave", handleLeave);
    window.removeEventListener("scroll", handleScroll);
    hoverTarget.style.cursor = "";
  };
}
