/**
 * Section entrance, driven by the native view timeline.
 *
 * This deliberately does not use Motion. The animation depends on nothing but
 * the element's own position in the viewport, so routing it through React
 * state, an IntersectionObserver and a client bundle would buy nothing. Where
 * `animation-timeline: view()` is unsupported the element is simply visible,
 * which is the correct fallback for content.
 *
 * Motion is reserved for the cases CSS cannot express: layout animation,
 * shared-element transitions, and presence.
 */
import { cn } from "@/lib/utils";

export function Reveal({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn("reveal", className)}>{children}</div>;
}
