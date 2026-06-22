"use client";

import { useEffect } from "react";
import Lenis from "lenis";

const LenisProvider = ({ children }) => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Optional custom easing
      smooth: true,
    });

    const onRaf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(onRaf);
    };

    requestAnimationFrame(onRaf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
};

export default LenisProvider;