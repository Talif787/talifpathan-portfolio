/**
 * Reading progress, driven entirely by the native scroll timeline.
 *
 * No scroll listener, no rAF loop, no client component. Browsers without
 * `animation-timeline` hide the bar rather than receive a JavaScript fallback,
 * because progress here is an affordance and not information.
 */
export function ScrollProgress() {
  return <div aria-hidden className="scroll-progress" />;
}
