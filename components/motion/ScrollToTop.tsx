"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUp } from "lucide-react";
import { duration, ease } from "@/lib/motion";

/**
 * Scroll to top.
 *
 * The page is long enough now that returning to the header by scrolling is a
 * real cost, and the header itself has no home affordance beyond the name.
 *
 * Visibility is a single threshold on scroll position, evaluated at most once
 * per animation frame. An earlier version paired an IntersectionObserver on a
 * sentinel with a scroll listener; the observer only ever fired at the very top
 * of the page, so it was doing nothing the listener was not already doing.
 *
 * Reduced motion is respected twice over: the entrance becomes an instant
 * appearance, and the scroll itself becomes a jump rather than a glide.
 */
export function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    let frame = 0;

    const compute = () => {
      frame = 0;
      const past = window.scrollY > 800;
      setVisible((previous) => (previous === past ? previous : past));
    };

    const schedule = () => {
      if (frame === 0) frame = requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener("scroll", schedule, { passive: true });
    return () => {
      if (frame !== 0) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
    };
  }, []);

  const toTop = () => {
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
    document.getElementById("main")?.focus?.();
  };

  return (
    <AnimatePresence>
      {visible ? (
        <motion.button
          key="to-top"
          type="button"
          onClick={toTop}
          aria-label="Scroll back to top"
          className="to-top"
          initial={reduced ? false : { opacity: 0, y: 8, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.9 }}
          transition={{ duration: duration.card, ease: ease.entrance }}
        >
          <ArrowUp aria-hidden className="size-4" />
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}
