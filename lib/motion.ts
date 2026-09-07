import type { Transition, Variants } from "motion/react";

/**
 * The motion system.
 *
 * Rules this file encodes:
 *  1. Durations are graded by interaction class and mirror the --dur-* tokens
 *     in globals.css, so a CSS transition and a Motion transition of the same
 *     class take the same time.
 *  2. Entrance and exit use different curves. Reversing one curve to produce
 *     the other is what makes cheap animation feel cheap.
 *  3. Springs are used only where an element is physically repositioned
 *     (disclosure height, nav indicator). Everything else is a tuned ease.
 *  4. Travel is small. 10 to 14px reads as intent; 40px reads as a slideshow.
 *
 * Anything expressible in CSS is not here: hover, focus, press, the section
 * reveal and the architecture pulse all live in globals.css. Motion is used
 * only for layout animation, shared-element transitions and presence.
 */

type Cubic = [number, number, number, number];

export const duration = {
  micro: 0.11,
  press: 0.09,
  ui: 0.18,
  card: 0.3,
  panel: 0.42,
} as const;

export const ease: Record<"entrance" | "exit" | "standard", Cubic> = {
  entrance: [0.16, 1, 0.3, 1],
  exit: [0.5, 0, 0.75, 0],
  standard: [0.2, 0, 0, 1],
};

/** Repositioning a real element: mass over decoration, no visible overshoot. */
export const layoutSpring: Transition = {
  type: "spring",
  stiffness: 320,
  damping: 34,
  mass: 0.9,
};

/** Chrome that must feel instant, e.g. the nav active indicator. */
export const indicatorSpring: Transition = {
  type: "spring",
  stiffness: 520,
  damping: 42,
  mass: 0.6,
};

/** Disclosure: height springs, content fades on a shorter, offset track. */
export const disclosureVariants: Variants = {
  collapsed: {
    height: 0,
    opacity: 0,
    transition: {
      height: layoutSpring,
      opacity: { duration: duration.ui, ease: ease.exit },
    },
  },
  expanded: {
    height: "auto",
    opacity: 1,
    transition: {
      height: layoutSpring,
      opacity: { duration: duration.card, ease: ease.entrance, delay: 0.06 },
    },
  },
};

export const overlayVariants: Variants = {
  hidden: { opacity: 0, transition: { duration: duration.ui, ease: ease.exit } },
  visible: { opacity: 1, transition: { duration: duration.ui, ease: ease.standard } },
};

export const dialogVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -8,
    scale: 0.985,
    transition: { duration: duration.ui, ease: ease.exit },
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: duration.panel, ease: ease.entrance },
  },
};
