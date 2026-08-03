"use client";
import { useEffect } from "react";

const DESKTOP_QUERY = "(min-width: 768px)";

// Drives a horizontally-scrolling track from page-scroll position, with the
// section pinned via native CSS `position: sticky` (the section must be
// taller than 100vh, with a `position: sticky; top: 0; height: 100vh;`
// wrapper inside it — see the .we-are-proud / .we-are-proud-sticky CSS
// pair for the reference markup this expects).
//
// Desktop only — below 768px the section falls back to plain vertical
// stacking (see each section's mobile CSS), so this hook does nothing and
// leaves the track's transform untouched there.
//
// Distance is recomputed live on every scroll tick (never cached), so it
// can't drift out of sync if images or other content change the track's
// width after mount — unlike GSAP's `end` value, which is computed once
// and needs an explicit `.refresh()` to catch up.
export default function useStickyHorizontalTrack(sectionRef, trackRef, deps = []) {
  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const mql = window.matchMedia(DESKTOP_QUERY);

    let targetX = 0;
    let currentX = 0;
    let rafId = null;

    // How much the movement lags behind the scroll position — lower is
    // laggier/smoother (like GSAP's scrub), higher snaps more directly.
    const EASE = 0.08;

    function computeTarget() {
      const rect = section.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const scrollableDistance = section.offsetHeight - viewportH;

      const progress =
        scrollableDistance > 0
          ? Math.min(1, Math.max(0, -rect.top / scrollableDistance))
          : 0;

      // The track sits inside a max-width, centered .container, so it has a
      // resting left offset from the viewport edge (container padding +
      // gap-left indent). Back that out of its current rect (using the
      // transform already applied) so maxTranslate accounts for the real
      // visible width — otherwise the end of the scroll either leaves a
      // sliver of the previous card showing (if using track.clientWidth,
      // which excludes that offset) or cuts off the last card by that same
      // amount (if using plain window.innerWidth, which ignores it).
      const staticLeft = track.getBoundingClientRect().left - currentX;
      const availableWidth = window.innerWidth - staticLeft;
      const maxTranslate = Math.max(0, track.scrollWidth - availableWidth);
      targetX = -progress * maxTranslate;
    }

    function tick() {
      currentX += (targetX - currentX) * EASE;

      // Snap once close enough so the transform settles exactly instead of
      // approaching forever.
      if (Math.abs(targetX - currentX) < 0.5) currentX = targetX;

      track.style.transform = `translateX(${currentX}px)`;
      rafId = requestAnimationFrame(tick);
    }

    let cleanupActive = null;

    function activate() {
      targetX = 0;
      currentX = 0;
      computeTarget();
      currentX = targetX;
      track.style.transform = `translateX(${currentX}px)`;

      window.addEventListener("scroll", computeTarget, { passive: true });
      window.addEventListener("resize", computeTarget);
      rafId = requestAnimationFrame(tick);

      cleanupActive = () => {
        window.removeEventListener("scroll", computeTarget);
        window.removeEventListener("resize", computeTarget);
        if (rafId) cancelAnimationFrame(rafId);
        rafId = null;
      };
    }

    function deactivate() {
      cleanupActive?.();
      cleanupActive = null;
      // Let the mobile CSS (plain vertical stacking) take over untouched.
      track.style.transform = "";
    }

    function handleChange(e) {
      deactivate();
      if (e.matches) activate();
    }

    if (mql.matches) activate();
    mql.addEventListener("change", handleChange);

    return () => {
      mql.removeEventListener("change", handleChange);
      deactivate();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
