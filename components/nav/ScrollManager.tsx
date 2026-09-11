"use client";

import { useEffect } from "react";
import { resolveAnchor, scrollToSection } from "@/lib/scroll";

/**
 * Owns every in-page navigation on the site.
 *
 * One delegated listener on the document handles the header links, the footer
 * links, the hero CTAs and anything added later, so there is a single scroll
 * implementation rather than one per call site. `scroll-behavior: smooth` is
 * deliberately absent from the CSS: this needs explicit control over when a
 * scroll is animated and when it is instant, and a CSS default would silently
 * turn the instant correction pass back into an animated one.
 *
 * Modified clicks (cmd, ctrl, shift, alt, middle button) are left alone so
 * "open in new tab" still works on an anchor link.
 */
export function ScrollManager() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest('a[href^="#"]');
      if (!(anchor instanceof HTMLAnchorElement)) return;

      const id = resolveAnchor(anchor.getAttribute("href"));
      if (!id) return;

      event.preventDefault();
      scrollToSection(id);
      window.history.pushState(null, "", `#${id}`);
    };

    document.addEventListener("click", onClick);

    // Back and forward through in-page history.
    const onPopState = () => {
      const id = resolveAnchor(window.location.hash);
      if (id) scrollToSection(id, false);
    };
    window.addEventListener("popstate", onPopState);

    // A URL that arrives with a hash already on it. Waiting for the fonts
    // removes the largest single source of post-load reflow before measuring,
    // and the correction pass in scrollToSection covers whatever is left.
    const initial = resolveAnchor(window.location.hash);
    if (initial) {
      const run = () => requestAnimationFrame(() => scrollToSection(initial, false));
      if (document.fonts && document.fonts.status !== "loaded") {
        document.fonts.ready.then(run).catch(run);
      } else {
        run();
      }
    }

    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("popstate", onPopState);
    };
  }, []);

  return null;
}
