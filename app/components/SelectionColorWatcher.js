"use client";

import { useEffect } from "react";

// CSS can't see the background an element sits on, so a single
// ::selection colour can't be readable on both light and dark sections.
// On every selection change we find the effective background behind the
// selected text and set --selection-bg / --selection-color on <html>
// (consumed by *::selection in globals.css): dark bg (red/black) →
// white highlight + black text, light bg → black highlight + white text.
const isDark = ([r, g, b]) => (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.6;

function parseColor(value) {
  const m = value.match(/rgba?\(([^)]+)\)/);
  if (!m) return null;
  const [r, g, b, a = 1] = m[1].split(/[,\s/]+/).filter(Boolean).map(Number);
  return a > 0.5 ? [r, g, b] : null; // treat (near-)transparent as "no background"
}

function backgroundBehind(el) {
  for (let node = el; node && node.nodeType === 1; node = node.parentElement) {
    const color = parseColor(getComputedStyle(node).backgroundColor);
    if (color) return color;
  }
  return null;
}

export default function SelectionColorWatcher() {
  useEffect(() => {
    const root = document.documentElement;

    const update = () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || !sel.anchorNode) return;
      const node = sel.anchorNode;
      const el = node.nodeType === 1 ? node : node.parentElement;
      const bg = backgroundBehind(el) || [216, 3, 29]; // body fallback: --sp-red
      const dark = isDark(bg);
      root.style.setProperty("--selection-bg", dark ? "#ffffff" : "#111111");
      root.style.setProperty("--selection-color", dark ? "#111111" : "#ffffff");
    };

    document.addEventListener("selectionchange", update);
    return () => document.removeEventListener("selectionchange", update);
  }, []);

  return null;
}
