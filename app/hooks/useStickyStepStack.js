"use client";
import { useEffect } from "react";

const DESKTOP_QUERY = "(min-width: 768px)";

// Drives a "step through N items, one at a time" crossfade (WeDoStand's
// awards list) from page-scroll position, with the section pinned via
// native CSS `position: sticky` instead of a GSAP pin.
//
// Desktop only — below 768px the section falls back to plain vertical
// stacking (see WeDoStand's mobile CSS), so this hook does nothing there
// and leaves items at their default (untouched) styles.
//
// itemRefs (text panel, slides up + fades) and imgRefs (image behind it,
// just fades) are parallel arrays, one entry per item. wrapRef is the
// overflow:hidden container the items slide within — its height is set
// here to the first item's natural height.
export default function useStickyStepStack(
  sectionRef,
  itemRefs,
  imgRefs,
  wrapRef,
  count
) {
  useEffect(() => {
    const section = sectionRef.current;
    const items = itemRefs.current.filter(Boolean);
    const imgs = imgRefs.current.filter(Boolean);
    const wrap = wrapRef.current;

    if (!section || !wrap || items.length < 2 || items.length !== count) return;

    const mql = window.matchMedia(DESKTOP_QUERY);

    const itemH = items[0].offsetHeight;
    const step = itemH + 60;

    let targetVirtualPos = 0;
    let currentVirtualPos = 0;
    let rafId = null;

    const EASE = 0.12;

    function computeTarget() {
      const rect = section.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const scrollableDistance = section.offsetHeight - viewportH;

      const progress =
        scrollableDistance > 0
          ? Math.min(1, Math.max(0, -rect.top / scrollableDistance))
          : 0;

      targetVirtualPos = progress * (count - 1);
    }

    function clamp01(n) {
      return Math.min(1, Math.max(0, n));
    }

    function render(virtualPos) {
      items.forEach((el, k) => {
        let y, opacity;
        if (virtualPos <= k) {
          const t = clamp01(virtualPos - (k - 1));
          y = (1 - t) * step;
          opacity = t;
        } else {
          const t = clamp01(virtualPos - k);
          y = -t * step;
          opacity = 1 - t;
        }
        el.style.transform = `translateY(${y}px)`;
        el.style.opacity = opacity;

        if (imgs[k]) imgs[k].style.opacity = opacity;
      });
    }

    function tick() {
      currentVirtualPos += (targetVirtualPos - currentVirtualPos) * EASE;
      if (Math.abs(targetVirtualPos - currentVirtualPos) < 0.001) {
        currentVirtualPos = targetVirtualPos;
      }
      render(currentVirtualPos);
      rafId = requestAnimationFrame(tick);
    }

    let cleanupActive = null;

    function activate() {
      wrap.style.height = itemH + "px";
      section.style.height = `${count * 100}vh`;

      targetVirtualPos = 0;
      currentVirtualPos = 0;
      computeTarget();
      currentVirtualPos = targetVirtualPos;
      render(currentVirtualPos);

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
      section.style.height = "";
      wrap.style.height = "";
      items.forEach((el, k) => {
        el.style.transform = "";
        el.style.opacity = "";
        if (imgs[k]) imgs[k].style.opacity = "";
      });
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
  }, [count]);
}
