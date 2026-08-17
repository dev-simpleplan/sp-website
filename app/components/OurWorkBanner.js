"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { getImageUrl } from "./getImageUrl";
import cardImg from "./images/we-are-p.png"

export default function OurWorkBanner({ id, isReady = true }) {
  const bannerRef = useRef(null); // .our-work-banner-in — image expands to cover THIS
  const cardRef = useRef(null);
  const headingRef = useRef(null);
  const cursorCtaRef = useRef(null); // the "View Case Study" circle that follows the cursor
  const hasPlayedIntro = useRef(false);
  const cursorCtaCleanupRef = useRef(null);

  // ---- Step 1: the whole card drops from above the section down to its
  // natural centered position (no resizing, just an entrance transform).
  // ---- Step 2: a CLONE of the image+tag wrapper grows to cover the
  // entire banner. The tag lives inside that same wrapper (absolute,
  // top-right), so it travels/grows together with the image automatically.
  // The rest of the card (title, subtitle, stats) stays exactly where it
  // is and simply gets covered — nothing else moves or fades.
  // ---- Step 3 (new): once the image finishes growing, the "View Case
  // Study" circle becomes a cursor-follower over the image — reveals on
  // hover, tracks the mouse, hides on mouse-leave.
  useEffect(() => {
    if (hasPlayedIntro.current) return;

    const playIntro = () => {
      if (hasPlayedIntro.current) return;
      hasPlayedIntro.current = true;

      const card = cardRef.current;
      const bannerEl = bannerRef.current;
      const wrapEl = card?.querySelector(".ow-banner-img-wrap");
      if (!card || !bannerEl || !wrapEl) return;

      // How much of the banner's height the grown image should cover.
      // 1 = full height (edge to edge). Lower it to leave room below the
      // image for the heading — tune this alongside `.ow-banner-head`'s
      // CSS position so the image's bottom edge lands roughly through
      // the vertical middle of the heading text (that's what produces
      // the "half the heading is covered, half peeks out below" look in
      // your reference image). I don't have your actual heading
      // font-size/line-height here, so you'll likely need to nudge this
      // value +/- a bit to match exactly.
      const IMAGE_COVER_HEIGHT_RATIO = 0.85;

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Step 1 — card drops in from above, settles at its normal position.
      tl.set(card, { y: "-100vh", opacity: 0 }).to(card, {
        y: 0,
        opacity: 1,
        duration: 1,
      });

      // Step 2 — grow a CLONE of the image+tag wrapper to cover the full
      // section. We never touch the original wrapper: it just gets
      // hidden in place (opacity: 0, box untouched), so the card's
      // layout — title, subtitle, stats — never recalculates and can
      // never shift. Only the clone, appended straight onto the outer
      // section as position: absolute, does the growing.
      tl.add(() => {
        const wrapRect = wrapEl.getBoundingClientRect();
        const bannerRect = bannerEl.getBoundingClientRect();
        const computed = window.getComputedStyle(wrapEl);

        const clone = wrapEl.cloneNode(true);
        clone.classList.add("ow-banner-img-wrap-clone");
        clone.removeAttribute("id");

        gsap.set(clone, {
          position: "absolute",
          top: wrapRect.top - bannerRect.top,
          left: wrapRect.left - bannerRect.left,
          width: wrapRect.width,
          height: wrapRect.height,
          margin: 0,
          borderRadius: computed.borderRadius,
          zIndex: 20,
        });

        bannerEl.appendChild(clone);

        // Force stacking + position on the clone's children via inline
        // styles (not relying on any external CSS class), so the tag is
        // guaranteed to stay visible, on top, and pinned to the same
        // corner of the image for the entire grow animation — no matter
        // what z-index rules already exist elsewhere in the project.
        const cloneImg = clone.querySelector(".ow-banner-img");
        const cloneTag = clone.querySelector(".ow-banner-tag");

        if (cloneImg) {
          gsap.set(cloneImg, {
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            zIndex: 1,
          });
        }
        if (cloneTag) {
          gsap.set(cloneTag, {
            position: "absolute",
            top: 16,
            right: 0,
            zIndex: 999,
            opacity: 1,
          });
        }

        // Hide the original — its box stays exactly as-is, so nothing
        // around it moves.
        gsap.set(wrapEl, { opacity: 0 });

        // IMPORTANT: this tween has to be created HERE, now that `clone`
        // actually exists — not chained onto `tl` from outside, since at
        // the moment the timeline is built (synchronously, before any of
        // this callback has run) `clone` doesn't exist yet and GSAP would
        // have no target to animate.
        gsap.to(clone, {
          top: 0,
          left: 0,
          width: bannerEl.offsetWidth,
          height: bannerEl.offsetHeight * IMAGE_COVER_HEIGHT_RATIO,
          borderRadius: 0,
          duration: 1.1,
          ease: "power2.inOut",
          // Step 3 — only once the image is done growing does the
          // cursor-follow "View Case Study" circle become active.
          onComplete: () => {
            cursorCtaCleanupRef.current = setupCursorCta(clone);
          },
        });

        if (headingRef.current) {
          gsap.to(headingRef.current, {
            opacity: 0.9,
            duration: 0.6,
            delay: 0.5,
          });
        }
      }, "+=0.1");
    };

    if (isReady) {
      playIntro();
    } else if (typeof window !== "undefined") {
      window.addEventListener("load", playIntro);
      return () => window.removeEventListener("load", playIntro);
    }
  }, [isReady]);

  // Sets up the cursor-follower on `hoverTarget` (the grown image).
  // Returns a cleanup function that removes the listeners.
  function setupCursorCta(hoverTarget) {
    const cta = cursorCtaRef.current;
    if (!cta || !hoverTarget) return;

    // Center the circle on the cursor point once; quickTo below only
    // ever animates x/y (px), which GSAP composes with this percentage
    // offset automatically.
    gsap.set(cta, { xPercent: -50, yPercent: -50 });

    const xTo = gsap.quickTo(cta, "x", { duration: 0.5, ease: "power3" });
    const yTo = gsap.quickTo(cta, "y", { duration: 0.5, ease: "power3" });

    // We only get real mouse events when the mouse actually moves — a
    // scroll with a completely still cursor fires nothing (or fires
    // inconsistent native mouseenter/mouseleave depending on the
    // browser). So we track the cursor's position ourselves — globally,
    // not just while it's over the target — and on every scroll, decide
    // show/hide purely from whether that last known position now falls
    // inside the target's CURRENT (post-scroll) bounding box. This makes
    // both directions symmetric: scrolling the image under a still
    // cursor shows it, scrolling it away from a still cursor hides it.
    let lastX = -9999;
    let lastY = -9999;
    let isHovering = false;

    const showCta = () => {
      isHovering = true;
      gsap.to(cta, {
        scale: 1,
        opacity: 1,
        duration: 0.45,
        ease: "back.out(1.7)",
      });
      hoverTarget.style.cursor = "none";
    };

    const hideCta = () => {
      isHovering = false;
      gsap.to(cta, {
        scale: 0.4,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
      });
      hoverTarget.style.cursor = "";
    };

    const trackPosition = (e) => {
      lastX = e.clientX;
      lastY = e.clientY;
    };

    const handleMove = (e) => {
      trackPosition(e);
      xTo(lastX);
      yTo(lastY);
    };

    const handleEnter = (e) => {
      trackPosition(e);
      gsap.set(cta, { x: lastX, y: lastY }); // snap in at the entry point
      showCta();
    };

    const handleLeave = () => {
      hideCta();
    };

    const handleScroll = () => {
      const rect = hoverTarget.getBoundingClientRect();
      const isInside =
        lastX >= rect.left &&
        lastX <= rect.right &&
        lastY >= rect.top &&
        lastY <= rect.bottom;

      if (isInside && !isHovering) {
        gsap.set(cta, { x: lastX, y: lastY });
        showCta();
      } else if (!isInside && isHovering) {
        hideCta();
      }
    };

    // Global tracker so we know the cursor's position even before it's
    // ever been over the target (needed for the very first scroll-in).
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
    };
  }

  // Clean up the hover listeners if the component unmounts mid-hover.
  useEffect(() => {
    return () => {
      if (cursorCtaCleanupRef.current) cursorCtaCleanupRef.current();
    };
  }, []);

  return (
    <section className="our-work-banner" id="our-work-sec">
      {/* <div className="container"> */}

        <div className="our-work-banner-in" ref={bannerRef}>

        {/* <div className="slider-wrapper-outer gap-left"> */}
          {/* <div className="slider-wrapper-inner" > */}
            <a className="we-are-proud-company-card gap-left ow-banner-card
            " ref={cardRef}>
              <div className="fold-wrap hrzntl-scroll-company">
                <div className="left">
                  <div className="wap-img ow-banner-img-wrap">
                    <img
                      src={cardImg.src}
                      alt="demotext"
                      className="img ow-banner-img"
                    />
                    <span className="ow-banner-tag">Fashion &amp; Beauty</span>
                  </div>
                  <div className="wap-text">
                    <div className="wap-text-left">
                      <h5>invouge</h5>
                      <p>Lorem ipsum dolor sit amet consectetur.</p>
                    </div>
                  </div>
                </div>
                
                <div className="right">
                  <div className="fw-right-top">
                    <h4>
                      1.2
                      <span>x</span>
                    </h4>
                    <p>Revenue Growth</p>
                  </div>
                  <div className="fw-right-bottom">
                    <p className="eye-head">WHAT WE DID</p>
                    <div className="fw-points-wrap">
                      <p>Brand Positioning</p>
                    </div>
                  </div>
                </div>
              </div>
            </a>
          {/* </div> */}
        {/* </div> */}
        {/* <div className="our-work-banner__image-wrap">
          <img
            src={data?.image?.url}
            alt={data?.title || "Featured Work"}
            className="our-work-banner__image"
          />
        </div>

        <span className="our-work-banner__tag">
          {data?.category || "Fashion & Beauty"}
        </span>

        <a href={data?.case_study_link || "#"} className="our-work-banner__cta">
          View Case Study
        </a> */}
      {/* </div> */}
      <div className="ow-banner-head">
          <div className="ow-banner-title">
            <h1 className="reveal-heading">Our Featured work</h1>
          </div>
      </div>
      </div>

      {/* Cursor-follow "View Case Study" circle. Fixed + hidden by
          default (see CSS notes below); setupCursorCta() reveals it and
          drives its position once the image has finished scaling. */}
      <a href="#" className="ow-banner-cursor-cta" ref={cursorCtaRef}>
        <span>View Case</span>
        <span>Study</span>
      </a>
    </section>
  );
}