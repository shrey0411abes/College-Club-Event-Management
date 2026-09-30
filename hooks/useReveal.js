"use client";
import { useEffect, useRef, useState } from "react";

/**
 * useReveal hook using IntersectionObserver (once) with optional delay for staggering.
 * Returns [ref, isRevealed].
 */
export function useReveal(delay = 0) {
  const ref = useRef(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      const fallbackTimer = setTimeout(() => setIsRevealed(true), 0);
      return () => clearTimeout(fallbackTimer);
    }

    let staggerTimer = null;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          if (delay > 0) {
            staggerTimer = setTimeout(() => setIsRevealed(true), delay);
          } else {
            setIsRevealed(true);
          }
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (staggerTimer) clearTimeout(staggerTimer);
    };
  }, [delay]);

  return [ref, isRevealed];
}
