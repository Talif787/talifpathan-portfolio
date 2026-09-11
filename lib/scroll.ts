/**
 * Self-correcting in-page scroll.
 *
 * Native anchor scrolling computes the target's offset once, at click time, and
 * commits to it. On this page at least three things can change layout height
 * after that moment:
 *
 *   1. font swap. Space Grotesk and IBM Plex Mono load with `display: swap`,
 *      and next/font's fallback metrics get close but not exact across 139
 *      skill chips, 14 project rows and 10 roles.
 *   2. container queries. Each architecture diagram switches from a stacked
 *      grid to an inline one at 34rem of container width. Stacked is roughly
 *      220px taller, and there are 14 of them.
 *   3. hydration. ProjectList is a client island that wraps 14 rows in
 *      motion.div and runs layout animation on mount.
 *
 * Any one of those shifts the target after the browser has already decided
 * where to stop, and you land short. Two earlier attempts at this fixed
 * individual causes and the symptom survived, so this fixes the mechanism: the
 * scroll re-measures the target until it actually stops moving.
 *
 * Phases: issue the scroll, wait for the animation to finish, then correct with
 * instant scrolls until the target holds position for a few frames. Aborts the
 * moment the reader touches the wheel, a key or the screen, so it never fights
 * a person for control of their own scroll position.
 */

const SETTLE_FRAMES = 3;
const TOLERANCE_PX = 2;
const ANIMATION_BUDGET_MS = 900;
const CORRECTION_BUDGET_MS = 900;

/** Distance from the viewport top at which a section heading should land. */
function headingOffset(): number {
  const header = document.querySelector("header");
  return (header instanceof HTMLElement ? header.offsetHeight : 0) + 24;
}

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Move focus to the target without scrolling, so keyboard and screen-reader
 * users land where sighted users do. Native anchor navigation does this for
 * free; preventDefault takes it away, so it is restored by hand.
 */
function focusTarget(el: HTMLElement) {
  const had = el.hasAttribute("tabindex");
  if (!had) el.setAttribute("tabindex", "-1");
  el.focus({ preventScroll: true });
  if (!had) {
    el.addEventListener("blur", () => el.removeAttribute("tabindex"), { once: true });
  }
}

export function scrollToSection(id: string, smooth = true): void {
  const el = document.getElementById(id);
  if (!el) return;

  const reduced = prefersReducedMotion();
  const behavior: ScrollBehavior = smooth && !reduced ? "smooth" : "auto";

  let cancelled = false;
  const abort = () => {
    cancelled = true;
  };
  const interruptions = ["wheel", "touchstart", "keydown"] as const;
  const listen = (add: boolean) => {
    for (const event of interruptions) {
      if (add) window.addEventListener(event, abort, { passive: true });
      else window.removeEventListener(event, abort);
    }
  };
  listen(true);

  /** How far the target currently is from where it should be. */
  const drift = () => el.getBoundingClientRect().top - headingOffset();

  window.scrollBy({ top: drift(), behavior });
  focusTarget(el);

  const started = performance.now();
  let lastScrollY = window.scrollY;
  let stillFrames = 0;
  let settledFrames = 0;
  let phase: "animating" | "correcting" =
    behavior === "smooth" ? "animating" : "correcting";

  const tick = () => {
    if (cancelled) {
      listen(false);
      return;
    }

    const elapsed = performance.now() - started;

    if (phase === "animating") {
      // The scroll animation is done when scrollY stops moving, or when it has
      // had long enough that waiting is no longer honest.
      stillFrames = window.scrollY === lastScrollY ? stillFrames + 1 : 0;
      lastScrollY = window.scrollY;
      if (stillFrames >= 2 || elapsed > ANIMATION_BUDGET_MS) {
        phase = "correcting";
        settledFrames = 0;
      }
      requestAnimationFrame(tick);
      return;
    }

    const delta = drift();
    if (Math.abs(delta) <= TOLERANCE_PX) {
      settledFrames += 1;
      if (settledFrames >= SETTLE_FRAMES) {
        listen(false);
        return;
      }
    } else {
      settledFrames = 0;
      // "auto" resolves to the computed scroll-behavior, which is the
      // browser default now that CSS smooth scrolling is gone. Instant.
      window.scrollBy({ top: delta, behavior: "auto" });
    }

    if (elapsed < ANIMATION_BUDGET_MS + CORRECTION_BUDGET_MS) {
      requestAnimationFrame(tick);
    } else {
      listen(false);
    }
  };

  requestAnimationFrame(tick);
}

/** True when the href is an in-page anchor with a target on this page. */
export function resolveAnchor(href: string | null): string | null {
  if (!href || !href.startsWith("#") || href.length < 2) return null;
  const id = href.slice(1);
  return document.getElementById(id) ? id : null;
}
